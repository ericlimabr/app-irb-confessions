#!/usr/bin/env node
/**
 * Conversor Markdown → JSON (ADR-021, docs/CONVERSOR.md).
 *
 *   node scripts/convert.mjs [colecao...]     # gera/atualiza content/
 *   node scripts/convert.mjs --check [colecao...]  # regenera em memória e falha
 *                                                    se divergir do comitado (CI)
 *
 * Sem coleções nomeadas, roda todas as que têm parser. A escrita é uma
 * substituição transacional por coleção: arquivos `*.json` órfãos (documento
 * removido da fonte) são apagados. Falha barulhenta com `arquivo:linha`.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ConvertError, makeCollection, readCollectionMeta, toJson } from './convert/common.mjs';
import { COLLECTIONS } from './convert/config.mjs';
import { parseBelgic } from './convert/belgic.mjs';
import { parseHeidelberg } from './convert/heidelberg.mjs';
import { parseDort } from './convert/dort.mjs';
import { parsePsalms } from './convert/psalms.mjs';
import { parseHymns } from './convert/hymns.mjs';

const PARSERS = {
  belgic: parseBelgic,
  heidelberg: parseHeidelberg,
  dort: parseDort,
  psalms: parsePsalms,
  hymns: parseHymns,
};

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTES = join(REPO_ROOT, 'fontes');
const CONTENT = join(REPO_ROOT, 'content');

/** Monta o conjunto de arquivos {nome → conteúdo} de uma coleção. */
function generate(id) {
  const cfg = COLLECTIONS[id];
  const parser = PARSERS[id];
  if (!cfg) throw new ConvertError(`coleção desconhecida: ${id}`);
  const relFile = `fontes/${cfg.srcDir}/${cfg.srcFile}`;
  const source = readFileSync(join(FONTES, cfg.srcDir, cfg.srcFile), 'utf8');
  const docs = parser(source, relFile);

  const meta = readCollectionMeta(join(CONTENT, id, '_collection.json'));
  const collection = makeCollection({
    id,
    kind: cfg.kind,
    title: cfg.title,
    subtitle: cfg.subtitle,
    sortOrder: cfg.sortOrder,
    version: meta.version,
    revision: meta.revision,
  });

  const files = new Map();
  files.set('_collection.json', toJson(collection));
  for (const doc of docs) {
    const name = `${doc.id}.json`;
    if (files.has(name)) throw new ConvertError(`${relFile}: id de documento duplicado "${doc.id}"`);
    files.set(name, toJson(doc));
  }
  return files;
}

function listJson(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith('.json') && statSync(join(dir, f)).isFile());
}

function writeCollection(id, files) {
  const dir = join(CONTENT, id);
  mkdirSync(dir, { recursive: true });
  for (const [name, content] of files) writeFileSync(join(dir, name), content);
  for (const stale of listJson(dir)) {
    if (!files.has(stale)) rmSync(join(dir, stale));
  }
}

function checkCollection(id, files) {
  const dir = join(CONTENT, id);
  const problems = [];
  for (const [name, content] of files) {
    const path = join(dir, name);
    if (!existsSync(path)) problems.push(`faltando: content/${id}/${name}`);
    else if (readFileSync(path, 'utf8') !== content) problems.push(`divergente: content/${id}/${name}`);
  }
  for (const stale of listJson(dir)) {
    if (!files.has(stale)) problems.push(`órfão (não gerado): content/${id}/${stale}`);
  }
  return problems;
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const named = args.filter((a) => !a.startsWith('--'));
  const targets = named.length ? named : Object.keys(PARSERS);

  const unknown = targets.filter((t) => !PARSERS[t]);
  if (unknown.length) {
    console.error(`✖ sem parser para: ${unknown.join(', ')} (implementadas: ${Object.keys(PARSERS).join(', ')})`);
    process.exit(1);
  }

  let totalDocs = 0;
  const allProblems = [];
  for (const id of targets) {
    let files;
    try {
      files = generate(id);
    } catch (e) {
      if (e instanceof ConvertError) {
        console.error(`✖ ${e.message}`);
        process.exit(1);
      }
      throw e;
    }
    totalDocs += files.size - 1; // menos o _collection.json
    if (check) {
      allProblems.push(...checkCollection(id, files));
    } else {
      writeCollection(id, files);
      console.log(`✓ ${id}: ${files.size - 1} documento(s)`);
    }
  }

  if (check) {
    if (allProblems.length) {
      console.error(`✖ conversor: saída diverge do comitado (${allProblems.length}):`);
      for (const p of allProblems) console.error(`    - ${p}`);
      console.error('\n  Rode `npm run convert` e comite o content/ gerado.');
      process.exit(1);
    }
    console.log(`✓ conversor: content/ bate com a fonte (${totalDocs} documento(s)).`);
  }
}

main();
