/**
 * Parser da Confissão Belga (docs/CONVERSOR.md §5.1).
 *
 * - `## ARTIGO N` → documento `belgic-art{NN}`, `numberLabel "Art. N"`.
 * - `### Título` → `document.title`.
 * - Cada parágrafo → unidade `article` `-p{n}` (D5-a).
 * - Bloco de referências numerado → `attrs.refs` na ÚLTIMA unidade do artigo (D5-a).
 * - `<sup>N</sup>` de nota PRESERVADO no corpo (R1, revoga D1): o marcador casa por
 *   posição com a referência de mesmo índice em `attrs.refs`. Itálico preservado.
 * - Caso especial art. 4: cada `####` (listas VT/NT) → unidade `heading` `-h{n}`;
 *   a lista de livros que a segue → unidade `article` `-l{n}` (marcador `- ` removido).
 */

import { counter, fail, makeDoc, makeUnit, pad, parseNumberedRefs, toLines } from './common.mjs';

const ART_RE = /^## ARTIGO (\d+)\s*$/;

export function parseBelgic(source, file) {
  const lines = toLines(source);
  const docOrder = counter();
  const docs = [];

  let i = 0;
  while (i < lines.length && !ART_RE.test(lines[i].text)) i += 1;
  if (i === lines.length) fail(file, 1, 'nenhum "## ARTIGO N" encontrado');

  while (i < lines.length) {
    const head = lines[i];
    const m = head.text.match(ART_RE);
    if (!m) fail(file, head.n, `esperava "## ARTIGO N", achei ${JSON.stringify(head.text)}`);
    const number = Number(m[1]);
    i += 1;

    const block = [];
    while (i < lines.length && !ART_RE.test(lines[i].text)) {
      block.push(lines[i]);
      i += 1;
    }
    docs.push(buildArticle(number, head.n, block, file, docOrder));
  }
  return docs;
}

function buildArticle(number, headLine, block, file, docOrder) {
  const idBase = `belgic-art${pad(number, 2)}`;
  const uOrder = counter();
  const units = [];
  let pN = 0;
  let hN = 0;
  let lN = 0;
  let refs = null;

  let idx = 0;
  while (idx < block.length && block[idx].text.trim() === '') idx += 1;
  const titleLine = block[idx];
  const tm = titleLine?.text.match(/^### (.*)$/);
  if (!tm) fail(file, titleLine?.n ?? headLine, `artigo ${number} sem título "### …"`);
  const title = tm[1].trim();
  idx += 1;

  while (idx < block.length) {
    const { n, text } = block[idx];
    if (text.trim() === '') {
      idx += 1;
      continue;
    }
    if (/^#### /.test(text)) {
      units.push(
        makeUnit({
          id: `${idBase}-h${(hN += 1)}`,
          kind: 'heading',
          body: text.replace(/^#### /, '').trim(),
          sortOrder: uOrder(),
        }),
      );
      idx += 1;
      while (idx < block.length && block[idx].text.trim() === '') idx += 1;
      const bullets = [];
      while (idx < block.length && /^- +/.test(block[idx].text)) {
        bullets.push(block[idx].text.replace(/^- +/, '').trimEnd());
        idx += 1;
      }
      if (bullets.length) {
        units.push(
          makeUnit({
            id: `${idBase}-l${(lN += 1)}`,
            kind: 'article',
            body: bullets.join('\n'),
            sortOrder: uOrder(),
          }),
        );
      }
      continue;
    }
    if (/^\d+\.\s/.test(text)) {
      const refLines = [];
      while (idx < block.length && /^\d+\.\s/.test(block[idx].text)) {
        refLines.push(block[idx]);
        idx += 1;
      }
      if (refs) fail(file, n, `artigo ${number} com dois blocos de referência`);
      refs = parseNumberedRefs(refLines, file);
      continue;
    }
    if (/^#{1,3} /.test(text)) {
      fail(file, n, `cabeçalho inesperado dentro do artigo ${number}: ${JSON.stringify(text)}`);
    }
    // Parágrafo: linhas contíguas até branco/lista/cabeçalho.
    const para = [];
    while (
      idx < block.length &&
      block[idx].text.trim() !== '' &&
      !/^#### /.test(block[idx].text) &&
      !/^#{1,3} /.test(block[idx].text) &&
      !/^\d+\.\s/.test(block[idx].text) &&
      !/^- +/.test(block[idx].text)
    ) {
      para.push(block[idx].text);
      idx += 1;
    }
    const body = para.join(' ').trim();
    if (body === '') fail(file, n, `parágrafo vazio no artigo ${number}`);
    units.push(
      makeUnit({ id: `${idBase}-p${(pN += 1)}`, kind: 'article', body, sortOrder: uOrder() }),
    );
  }

  if (units.length === 0) fail(file, headLine, `artigo ${number} sem conteúdo`);
  if (refs) units[units.length - 1].attrs = { refs };

  return makeDoc({
    id: idBase,
    collection: 'belgic',
    number,
    numberLabel: `Art. ${number}`,
    title,
    sortOrder: docOrder(),
    units,
  });
}
