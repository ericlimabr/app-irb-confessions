/**
 * Parser do Catecismo de Heidelberg (docs/CONVERSOR.md §5.2).
 *
 * - `## DIA DO SENHOR N` → documento `heidelberg-ld{NN}`, `numberLabel "Domingo N"`,
 *   `title: null` (o Domingo não tem título próprio — D6), `subtitle` = a seção
 *   temática corrente.
 * - `# ~ PARTE X ~ Nome` → agrupador de parte (attrs.part; reseta a seção).
 * - `# Nome` (após o 1º documento) → seção temática (vira o subtitle dos Domingos
 *   sob ela). O `# O CATECISMO DE HEIDELBERG` inicial é título de obra → ignorado.
 * - `### P.N. …?` → duas unidades com numeração GLOBAL 1–129:
 *   `heidelberg-q{NNN}-q` (question) e `-a` (answer). `attrs.questionNumber = N`,
 *   `attrs.refs` na resposta (regra §1.6). `<sup>` de nota achatado; itálico e
 *   indentação (Oração/Mandamentos) preservados.
 */

import {
  counter,
  fail,
  makeDoc,
  makeUnit,
  pad,
  splitTrailingRefs,
  stripSup,
  toLines,
} from './common.mjs';

const DIA_RE = /^## DIA DO SENHOR (\d+)\s*$/;
const PARTE_RE = /^# ~ PARTE .+ ~ (.+)$/;
const Q_RE = /^#{2,3}\s+P\.(\d+)\.\s*(.*)$/;
const H1_RE = /^# (.+)$/;

export function parseHeidelberg(source, file) {
  const lines = toLines(source);
  const docOrder = counter();
  const docs = [];

  let part = null;
  let section = null;
  let seenDoc = false;
  let doc = null; // { number, uOrder, units }

  const finalize = () => {
    if (!doc) return;
    if (doc.units.length === 0) fail(file, doc.headLine, `Domingo ${doc.number} sem perguntas`);
    docs.push(
      makeDoc({
        id: `heidelberg-ld${pad(doc.number, 2)}`,
        collection: 'heidelberg',
        number: doc.number,
        numberLabel: `Domingo ${doc.number}`,
        title: null,
        subtitle: doc.section,
        attrs: doc.part ? { part: doc.part } : {},
        sortOrder: docOrder(),
        units: doc.units,
      }),
    );
    doc = null;
  };

  let i = 0;
  while (i < lines.length) {
    const { n, text } = lines[i];

    const dia = text.match(DIA_RE);
    if (dia) {
      finalize();
      seenDoc = true;
      doc = { number: Number(dia[1]), headLine: n, part, section, uOrder: counter(), units: [] };
      i += 1;
      continue;
    }

    const parte = text.match(PARTE_RE);
    if (parte) {
      part = parte[1].trim();
      section = null;
      i += 1;
      continue;
    }

    const q = text.match(Q_RE);
    if (q) {
      if (!doc) fail(file, n, `pergunta P.${q[1]} fora de um "## DIA DO SENHOR"`);
      const number = Number(q[1]);
      const qBody = stripSup(q[2].trim());
      if (qBody === '') fail(file, n, `pergunta P.${number} sem enunciado`);

      // Região da resposta: até o próximo cabeçalho.
      const region = [];
      i += 1;
      while (i < lines.length && !/^#{1,3} /.test(lines[i].text) && !/^#{1,3}\s+P\./.test(lines[i].text)) {
        region.push(lines[i]);
        i += 1;
      }
      const { bodyLines, refs } = splitTrailingRefs(region, file);
      let answer = buildProse(bodyLines);
      if (!/^R\.\s/.test(answer) && !/^R\.$/.test(answer)) {
        fail(file, n, `resposta de P.${number} não começa com "R." (achei ${JSON.stringify(answer.slice(0, 30))})`);
      }
      answer = stripSup(answer.replace(/^R\.\s*/, '')).trim();
      if (answer === '') fail(file, n, `resposta de P.${number} vazia`);

      const idBase = `heidelberg-q${pad(number, 3)}`;
      doc.units.push(
        makeUnit({
          id: `${idBase}-q`,
          kind: 'question',
          label: `P. ${number}`,
          body: qBody,
          attrs: { questionNumber: number },
          sortOrder: doc.uOrder(),
        }),
      );
      doc.units.push(
        makeUnit({
          id: `${idBase}-a`,
          kind: 'answer',
          label: `R. ${number}`,
          body: answer,
          attrs: refs ? { questionNumber: number, refs } : { questionNumber: number },
          sortOrder: doc.uOrder(),
        }),
      );
      continue;
    }

    const h1 = text.match(H1_RE);
    if (h1 && !text.startsWith('# ~')) {
      if (seenDoc) section = h1[1].trim(); // seção temática
      // antes do 1º documento: título de obra → ignora
      i += 1;
      continue;
    }

    if (text.trim() !== '' && doc && doc.units.length === 0) {
      // conteúdo solto entre "## DIA" e a 1ª pergunta não é esperado
      fail(file, n, `conteúdo inesperado antes da 1ª pergunta do Domingo ${doc.number}: ${JSON.stringify(text)}`);
    }
    i += 1;
  }
  finalize();
  return docs;
}

/** Parágrafos separados por linha em branco; linhas de um parágrafo unidas por
 *  `\n` (preserva listas/indentação da Oração e dos Mandamentos); parágrafos por
 *  `\n\n`. */
function buildProse(bodyLines) {
  const paras = [];
  let cur = [];
  for (const { text } of bodyLines) {
    if (text.trim() === '') {
      if (cur.length) {
        paras.push(cur);
        cur = [];
      }
    } else {
      cur.push(text);
    }
  }
  if (cur.length) paras.push(cur);
  return paras.map((p) => p.join('\n')).join('\n\n');
}
