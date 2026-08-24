# JSON Schemas — formato-fonte

Schemas formais (Draft 2020-12) que descrevem os arquivos sob `content/`.

- `collection.schema.json` — formato de `_collection.json` (SPEC-FORMATO §3).
- `document.schema.json` — formato de `{document.id}.json` (SPEC-FORMATO §4).

Os schemas são a **primeira camada** de validação. As regras extras (unicidade global de IDs, prefixo do ID == coleção, padrão por tipo, sortOrder único dentro do documento, etc.) vivem no validador (`scripts/validate-content.mjs`) porque vão além do que JSON Schema sozinho expressa.

Mudou um spec? Sincronizar:

1. Estes schemas.
2. `scripts/validate-content.mjs` (regras extras).
3. `src/database/content/schema.ts` (enums TS).
4. `docs/SPEC-MODELO-DE-DADOS.md` e `docs/SPEC-FORMATO-FONTE.md`.
