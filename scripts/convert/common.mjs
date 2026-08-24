/**
 * Helpers compartilhados do conversor Markdown → JSON (ADR-021, docs/CONVERSOR.md).
 *
 * O emissor não sabe nada de Markdown: recebe documentos/unidades já montados
 * pelos parsers e garante (a) ordem de chaves estável (para diff legível e
 * saída idempotente) e (b) as invariantes de §2 da spec. Os parsers usam
 * `fail()` para abortar barulhento com `arquivo:linha` (invariante §2.6).
 */

import { existsSync, readFileSync } from 'node:fs';

// ─── Falha barulhenta ───────────────────────────────────────────────────────

export class ConvertError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConvertError';
  }
}

/** Aborta com contexto `arquivo:linha` e a mensagem. Nunca emitir um palpite. */
export function fail(file, line, msg) {
  throw new ConvertError(`${file}:${line}: ${msg}`);
}

// ─── Leitura de linhas com número (1-based) ─────────────────────────────────

/** @returns {{ n: number, text: string }[]} linhas com número 1-based. */
export function toLines(source) {
  return source.split('\n').map((text, i) => ({ n: i + 1, text }));
}

// ─── Marcação inline ────────────────────────────────────────────────────────

/**
 * Confessionais: achata o marcador de nota `<sup>N</sup>` (D1). Remove a tag e
 * um único espaço à esquerda, de modo que "boca, <sup>1</sup> que" → "boca, que"
 * sem criar espaço duplo. Espaços múltiplos legítimos (§2.3) não são tocados
 * fora da vizinhança imediata do marcador.
 */
export function stripSup(s) {
  return s.replace(/ ?<sup>[^<]*<\/sup>/g, '');
}

/** Remove os marcadores de itálico externos `_..._` → texto interno. */
export function stripItalic(s) {
  const m = s.match(/^_(.+)_$/);
  return m ? m[1] : s;
}

/** Remove só a marcação de negrito `**…**` → texto interno (Dort: rótulos
 *  `**Erro N**`/`**Refutação**`). Palavras e travessões preservados. */
export function stripBold(s) {
  return s.replace(/\*\*(.*?)\*\*/g, '$1');
}

// ─── Bloco de referências (lista numerada) ──────────────────────────────────

/**
 * Converte uma lista `1. ...`, `2. ...` em array de strings (ordem preservada).
 * Preserva a forma da fonte verbatim (D2), só remove o enumerador `N.` e o
 * espaço logo após. Falha se um item não casar o formato.
 * @param {{n:number,text:string}[]} lines  linhas contíguas do bloco
 */
export function parseNumberedRefs(lines, file) {
  const refs = [];
  let expected = 1;
  for (const { n, text } of lines) {
    const m = text.match(/^(\d+)\.\s+(.*)$/);
    if (!m) fail(file, n, `esperava item de referência "N. …", achei: ${JSON.stringify(text)}`);
    const num = Number(m[1]);
    if (num !== expected) {
      fail(file, n, `referência fora de ordem: esperava ${expected}, achei ${num}`);
    }
    refs.push(m[2].trimEnd());
    expected += 1;
  }
  return refs;
}

// ─── Fronteira do bloco de referências (§1.6) ───────────────────────────────
// Réplica de `ferramentas/validar_confissoes.py`: o bloco de referências é a
// corrida contígua de linhas `N. …` que FECHA a unidade, aceita só se a maioria
// "parece referência". Isso separa refs de listas de CONTEÚDO numeradas — o
// Credo (P.23), os Dez Mandamentos (P.92), as 7 acusações da Conclusão de Dort.

