# Conversor Markdown → JSON — Especificação

Executa a **ADR-021** (repo do app): o Markdown deste repositório é a **fonte
editorial**; o conversor mora **aqui** e projeta o Markdown no formato-fonte
JSON que o App IRB consome.

- **Entrada:** `fontes/{coleção}/*.md`, no formato de [`FORMATO.md`](./FORMATO.md).
- **Saída:** `content/{coleção}/_collection.json` + `{document.id}.json`, no
  formato de `SPEC-FORMATO-FONTE.md`, validado por `schemas/*.schema.json` e
  pela `SPEC-CONVENCAO-DE-IDS.md` (todos no repo do app; migram para cá pela
  `SPEC-REPOSITORIO-DE-CONTEUDO.md`).

> **Estado deste documento.** O corpo normativo (§§ 1–5) descreve o conversor a
> construir; ele ainda **não existe**. As decisões de §6 continuam abrindo
> escolhas que o conversor **não** deve fixar silenciosamente — ao decidir uma,
> troque o status para **DECIDIDO** e anote a escolha. §5 assume o resultado dos
> *padrões propostos* de §6; onde uma decisão de §6 ainda pende, o mapeamento de
> §5 aponta para ela.

---

## 1. Papel no pipeline

```
fontes/{coleção}/*.md  →  convert.mjs  →  content/{coleção}/*.json  →  validate:content  →  build do app
   (Markdown, humano)     (este repo)      (formato-fonte)              (portão)            (content.db)
```

- **Um parser por coleção** + um **emissor comum**. Cada parser conhece a
  hierarquia de uma obra (`FORMATO.md` §§ 2–6); o emissor conhece o schema, a
  convenção de IDs e as regras do validador — e não sabe nada de Markdown.
- **Portão de CI (irmão do que já existe).** O JSON gerado é **comitado** junto
  do Markdown. A CI roda o conversor e **falha se a saída divergir do comitado**
  — mesmo desenho do gate PDF→Markdown de `ferramentas/validar.py`. Assim o app
  consome `content/*.json` sem rodar o conversor no builder do EAS (ADR-019), e
  o revisor lê dois diffs legíveis: prosa (Markdown) e estrutura (JSON).
- **Determinístico e idempotente.** Saída é função pura do Markdown de entrada
  (+ a config por coleção de §3.2). Mesma entrada → saída byte a byte idêntica.
  Rodar duas vezes não muda nada.

---

## 2. Invariantes (não negociáveis)

1. **Projeção, não autoria.** O conversor **copia** o texto; nunca reescreve,
   normaliza, "corrige" nem completa prosa confessional/bíblica (CLAUDE.md
   §Conteúdo). Toda correção de texto já aconteceu no Markdown, sob aprovação
   editorial — o conversor não é lugar de correção.
2. **Nunca inventa casing nem título.** Se o impresso traz o cabeçalho em
   versalete, é versalete que sai. Deduzir um `title` "bonito" onde a fonte não
   tem título é autoria (ver D6/§5). Proibido.
3. **Espaços múltiplos internos são preservados** (`FORMATO.md` §1.1) — vão para
   o `body` como estão. São 927 na Belga, 977 em Dort, 569 no Heidelberg; não são
   ruído.
4. **IDs saem do número impresso, nunca de índice posicional.** `belgic-art07`,
   `heidelberg-ld12`, `heidelberg-q085-a`, `dort-h3-art11`, `hymn-042`,
   `psalm-001-gen`. Remover o artigo 5 **aposenta** `belgic-art05` e não renumera
   nada (`SPEC-CONVENCAO-DE-IDS.md` §5). O parser lê o número da fonte; não conta.
5. **Campos derivados nunca são emitidos** (`title_norm`, `rowid`, índice FTS):
   nascem no build do `content.db`, não aqui. O validador reprova se aparecerem.
6. **Falha barulhenta.** Bloco que o parser não classifica → **aborta** com
   `arquivo:linha` e a linha ofensora. Nunca emite um palpite. Um `<sup>`
   órfão, uma chave de referência sem marcador, uma estrofe sem número: pára.

---

## 3. Contrato de entrada e saída

### 3.1 Arquivos de entrada (o escopo real de hoje)

