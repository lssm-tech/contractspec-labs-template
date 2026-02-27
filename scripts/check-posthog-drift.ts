#!/usr/bin/env bun
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

interface PostHogFeatureFlag {
  key: string;
}
interface PostHogEventDefinition {
  name: string;
}
interface PostHogAction {
  name: string;
  steps?: { event?: string | null }[];
}
interface ActionEventDrift {
  action: string;
  event: string;
}

const DEFAULT_HOST = 'https://eu.posthog.com';
const MAX_OFFSET = 10_000;
const PAGE_SIZE = 100;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function toSortedUnique(values: Iterable<string>): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function difference(left: Set<string>, right: Set<string>): string[] {
  const out: string[] = [];
  for (const value of left) {
    if (!right.has(value)) {
      out.push(value);
    }
  }
  return out.sort((a, b) => a.localeCompare(b));
}

function extractItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  if (isRecord(payload) && Array.isArray(payload.results)) {
    return payload.results as T[];
  }
  return [];
}

function extractEnumStringValues(source: string): string[] {
  const matches = source.matchAll(/=\s*'([^']+)'/g);
  return toSortedUnique(Array.from(matches, (match) => match[1]));
}

function extractUnionStringValues(source: string): string[] {
  const matches = source.matchAll(/\|\s*'([^']+)'/g);
  return toSortedUnique(Array.from(matches, (match) => match[1]));
}

async function fetchCollection<T>(
  host: string,
  projectId: string,
  apiKey: string,
  resource: string
): Promise<T[]> {
  const all: T[] = [];
  let offset = 0;

  while (offset <= MAX_OFFSET) {
    const url = new URL(`${host}/api/projects/${projectId}/${resource}/`);
    url.searchParams.set('limit', String(PAGE_SIZE));
    url.searchParams.set('offset', String(offset));

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to fetch ${resource} (${response.status}): ${text}`
      );
    }

    const payload = (await response.json()) as unknown;
    const page = extractItems<T>(payload);
    all.push(...page);

    if (page.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
  }

  return all;
}

function printSection(title: string, values: string[]): void {
  console.log(`\n${title} (${values.length})`);
  if (values.length === 0) {
    console.log('  - none');
    return;
  }
  for (const value of values) {
    console.log(`  - ${value}`);
  }
}

function printActionSection(values: ActionEventDrift[]): void {
  console.log(`\nActions with unknown events (${values.length})`);
  if (values.length === 0) {
    console.log('  - none');
    return;
  }
  for (const value of values) {
    console.log(`  - ${value.action}: ${value.event}`);
  }
}

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function main(): Promise<void> {
  const shouldOutputJson = process.argv.includes('--json');
  const shouldFailOnDrift = !process.argv.includes('--no-fail');

  const apiKey = readRequiredEnv('POSTHOG_PERSONAL_API_KEY');
  const projectId = readRequiredEnv('POSTHOG_PROJECT_ID');
  const host = (process.env.POSTHOG_HOST ?? DEFAULT_HOST).replace(/\/+$/, '');

  const repoRoot = resolve(import.meta.dir, '..');
  const featureFlagFile = resolve(
    repoRoot,
    'packages/libs/contracts-contractspec-studio/src/analytics/feature-flags.ts'
  );
  const coreNamesFile = resolve(
    repoRoot,
    'packages/libs/contracts-contractspec-studio/src/analytics/events/names-core.ts'
  );
  const extendedNamesFile = resolve(
    repoRoot,
    'packages/libs/contracts-contractspec-studio/src/analytics/events/names-extended.ts'
  );

  const [featureFlagSource, coreNamesSource, extendedNamesSource] =
    await Promise.all([
      readFile(featureFlagFile, 'utf8'),
      readFile(coreNamesFile, 'utf8'),
      readFile(extendedNamesFile, 'utf8'),
    ]);

  const localFlags = new Set(extractEnumStringValues(featureFlagSource));
  const localEvents = new Set([
    ...extractUnionStringValues(coreNamesSource),
    ...extractUnionStringValues(extendedNamesSource),
  ]);

  const [remoteFlagsRaw, remoteEventsRaw, remoteActionsRaw] = await Promise.all(
    [
      fetchCollection<PostHogFeatureFlag>(
        host,
        projectId,
        apiKey,
        'feature_flags'
      ),
      fetchCollection<PostHogEventDefinition>(
        host,
        projectId,
        apiKey,
        'event_definitions'
      ),
      fetchCollection<PostHogAction>(host, projectId, apiKey, 'actions'),
    ]
  );

  const remoteFlags = new Set(
    remoteFlagsRaw.map((flag) => flag.key).filter((key) => key.length > 0)
  );
  const remoteEvents = new Set(
    remoteEventsRaw
      .map((eventDef) => eventDef.name)
      .filter((name) => name.length > 0)
  );
  const remoteEventsNonSystem = new Set(
    Array.from(remoteEvents).filter((name) => !name.startsWith('$'))
  );

  const actionsWithUnknownEvents = toSortedUnique(
    remoteActionsRaw.flatMap((action) =>
      (action.steps ?? [])
        .map((step) => step.event ?? '')
        .filter((eventName) => eventName.length > 0)
        .filter(
          (eventName) =>
            !eventName.startsWith('$') && !localEvents.has(eventName)
        )
        .map((eventName) => `${action.name}::${eventName}`)
    )
  ).map((entry) => {
    const [action, event] = entry.split('::');
    return { action, event };
  });

  const summary = {
    missingFlagsInPostHog: difference(localFlags, remoteFlags),
    extraFlagsInPostHog: difference(remoteFlags, localFlags),
    missingEventsInPostHog: difference(localEvents, remoteEvents),
    extraEventsInPostHog: difference(remoteEventsNonSystem, localEvents),
    actionsWithUnknownEvents,
  };

  if (shouldOutputJson) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log('PostHog drift report');
    printSection('Flags missing in PostHog', summary.missingFlagsInPostHog);
    printSection('Extra flags in PostHog', summary.extraFlagsInPostHog);
    printSection('Events missing in PostHog', summary.missingEventsInPostHog);
    printSection('Extra events in PostHog', summary.extraEventsInPostHog);
    printActionSection(summary.actionsWithUnknownEvents);
  }

  const hasDrift =
    summary.missingFlagsInPostHog.length > 0 ||
    summary.extraFlagsInPostHog.length > 0 ||
    summary.missingEventsInPostHog.length > 0 ||
    summary.extraEventsInPostHog.length > 0 ||
    summary.actionsWithUnknownEvents.length > 0;

  if (hasDrift && shouldFailOnDrift) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
