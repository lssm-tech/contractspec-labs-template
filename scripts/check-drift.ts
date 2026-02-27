#!/usr/bin/env bun
/**
 * Contract drift check script for CI/CD pipelines.
 *
 * Runs the drift detection engine and reports results.
 * In CI (GitHub Actions), annotates PR files with drift items.
 * Exits non-zero when critical drift exists and failOnCritical is enabled.
 *
 * Usage:
 *   bun scripts/check-drift.ts
 *   bun scripts/check-drift.ts --changed-only
 *
 * @see specs/customer-governance-triad/02-ci-drift-gate.md
 */
import { readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { getContractCoverage } from '../packages/bundles/example-product/src/modules/source-analysis/extractor-service';

// ── Types ──

interface DriftConfig {
  drift: {
    enabled: boolean;
    contractsDir: string;
    failOnCritical: boolean;
    warnOnWarning: boolean;
    ignorePatterns: string[];
    ignoreDriftIds: string[];
  };
}

// ── Config ──

async function loadConfig(root: string): Promise<DriftConfig> {
  const configPath = join(root, '.contractspecrc.json');
  try {
    const raw = await readFile(configPath, 'utf-8');
    return JSON.parse(raw) as DriftConfig;
  } catch {
    return {
      drift: {
        enabled: true,
        contractsDir: 'packages/libs/contracts-contractspec-studio/src',
        failOnCritical: false,
        warnOnWarning: true,
        ignorePatterns: [],
        ignoreDriftIds: [],
      },
    };
  }
}

// ── GitHub Actions annotations ──

const isCI = !!process.env['GITHUB_ACTIONS'];

function annotate(
  level: 'error' | 'warning' | 'notice',
  message: string,
  file?: string,
  line?: number
): void {
  if (isCI && file) {
    const lineStr = line ? `,line=${line}` : '';
    console.log(`::${level} file=${file}${lineStr}::${message}`);
  } else if (level === 'error') {
    console.error(`  ERROR   ${file ?? ''} — ${message}`);
  } else if (level === 'warning') {
    console.warn(`  WARN    ${file ?? ''} — ${message}`);
  } else {
    console.log(`  NOTICE  ${file ?? ''} — ${message}`);
  }
}

// ── Pattern matching ──

function matchesIgnorePattern(filePath: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    const regex = new RegExp(
      '^' +
        pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\?/g, '.') +
        '$'
    );
    if (regex.test(filePath)) return true;
  }
  return false;
}

// ── Changed-only filter ──

async function getChangedFiles(root: string): Promise<Set<string> | null> {
  const flag = process.argv.includes('--changed-only');
  if (!flag) return null;

  try {
    const proc = Bun.spawn(['git', 'diff', '--name-only', 'HEAD'], {
      cwd: root,
      stdout: 'pipe',
    });
    const text = await new Response(proc.stdout).text();
    const files = text
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);
    return new Set(files);
  } catch {
    console.warn(
      '--changed-only: could not determine changed files, scanning all'
    );
    return null;
  }
}

// ── Main ──

async function main(): Promise<void> {
  const startMs = Date.now();
  const root = process.cwd();
  const config = await loadConfig(root);

  if (!config.drift.enabled) {
    console.log('Drift check disabled in .contractspecrc.json');
    return;
  }

  const changedFiles = await getChangedFiles(root);
  if (changedFiles !== null) {
    console.log(
      `Running contract drift check (--changed-only: ${changedFiles.size} files)...\n`
    );
  } else {
    console.log('Running contract drift check...\n');
  }

  const contractsDir = join(root, config.drift.contractsDir);
  const report = await getContractCoverage(root, contractsDir);

  // Filter out ignored patterns and IDs
  const filtered = report.driftRecords.filter((item) => {
    if (config.drift.ignoreDriftIds.includes(item.id)) return false;
    const relFile = relative(root, item.implementationFile || '');
    if (matchesIgnorePattern(relFile, config.drift.ignorePatterns)) {
      return false;
    }
    // --changed-only: skip drift items for unchanged files
    if (changedFiles !== null) {
      const contractRel = item.contractFile
        ? relative(root, item.contractFile)
        : '';
      if (!changedFiles.has(relFile) && !changedFiles.has(contractRel)) {
        return false;
      }
    }
    return true;
  });

  const critical = filtered.filter((d) => d.severity === 'critical');
  const warnings = filtered.filter((d) => d.severity === 'warning');
  const info = filtered.filter((d) => d.severity === 'info');

  // Annotate files
  for (const item of filtered) {
    const relFile = item.implementationFile
      ? relative(root, item.implementationFile)
      : item.contractFile
        ? relative(root, item.contractFile)
        : undefined;

    const level =
      item.severity === 'critical'
        ? 'error'
        : item.severity === 'warning'
          ? 'warning'
          : 'notice';

    annotate(level, item.reason, relFile, item.implementationLine);
  }

  // Summary
  const durationMs = Date.now() - startMs;
  console.log('\n--- Drift Check Summary ---');
  console.log(`Coverage: ${report.summary.coveragePercent}%`);
  console.log(`Endpoints: ${report.summary.totalEndpoints}`);
  console.log(`Contracts: ${report.summary.totalContracts}`);
  console.log(
    `Drift: ${critical.length} critical, ${warnings.length} warning, ${info.length} info`
  );
  console.log(`Duration: ${durationMs}ms`);

  if (isCI) {
    // Write step summary for GitHub Actions
    const summaryPath = process.env['GITHUB_STEP_SUMMARY'];
    if (summaryPath) {
      const md = [
        '## Contract Drift Check',
        '',
        `| Metric | Value |`,
        `| --- | --- |`,
        `| Coverage | ${report.summary.coveragePercent}% |`,
        `| Critical | ${critical.length} |`,
        `| Warnings | ${warnings.length} |`,
        `| Info | ${info.length} |`,
        `| Duration | ${durationMs}ms |`,
        '',
        config.drift.failOnCritical
          ? critical.length > 0
            ? '**BLOCKED** — Critical drift detected.'
            : 'Passed — No critical drift.'
          : 'Warn-only mode — not blocking.',
      ].join('\n');
      await Bun.write(summaryPath, md);
    }
  }

  // Exit code
  if (config.drift.failOnCritical && critical.length > 0) {
    console.error(
      `\nFAILED: ${critical.length} critical drift item(s) detected.`
    );
    process.exit(1);
  }

  console.log('\nDrift check passed.');
}

main().catch((err) => {
  console.error('Drift check failed:', err);
  process.exit(2);
});
