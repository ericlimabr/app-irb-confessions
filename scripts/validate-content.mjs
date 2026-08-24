#!/usr/bin/env node
/**
 * CLI wrapper around `lib/validate-content.mjs`.
 *
 * - Reads from `<repo>/content` against `<repo>/schemas`.
 *   `IRB_CONTENT_DIR` overrides the content path (used by tests only).
 * - Prints results to stdout/stderr and exits 0/1.
 *
 * Usage: `npm run validate:content` (or `node scripts/validate-content.mjs`).
 */

import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateContent } from './lib/validate-content.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const contentDir = process.env.IRB_CONTENT_DIR
  ? resolve(process.env.IRB_CONTENT_DIR)
  : join(REPO_ROOT, 'content');
const schemasDir = join(REPO_ROOT, 'schemas');

const { ok, errors, summary } = validateContent({
  contentDir,
  schemasDir,
  repoRoot: REPO_ROOT,
});

if (ok) {
  console.log(
    `✓ Conteúdo válido. ${summary.collections} coleção(ões), ${summary.documents} documento(s), ${summary.units} unit(s).`,
  );
  process.exit(0);
}

console.error(`✖ ${errors.length} problema(s) encontrado(s):`);
const byFile = new Map();
for (const e of errors) {
  if (!byFile.has(e.file)) byFile.set(e.file, []);
  byFile.get(e.file).push(e.message);
}
for (const [file, msgs] of byFile) {
  console.error(`\n  ${file}`);
  for (const m of msgs) console.error(`    - ${m}`);
}
process.exit(1);
