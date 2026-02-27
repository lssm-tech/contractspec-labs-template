#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const sourcePath = resolve(process.cwd(), 'packs/vibecoding-tooling/mcp.json');
const targetPath = resolve(process.cwd(), '.mcp.json');

const sourceContent = readFileSync(sourcePath, 'utf-8');
const source = JSON.parse(sourceContent);

const mcpServers = source.mcpServers ?? {};
const output = { mcpServers };

writeFileSync(targetPath, `${JSON.stringify(output, null, 2)}\n`, 'utf-8');
