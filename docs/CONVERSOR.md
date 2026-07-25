# Conversor Markdown → JSON — decisões em aberto

Registro das decisões que a conversão dos textos deste repositório (Markdown,
`FORMATO.md`) para o formato-fonte JSON do App IRB **força**, e que ainda não
foram tomadas. Markdown é apresentacional; o modelo JSON tem campos que o
Markdown não carrega naturalmente — é daí que saem estas escolhas.

**Nada aqui está decidido.** Enquanto uma decisão estiver aberta, o conversor
não deve ser escrito de forma a fixá-la silenciosamente. Ao decidir, troque o
status para **DECIDIDO** e anote a escolha.

---

## Contexto: o que o conversor faz

```
Markdown (Obsidian, humano)  →  convert.mjs  →  content/{colecao}/*.json  →  validador → build do app
```

- Um conversor com **um parser por coleção** (Heidelberg, Belga, Dort; depois
  salmos, hinos, formas, ordem-da-igreja…) e um emissor comum que roda o
  validador existente como portão.
- **IDs saem de números impressos, nunca de índice posicional.** `belgic-artNN`,
  `heidelberg-ldNN`, `heidelberg-qNNN`, `dort-hN` — todos derivados de um número
  que a própria confissão imprime. Por isso remover o artigo 5 aposenta
  `belgic-art05` e não renumera nada.
- Recomendação operacional: **comitar o JSON gerado** junto do Markdown, com um
  gate de CI que roda o conversor e falha se a saída divergir do comitado
  (mesmo espírito do `check:version-bump`). Assim o app consome
  `content/*.json` exatamente como hoje e o revisor vê dois diffs legíveis
  (prosa e estrutura).

---

## Decisões com padrão proposto (adotar salvo objeção)

### D1 — Marcadores de nota são achatados
- **Situação:** o modelo atual já remove `<sup>N</sup>` do corpo e guarda um
  array `refs` plano por unidade (ver `heidelberg-ld01.json` no app). A ligação
  posição-do-marcador → referência **não** é preservada.
- **Padrão proposto:** seguir o modelo existente — remover `<sup>N</sup>`,
  coletar o bloco de referências em `attrs.refs` na ordem.