| Arquivo-fonte | Coleção (`collection.id`) | Forma | Documentos |
| --- | --- | --- | --- |
| `fontes/belgic/A Confissão Belga.md` | `belgic` | um arquivo, muitos documentos | 37 artigos |
| `fontes/heidelberg/O Catecismo de Heidelberg.md` | `heidelberg` | um arquivo, muitos documentos | 52 Dias do Senhor |
| `fontes/dort/Os Cânones de Dort.md` | `dort` | um arquivo, muitos documentos | 4 capítulos |
| `fontes/salmos/Salmos - letras.md` | `psalms` | um arquivo, muitos documentos | 283 variantes |
| `fontes/hinos/Hinos - letras.md` | `hymns` | um arquivo, muitos documentos | 97 hinos |

As pastas `salmos/`/`hinos/` estão em português e **não** espelham o
`collection.id` (`psalms`/`hymns`) — de propósito (F4, DECIDIDO: não renomear). O
conversor faz o de/para `salmos→psalms`, `hinos→hymns`. As demais coleções da lista
canônica (`creeds`, `forms`, `church-order`, `minutes`, `bible-*`) **não têm
Markdown** ainda e estão fora de escopo (§7).

### 3.2 `_collection.json` — o que o conversor emite e o que ele **não** deriva

Cinco campos são **config por coleção**, não deriváveis do Markdown; ficam num
único mapa no conversor (`kind`, `title`, `subtitle`, `sortOrder`, e a redação
de `numberLabel` de §D3):

```jsonc
// exemplo do mapa de config (não é a saída)
"belgic": { "kind": "confession", "title": "Confissão Belga", "subtitle": null, "sortOrder": 40 }
```

`version` é o **único campo que o conversor preserva do arquivo já comitado** —
nunca reseta para `1`, nunca deriva. O incremento de `version` a cada mudança de
texto é ato humano, exigido por `SPEC-REPOSITORIO-DE-CONTEUDO.md` e barrado pelo
`check:version-bump`. O conversor lê o `version` corrente e o repassa; se o
`_collection.json` ainda não existe, emite `version: 1`.

### 3.3 `{document.id}.json` — recapitulação do alvo

Campos por `schemas/document.schema.json`: `id`, `collection`, `number`,
`numberLabel`, `title`, `subtitle`, `variant`, `groupKey`, `attrs`, `sortOrder`,
`units[]`. Cada `unit`: `id`, `kind` (enum de 12), `label`, `body` (≥ 1 char),
`attrs`, `sortOrder`.

- `sortOrder` de documento é único na coleção; de unidade, único no documento.
  O conversor atribui por **ordem de leitura** (contador crescente), de forma
  determinística.
- `attrs` é objeto livre — é onde vão os metadados que o schema não nomeia
  (`refs`, `author`, `section`, `heading`, `speaker`, `questionNumber`…).

---

## 4. Regras de emissão do corpo (`body`) — o núcleo

O que entra em `body` é a decisão mais delicada, porque `body` é uma string e o
Markdown carrega marcação. Regras, por tipo de marca:

| Marca no Markdown | Confessionais | Cantados |
| --- | --- | --- |
| **Parágrafo / linha física** | um parágrafo = uma linha; junção de parágrafos de uma mesma unidade por `\n\n` | **cada linha cantada é significativa**: vão para `body` separadas por `\n` (`FORMATO.md` §1.1, F2 DECIDIDO) |
| **Espaços múltiplos internos** | preservados verbatim | preservados verbatim |
| **Itálico `_…_`** | preservado inline no `body` (ver §4.1) | preservado inline (atribuição/`_Amém._` ficam em bloco próprio, §5.4-5.5) |
| **Elisão `\_`** | não ocorre | **preservada** como `\_` no `body` (`FORMATO.md` §5.5) — é instrução de canto, jamais normalizar |
| **Negrito `**…**`** | só Dort (`**Erro N**`/`**Refutação**`) → vira **estrutura** (§5.3), sai do `body` | `**N**` de estrofe → vira `label`/unidade (§5.4), sai do `body` |
| **`<sup>N</sup>`** | **marcador de nota** → achatado, sai do `body`; referência vai para `attrs.refs` (D1) | **número de versículo bíblico** → **mantido** no `body`, onde o impresso o traz (§4.2) |

