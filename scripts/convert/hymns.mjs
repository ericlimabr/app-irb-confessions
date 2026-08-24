/**
 * Parser dos Hinos (docs/CONVERSOR.md §5.5).
 *
 * - `# HINOS` e `# CLASSIFICAÇÃO LITÚRGICA DOS HINOS` (índice) → descartados.
 * - `# SEÇÃO LITÚRGICA` → agrupador; vira `attrs.section` do hino corrente.
 * - `## N. TÍTULO` → documento `hymn-{NNN}`, `title` = TÍTULO como no impresso
 *   (versalete não é rebaixado — §2.2).
 * - Cânticos bíblicos (1–6): linha de referência bíblica (não itálico) → `attrs.bibleRef`.
 *   Atribuição em itálico → `attrs.author`.
 * - `**N**` → `verse`; `<sup>` de versículo mantido (hinos 1–5); elisão preservada.
 * - Refrão (blockquote `>`) → `refrain` `-ref{n}`.
 * - `_Amém._` (linha isolada em itálico) → `verse` com `attrs.role:"amen"`.
 */

import { counter, fail, makeDoc, makeUnit, pad, stripItalic, toLines } from './common.mjs';

const HYMN_RE = /^## (\d+)\.\s+(.*)$/;
const STANZA_RE = /^\*\*(\d+)\*\*\s*$/;
const AMEN_RE = /^_Amém[.!]?_\s*$/;
const IGNORE_H1 = new Set(['HINOS', 'CLASSIFICAÇÃO LITÚRGICA DOS HINOS']);

export function parseHymns(source, file) {
  const lines = toLines(source);
  const docOrder = counter();
  const docs = [];
  let section = null;
  let doc = null;

  const finalize = () => {
    if (!doc) return;
    if (doc.units.length === 0) fail(file, doc.headLine, `${doc.id} sem estrofes`);
    const attrs = {};
    if (doc.section) attrs.section = doc.section;
    if (doc.bibleRef) attrs.bibleRef = doc.bibleRef;
    if (doc.author) attrs.author = doc.author;
    docs.push(
      makeDoc({
        id: doc.id,
        collection: 'hymns',
        number: doc.number,
        numberLabel: `Hino ${doc.number}`,
        title: doc.title,
        attrs,
        sortOrder: docOrder(),
        units: doc.units,
      }),
    );
    doc = null;
  };

  let i = 0;
  while (i < lines.length) {
    const { n, text } = lines[i];

    const hm = text.match(HYMN_RE);
    if (hm) {
      finalize();
      const number = Number(hm[1]);
      doc = {
        id: `hymn-${pad(number, 3)}`,
        number,
        title: hm[2].trim(),
        section,
        bibleRef: null,
        author: null,
        headLine: n,
        uOrder: counter(),
        refN: 0,
        units: [],
        contentStarted: false,
      };
      i += 1;
      continue;
    }

    if (/^# /.test(text)) {
      const h = text.slice(2).trim();
      finalize();
      if (!IGNORE_H1.has(h)) section = h; // seção litúrgica
      i += 1;
      continue;
    }

    const st = text.match(STANZA_RE);
    if (st) {
      if (!doc) fail(file, n, `estrofe fora de um hino: ${JSON.stringify(text)}`);
      doc.contentStarted = true;
      const number = Number(st[1]);
      const sung = [];
      i += 1;
      while (
        i < lines.length &&
        lines[i].text.trim() !== '' &&
        !STANZA_RE.test(lines[i].text) &&
        !AMEN_RE.test(lines[i].text) &&
        !/^>/.test(lines[i].text) &&
        !/^#{1,2} /.test(lines[i].text)
      ) {
        sung.push(lines[i].text);
        i += 1;
      }
      if (sung.length === 0) fail(file, n, `${doc.id} estrofe ${number} vazia`);
      doc.units.push(
        makeUnit({ id: `${doc.id}-v${number}`, kind: 'verse', label: String(number), body: sung.join('\n'), sortOrder: doc.uOrder() }),
      );
      continue;
    }

    if (/^>/.test(text)) {
      if (!doc) fail(file, n, `refrão fora de um hino`);
      doc.contentStarted = true;
      const refLines = [];
      while (i < lines.length && /^>/.test(lines[i].text)) {
        refLines.push(lines[i].text.replace(/^>/, ''));
        i += 1;
      }
      doc.refN += 1;
      doc.units.push(
        makeUnit({ id: `${doc.id}-ref${doc.refN}`, kind: 'refrain', body: refLines.join('\n'), sortOrder: doc.uOrder() }),
      );
      continue;
    }

    if (AMEN_RE.test(text)) {
      if (!doc) fail(file, n, `"_Amém._" fora de um hino`);
      doc.contentStarted = true;
      doc.units.push(
        makeUnit({
          id: `${doc.id}-amen`,
          kind: 'verse',
          body: stripItalic(text.trim()),
          attrs: { role: 'amen' },
          sortOrder: doc.uOrder(),
        }),
      );
      i += 1;
      continue;
    }

    if (text.trim() !== '') {
      if (!doc) {
        i += 1; // preâmbulo/índice antes do 1º "## N." → ignorado
        continue;
      }
      if (doc.contentStarted) {
        fail(file, n, `linha solta em ${doc.id} (após início do conteúdo): ${JSON.stringify(text)}`);
      }
      // Metadados antes da 1ª estrofe: itálico → autor; senão → referência bíblica.
      const it = text.match(/^_(.+)_\s*$/);
      if (it) {
        if (doc.author) fail(file, n, `${doc.id} com dois autores`);
        doc.author = stripItalic(text.trim());
      } else {
        if (doc.bibleRef) fail(file, n, `${doc.id} com duas referências bíblicas`);
        doc.bibleRef = text.trim();
      }
    }
    i += 1;
  }
  finalize();
  return docs;
}
