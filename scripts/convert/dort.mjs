/**
 * Parser dos Cânones de Dort (docs/CONVERSOR.md §5.3).
 *
 * - `# ~ ORDINAL CAPÍTULO(S) DA DOUTRINA ~ Assunto` → documento de capítulo.
 *   São 4 documentos: o 3º e o 4º capítulos vêm COMBINADOS no impresso
 *   ("Terceiro e Quarto Capítulos") → um só documento `dort-h3-4`.
 *     PRIMEIRO → dort-h1 · SEGUNDO → dort-h2 · TERCEIRO E QUARTO → dort-h3-4 · QUINTO → dort-h5
 * - `## ARTIGO N` → unidade `article` `dort-{cap}-art{NN}`; `### Título` → `attrs.heading`;
 *   parágrafo de referência não-chaveado (D4) → `attrs.refs` de um elemento.
 * - `## REJEIÇÃO DE ERROS` → intro (unidade `rejection`) + um par `**Erro N**`/
 *   `**Refutação**` por unidade `rejection` `-rej{N}` (D-Dort). Só a marcação de
 *   negrito é removida; palavras/travessões/citações inline preservadas.
 * - `# CONCLUSÃO` → documento próprio `dort-conclusion` (attrs.role "conclusion"),
 *   amarrado aos Cânones pela coleção e posto por último; os 7 itens NÃO são
 *   fragmentados (ficam na prosa que os rejeita). `kind: "section"`.
 */

import { counter, fail, makeDoc, makeUnit, pad, stripBold, stripSup, toLines } from './common.mjs';

const CHAPTERS = {
  PRIMEIRO: { suffix: 'h1', number: 1, label: 'Capítulo I' },
  SEGUNDO: { suffix: 'h2', number: 2, label: 'Capítulo II' },
  'TERCEIRO E QUARTO': { suffix: 'h3-4', number: null, label: 'Capítulos III e IV' },
  QUINTO: { suffix: 'h5', number: 5, label: 'Capítulo V' },
};

const CHAP_RE = /^# ~ (.+?) CAPÍTULOS? DA DOUTRINA ~ (.+)$/;
const ART_RE = /^## ARTIGO (\d+)\s*$/;

export function parseDort(source, file) {
  const lines = toLines(source);
  const docOrder = counter();
  const docs = [];
  let chap = null;

  const finalizeChap = () => {
    if (!chap) return;
    if (chap.units.length === 0) fail(file, chap.headLine, `capítulo ${chap.label} sem conteúdo`);
    docs.push(
      makeDoc({
        id: `dort-${chap.suffix}`,
        collection: 'dort',
        number: chap.number,
        numberLabel: chap.label,
        title: chap.title,
        sortOrder: docOrder(),
        units: chap.units,
      }),
    );
    chap = null;
  };

  let i = 0;
  while (i < lines.length) {
    const { n, text } = lines[i];

    const chm = text.match(CHAP_RE);
    if (chm) {
      finalizeChap();
      const key = chm[1].trim();
      const meta = CHAPTERS[key];
      if (!meta) fail(file, n, `ordinal de capítulo desconhecido: ${JSON.stringify(key)}`);
      chap = { ...meta, title: chm[2].trim(), uOrder: counter(), units: [], headLine: n };
      i += 1;
      continue;
    }

    if (/^# CONCLUSÃO\s*$/.test(text)) {
      finalizeChap();
      const region = [];
      i += 1;
      while (i < lines.length && !/^# /.test(lines[i].text)) {
        region.push(lines[i]);
        i += 1;
      }
      docs.push(buildConclusion(region, file, docOrder));
      continue;
    }

    if (/^# /.test(text)) {
      i += 1; // título de obra (# OS CÂNONES DE DORT) → ignora
      continue;
    }

    const am = text.match(ART_RE);
    if (am) {
      if (!chap) fail(file, n, `artigo ${am[1]} fora de um capítulo`);
      const region = [];
      i += 1;
      while (i < lines.length && !/^#{1,2} /.test(lines[i].text)) {
        region.push(lines[i]);
        i += 1;
      }
      chap.units.push(buildArticle(chap, Number(am[1]), region, file, n));
      continue;
    }

    if (/^## REJEIÇÃO DE ERROS\s*$/.test(text)) {
      if (!chap) fail(file, n, 'rejeição fora de um capítulo');
      const region = [];
      i += 1;
      while (i < lines.length && !/^#{1,2} /.test(lines[i].text)) {
        region.push(lines[i]);
        i += 1;
      }
      buildRejection(chap, region, file);
      continue;
    }

    if (text.trim() !== '') fail(file, n, `linha inesperada no nível do capítulo: ${JSON.stringify(text)}`);
    i += 1;
  }
  finalizeChap();
  return docs;
}