### 4.1 Marcação inline preservada

O `body` carrega um **subconjunto restrito e documentado** de Markdown inline:
**itálico `_…_`** (confessionais e cantados) e, nos cantados, a **elisão `\_`**.
Nada mais. Justificativa: o itálico é autoral (ênfase, citação literal da
Escritura — `FORMATO.md` §1.3) e descartá-lo perde informação; a elisão é
conteúdo de canto. O *renderer* do app deve honrar esse subconjunto. **Isto é
contrato**: se o app não quiser Markdown no `body`, D1 e esta regra mudam juntas.

### 4.2 `<sup>N</sup>`: nota (achata) × versículo (mantém)

A mesma sintaxe tem dois sentidos (`FORMATO.md` §1.5 vs §5.4), e o conversor os
trata de forma **oposta**:

- **Confessionais** (nota): o `<sup>N</sup>` é chave para o bloco de referências
  ao fim da unidade. O conversor **remove** a tag do `body` e coleta o bloco em
  `attrs.refs` (D1). O emissor **verifica** que as chaves do bloco batem com os
  marcadores do corpo (é o que `validar_confissoes.py` já garante no Markdown) —
  divergência = falha barulhenta (§2.6).
- **Cantados** (versículo): o `<sup>N</sup>` é o número do versículo bíblico,
  pode ser intervalo (`<sup>4-5</sup>`) e às vezes cai no **meio** de uma linha.
  Achatá-lo destruiria a única informação de versículo do texto. O conversor o
  **mantém** no `body`, na posição da fonte. (Salmos: todos. Hinos: só 1–5.)

---

## 5. Mapeamento por coleção

Notação: `§X` remete a `FORMATO.md`. Larguras de ID e sufixos vêm de
`SPEC-CONVENCAO-DE-IDS.md` §3.

### 5.1 `belgic` — Confissão Belga (§3)

- `## ARTIGO N` → **novo documento**. `id = belgic-art{NN}` (2 díg.),
  `number = N`, `numberLabel = "Art. N"`.
- `### Título temático` (bloco seguinte) → `document.title`. `subtitle = null`.
- Cada **parágrafo** do corpo → uma `unit` `kind:"article"`,
  `id = …-p{n}`, `label = null`, `body` = o parágrafo (§4). **(D5 — inclinação
  (a): um parágrafo por unidade.)**
- **Bloco de referências** (lista numerada, §1.6) → `attrs.refs` (ordenado) na
  **última** unidade do artigo (D5-a). `<sup>N</sup>` achatados (§4.2).
- **Caso especial art. 4** (`####`, duas listas do cânon do VT/NT, §3.1): os
  dois `####` viram unidades `kind:"heading"`; os livros listados, unidades
  `article` (ou uma `article` por lista — **decisão de forma, abrir quando
  chegar ao art. 4**).

### 5.2 `heidelberg` — Catecismo (§2)

- `# ~ PARTE N ~ Nome` e `# Seção temática` (§2.1) → **agrupadores acima do
  documento**. Vão para `attrs.part` e `attrs.section` do documento que abrem, e
  o `attrs.section` alimenta o `subtitle` (D6). Não viram documento nem unidade.
- `## DIA DO SENHOR N` → **novo documento**. `id = heidelberg-ld{NN}`,
  `number = N`, `numberLabel = "Domingo N"`, **`title = null`** (o Domingo não
  tem título próprio — D6), `subtitle` = título de seção corrente.
- `### P.N. …?` → **duas unidades**, com numeração **global** 1–129
  (`SPEC-CONVENCAO` §3, caso especial):
  - pergunta: `id = heidelberg-q{NNN}-q`, `kind:"question"`, `label = "P. N"`,
    `attrs.questionNumber = N`.
  - resposta (`R. …`): `id = …-q{NNN}-a`, `kind:"answer"`, `label = "R. N"`,
    `attrs.questionNumber = N`, `attrs.refs` = bloco achatado (D1).
- Resposta **em partes enumeradas** (§2.2): parágrafos unidos por `\n\n`,
  itálico dos enumeradores preservado (§4.1).
