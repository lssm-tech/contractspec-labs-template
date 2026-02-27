#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourcePath = resolve(process.cwd(), '.claude/CLAUDE.md');
const targetPath = resolve(process.cwd(), 'CLAUDE.md');

if (!existsSync(sourcePath)) {
  console.error(
    '[agentpacks] Missing .claude/CLAUDE.md. Run `bun run agentpacks:generate` first.'
  );
  process.exit(1);
}

const sourceContent = readFileSync(sourcePath, 'utf-8');
const output = sourceContent.endsWith('\n')
  ? sourceContent
  : `${sourceContent}\n`;

writeFileSync(targetPath, output, 'utf-8');
