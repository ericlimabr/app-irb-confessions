/**
 * Config por coleção (docs/CONVERSOR.md §3.2): campos que NÃO se derivam do
 * Markdown. `kind`/`title`/`subtitle`/`sortOrder` alimentam `_collection.json`;
 * `srcDir`/`srcFile` guardam o de/para de pasta (F4 DECIDIDO: `salmos→psalms`,
 * `hinos→hymns` — as pastas-fonte não são renomeadas). `numberLabel` de cada
 * documento é montado pelo parser da coleção (D3), não aqui.
 *
 * Valores de `kind`/`title`/`subtitle`/`sortOrder` reaproveitados do
 * `_collection.json` que o app já definiu, para continuidade.
 */

export const COLLECTIONS = {
  psalms: {
    id: 'psalms',
    srcDir: 'salmos',
    srcFile: 'Salmos - letras.md',
    kind: 'psalm',
    title: 'Salmos',
    subtitle: '150 salmos',
    sortOrder: 10,
  },
  hymns: {
    id: 'hymns',
    srcDir: 'hinos',
    srcFile: 'Hinos - letras.md',
    kind: 'hymn',
    title: 'Hinos',
    subtitle: 'Hinário congregacional',
    sortOrder: 20,
  },
  heidelberg: {
    id: 'heidelberg',
    srcDir: 'heidelberg',
    srcFile: 'O Catecismo de Heidelberg.md',
    kind: 'catechism',
    title: 'Catecismo de Heidelberg',
    subtitle: 'Três Formas de Unidade',
    sortOrder: 41,
  },
  belgic: {
    id: 'belgic',
    srcDir: 'belgic',
    srcFile: 'A Confissão Belga.md',
    kind: 'confession',
    title: 'Confissão Belga',
    subtitle: 'Três Formas de Unidade',
    sortOrder: 42,
  },
  dort: {
    id: 'dort',
    srcDir: 'dort',
    srcFile: 'Os Cânones de Dort.md',
    kind: 'canons',
    title: 'Cânones de Dort',
    subtitle: 'Três Formas de Unidade',
    sortOrder: 43,
  },
};
