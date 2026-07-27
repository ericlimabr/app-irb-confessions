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
- Esse padrão já existe **um degrau acima**, entre o PDF e o Markdown:
  `ferramentas/validar.py` confere os textos cantados contra os PDFs de origem
  e sai com código != 0 se divergirem. O gate do conversor deve ser irmão dele,
  não um mecanismo novo.

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
| `psalms` | `psalm-NNNa/b` (ver F1) | `verse` | variante A/B + `groupKey`; `\n` real dentro do verso; versículo em `<sup>`; **nenhum refrão** |
| `hymns` | `hymn-NNN` | `verse`, `refrain` | metadado `attrs.author`; refrão em citação de bloco (34 de 97); agrupamento por seção litúrgica |
| `creeds` | `creed-slug` | `line` | texto vem do responsável (ver ressalvas) |
| `forms` | `form-slug` | `section`, `rubric`, `speech` | `attrs.speaker` — diálogo litúrgico |
| `church-order` | `church-order-artNNN` | `article` | como a Belga, 3 dígitos; um arquivo, muitos artigos |

### Decisões novas que virão (abrir quando a coleção chegar)

- **F1 — Salmos, id da variante.** *Revisto com o texto real em mãos.* O eixo
  não é `gen`/`har` como se supôs: é a **letra impressa**, `A`/`B`, que designa
  a versificação/melodia (`A` quase sempre Saltério de Genebra, `B` uma melodia
  alternativa). São 150 salmos em 283 variantes — 106 com `A`+`B`, 43 só com
  `A`. Pelo princípio "id sai do número impresso", o id sai da letra:
  `psalm-001a`, `psalm-001b`.
  - **Pendente:** o **Salmo 119** é publicado em 22 seções de oito versículos
    (`SALMO 119.1-8A`), 28 variantes ao todo. Não cabe em `psalm-NNNx`. Opções:
    `psalm-119.1-8a`, `psalm-119-001-008a`, ou tratar cada seção como documento
    próprio com `groupKey` comum.
  - **Pendente:** um arquivo com todas as variantes (como está) ou um arquivo
    por variante. Hoje é **um arquivo, muitos documentos** — o que contraria a
    tabela acima, que previa `psalms` como "um arquivo, um documento".
  - **Status:** parcialmente resolvida; o esquema de id do 119 e o layout de
    arquivo continuam **em aberto**.
- **F2 — Quebra de linha do verso.** **DECIDIDO.** Uma linha cantada por linha
  física, **sem** marcador de quebra dura. Descartou-se o sufixo de dois espaços
  (indistinguível dos espaços múltiplos que `FORMATO.md` § 1.1 manda preservar)
  e o `<br>` (ruído em ~11 mil linhas). O Obsidian renderiza quebra simples por
  padrão. Ver `FORMATO.md` § 1.1 e § 5.3.
  - Consequência para o conversor: o `\n` **dentro** de uma unidade é
    significativo e deve ir para o JSON como está.
- **F3 — Metadados** (`author` de hino, `speaker` de fala): não são texto
  corrido; precisam de um lugar no Markdown — provavelmente front-matter YAML.
  - *Nota do texto real:* nos salmos a atribuição já está no corpo, em itálico
    logo após o título (`_CBS - Arlington_`), com 96 rótulos distintos que
    misturam versificador e melodia (`Vítor Olivier - Saltério de Genebra`).
    Se virar metadado, precisa ser **separado em dois campos**, e essa separação
    é interpretação — não sai do impresso sozinha.
- **F4 — Nome das pastas de `fontes/`.** As três confissões usam o id de coleção
  do App IRB (`belgic`, `heidelberg`, `dort`); salmos e hinos entraram como
  `salmos/` e `hinos/`, em português. Ou se renomeia para `psalms/` e `hymns/`,
  mantendo a invariante "`fontes/{coleção}` espelha `content/{coleção}`", ou a
  invariante deixa de valer e o conversor passa a precisar de um mapa. Inclinação:
  renomear.
  - **Status:** ABERTA.

### Marcadores de versículo: o que o conversor recebe

Nos textos cantados o `<sup>N</sup>` **não** é chave de nota (não há bloco de
referências): é o número do versículo bíblico, vem antes do trecho que abre e
pode ser intervalo (`<sup>4-5</sup>`, 50 ocorrências nos salmos). D1 — "achatar
os marcadores" — **não se aplica aqui**: achatar destruiria a única informação
de versículo que o texto tem. Precisa de decisão própria quando os salmos
entrarem no conversor.

Nos hinos o marcador só existe em **5 dos 97** (os cânticos de textos bíblicos);
os outros 92 não têm numeração de versículo nenhuma.

### Refrão: resolvido no Markdown

O `kind: "refrain"` já tem origem inequívoca no texto-fonte: o refrão é uma
**citação em bloco** (`>`), conforme `FORMATO.md` § 5.3.1. São 34 nos hinos e
nenhum nos salmos. O conversor não precisa inferir nada — basta mapear
blockquote → `refrain`, e o resto dos blocos → `verse`.

Uma ressalva: o hino 45 tem, depois da última estrofe, um bloco de uma linha
(`Amém.`) que **não** é refrão e por isso não está em blockquote. Hoje ele cai
em `verse` junto da última estrofe ou vira unidade solta, conforme o parser.
Ver `FORMATO.md` § 8.1 — precisa de decisão de forma antes de virar JSON.

### Seções litúrgicas dos hinos

Os hinos têm um nível de agrupamento que os salmos não têm: 16 seções
litúrgicas (`# CHAMADO À ADORAÇÃO`), com a numeração dos hinos correndo de 1 a
97 **através** delas. Isso não cabe em `hymn-NNN` sozinho — a seção é metadado
de agrupamento, análogo ao capítulo de Dort, e precisa de um lugar no JSON
(`attrs.section`?) ou de ser descartada explicitamente.
  - **Status:** ABERTA.

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
