#!/usr/bin/env node
/**
 * CLI do portão de incremento de `version` (ver `lib/check-version-bump.mjs`).
 *
 * Compara o HEAD contra uma base git e exige que toda coleção com arquivos
 * alterados tenha `version` maior que a da base.
 *
 * Base (nesta ordem): `IRB_BASE_REF` → `origin/main` → `main`.
 * Uso: `npm run check:version-bump` (na CI, em pull requests).
 */

import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkVersionBumps } from './lib/check-version-bump.mjs';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const git = (args) =>
  execFileSync('git', args, {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

/** Primeira ref que existe no clone. */
function resolveBase() {
  const candidates = [process.env.IRB_BASE_REF, 'origin/main', 'main'].filter(Boolean);
  for (const ref of candidates) {
    try {
      git(['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]);
      return ref;
    } catch {
      /* tenta a próxima */
    }
  }
  return null;
}

const base = resolveBase();
if (!base) {
  console.error(
    'check:version-bump — nenhuma base git encontrada (IRB_BASE_REF/origin/main/main).',
  );
  console.error('Em CI, garanta `fetch-depth: 0` no checkout. Pulando.');
  process.exit(0); // não barra por falta de base; a CI de PR sempre tem uma
}

/** `git show ref:path` → JSON, ou null se o arquivo não existe naquela ref. */
function readAt(ref, path) {
  try {
    return JSON.parse(git(['show', `${ref}:${path}`]));
  } catch {
    return null;
  }
}

const changedFiles = git(['diff', '--name-only', `${base}...HEAD`])
  .split('\n')
  .map((l) => l.trim())
  .filter(Boolean);

const { ok, errors, checked } = checkVersionBumps({
  changedFiles,
  readCurrent: (c) => readAt('HEAD', `content/${c}/_collection.json`),
  readBase: (c) => readAt(base, `content/${c}/_collection.json`),
});

if (checked.length === 0) {
  console.log('check:version-bump — nenhuma coleção alterada.');
  process.exit(0);
}

if (!ok) {
  console.error(`check:version-bump — falhou (base: ${base})\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error('');
  process.exit(1);
}

console.log(`check:version-bump — ok (${checked.join(', ')} com version incrementada).`);