- Resposta **litúrgica longa** (P.92 Mandamentos, P.119 Oração; §2.3): quebras
  de verso preservadas como `\n`, itálico de abertura/fecho preservado.
- Perguntas **sem** bloco de referências, e as que trazem a referência no corpo
  entre parênteses (§1.6): `attrs.refs` ausente — não inventar bloco.

### 5.3 `dort` — Cânones (§4)

- `# ~ N CAPÍTULO DA DOUTRINA ~ Assunto` → **novo documento**.
  `id = dort-h{n}` (n = 1–4), `number = n`, `numberLabel = "Capítulo {romano}"`,
  `title` = Assunto (o texto após `~ … ~`), `subtitle` = a designação
  `~ … ~` (ver D3). A numeração de artigos **reinicia por capítulo** (§4.1).
- `## ARTIGO N` → `unit` `kind:"article"`, `id = dort-h{n}-art{N}`,
  `label = "Art. N"`.
  - `### Título temático` do artigo → `attrs.heading` da unidade (unidades não
    têm `title`).
  - **Bloco de referências** (parágrafo único, não chaveado, §4.3; **sem**
    `<sup>`) → `attrs.refs` de **um elemento** (D4).
- `## REJEIÇÃO DE ERROS` (irmã dos artigos, fecha o capítulo, §4.4):
  - parágrafo de introdução → `unit` `kind:"rejection"`, `label = null`.
  - cada par **`**Erro N**` + `**Refutação**`** → uma `unit` `kind:"rejection"`,
    `id = …-rej{N}`, `label = "Erro N"`, `body` com erro e refutação (rótulos de
    negrito removidos; travessão `—` preservado; citações no corpo, §1.3,
    mantidas). **(Granularidade — decisão em aberto, ver §6/D-Dort.)**
- `# CONCLUSÃO` (do documento inteiro, §4.5) → **decisão de forma pendente**:
  documento próprio `dort-conclusion` ou unidades `kind:"section"`. Nenhum
  `kind` do enum a acomoda bem. Abrir quando chegar.

### 5.4 `psalms` — Salmos (§5)

- `# SALMOS` e `# CLASSIFICAÇÃO LITÚRGICA DOS SALMOS` (índice, §5.1) → **não são
  conteúdo de unidade**. Descartados pelo conversor (registrar no log). *Se* o
  índice litúrgico tiver de virar dado, é decisão à parte.
- `## SALMO N{A|B}` → **novo documento**. A letra impressa mapeia direto para
  `variant`: **`A → gen`, `B → har`** (F1 DECIDIDO — `A` é 100% Saltério de
  Genebra; `B` é a versificação/melodia alternativa). `id = psalm-{NNN}-{var}`
  (3 díg. + `gen`/`har`, como `SPEC-CONVENCAO-DE-IDS.md` §3), `number = N`,
  `groupKey = psalm-{NNN}`, `numberLabel = "Salmo N"`, **`title = null`** (o
  salmo não tem título temático, §5.1 — não usar a 1ª linha como título; o
  fixture o fez, é inválido).
  - **Salmo 119** (`## SALMO 119.1-8A`): 22 seções de 8 versículos, cada uma com
    A/B. A variante continua binária (`gen`/`har`); o `id` e o `groupKey`
    **encodam a seção** para não colidir. Formato **DECIDIDO**:
    `id = psalm-119-{VVV}-{VVV}-{gen|har}`, `groupKey = psalm-119-{VVV}-{VVV}`,
    com `{VVV}` = versículo em **3 dígitos** com zero à esquerda (ordena como
    texto). Ex.: `psalm-119-001-008-gen`, `psalm-119-009-016-har`. `number = 119`;
    `numberLabel = "Salmo 119.1-8"` (sem zero, redação humana).
- Atribuição `_CBS - Arlington_` (§5.2) → `attrs.attribution` (string crua; a
  separação versificador/melodia é interpretação — F3, não fazer).
- `**N**` (estrofe, §5.3) → `unit` `kind:"verse"`, `id = …-v{n}`, `label = "N"`,
  `body` = as linhas cantadas unidas por `\n`.
- `<sup>N</sup>` de versículo → **mantido** no `body` (§4.2). Elisão `\_`
  preservada (§4.1). Salmos **não têm refrão nem `_Amém._`** (§5.3.1/§5.3.2).

