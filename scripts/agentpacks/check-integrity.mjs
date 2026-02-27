#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { createIntegrityContext } from './integrity-utils.mjs';

const {
  failures,
  infos,
  abs,
  readText,
  readJson,
  listStems,
  listDirs,
  assertEqual,
  assertIncludes,
} = createIntegrityContext();

function extractSlashCommands(markdownText) {
  return new Set(
    [...markdownText.matchAll(/-\s+`\/([a-z0-9-]+)`/g)].map((m) => m[1])
  );
}

function validateCommandCatalog(sourceCommands) {
  const files = [
    'packs/vibecoding-contractspec-core/rules/overview.md',
    'AGENTS.md',
    '.claude/CLAUDE.md',
    'CLAUDE.md',
  ];

  for (const relativePath of files) {
    const content = readText(relativePath);
    if (!content) continue;
    assertEqual(
      sourceCommands,
      extractSlashCommands(content),
      `${relativePath} command catalog`
    );
  }
}

function validateSubagentReferences(sourceAgents) {
  const files = listStems('packs/vibecoding-tooling/commands', '.md').map(
    (name) => `packs/vibecoding-tooling/commands/${name}.md`
  );

  for (const relativePath of files) {
    const content = readText(relativePath);
    if (!content) continue;
    const refs = [...content.matchAll(/`([a-z0-9-]+)`\s+subagent/g)].map(
      (m) => m[1]
    );
    for (const ref of refs) {
      if (!sourceAgents.has(ref))
        failures.push(`${relativePath} references missing subagent: ${ref}`);
    }
  }
}

function validateHookPaths() {
  const hookConfigs = [
    ['.cursor/hooks.json', readJson('.cursor/hooks.json')?.hooks ?? {}],
    ['.claude/settings.json', readJson('.claude/settings.json')?.hooks ?? {}],
  ];

  for (const [relativePath, hooks] of hookConfigs) {
    const commands = Object.values(hooks)
      .flatMap((entries) => entries)
      .map((entry) => entry?.command)
      .filter(Boolean);

    if (!commands.length) {
      failures.push(`${relativePath} has no hook commands`);
      continue;
    }

    for (const command of commands) {
      const scriptPath = String(command).trim().split(/\s+/)[0];

      if (!scriptPath.startsWith('scripts/agent-hooks/')) {
        failures.push(
          `${relativePath} uses non-standard hook path: ${command}`
        );
      }
      if (command.includes('.rulesync/')) {
        failures.push(
          `${relativePath} contains stale .rulesync path: ${command}`
        );
      }
      if (!existsSync(abs(scriptPath))) {
        failures.push(
          `${relativePath} references missing hook script: ${command}`
        );
      }
    }

    infos.push(`${relativePath}: hook scripts are resolvable`);
  }
}

function validateMcpParity() {
  const source = readJson('packs/vibecoding-tooling/mcp.json')?.mcpServers;
  if (!source) return;

  const required = new Set(Object.keys(source));
  const targets = [
    [
      '.cursor/mcp.json MCP keys',
      readJson('.cursor/mcp.json')?.mcpServers,
      true,
    ],
    [
      '.claude/settings.json MCP keys',
      readJson('.claude/settings.json')?.mcpServers,
      true,
    ],
    ['.mcp.json MCP keys', readJson('.mcp.json')?.mcpServers, true],
    ['opencode.json MCP keys', readJson('opencode.json')?.mcp, false],
  ];

  for (const [label, object, exact] of targets) {
    if (!object) continue;
    const keys = new Set(Object.keys(object));
    if (exact) {
      assertEqual(required, keys, label);
    } else {
      assertIncludes(required, keys, label);
    }
  }
}

function validateStaleWording() {
  const files = [
    'packs/vibecoding-contractspec-core/rules/overview.md',
    'AGENTS.md',
    '.claude/CLAUDE.md',
    'CLAUDE.md',
  ];

  for (const relativePath of files) {
    const content = readText(relativePath);
    if (!content) continue;
    if (content.includes('rulesync governance gaps')) {
      failures.push(
        `${relativePath} contains stale wording: \"rulesync governance gaps\"`
      );
    }
  }
}

function main() {
  const sourceRules = new Set([
    ...listStems('packs/vibecoding-best-practices/rules', '.md'),
    ...listStems('packs/vibecoding-contractspec-core/rules', '.md'),
    ...listStems('packs/vibecoding-repository-rules/rules', '.md'),
  ]);
  const sourceCommands = new Set(
    listStems('packs/vibecoding-tooling/commands', '.md')
  );
  const sourceAgents = new Set(
    listStems('packs/vibecoding-tooling/agents', '.md')
  );
  const sourceSkills = new Set(listDirs('packs/vibecoding-tooling/skills'));
  const sharedRules = new Set(
    [...sourceRules].filter((name) => name !== 'agents-index')
  );
  const rootLessRules = new Set(
    [...sharedRules].filter((name) => name !== 'overview')
  );

  const checks = [
    [
      '.opencode/memories rules',
      rootLessRules,
      new Set(listStems('.opencode/memories', '.md')),
    ],
    ['.cursor/rules', sharedRules, new Set(listStems('.cursor/rules', '.mdc'))],
    [
      '.claude/rules',
      rootLessRules,
      new Set(listStems('.claude/rules', '.md')),
    ],
    [
      '.codex/memories rules',
      sharedRules,
      new Set(listStems('.codex/memories', '.md')),
    ],
    [
      '.opencode/command',
      sourceCommands,
      new Set(listStems('.opencode/command', '.md')),
    ],
    [
      '.cursor/commands',
      sourceCommands,
      new Set(listStems('.cursor/commands', '.md')),
    ],
    [
      '.claude/commands',
      sourceCommands,
      new Set(listStems('.claude/commands', '.md')),
    ],
    [
      '.opencode/agent',
      sourceAgents,
      new Set(listStems('.opencode/agent', '.md')),
    ],
    [
      '.cursor/agents',
      sourceAgents,
      new Set(listStems('.cursor/agents', '.md')),
    ],
    [
      '.claude/agents',
      sourceAgents,
      new Set(listStems('.claude/agents', '.md')),
    ],
    ['.opencode/skill', sourceSkills, new Set(listDirs('.opencode/skill'))],
    ['.cursor/skills', sourceSkills, new Set(listDirs('.cursor/skills'))],
    ['.claude/skills', sourceSkills, new Set(listDirs('.claude/skills'))],
    ['.codex/skills', sourceSkills, new Set(listDirs('.codex/skills'))],
  ];

  for (const [label, expected, actual] of checks)
    assertEqual(expected, actual, label);

  validateCommandCatalog(sourceCommands);
  validateSubagentReferences(sourceAgents);
  validateHookPaths();
  validateMcpParity();
  validateStaleWording();

  for (const info of infos) console.log(`[agentpacks-check] ${info}`);

  if (failures.length) {
    console.error('[agentpacks-check] Integrity check failed:');
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
  }

  console.log('[agentpacks-check] Integrity check passed.');
}

main();