- **Alternativa (exige trabalho):** um modelo `attrs.notes` que preserve a
  correspondência marcador↔referência (permite "toque o número, veja o
  versículo"). Possível **sem** mudar o schema, porque `attrs` é objeto livre.
- **Status:** ABERTA — padrão proposto: achatar.

### D2 — Forma da string de referência
- **Situação:** `FORMATO.md` §1.4 escreve `1Co 8.4,6` (sem espaço, vírgula
  colada); os fixtures do app escrevem `1 Co 8.4, 6` (com espaço).
- **Padrão proposto:** **preservar a forma da fonte verbatim** (`1Co`), não
  copiar o espaçamento do fixture. Instinto de inviolabilidade: não reformatar
  o aparato silenciosamente.
- **Status:** ABERTA — padrão proposto: preservar a fonte.

### D3 — Texto de `numberLabel`
- **Situação:** rótulo apresentacional. Markdown diz "DIA DO SENHOR N"; fixture
  diz "Domingo N"; capítulos de Dort são romanos ("Capítulo I").
- **Padrão proposto:** pôr a redação numa pequena config por coleção, um único
  lugar para trocar. (Escolha inicial sugerida: "Domingo N", "Art. N",
  "Capítulo I".)
- **Status:** ABERTA — padrão proposto: config por coleção.

### D4 — Referências não-chaveadas de Dort
- **Situação:** `FORMATO.md` §4.3 — em Dort as referências vêm num parágrafo
  único, não numa lista numerada; não há `<sup>N</sup>`. Não encaixam
  naturalmente em `attrs.refs`.
- **Padrão proposto:** guardar o parágrafo como `attrs.refs` da unidade do
  artigo (array de um elemento).
- **Alternativa:** uma unidade final `kind:"bible_verse"` por artigo.
- **Status:** ABERTA — padrão proposto: `attrs.refs` de um elemento.

---

## Decisões que precisam da sua escolha (sem padrão seguro)

### D5 — Onde ficam as referências da Confissão Belga
- **O problema:** um artigo da Belga tem **vários parágrafos** (→ várias
  unidades `article`) mas **um só** bloco de referências.
- **Opções:**
  - (a) uma unidade `article` por parágrafo; o bloco de referências vai na
    **última** unidade do artigo. Lê melhor no app (parágrafos separados).
  - (b) colapsar o artigo inteiro numa única unidade `article` preservando as
    quebras de parágrafo; referências ao lado. Mantém a coerência
    marcador↔referência trivial.
- **Por que está em aberto:** o fixture (`belgic-art01.json`) dividiu os
  parágrafos **e** descartou as referências — ou seja, o codebase nunca
  resolveu isto.
- **Inclinação:** (a), pela leitura.
- **Status:** ABERTA — **precisa da sua decisão.**

### D6 — Título por Domingo no Heidelberg
- **O problema:** o JSON quer um `title` por documento; o Domingo do Heidelberg
  **não tem** título próprio no Markdown (os títulos temáticos `#` abrangem
  vários Domingos, não um).
- **Opções:**
  - deixar `title: null`;
  - carregar o título de seção que abrange o Domingo como `subtitle`;
  - derivar do texto da primeira pergunta — **rejeitado**: seria a IA
    inventando prosa, proibido por `CLAUDE.md`.
- **Nota:** o fixture inventou "A nossa única consolação"; não é fonte
  autoritativa.
- **Inclinação:** `title: null` + título de seção como `subtitle`; nunca
  sintetizar prosa.
- **Status:** ABERTA — **precisa da sua decisão.**

---

## Coleções futuras (decidir quando houver texto real)

Este repositório vai guardar todo o conteúdo do MVP. As confissões são o caso
**incomum**; o resto é, em geral, mais simples. Nada aqui se decide agora — o
conversor cuida de cada coleção quando o texto dela existir. Registro só para
não se perder.

**Invariante:** `fontes/{coleção}/` sempre espelha `content/{coleção}/`, com os
ids de coleção do App IRB; ID sai do número impresso, nunca do índice; um
parser por coleção.

### A bifurcação real: quantos documentos por arquivo

| Forma | Coleções | Um arquivo `.md` = |
| --- | --- | --- |
| **Um arquivo, muitos documentos** | `belgic`, `heidelberg`, `dort`, `church-order` | uma obra inteira; os títulos *internos* marcam os documentos (artigos, Domingos) |
| **Um arquivo, um documento** | `psalms`, `hymns`, `creeds`, `forms` | um item autocontido; os títulos internos marcam só *unidades* |

### Alvo por coleção

Conferido contra os fixtures reais do app:

| Coleção | id | Unidades (`kind`) | Novidade |
| --- | --- | --- | --- |
| `psalms` | `psalm-NNN-gen/har` | `verse`, `refrain` | variantes gen/har + `groupKey`; `\n` real dentro do verso |
| `hymns` | `hymn-NNN` | `verse`, `refrain` | metadado `attrs.author` |
| `creeds` | `creed-slug` | `line` | texto vem do responsável (ver ressalvas) |
| `forms` | `form-slug` | `section`, `rubric`, `speech` | `attrs.speaker` — diálogo litúrgico |
| `church-order` | `church-order-artNNN` | `article` | como a Belga, 3 dígitos; um arquivo, muitos artigos |

### Decisões novas que virão (abrir quando a coleção chegar)

- **F1 — Salmos, layout das variantes.** `psalm-023-gen.md` + `psalm-023-har.md`
  (dois arquivos, `groupKey` derivado do número) **ou** um arquivo com duas
  seções? Inclinação: dois arquivos.
- **F2 — Quebra de linha do verso.** Salmos e hinos preservam `\n` **dentro** de
  uma unidade (as linhas do verso), o que contradiz a regra "um parágrafo por
  linha física" de `FORMATO.md`. Precisa de uma convenção de hard-break e de uma
  **seção própria no FORMATO por tipo**.
- **F3 — Metadados** (`author` de hino, `speaker` de fala): não são texto
  corrido; precisam de um lugar no Markdown — provavelmente front-matter YAML.

---

## Ressalvas / fora do escopo

- **Credos são caso à parte.** `CLAUDE.md`: o texto exato dos credos **vem do
  responsável do projeto** e é o modelo canônico do formato-fonte — não se
  inventa nem completa. `creeds` não é "autorar", é "receber e formatar".
- **`minutes`** (atas de sínodo): está na lista canônica do validador, mas
  **não é MVP** — não puxar para cá agora.
- **Bíblia** (`bible-ara/arc/acf`): milhares de documentos, quase certamente não
  vem de Markdown escrito à mão. Importador próprio quando sua parte chegar; a
  forma do conversor de confissões **não** deve ditar a da Bíblia.