### 5.5 `hymns` — Hinos (§6)

- `# HINOS` e `# CLASSIFICAÇÃO LITÚRGICA DOS HINOS` → descartados como em §5.4.
- `# SEÇÃO LITÚRGICA` (16, §6.1) → **agrupador**; vai para `attrs.section` do
  hino corrente (a numeração 1–97 atravessa as seções). **(Decisão em aberto —
  §6/hinos: `attrs.section` vs. descartar.)**
- `## N. TÍTULO` → **novo documento**. `id = hymn-{NNN}`, `number = N`,
  `numberLabel = "Hino N"`, `title = TÍTULO` **como no impresso** (versalete —
  não rebaixar caixa, §2.2; se título em caixa normal for desejado, é campo
  autorado à parte, não derivável).
- Cânticos de textos bíblicos (1–6): linha de referência bíblica no cabeçalho
  (§6.2, forma por extenso `Êxodo 20.1-17`) → `attrs.bibleRef`.
- Atribuição `_Autor_` → `attrs.author` (F3).
- `**N**` (estrofe) → `verse` (inclui os `**1**` sintéticos dos hinos 16, 25,
  26, 30, 97 — §6.6, **não** são estrofe perdida).
- **Refrão** (citação em bloco `>`, §5.3.1/§6.3, 34 hinos) → `unit`
  `kind:"refrain"`, `id = …-ref{n}`. Mapeamento é mecânico (blockquote →
  `refrain`), sem inferência.
- **Fecho `_Amém._`** (§5.3.2/§6.4, 12 hinos) → o enum **não tem** slot próprio.
  **Decisão em aberto**: `kind:"verse"` com `attrs.role:"amen"`, ou estender o
  enum. Não confundir com os hinos em que "Amém" é letra (§6.4).
- `<sup>N</sup>` de versículo só em 1–5 (§6.5) → mantido (§4.2).
- ⚠️ **Hino 45** (§8.1): bloco `Amém.` pós-última-estrofe **fora** de blockquote
  — decisão de forma no Markdown antes de virar JSON.

---

## 6. Decisões em aberto

> Preservadas do registro original. Nada aqui está decidido; ao decidir, marque
> **DECIDIDO** e anote a escolha.

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

### D-Dort — Granularidade da Rejeição de Erros
- **O problema:** §5.3 emite uma `unit` `rejection` por par Erro/Refutação. Uma
  alternativa é uma única `rejection` por capítulo (o bloco inteiro), ou separar
  Erro e Refutação em duas unidades.
- **Inclinação:** uma unidade por par (label "Erro N"), que casa com a
  numeração reiniciada por capítulo (§4.4).
- **Status:** ABERTA.

---

## 7. Coleções futuras e fora de escopo

Este repositório guardará todo o conteúdo do MVP; as confissões são o caso
**incomum**, o resto é em geral mais simples. Nada aqui se decide agora — o
conversor cuida de cada coleção quando o texto dela existir.

**Invariante:** `fontes/{coleção}/` espelha `content/{coleção}/`, com os ids de
coleção do App IRB; ID sai do número impresso; um parser por coleção.

### Alvo por coleção (conferido contra os fixtures do app)

| Coleção | id | Unidades (`kind`) | Novidade |
| --- | --- | --- | --- |
| `psalms` | `psalm-NNN-gen/har` (A→gen, B→har) | `verse` | `variant` + `groupKey`; `\n` real no verso; versículo em `<sup>`; **sem refrão**; só o 119 tem seção (F1) |
| `hymns` | `hymn-NNN` | `verse`, `refrain` | `attrs.author`; refrão em blockquote (34/97); agrupamento por seção litúrgica |
| `creeds` | `creed-slug` | `line` | texto vem do responsável (ver ressalvas) |
| `forms` | `form-slug` | `section`, `rubric`, `speech` | `attrs.speaker` — diálogo litúrgico |
| `church-order` | `church-order-artNNN` | `article` | como a Belga, 3 dígitos; um arquivo, muitos artigos |

### Decisões que virão (abrir quando a coleção chegar)

