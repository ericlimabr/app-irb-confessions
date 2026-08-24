/**
 * Source content validator — pure function form (no process side-effects).
 *
 * Layers:
 *  1. JSON Schema (`schemas/{collection,document}.schema.json`) via Ajv —
 *     shape, types, enums, regex patterns.
 *  2. Extra rules (SPEC-FORMATO-FONTE §5 + SPEC-CONVENCAO §1, §3):
 *     - folder/file coherence (folder == collection.id; file == {id}.json)
 *     - presence of `_collection.json`
 *     - global uniqueness of document.id and unit.id
 *     - kebab type-prefix per collection (psalm-, creed-, …)
 *     - per-type document.id pattern (psalm-NNN-var, heidelberg-ldNN, …)
 *     - unique sortOrder within document and within collection
 *     - psalm variants share a groupKey
 *     - rejection of derived fields (title_norm, rowid) at any depth
 *
 * Signature:
 *   validateContent({ contentDir, schemasDir, repoRoot? }) →
 *     { ok, errors, summary: { collections, documents, units } }
 *
 * Errors are returned, never thrown. The CLI wrapper turns them into
 * console output + exit codes.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

// ─── Normative constants ────────────────────────────────────────────────────

/** Per-collection document.id regex (SPEC-CONVENCAO §3). */
export const DOC_ID_PATTERNS = {
  // Salmo comum: `psalm-NNN-var`. Salmo 119 é seccionado por faixa de versículos
  // (CONVERSOR.md F1): `psalm-119-VVV-VVV-var`, VVV = versículo com 3 dígitos.
  psalms: /^psalm-(\d{3}|119-\d{3}-\d{3})-(gen|har)$/,
  hymns: /^hymn-\d{3}$/,
  creeds: /^creed-[a-z0-9]+(-[a-z0-9]+)*$/,
  belgic: /^belgic-art\d{2}$/,
  heidelberg: /^heidelberg-ld\d{2}$/,
  // Dort: 4 documentos de capítulo (o 3º/4º combinados → dort-h3-4) + a Conclusão.
  dort: /^dort-(h[1-5]|h3-4|conclusion)$/,
  forms: /^form-[a-z0-9]+(-[a-z0-9]+)*$/,
  'church-order': /^church-order-art\d{3}$/,
  minutes: /^minutes-\d{4}-\d{2}$/,
};

/** Canonical collection.id list (SPEC-CONVENCAO §2). */
export const KNOWN_COLLECTIONS = new Set([
  'psalms',
  'hymns',
  'creeds',
  'belgic',
  'heidelberg',
  'dort',
  'forms',
  'church-order',
  'minutes',
  'bible-ara',
  'bible-arc',
  'bible-acf',
]);

/**
 * Required prefix on every document.id and unit.id of a collection.
 * Singular type-name for most (`creed-`, `psalm-`); collection-name where the
 * collection itself is already singular (`heidelberg-`, `belgic-`, …).
 */
export const ID_PREFIX_BY_COLLECTION = {
  psalms: 'psalm-',
  hymns: 'hymn-',
  creeds: 'creed-',
  belgic: 'belgic-',
  heidelberg: 'heidelberg-',
  dort: 'dort-',
  forms: 'form-',
  'church-order': 'church-order-',
  minutes: 'minutes-',
};

/** Derived fields that must NOT appear in source files (SPEC-FORMATO §5.7). */
export const DERIVED_FIELDS = ['title_norm', 'rowid'];

// ─── Small helpers ──────────────────────────────────────────────────────────

const isJsonFile = (name) => name.endsWith('.json');
const isCollectionFile = (name) => name === '_collection.json';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function listDirs(parent) {
  return readdirSync(parent).filter((entry) => statSync(join(parent, entry)).isDirectory());
}

function listFiles(dir) {
  return readdirSync(dir).filter((entry) => statSync(join(dir, entry)).isFile());
}

/** Recursive scan for any banned key, returning the dotted path of each hit. */
function findDerivedFields(node, path = '') {
  const hits = [];
  if (Array.isArray(node)) {
    node.forEach((item, i) => hits.push(...findDerivedFields(item, `${path}[${i}]`)));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      const here = path ? `${path}.${key}` : key;
      if (DERIVED_FIELDS.includes(key)) hits.push(here);
      hits.push(...findDerivedFields(value, here));
    }
  }
  return hits;
}

