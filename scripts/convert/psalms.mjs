/**
 * Parser dos Salmos (docs/CONVERSOR.md §5.4).
 *
 * - `# SALMOS` e `# CLASSIFICAÇÃO LITÚRGICA DOS SALMOS` (índice) → descartados.
 * - `## SALMO N{A|B}` → documento. A letra mapeia a variante: **A → gen, B → har**
 *   (F1). `id = psalm-{NNN}-{gen|har}`, `groupKey = psalm-{NNN}`, `title: null`.
 *   - Salmo 119 seccionado (`## SALMO 119.1-8A`): `id = psalm-119-{VVV}-{VVV}-{var}`,
 *     `groupKey = psalm-119-{VVV}-{VVV}`, `{VVV}` = versículo em 3 dígitos.
 * - Atribuição em itálico logo após o título (`_CBS - Saltério de Genebra_`) →
 *   `attrs.attribution` (string crua; separar versificador/melodia é F3).
 * - `**N**` → unidade `verse`; as linhas cantadas vão ao `body` unidas por `\n`
 *   (F2). Versículo `<sup>N</sup>` MANTIDO no corpo (§4.2); elisão `\_` preservada.
 *   Salmos não têm refrão nem `_Amém._`.
 */

import { counter, fail, makeDoc, makeUnit, pad, stripItalic, toLines } from './common.mjs';

const SALMO_119_RE = /^## SALMO 119\.(\d+)-(\d+)([AB])\s*$/;
const SALMO_RE = /^## SALMO (\d+)([AB])\s*$/;
const STANZA_RE = /^\*\*(\d+)\*\*\s*$/;
const IGNORE_H1 = new Set(['SALMOS', 'CLASSIFICAÇÃO LITÚRGICA DOS SALMOS']);
const VAR = { A: 'gen', B: 'har' };

export function parsePsalms(source, file) {
  const lines = toLines(source);
  const docOrder = counter();
  const docs = [];
  let doc = null;

  const finalize = () => {
    if (!doc) return;
    if (doc.units.length === 0) fail(file, doc.headLine, `${doc.id} sem estrofes`);
    docs.push(
      makeDoc({
        id: doc.id,
        collection: 'psalms',
        number: doc.number,
        numberLabel: doc.numberLabel,
        title: null,
        variant: doc.variant,
        groupKey: doc.groupKey,
        attrs: doc.attribution ? { attribution: doc.attribution } : {},
        sortOrder: docOrder(),
        units: doc.units,
      }),
    );
    doc = null;
  };

  let i = 0;
  while (i < lines.length) {
    const { n, text } = lines[i];

    const m119 = text.match(SALMO_119_RE);
    const m = text.match(SALMO_RE);
    if (m119 || m) {
      finalize();
      const variant = VAR[(m119 ?? m)[m119 ? 3 : 2]];
      if (m119) {
        const a = pad(Number(m119[1]), 3);
        const b = pad(Number(m119[2]), 3);
        doc = {
          id: `psalm-119-${a}-${b}-${variant}`,
          number: 119,
          numberLabel: `Salmo 119.${Number(m119[1])}-${Number(m119[2])}`,
          groupKey: `psalm-119-${a}-${b}`,
          variant,
        };
      } else {
        const nnn = pad(Number(m[1]), 3);
        doc = {
          id: `psalm-${nnn}-${variant}`,
          number: Number(m[1]),
          numberLabel: `Salmo ${Number(m[1])}`,
          groupKey: `psalm-${nnn}`,
          variant,
        };
      }
      doc.headLine = n;
      doc.attribution = null;
      doc.uOrder = counter();
      doc.units = [];
      doc.sawStanza = false;
      i += 1;
      continue;
    }

    if (/^# /.test(text)) {
      const h = text.slice(2).trim();
      if (!IGNORE_H1.has(h)) fail(file, n, `cabeçalho de nível 1 inesperado nos salmos: ${JSON.stringify(text)}`);
      finalize();
      i += 1;
      continue;
    }

    if (/^>/.test(text)) fail(file, n, `salmo com refrão (blockquote) — inesperado (§5.4): ${JSON.stringify(text)}`);

    const st = text.match(STANZA_RE);
    if (st) {
      if (!doc) fail(file, n, `estrofe fora de um "## SALMO": ${JSON.stringify(text)}`);
      doc.sawStanza = true;
      const number = Number(st[1]);
      const sung = [];
      i += 1;
      while (i < lines.length && lines[i].text.trim() !== '' && !STANZA_RE.test(lines[i].text) && !/^#{1,2} /.test(lines[i].text)) {
        if (/^>/.test(lines[i].text)) fail(file, lines[i].n, `refrão inesperado num salmo`);
        sung.push(lines[i].text);
        i += 1;
      }
      if (sung.length === 0) fail(file, n, `${doc.id} estrofe ${number} vazia`);
      doc.units.push(
        makeUnit({
          id: `${doc.id}-v${number}`,
          kind: 'verse',
          label: String(number),
          body: sung.join('\n'),
          sortOrder: doc.uOrder(),
        }),
      );
      continue;
    }

    if (text.trim() !== '') {
      if (!doc) {
        i += 1; // preâmbulo/índice antes do 1º "## SALMO" → ignorado
        continue;
      }
      if (doc.sawStanza) fail(file, n, `linha solta entre estrofes de ${doc.id}: ${JSON.stringify(text)}`);
      // Antes da 1ª estrofe: atribuição em itálico.
      const it = text.match(/^_(.+)_\s*$/);
      if (!it) fail(file, n, `esperava atribuição em itálico em ${doc.id}, achei ${JSON.stringify(text)}`);
      if (doc.attribution) fail(file, n, `${doc.id} com duas linhas de atribuição`);
      doc.attribution = stripItalic(text.trim());
    }
    i += 1;
  }
  finalize();
  return docs;
}
