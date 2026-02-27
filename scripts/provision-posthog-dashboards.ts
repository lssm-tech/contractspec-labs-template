#!/usr/bin/env bun
/**
 * PostHog dashboard provisioning script.
 *
 * Creates 5 dashboards with tiles matching the ContractSpec analytics plan.
 * If POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID are set, creates via API.
 * Otherwise, outputs JSON definitions to stdout for manual creation.
 *
 * Usage: bun scripts/provision-posthog-dashboards.ts
 */

interface DashboardTile {
  name: string;
  description: string;
  eventName: string;
  aggregation: 'total' | 'unique_users' | 'avg' | 'p50' | 'p90';
  filters?: Record<string, string | number | boolean>;
}

interface DashboardDef {
  name: string;
  description: string;
  tiles: DashboardTile[];
}

/* eslint-disable @stylistic/max-len */
const DASHBOARDS: DashboardDef[] = [
  {
    name: 'Command Center: Loop Health',
    description: 'Top-level health of the evidence-to-outcome loop.',
    tiles: [
      {
        name: 'Activation rate',
        description: '% of signups reaching activation',
        eventName: 'activation_achieved',
        aggregation: 'unique_users',
      },
      {
        name: 'TTV p50 (min)',
        description: 'Median time-to-value in minutes',
        eventName: 'activation_achieved',
        aggregation: 'p50',
        filters: { property: 'ttv_minutes' },
      },
      {
        name: 'Patches certified',
        description: 'Total certified patches',
        eventName: 'patch_certified',
        aggregation: 'total',
      },
      {
        name: 'Work items exported',
        description: 'Total work items exported',
        eventName: 'work_items_exported',
        aggregation: 'total',
      },
      {
        name: 'Checks scheduled',
        description: 'Total checks scheduled',
        eventName: 'check_scheduled',
        aggregation: 'total',
      },
      {
        name: 'Checks confirmed',
        description: 'Checks confirmed by outcome data',
        eventName: 'check_confirmed',
        aggregation: 'total',
      },
    ],
  },
  {
    name: 'Trust & Determinism',
    description: 'Guardrails ensuring output correctness and determinism.',
    tiles: [
      {
        name: 'Citation missing rate',
        description: 'Briefs missing required citations',
        eventName: 'citation_missing',
        aggregation: 'total',
      },
      {
        name: 'JSON validation failures',
        description: 'Schema validation failures',
        eventName: 'json_validation_failed',
        aggregation: 'total',
      },
      {
        name: 'LLM retries',
        description: 'LLM retry events triggered',
        eventName: 'llm_retry_triggered',
        aggregation: 'total',
      },
      {
        name: 'Compile failure rate',
        description: 'Patch compilation failures',
        eventName: 'patch_compiled',
        aggregation: 'total',
        filters: { status: 'failed' },
      },
    ],
  },
  {
    name: 'Evidence Portfolio Maturity',
    description: 'Depth and breadth of ingested evidence.',
    tiles: [
      {
        name: 'Evidence ingested',
        description: 'Total evidence items ingested',
        eventName: 'evidence_item_ingested',
        aggregation: 'total',
      },
      {
        name: 'Patterns rebuilt',
        description: 'Pattern clustering runs',
        eventName: 'patterns_rebuilt',
        aggregation: 'total',
      },
      {
        name: 'Streams connected',
        description: 'Active evidence streams',
        eventName: 'evidence_stream_connected',
        aggregation: 'unique_users',
      },
      {
        name: 'Sync completions',
        description: 'Successful syncs',
        eventName: 'evidence_stream_sync_completed',
        aggregation: 'total',
      },
    ],
  },
  {
    name: 'Export Performance',
    description: 'Work item export funnel and adoption.',
    tiles: [
      {
        name: 'Exports total',
        description: 'Total export events',
        eventName: 'work_items_exported',
        aggregation: 'total',
      },
      {
        name: 'Export failures',
        description: 'Failed export attempts',
        eventName: 'work_items_export_failed',
        aggregation: 'total',
      },
      {
        name: 'Export users',
        description: 'Unique users who exported',
        eventName: 'work_items_exported',
        aggregation: 'unique_users',
      },
      {
        name: 'Loop: exported items',
        description: 'Revenue-loop export events',
        eventName: 'loop_exported_work_items',
        aggregation: 'total',
      },
    ],
  },
  {
    name: 'Checks Efficacy',
    description: 'Outcome verification loop health.',
    tiles: [
      {
        name: 'Checks scheduled',
        description: 'Total checks created',
        eventName: 'check_scheduled',
        aggregation: 'total',
      },
      {
        name: 'Checks confirmed',
        description: 'Checks with positive outcome',
        eventName: 'check_confirmed',
        aggregation: 'total',
      },
      {
        name: 'Checks rejected',
        description: 'Checks with negative outcome',
        eventName: 'check_rejected',
        aggregation: 'total',
      },
      {
        name: 'Closure rate (30d)',
        description: '% of checks closed within 30d',
        eventName: 'loop_check_completed',
        aggregation: 'total',
      },
      {
        name: 'Auto-evaluated',
        description: 'Checks auto-evaluated from analytics',
        eventName: 'check_evaluated_from_analytics',
        aggregation: 'total',
      },
    ],
  },
];
/* eslint-enable @stylistic/max-len */

async function provisionViaApi(
  apiKey: string,
  projectId: string,
  host: string
): Promise<void> {
  for (const dashboard of DASHBOARDS) {
    const body = {
      name: dashboard.name,
      description: dashboard.description,
      tiles: dashboard.tiles.map((tile) => ({
        name: tile.name,
        description: tile.description,
        query: {
          kind: 'EventsQuery',
          event: tile.eventName,
          math: tile.aggregation,
          properties: tile.filters
            ? Object.entries(tile.filters).map(([key, value]) => ({
                key,
                value,
                operator: 'exact',
                type: 'event',
              }))
            : [],
        },
      })),
    };

    const res = await fetch(`${host}/api/projects/${projectId}/dashboards/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `Failed to create "${dashboard.name}": ${res.status} ${errText}`
      );
    } else {
      const data = await res.json();
      console.log(`Created "${dashboard.name}" -> id=${data.id}`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────

const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const projectId = process.env.POSTHOG_PROJECT_ID;
const host = process.env.POSTHOG_HOST ?? 'https://eu.posthog.com';

if (apiKey && projectId) {
  console.log('Provisioning dashboards via PostHog API...\n');
  provisionViaApi(apiKey, projectId, host)
    .then(() => console.log('\nDone.'))
    .catch((err) => {
      console.error('Provisioning failed:', err);
      process.exit(1);
    });
} else {
  console.log('No POSTHOG_PERSONAL_API_KEY or POSTHOG_PROJECT_ID set.');
  console.log('Outputting dashboard definitions as JSON:\n');
  console.log(JSON.stringify(DASHBOARDS, null, 2));
}
