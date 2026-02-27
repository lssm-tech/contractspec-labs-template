import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const diff = (left, right) =>
  [...left].filter((item) => !right.has(item)).sort();

export function createIntegrityContext(root = process.cwd()) {
  const failures = [];
  const infos = [];
  const abs = (relativePath) => resolve(root, relativePath);

  function readText(relativePath) {
    const path = abs(relativePath);
    if (!existsSync(path)) {
      failures.push(`Missing file: ${relativePath}`);
      return '';
    }
    return readFileSync(path, 'utf-8');
  }

  function readJson(relativePath) {
    const text = readText(relativePath);
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch (error) {
      failures.push(`Invalid JSON in ${relativePath}: ${String(error)}`);
      return null;
    }
  }

  function listStems(relativePath, extension) {
    const path = abs(relativePath);
    if (!existsSync(path)) {
      failures.push(`Missing directory: ${relativePath}`);
      return [];
    }
    return readdirSync(path, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
      .map((entry) => entry.name.slice(0, -extension.length))
      .sort();
  }

  function listDirs(relativePath) {
    const path = abs(relativePath);
    if (!existsSync(path)) {
      failures.push(`Missing directory: ${relativePath}`);
      return [];
    }
    return readdirSync(path, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  }

  function assertEqual(expected, actual, label) {
    const missing = diff(expected, actual);
    const unexpected = diff(actual, expected);
    if (missing.length)
      failures.push(`${label} is missing: ${missing.join(', ')}`);
    if (unexpected.length) {
      failures.push(
        `${label} has unexpected entries: ${unexpected.join(', ')}`
      );
    }
    if (!missing.length && !unexpected.length)
      infos.push(`${label}: ok (${expected.size})`);
  }

  function assertIncludes(required, actual, label) {
    const missing = diff(required, actual);
    if (missing.length) {
      failures.push(`${label} is missing required keys: ${missing.join(', ')}`);
      return;
    }
    infos.push(`${label}: includes required keys (${required.size})`);
  }

  return {
    failures,
    infos,
    abs,
    readText,
    readJson,
    listStems,
    listDirs,
    assertEqual,
    assertIncludes,
  };
}
