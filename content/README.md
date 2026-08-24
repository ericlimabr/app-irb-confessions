# `content/` — JSON gerado (não editar à mão)

Este diretório guarda o **artefato** do conteúdo: um JSON por documento, mais um
`_collection.json` por coleção, no formato de `docs/specs/SPEC-FORMATO-FONTE.md` e
validado pelos `schemas/`.

- **Fonte de verdade é o Markdown** em `fontes/` (ADR-021). Ninguém edita
  `content/` na mão.
- O conversor `scripts/convert.mjs` (branch `feat/md-json-converter`) lê `fontes/`
  e **gera** este diretório. O de/para de nome de pasta vive lá:
  `fontes/salmos → content/psalms`, `fontes/hinos → content/hymns` (as pastas-fonte
  não são renomeadas — ver `docs/CONVERSOR.md` F4). As três confissões mantêm o
  nome: `fontes/belgic → content/belgic`, etc.
- O app consome `content/` via a dependência `@irb/content` (ADR-019).

**Estado atual:** vazio de propósito. O empacotamento (`chore/content-repo-packaging`)
montou o ferramental — `schemas/`, validador, `package.json`, CI. Rodar
`npm run validate:content` aqui passa com "0 coleções": prova que o ferramental está
de pé. As coleções reais entram na branch `feat/md-json-converter`, quando o
validador ganha dentes.