/** Translate Ajv error objects into single-line, PT-facing messages. */
function ajvErrorsToMessages(errors) {
  return errors.map((e) => {
    const where = e.instancePath || '/';
    if (e.keyword === 'enum') {
      return `${where}: valor não está no enum [${e.params.allowedValues.join(', ')}]`;
    }
    if (e.keyword === 'pattern') {
      return `${where}: não casa o padrão ${e.params.pattern}`;
    }
    if (e.keyword === 'required') {
      return `${where}: faltando campo obrigatório "${e.params.missingProperty}"`;
    }
    if (e.keyword === 'additionalProperties') {
      return `${where}: campo não declarado "${e.params.additionalProperty}"`;
    }
    return `${where}: ${e.message}`;
  });
}

// ─── Main entry ─────────────────────────────────────────────────────────────

/**
 * Run all validation layers against a content directory.
 *
 * @param {{contentDir: string, schemasDir: string, repoRoot?: string}} opts
 * @returns {{
 *   ok: boolean,
 *   errors: { file: string, message: string }[],
 *   summary: { collections: number, documents: number, units: number },
 * }}
 */
export function validateContent({ contentDir, schemasDir, repoRoot }) {
  const root = repoRoot ?? contentDir;
  const errors = [];
  const add = (file, message) => {
    errors.push({ file: relative(root, file), message });
  };

  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validateCollectionSchema = ajv.compile(
    readJson(join(schemasDir, 'collection.schema.json')),
  );
  const validateDocumentSchema = ajv.compile(readJson(join(schemasDir, 'document.schema.json')));

  // Content dir missing is a hard failure but still returned (not thrown) so
  // the CLI shim controls how to render it.
  try {
    statSync(contentDir);
  } catch {
    return {
      ok: false,
      errors: [{ file: contentDir, message: 'pasta de conteúdo inexistente' }],
      summary: { collections: 0, documents: 0, units: 0 },
    };
  }

  const allDocIds = new Map(); // id → absolute file path of the first sighting
  const allUnitIds = new Map();
  const docsByGroupKey = new Map(); // groupKey → [{ id, variant }]
  let docCount = 0;
  let collectionCount = 0;

  for (const collDir of listDirs(contentDir)) {
    const fullCollDir = join(contentDir, collDir);
    const collFile = join(fullCollDir, '_collection.json');

    // Rule 4 — _collection.json must exist
    try {
      statSync(collFile);
    } catch {
      add(fullCollDir, '_collection.json ausente nesta pasta');
      continue;
    }

    let collJson;
    try {
      collJson = readJson(collFile);
    } catch (e) {
      add(collFile, `JSON inválido: ${e.message}`);
      continue;
    }

    // Layer 1 — schema
    if (!validateCollectionSchema(collJson)) {
      for (const msg of ajvErrorsToMessages(validateCollectionSchema.errors)) {
        add(collFile, msg);
      }
    }

    // Rule 3 — folder name == collection.id
    if (collJson.id !== collDir) {
      add(collFile, `_collection.id="${collJson.id}" não bate com a pasta "${collDir}"`);
    }

    if (!KNOWN_COLLECTIONS.has(collJson.id)) {
      add(
        collFile,
        `_collection.id="${collJson.id}" não está na lista canônica de SPEC-CONVENCAO §2`,
      );
    }

    collectionCount += 1;

    // ── Documents within the collection ───────────────────────────────────
    const docFiles = listFiles(fullCollDir).filter((f) => isJsonFile(f) && !isCollectionFile(f));
    const sortOrdersSeen = new Map(); // sortOrder → docId

    for (const docFile of docFiles) {
      const fullDocFile = join(fullCollDir, docFile);
      let doc;
      try {
        doc = readJson(fullDocFile);
      } catch (e) {
        add(fullDocFile, `JSON inválido: ${e.message}`);
        continue;
      }

      // Layer 1 — schema
      if (!validateDocumentSchema(doc)) {
        for (const msg of ajvErrorsToMessages(validateDocumentSchema.errors)) {
          add(fullDocFile, msg);
        }
        // Keep running the other checks so the author sees the full picture.
      }

      // Rule 3 — file name == {id}.json and document.collection == folder
      if (docFile !== `${doc.id}.json`) {
        add(fullDocFile, `nome do arquivo deve ser "${doc.id}.json" (id do documento)`);
      }
      if (doc.collection !== collJson.id) {
        add(
          fullDocFile,
          `document.collection="${doc.collection}" não bate com a pasta "${collJson.id}"`,
        );
      }

      // Rule 2 — global unique document.id
      if (allDocIds.has(doc.id)) {
        add(
          fullDocFile,
          `document.id="${doc.id}" duplicado (já visto em ${relative(root, allDocIds.get(doc.id))})`,
        );
      } else {
        allDocIds.set(doc.id, fullDocFile);
      }

      // SPEC-CONVENCAO §3 — per-type document.id pattern
      const pattern = DOC_ID_PATTERNS[collJson.id];
      if (pattern && !pattern.test(doc.id)) {
        add(
          fullDocFile,
          `document.id="${doc.id}" não casa o padrão de "${collJson.id}" (${pattern})`,
        );
      }

      // Rule 5 — unique sortOrder among collection's documents
      if (sortOrdersSeen.has(doc.sortOrder)) {
        add(
          fullDocFile,
          `sortOrder=${doc.sortOrder} já usado pelo doc "${sortOrdersSeen.get(doc.sortOrder)}"`,
        );
      } else {
        sortOrdersSeen.set(doc.sortOrder, doc.id);
      }

      // Rule 6 — variant ⇒ groupKey
      if (doc.variant && !doc.groupKey) {
        add(fullDocFile, `variant="${doc.variant}" exige groupKey (SPEC-FORMATO §5.6)`);
      }
      if (doc.groupKey) {
        if (!docsByGroupKey.has(doc.groupKey)) docsByGroupKey.set(doc.groupKey, []);
        docsByGroupKey.get(doc.groupKey).push({ id: doc.id, variant: doc.variant });
      }

      // Rule 7 — derived fields banned at any depth
      for (const hit of findDerivedFields(doc)) {
        add(fullDocFile, `campo derivado "${hit}" não pode aparecer na fonte (gerado pelo build)`);
      }

      // Units: global unique id + unique sortOrder per doc + type prefix.
      // SPEC-CONVENCAO §1.3 requires the collection type-prefix, NOT the
      // document.id prefix — Heidelberg P&Rs are numbered globally
      // (`heidelberg-q001-q`) outside any `heidelberg-ldNN` document.
      const unitSortOrders = new Map();
      for (const unit of doc.units ?? []) {
        if (allUnitIds.has(unit.id)) {
          add(
            fullDocFile,
            `unit.id="${unit.id}" duplicado (já visto em ${relative(root, allUnitIds.get(unit.id))})`,
          );
        } else {
          allUnitIds.set(unit.id, fullDocFile);
        }

        const expectedPrefix = ID_PREFIX_BY_COLLECTION[collJson.id];
        if (expectedPrefix && !unit.id.startsWith(expectedPrefix)) {
          add(
            fullDocFile,
            `unit.id="${unit.id}" não começa com "${expectedPrefix}" (SPEC-CONVENCAO §1.3)`,
          );
        }

        if (unitSortOrders.has(unit.sortOrder)) {
          add(
            fullDocFile,
            `unit sortOrder=${unit.sortOrder} duplicado neste documento (já usado por "${unitSortOrders.get(unit.sortOrder)}")`,
          );
        } else {
          unitSortOrders.set(unit.sortOrder, unit.id);
        }
      }

      docCount += 1;
    }
  }

  // Post-loop — groupKey consistency: every member must have a variant set.
  for (const [gk, members] of docsByGroupKey) {
    if (members.length < 2) continue;
    const variants = new Set(members.map((m) => m.variant));
    if (variants.has(null) || variants.has(undefined)) {
      add(
        contentDir,
        `groupKey="${gk}" tem variante nula em algum membro (todos devem ter variant)`,
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    summary: { collections: collectionCount, documents: docCount, units: allUnitIds.size },
  };
}