/** Parágrafo de só citações bíblicas (Dort, não numerado — D4). Cada trecho
 *  separado por `;` começa com sigla + capítulo.versículo. */
function isRefParagraph(text) {
  const parts = text
    .replace(/\.$/, '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) return false;
  return parts.every((p) => /^[1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3}\s+\d/.test(p));
}

/** Agrupa linhas em parágrafos (branco separa); dentro do parágrafo une por `\n`. */
function paragraphs(lines) {
  const out = [];
  let cur = [];
  for (const { text } of lines) {
    if (text.trim() === '') {
      if (cur.length) {
        out.push(cur.join('\n'));
        cur = [];
      }
    } else {
      cur.push(text);
    }
  }
  if (cur.length) out.push(cur.join('\n'));
  return out;
}

function buildArticle(chap, number, region, file, headLine) {
  let idx = 0;
  while (idx < region.length && region[idx].text.trim() === '') idx += 1;
  const tm = region[idx]?.text.match(/^### (.*)$/);
  if (!tm) fail(file, region[idx]?.n ?? headLine, `artigo ${number} sem título "### …"`);
  const heading = tm[1].trim();

  const paras = paragraphs(region.slice(idx + 1));
  if (paras.length === 0) fail(file, headLine, `artigo ${number} sem corpo`);

  let refs = null;
  if (isRefParagraph(paras[paras.length - 1])) {
    refs = [paras.pop().trim()];
  }
  if (paras.length === 0) fail(file, headLine, `artigo ${number} só com referências, sem corpo`);

  const body = stripSup(paras.join('\n\n')).trim();
  const attrs = { heading };
  if (refs) attrs.refs = refs;

  return makeUnit({
    id: `dort-${chap.suffix}-art${pad(number, 2)}`,
    kind: 'article',
    label: `Art. ${number}`,
    body,
    attrs,
    sortOrder: chap.uOrder(),
  });
}

function buildRejection(chap, region, file) {
  // Introdução: tudo até o primeiro **Erro N**.
  let idx = 0;
  const introLines = [];
  while (idx < region.length && !/^\*\*Erro \d+\*\*/.test(region[idx].text)) {
    introLines.push(region[idx]);
    idx += 1;
  }
  const introParas = paragraphs(introLines);
  if (introParas.length) {
    chap.units.push(
      makeUnit({
        id: `dort-${chap.suffix}-rej-intro`,
        kind: 'rejection',
        body: stripSup(introParas.join('\n\n')).trim(),
        sortOrder: chap.uOrder(),
      }),
    );
  }

  // Pares Erro/Refutação.
  while (idx < region.length) {
    const em = region[idx].text.match(/^\*\*Erro (\d+)\*\*/);
    if (!em) fail(file, region[idx].n, `esperava "**Erro N**", achei ${JSON.stringify(region[idx].text)}`);
    const number = Number(em[1]);
    const erroLines = [region[idx]];
    idx += 1;
    while (idx < region.length && !/^\*\*Refutação\*\*/.test(region[idx].text) && !/^\*\*Erro \d+\*\*/.test(region[idx].text)) {
      erroLines.push(region[idx]);
      idx += 1;
    }
    if (idx >= region.length || !/^\*\*Refutação\*\*/.test(region[idx].text)) {
      fail(file, region[idx - 1].n, `Erro ${number} sem "**Refutação**"`);
    }
    const refutLines = [region[idx]];
    idx += 1;
    while (idx < region.length && !/^\*\*Erro \d+\*\*/.test(region[idx].text)) {
      refutLines.push(region[idx]);
      idx += 1;
    }
    const erro = stripBold(paragraphs(erroLines).join('\n\n'));
    const refut = stripBold(paragraphs(refutLines).join('\n\n'));
    chap.units.push(
      makeUnit({
        id: `dort-${chap.suffix}-rej${number}`,
        kind: 'rejection',
        label: `Erro ${number}`,
        body: `${erro}\n\n${refut}`.trim(),
        sortOrder: chap.uOrder(),
      }),
    );
  }
}

function buildConclusion(region, file, docOrder) {
  const paras = paragraphs(region);
  if (paras.length === 0) fail(file, 1, 'CONCLUSÃO vazia');
  const uOrder = counter();
  const units = paras.map((p, k) =>
    makeUnit({
      id: `dort-conclusion-s${k + 1}`,
      kind: 'section',
      body: stripSup(p).trim(),
      sortOrder: uOrder(),
    }),
  );
  return makeDoc({
    id: 'dort-conclusion',
    collection: 'dort',
    number: null,
    numberLabel: 'Conclusão',
    title: 'Conclusão',
    attrs: { role: 'conclusion' },
    sortOrder: docOrder(),
    units,
  });
}
