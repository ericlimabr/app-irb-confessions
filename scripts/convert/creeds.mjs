/**
 * Parser dos Credos ecumênicos (Apostólico, Niceno, Atanasiano).
 *
 * - `## CREDO X` → um documento por credo (`creed-apostles` / `creed-nicene` /
 *   `creed-athanasian`), `title` legível, sem `numberLabel` (o credo não é
 *   numerado como documento).
 * - Cada artigo numerado (`N. …`) → uma unidade `kind: verse`, `label` com o
 *   número (visível à esquerda, como no Cantado). As linhas seguintes SEM número
 *   são continuação do mesmo artigo e entram no corpo unidas por `\n` (é assim
 *   que as quebras do Credo Niceno são preservadas).
 * - Numeração validada 1..N contígua por credo; falha barulhenta em `arquivo:linha`.
 * - Texto **verbatim** (CLAUDE.md §Conteúdo): nada de `<sup>`/itálico nos credos,
 *   então o corpo passa direto, sem transformação.
 */

import { counter, fail, makeDoc, makeUnit, pad, toLines } from './common.mjs';

const HEAD_RE = /^## CREDO (.+?)\s*$/;
const ITEM_RE = /^(\d+)\.\s+(.*)$/;

/** Cabeçalho da fonte → identidade do documento (ID estável e autoral). */
const CREEDS = {
  APOSTÓLICO: { id: 'creed-apostles', title: 'Credo Apostólico' },
  NICENO: { id: 'creed-nicene', title: 'Credo Niceno' },
  ATANASIANO: { id: 'creed-athanasian', title: 'Credo Atanasiano' },
};

export function parseCreeds(source, file) {
  const lines = toLines(source);
  const docOrder = counter();
  const docs = [];

  let i = 0;
  while (i < lines.length && !HEAD_RE.test(lines[i].text)) i += 1;
  if (i === lines.length) fail(file, 1, 'nenhum "## CREDO …" encontrado');

  while (i < lines.length) {
    const head = lines[i];
    const m = head.text.match(HEAD_RE);
    if (!m) fail(file, head.n, `esperava "## CREDO …", achei ${JSON.stringify(head.text)}`);
    const key = m[1].toUpperCase();
    const meta = CREEDS[key];
    if (!meta) fail(file, head.n, `credo desconhecido: ${JSON.stringify(m[1])}`);
    i += 1;

    const block = [];
    while (i < lines.length && !HEAD_RE.test(lines[i].text)) {
      block.push(lines[i]);
      i += 1;
    }
    docs.push(buildCreed(meta, head.n, block, file, docOrder));
  }

  return docs;
}

function buildCreed(meta, headLine, block, file, docOrder) {
  const uOrder = counter();
  const units = [];
  let expected = 1;

  let idx = 0;
  while (idx < block.length) {
    const { n, text } = block[idx];
    if (text.trim() === '') {
      idx += 1;
      continue;
    }
    const m = text.match(ITEM_RE);
    if (!m) fail(file, n, `esperava artigo "N. …" em ${meta.id}, achei ${JSON.stringify(text)}`);
    const number = Number(m[1]);
    if (number !== expected) {
      fail(file, n, `${meta.id}: artigo fora de ordem — esperava ${expected}, achei ${number}`);
    }
    idx += 1;

    // Primeira linha (após "N. ") + continuações sem número, até branco/próximo item.
    const bodyLines = [m[2].trimEnd()];
    while (idx < block.length && block[idx].text.trim() !== '' && !ITEM_RE.test(block[idx].text)) {
      bodyLines.push(block[idx].text.trimEnd());
      idx += 1;
    }

    units.push(
      makeUnit({
        id: `${meta.id}-a${pad(number, 2)}`,
        kind: 'verse',
        label: String(number),
        body: bodyLines.join('\n'),
        sortOrder: uOrder(),
      }),
    );
    expected += 1;
  }

  if (units.length === 0) fail(file, headLine, `${meta.id} sem artigos`);

  return makeDoc({
    id: meta.id,
    collection: 'creeds',
    title: meta.title,
    sortOrder: docOrder(),
    units,
  });
}
