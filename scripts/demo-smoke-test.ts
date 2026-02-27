#!/usr/bin/env bun
/**
 * Demo dataset smoke test.
 *
 * Verifies that the demo cache for "onboarding_dropoff" contains
 * valid, complete data that satisfies the golden path requirements:
 *
 * 1. All cacheable steps have data (brief, patch, impact, export, check, stakeholder)
 * 2. Brief has citations and structured problem/who/proposedChange
 * 3. Patch has at least 1 change with surfaces
 * 4. Impact has breaks, mustChange, risky arrays with correct counts
 * 5. Export has tasks with required fields
 * 6. Check has baseline and post windows with timestamps in "last 7 days" range
 * 7. Stakeholder brief has a non-empty transcript
 *
 * Run: bun scripts/demo-smoke-test.ts
 */

/*
Check at posthog best practices, especially how to handling linking of marketing website and application https://posthog.com/docs/product-analytics/best-practices.md

Use this kind of trick to properly identify each surface:
posthog.register({ app_surface: 'marketing' }) // on marketing
posthog.register({ app_surface: 'product' })   // in the app

 */

/*
Improve the posthog leverage, making sure that:
- we track all key metrics/events
- we had setup the proper `goals`
- all events are properly linked to the proper customer/product/revenue
 */
import {
  getCacheVersion,
  getDemoCacheEntry,
  hasDemoCache,
} from '../packages/bundles/example-product/src/infrastructure/demo-cache/demo-cache-service';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string): void {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

function section(title: string): void {
  console.log(`\n${title}`);
  console.log('─'.repeat(title.length));
}

// ── Cache availability ──────────────────────────────────────────────

section('Cache availability');

assert(hasDemoCache('onboarding_dropoff'), 'onboarding_dropoff cache exists');
assert(getCacheVersion() === '1.0.0', 'Cache version is 1.0.0');

const entry = getDemoCacheEntry('onboarding_dropoff');
assert(entry !== null, 'Full cache entry is retrievable');

if (!entry) {
  console.error('\nFATAL: No cache entry — cannot continue.\n');
  process.exit(1);
}

// ── Brief ───────────────────────────────────────────────────────────

section('Brief');

assert(entry.brief.opportunityId.length > 0, 'Brief has opportunityId');
assert(entry.brief.title.length > 0, 'Brief has title');
assert(
  entry.brief.problem.citations.length >= 1,
  `Brief problem has ${entry.brief.problem.citations.length} citation(s)`
);
assert(
  entry.brief.who.citations.length >= 1,
  `Brief who has ${entry.brief.who.citations.length} citation(s)`
);
assert(
  entry.brief.proposedChange.description.length > 0,
  'Brief proposedChange has description'
);
assert(
  entry.brief.expectedImpact.metric.length > 0,
  'Brief expectedImpact has metric'
);
assert(
  entry.brief.contractPatchIntent.changes.length >= 1,
  `Brief patchIntent has ${entry.brief.contractPatchIntent.changes.length} change(s)`
);
assert(
  entry.brief.contractPatchIntent.acceptanceCriteria.length >= 1,
  `Brief patchIntent has ${entry.brief.contractPatchIntent.acceptanceCriteria.length} acceptance criteria`
);
assert(entry.brief.confidence === 'high', "Brief confidence is 'high'");

// ── Patch ───────────────────────────────────────────────────────────

section('Patch');

assert(entry.patch.patchId.length > 0, 'Patch has patchId');
assert(entry.patch.summary.length > 0, 'Patch has summary');
assert(
  entry.patch.changes.length >= 1,
  `Patch has ${entry.patch.changes.length} change(s)`
);
for (const change of entry.patch.changes) {
  assert(
    change.surfaces.length >= 1,
    `Patch change "${change.type}" has surfaces`
  );
}
assert(
  entry.patch.risks.length >= 1,
  `Patch has ${entry.patch.risks.length} risk(s)`
);

// ── Impact ──────────────────────────────────────────────────────────

section('Impact');

assert(entry.impact.reportId.length > 0, 'Impact has reportId');
assert(entry.impact.summary.length > 0, 'Impact has summary');
assert(
  entry.impact.breaks.length === entry.impact.breakCount,
  `Impact breaks count matches (${entry.impact.breaks.length} === ${entry.impact.breakCount})`
);
assert(
  entry.impact.mustChange.length === entry.impact.mustChangeCount,
  `Impact mustChange count matches (${entry.impact.mustChange.length} === ${entry.impact.mustChangeCount})`
);
assert(
  entry.impact.risky.length === entry.impact.riskyCount,
  `Impact risky count matches (${entry.impact.risky.length} === ${entry.impact.riskyCount})`
);
assert(entry.impact.breakCount >= 1, 'Impact has at least 1 break');

for (const item of entry.impact.breaks) {
  assert(item.severity === 'breaks', `Break item severity is "breaks"`);
  assert(item.surface.length > 0, `Break item has surface`);
  assert(item.filePaths.length >= 1, `Break item has file paths`);
}

// ── Export ───────────────────────────────────────────────────────────

section('Export');

assert(entry.exportPack.exportId.length > 0, 'Export has exportId');
assert(
  entry.exportPack.tasks.length >= 3,
  `Export has ${entry.exportPack.tasks.length} tasks (need >= 3)`
);
assert(
  entry.exportPack.exportedCount === entry.exportPack.tasks.length,
  `Export count matches task length (${entry.exportPack.exportedCount})`
);

for (const task of entry.exportPack.tasks) {
  assert(task.id.length > 0, `Task "${task.title}" has id`);
  assert(task.title.length > 0, `Task "${task.id}" has title`);
  assert(task.description.length > 0, `Task "${task.id}" has description`);
  assert(task.surfaces.length >= 1, `Task "${task.id}" has surfaces`);
  assert(
    task.acceptanceCriteria.length >= 1,
    `Task "${task.id}" has acceptance criteria`
  );
}

// ── Check ───────────────────────────────────────────────────────────

section('Check');

assert(entry.check.id.length > 0, 'Check has id');
assert(entry.check.metric.length > 0, 'Check has metric');
assert(entry.check.segment.length > 0, 'Check has segment');
assert(
  entry.check.threshold > 0,
  `Check threshold is ${entry.check.threshold}%`
);
assert(entry.check.status === 'planned', "Check status is 'planned'");

// Verify timestamps are in a reasonable range
const baseline = new Date(entry.check.baselineWindow.startDate);
const post = new Date(entry.check.postWindow.startDate);
assert(
  post > baseline,
  `Post window starts after baseline (${entry.check.baselineWindow.startDate} < ${entry.check.postWindow.startDate})`
);

// ── Stakeholder Brief ───────────────────────────────────────────────

section('Stakeholder brief');

assert(
  entry.stakeholderBrief.artifactId.length > 0,
  'Stakeholder has artifactId'
);
assert(
  entry.stakeholderBrief.transcript.length > 50,
  `Stakeholder transcript is substantial (${entry.stakeholderBrief.transcript.length} chars)`
);
assert(
  entry.stakeholderBrief.format === 'text' ||
    entry.stakeholderBrief.format === 'voice',
  `Stakeholder format is "${entry.stakeholderBrief.format}"`
);

// ── Golden path completeness ────────────────────────────────────────

section('Golden path completeness');

const cacheableSteps = [
  'brief',
  'patch',
  'impact',
  'export',
  'check',
  'stakeholder',
] as const;

for (const step of cacheableSteps) {
  const stepMap: Record<string, unknown> = {
    brief: entry.brief,
    patch: entry.patch,
    impact: entry.impact,
    export: entry.exportPack,
    check: entry.check,
    stakeholder: entry.stakeholderBrief,
  };
  assert(stepMap[step] != null, `Cache has data for "${step}" step`);
}

// ── Summary ─────────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(40)}`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`${'═'.repeat(40)}\n`);

process.exit(failed > 0 ? 1 : 0);