- **F1 — Salmos, id da variante.** *Conferido no texto real.* A letra impressa é
  binária e mapeia direto no `variant` do schema: **`A → gen`, `B → har`**.
  Dados: 283 variantes = **171 `A`** (100% "Saltério de Genebra" → genebrino) +
  **112 `B`** (a versificação/melodia alternativa/harmônica). Não há conflito de
  schema: `variant ∈ {gen, har, null}` basta; `id = psalm-{NNN}-{gen|har}`,
  `groupKey = psalm-{NNN}`. **DECIDIDO.**
  - *Nota:* 22 dos 112 `B` também dizem "Saltério de Genebra" no impresso
    (arranjos de autor desconhecido) e 90 trazem melodia nomeada (Old Hundredth,
    Passion Chorale…). Como a atribuição inteira vai em `attrs.attribution`,
    `gen`/`har` é só o nome do slot e nenhuma informação de melodia se perde.
  - **Salmo 119 — DECIDIDO.** São **22 seções** de 8 versículos
    (`SALMO 119.1-8A`…), cada uma com A/B — a variante segue binária (os "28" são
    seções × variante). O `id` encoda a seção: **`psalm-119-{VVV}-{VVV}-{gen|har}`**
    com versículo em 3 dígitos (`psalm-119-001-008-gen`), e
    **`groupKey = psalm-119-{VVV}-{VVV}`** agrupa A/B da mesma seção.
    - **Consequência:** o padrão de doc-id de `psalms` no validador
      (`validate-content.mjs`, `DOC_ID_PATTERNS`) precisa aceitar a forma
      estendida do 119 além de `psalm-{NNN}-{gen|har}`.
  - **Layout de arquivo:** hoje os 283 estão num só `.md` ("um arquivo, muitos
    documentos"). Manter assim ou um arquivo por variante — **ABERTA**.
- **F2 — Quebra de linha do verso. DECIDIDO.** Uma linha cantada por linha
  física, **sem** marcador de quebra dura (`FORMATO.md` §1.1, §5.3). O `\n`
  **dentro** de uma unidade é significativo e vai para o JSON como está.
- **F3 — Metadados** (`author` de hino, `speaker` de fala): não são texto
  corrido; precisam de lugar no Markdown — provavelmente front-matter YAML.
  - *Nota do texto real:* nos salmos a atribuição já está no corpo, em itálico
    logo após o título (`_CBS - Arlington_`), com 96 rótulos que misturam
    versificador e melodia (`Vítor Olivier - Saltério de Genebra`). Separá-los em
    dois campos é **interpretação** — não sai do impresso sozinho.
- **F4 — Nome das pastas de `fontes/`.** As três confissões usam o id de coleção
  do App IRB (`belgic`, `heidelberg`, `dort`); salmos e hinos entraram como
  `salmos/` e `hinos/`.
  - **Status: DECIDIDO (2026-08-24) — NÃO renomear.** As pastas-fonte ficam
    `fontes/salmos` e `fontes/hinos`. Motivo: o validador editorial Python
    (`ferramentas/validar.py`, `extrair.py`) e os digests
    (`ferramentas/digests/{salmos,hinos}.txt`) têm esses nomes embutidos;
    renomear arrastaria uma mudança de risco no guardião da fidelidade textual
    por um ganho só estético. O **de/para** (`salmos→psalms`, `hinos→hymns`) vive
    no `convert.mjs`: um mapa de coleção que lê de `fontes/salmos` e escreve em
    `content/psalms`. A invariante "`fontes/{coleção}` espelha `content/{coleção}`"
    é substituída por "o mapa do conversor é a única fonte do de/para".

### Ressalvas

- **Credos são caso à parte.** `CLAUDE.md`: o texto exato dos credos **vem do
  responsável do projeto** e é o modelo canônico do formato-fonte — não se
  inventa nem completa. `creeds` não é "autorar", é "receber e formatar".
- **`minutes`** (atas de sínodo): está na lista canônica do validador, mas
  **não é MVP** — não puxar para cá agora.
- **Bíblia** (`bible-ara/arc/acf`): milhares de documentos, quase certamente não
  vem de Markdown à mão. Importador próprio quando sua parte chegar; a forma do
  conversor de confissões **não** deve ditar a da Bíblia.