const LIVROS = new Set([
  'Gn', 'Êx', 'Lv', 'Nm', 'Dt', '1Sm', '2Sm', '1Rs', '2Cr', 'Jó', 'Sl', 'Pv',
  'Ec', 'Is', 'Jr', 'Ez', 'Dn', 'Jl', 'Am', 'Mq', 'Na', 'Hc', 'Zc', 'Ml', 'Mt',
  'Mc', 'Lc', 'Jo', 'At', 'Rm', '1Co', '2Co', 'Gl', 'Ef', 'Fp', 'Cl', '1Ts',
  '2Ts', '1Tm', '2Tm', 'Tt', 'Hb', 'Tg', '1Pe', '2Pe', '1Jo', '2Jo', 'Jd', 'Ap',
  'Js', 'Jz', 'Rt', '2Rs', '1Cr', 'Ed', 'Ne', 'Et', 'Ct', 'Lm', 'Os', 'Ob', 'Jn',
  'Sf', 'Ag', 'Fm', '3Jo',
]);
const SIGLA = /([1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3})(?=[\s\d.])/g;

/** Carrega ao menos uma sigla bíblica conhecida (após remover o enumerador). */
export function looksLikeReference(entry) {
  const corpo = entry.replace(/^\d+\.\s+/, '');
  for (const [, sigla] of corpo.matchAll(SIGLA)) {
    if (LIVROS.has(sigla)) return true;
  }
  return false;
}

/**
 * Separa o corpo das referências numa região de linhas (a unidade inteira).
 * @param {{n:number,text:string}[]} region
 * @returns {{ bodyLines: {n:number,text:string}[], refs: string[]|null }}
 */
export function splitTrailingRefs(region, file) {
  let end = region.length;
  while (end > 0 && region[end - 1].text.trim() === '') end -= 1;
  let start = end;
  while (start > 0 && /^\d+\.\s/.test(region[start - 1].text.trim())) start -= 1;
  const candidate = region.slice(start, end);
  if (candidate.length === 0) return { bodyLines: region, refs: null };

  const hits = candidate.filter((l) => looksLikeReference(l.text.trim())).length;
  if (hits * 2 < candidate.length) return { bodyLines: region, refs: null }; // lista de conteúdo

  const refs = parseNumberedRefs(
    candidate.map((l) => ({ n: l.n, text: l.text.trim() })),
    file,
  );
  return { bodyLines: region.slice(0, start), refs };
}

// ─── Construtores com ordem de chave estável ────────────────────────────────

/** Documento no formato de `schemas/document.schema.json` (ordem de chave fixa). */
export function makeDoc({
  id,
  collection,
  number = null,
  numberLabel = null,
  title = null,
  subtitle = null,
  variant = null,
  groupKey = null,
  attrs = {},
  sortOrder,
  units,
}) {
  return { id, collection, number, numberLabel, title, subtitle, variant, groupKey, attrs, sortOrder, units };
}

/** Unidade (ordem de chave fixa). */
export function makeUnit({ id, kind, label = null, body, attrs = {}, sortOrder }) {
  return { id, kind, label, body, attrs, sortOrder };
}

/** `_collection.json` (ordem de chave conforme schema). */
export function makeCollection({ id, kind, title, subtitle = null, sortOrder, version, revision = null }) {
  return { id, kind, title, subtitle, sortOrder, version, revision };
}

// ─── Saída determinística ───────────────────────────────────────────────────

/** JSON com indent 2 + newline final (idempotente, diff-friendly). */
export function toJson(obj) {
  return `${JSON.stringify(obj, null, 2)}\n`;
}

/**
 * `version`/`revision` são preservados do `_collection.json` já comitado
 * (§3.2): o incremento de `version` é ato humano barrado por `check:version-bump`.
 * Coleção nova → `version: 1`, `revision: null`.
 */
export function readCollectionMeta(path) {
  if (!existsSync(path)) return { version: 1, revision: null };
  try {
    const j = JSON.parse(readFileSync(path, 'utf8'));
    return {
      version: Number.isInteger(j.version) ? j.version : 1,
      revision: typeof j.revision === 'string' ? j.revision : null,
    };
  } catch {
    return { version: 1, revision: null };
  }
}

/** Contador de sortOrder crescente (por documento ou por coleção). */
export function counter() {
  let i = 0;
  return () => (i += 1);
}

/** Zero-pad numérico para IDs (ex.: 7 → "07" com width 2). */
export function pad(num, width) {
  return String(num).padStart(width, '0');
}
