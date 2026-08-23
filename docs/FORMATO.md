# Especificação de Formato

Este documento define como os textos deste repositório são estruturados em
Markdown. Os arquivos ficam em `fontes/{coleção}/` e se dividem em duas
famílias, que seguem convenções diferentes.

**Textos confessionais** — prosa, com aparato de referências bíblicas:

| Arquivo | Unidade de conteúdo | Notas de referência |
| --- | --- | --- |
| `O Catecismo de Heidelberg.md` | Pergunta e resposta (129) | Numeradas, com marcador no texto |
| `A Confissão Belga.md` | Artigo (37) | Numeradas, com marcador no texto |
| `Os Cânones de Dort.md` | Artigo (59, reiniciados por capítulo) | Sem numeração, em bloco único |

**Textos cantados** — verso metrificado, com estrofes e linhas de canto:

| Arquivo | Unidade de conteúdo | Marcação de versículo |
| --- | --- | --- |
| `Salmos - letras.md` | Variante de salmo (283) | `<sup>N</sup>` do versículo bíblico |
| `Hinos - letras.md` | Hino (97), sob 16 seções litúrgicas | Só nos hinos 1–5 |

O Catecismo de Heidelberg é o documento de referência **para os textos
confessionais**: quando houver dúvida sobre uma convenção não prevista aqui,
siga o que ele faz. Para os textos cantados, o documento de referência é
`Salmos - letras.md` (§ 5); § 6 registra apenas o que é próprio dos hinos.

---

## 1. Convenções comuns

Salvo indicação em contrário, tudo nesta seção vale para os dois tipos de
texto. Onde os textos cantados divergem, a divergência está anotada aqui e
detalhada em § 5.

### 1.1 Arquivo e blocos

- Markdown, codificação UTF-8, uma linha em branco entre blocos.
- **Cada parágrafo ocupa uma única linha física.** Não há quebra de linha
  manual dentro do parágrafo — a quebra visual fica a cargo do editor.
- Os espaços múltiplos internos herdados da diagramação original
  (`e  à  Sua imagem`) são preservados. Não são erro de formato e não devem
  ser normalizados.

> **Exceção — textos cantados.** Num salmo, a linha física **é** a linha
> cantada: a quebra de verso é conteúdo, não apresentação, e por isso não pode
> ficar a cargo do editor. Ver § 5.3. Não se usa marcador de quebra dura (dois
> espaços no fim da linha ou `<br>`): o primeiro seria indistinguível dos
> espaços múltiplos que § 1.1 manda preservar, e o segundo é ruído em ~11 mil
> linhas. O Obsidian renderiza quebra simples por padrão.

### 1.2 Ênfase

- Itálico com sublinhado: `_texto_`. Nunca asteriscos.
- Negrito (`**texto**`) é reservado a rótulos estruturais, nunca a ênfase de
  leitura. Só há três usos:
  - `**Erro N**` e `**Refutação**` nos Cânones de Dort (§ 4.4);
  - `**N**` como número de estrofe nos textos cantados (§ 5.3).

> **Atenção nos textos cantados.** O sublinhado tem ali um segundo papel: ele
> marca elisão no canto e aparece escapado como `\_` (§ 5.5). Itálico e elisão
> convivem no mesmo arquivo porque a elisão é sempre escapada.

### 1.3 Citações bíblicas no corpo do texto

Citação literal da Escritura em itálico **e** entre aspas duplas, com a
referência fora das aspas e do itálico, entre parênteses:

```markdown
conforme declarou: _"Maldito todo aquele que não permanece em todas as coisas
escritas no Livro da lei, para praticá-las"_ (Gl 3.10).
```

Quando a referência já foi anunciada na frase, ela pode ser omitida do fim:

```markdown
Assim também em Gênesis 3.22: _"Eis que o homem se tornou como um de Nós"_.
```

Palavras ou expressões apenas destacadas (não citadas) levam somente itálico:
`e ao dizer: _Criou Deus_, demonstra-se que…`

### 1.4 Forma das referências bíblicas

A sigla canônica é **a da edição impressa** (decisão de 2026-07-27). O
inventário atestado — as 49 siglas que o PDF de origem usa duas vezes ou mais —
está em `LIVROS_ATESTADAS`, em `ferramentas/validar_confissoes.py`, junto das 17
inferidas para livros que nenhum dos três documentos cita.

Duas consequências que valem registrar, porque contrariam a intuição:

- **`Êx`, com circunflexo.** É assim que o impresso escreve, 19 vezes, e nunca
  `Ex`. A Confissão Belga segue; o Catecismo de Heidelberg usa `Ex` e por isso
  é acusado pelo validador.
- **`Fp` para Filipenses**, não `Fl`. O impresso traz `Fp` 37 vezes.

- Nome do livro abreviado, sem ponto: `Gn`, `Sl`, `Mt`, `1Co`, `2Tm`, `Ap`.
- Capítulo e versículo separados por ponto: `Rm 8.28`.
- Versículos avulsos do mesmo capítulo separados por vírgula: `Rm 8.15, 16`.
- Intervalos com hífen: `Rm 7.7-25`.
- Passagens distintas separadas por ponto e vírgula: `Mt 10.29-31; Lc 21.16-18`.
- Capítulos distintos do mesmo livro também por ponto e vírgula, sem repetir o
  nome do livro: `Gn 6.5; 8.21`.
- Capítulo inteiro sem versículo: `Gn 3`, `Sl 8`.

### 1.5 Marcadores de nota

- Formato: `<sup>N</sup>`, precedido de um espaço.
- Posicionado **depois** da pontuação do segmento que a nota cobre:

```markdown
R. Que não pertenço a mim mesmo, <sup>1</sup> mas pertenço de corpo e alma,
tanto na vida quanto na morte, <sup>2</sup> ao meu fiel Salvador Jesus Cristo. <sup>3</sup>
```

- Marcadores consecutivos ficam numa única tag, separados por espaço:
  `<sup>9 10</sup>`.
- A numeração reinicia em `1` a cada unidade de conteúdo (cada pergunta, cada
  artigo).

> **Exceção — textos cantados.** Ali o `<sup>N</sup>` não é chave de nota: é o
> **número do versículo bíblico**, e por isso não reinicia por unidade nem
> remete a bloco de referências. Vem **antes** do trecho que abre, não depois,
> e pode ser intervalo (`<sup>4-5</sup>`). Ver § 5.4.

### 1.6 Bloco de referências

Fecha a unidade de conteúdo **quando ela tem notas numeradas** (`<sup>N</sup>`),
como último bloco, precedido de linha em branco. Nem toda unidade o tem: há
perguntas sem referência e há perguntas cujas referências aparecem no corpo da
resposta, entre parênteses (§ 1.3) — nesses casos não há bloco.

Nos documentos com notas numeradas (Heidelberg e Confissão Belga), quando o
bloco existe, é uma lista ordenada com **uma chave por linha**, terminada em
ponto:

```markdown
1. 1Co 6.19, 20.
2. Rm 14.7-9.
3. 1Co 3.23; Tt 2.14.
```

As chaves do bloco devem corresponder exatamente aos marcadores `<sup>N</sup>`
do corpo. Nos Cânones de Dort o bloco tem forma diferente — ver § 4.3.

### 1.7 Enumerações

Listas com marcador para itens sem ordem intrínseca, lista ordenada quando a
numeração faz parte do texto (artigos do Credo, Dez Mandamentos):

```markdown
R. Em três partes.
- a primeira é sobre Deus o Pai e a nossa criação;
- a segunda é sobre Deus o Filho e a nossa redenção;
- a terceira é sobre Deus o Espírito Santo e a nossa santificação.
```

---

## 2. O Catecismo de Heidelberg

### 2.1 Hierarquia

| Nível | Forma | Ocorrências |
| --- | --- | --- |
| `#` | `# O CATECISMO DE HEIDELBERG` | Título do documento, versalete |
| `#` | `# ~ PARTE I ~ Nossos Pecados e Miséria` | 3 partes |
| `#` | `# Deus Pai e a Nossa Criação` | Seções temáticas |
| `##` | `## DIA DO SENHOR 1` | 52 Dias do Senhor |
| `###` | `### P.1. Qual é o seu único consolo…?` | 129 perguntas |

- As **partes** usam o marcador `~ PARTE N ~` seguido do nome em Capitalização
  de Título. As três são: `PARTE I` (Nossos Pecados e Miséria), `PARTE II`
  (Nossa Salvação), `PARTE III` (A Nossa Gratidão).
- As **seções temáticas** subdividem uma parte e usam o mesmo nível `#`, sem
  marcador: `Deus Pai e a Nossa Criação`, `Deus Filho e a Nossa Redenção`,
  `Deus Espírito Santo e a Nossa Santificação`, `A Nossa Justificação`,
  `A Palavra e os Sacramentos`, `O Santo Batismo`, `A Santa Ceia`,
  `Os Dez Mandamentos`, `A Oração`.
- Um Dia do Senhor contém de uma a quatro perguntas.

### 2.2 Pergunta e resposta

- Título da pergunta: `### P.N. ` seguido do texto, sempre terminado em `?`.
- A resposta abre com `R. ` e ocupa um ou mais parágrafos.
- Resposta em partes enumeradas: um parágrafo por parte, com o enumerador em
  itálico.

```markdown
### P.2. O que é que você precisa saber para viver e morrer nessa consolação?

R. _Primeiro_, como são grandes meus pecados e miséria; <sup>1</sup>

_segundo_, de que modo sou liberto de todos os meus pecados e miséria; <sup>2</sup>

_terceiro_, de que modo devo ser grato a Deus por uma tal libertação. <sup>3</sup>

1. Rm 3.9, 10; 1Jo 1.10.
2. Jo 17.3; At 4.12; 10.43.
3. Mt 5.16; Rm 6.13; Ef 5.8-10; 1Pe 2.9, 10.
```

### 2.3 Textos litúrgicos longos

Orações e listas citadas na íntegra (Oração do Senhor, P.119; Dez Mandamentos,
P.92) preservam a quebra de versos. O itálico abre no início e fecha no fim do
trecho inteiro, e as linhas internas são indentadas com três espaços:

```markdown
R. _"Pai nosso, que estás nos céus,_

   _santificado seja o teu nome;
   venha o teu reino;
   faça-se a tua vontade, assim na terra como no céu;_ <sup>1</sup>
```

### 2.4 Modelo completo

```markdown
# ~ PARTE I ~ Nossos Pecados e Miséria

## DIA DO SENHOR 2

### P.3. Como é que você sabe dos seus pecados e miséria?

R. Pela lei de Deus. <sup>1</sup>

1. Rm 3.20; 7.7-25.
```

---

## 3. A Confissão Belga

### 3.1 Hierarquia

| Nível | Forma | Ocorrências |
| --- | --- | --- |
| `#` | `# A CONFISSÃO BELGA` | Título do documento, versalete |
| `##` | `## ARTIGO 1` | 37 artigos |
| `###` | `### Só existe um Deus` | Título temático do artigo |
| `####` | `#### Os livros do Velho Testamento são:` | Subdivisão interna (só no art. 4) |

- Não há partes nem Dias do Senhor: o documento é uma sequência plana de 37
  artigos.
- `## ARTIGO N` traz **apenas** o número. O título temático vem sempre no bloco
  seguinte, como `###`, na capitalização do original (só a inicial maiúscula).
- O nível `####` existe unicamente no artigo 4, para as duas listas do cânon.

### 3.2 Corpo

Um ou mais parágrafos, com marcadores `<sup>N</sup>` conforme § 1.5, fechados
pelo bloco de referências numeradas de § 1.6.

### 3.3 Modelo completo

```markdown
## ARTIGO 1

### Só existe um Deus

Todos nós cremos com o coração, e confessamos com a boca, <sup>1</sup> que só
existe um Deus, <sup>2</sup> que é um Ser espiritual e simples; <sup>3</sup>

1. Rm 10.10.
2. Dt 6.4; 1Co 8.4, 6; 1Tm 2.5.
3. Jo 4.24.
```

---

## 4. Os Cânones de Dort

### 4.1 Hierarquia

| Nível | Forma | Ocorrências |
| --- | --- | --- |
| `#` | `# OS CÂNONES DE DORT` | Título do documento, versalete |
| `#` | `# ~ PRIMEIRO CAPÍTULO DA DOUTRINA ~ A Eleição e a Reprovação Divinas` | 4 capítulos |
| `##` | `## ARTIGO 1` | 59 artigos |
| `###` | `### Toda a humanidade é condenável diante de Deus` | Título temático do artigo |
| `##` | `## REJEIÇÃO DE ERROS` | 1 por capítulo |
| `#` | `# CONCLUSÃO` | 1, no fim do documento |

- Os **capítulos** seguem a forma das partes do Heidelberg (§ 2.1): marcador
  `~ … ~` com a designação em versalete, seguido do assunto em Capitalização de
  Título. São quatro, porque o terceiro e o quarto são unificados no original:

```markdown
# ~ PRIMEIRO CAPÍTULO DA DOUTRINA ~ A Eleição e a Reprovação Divinas
# ~ SEGUNDO CAPÍTULO DA DOUTRINA ~ A Morte de Cristo e a Redenção do Homem Através Dela
# ~ TERCEIRO E QUARTO CAPÍTULOS DA DOUTRINA ~ A Corrupção do Homem, a Sua Conversão a Deus e o Modo Como Isso Ocorre
# ~ QUINTO CAPÍTULO DA DOUTRINA ~ A Perseverança dos Santos
```

- A numeração dos artigos **reinicia em 1 a cada capítulo** (18, 9, 17 e 15
  artigos, respectivamente).
- `## REJEIÇÃO DE ERROS` é irmão de `## ARTIGO N`, não filho: fecha o capítulo.
- `# CONCLUSÃO` é do documento inteiro, não de um capítulo — daí o nível `#`.

### 4.2 Corpo dos artigos

Igual em tudo ao da Confissão Belga, **exceto** que não há marcadores
`<sup>N</sup>`: o original não vincula cada referência a um ponto do texto.

### 4.3 Bloco de referências

Como as referências não são chaveadas, o bloco **não** é lista numerada — seria
inventar uma correspondência que o original não tem. É um parágrafo único de
citações, em linha, como último bloco do artigo:

```markdown
### Toda a humanidade é condenável diante de Deus

Como todos os homens pecaram em Adão, estão debaixo da maldição e merecem a
morte eterna, Deus não teria feito injustiça a ninguém…

Rm 5.12; Rm 3.19, 23; Rm 6.23.
```

Cada um dos 59 artigos tem exatamente um bloco desses.

### 4.4 Rejeição de Erros

Abre com `## REJEIÇÃO DE ERROS`, seguido de um parágrafo de introdução e dos
pares erro/refutação. Cada membro do par é um parágrafo próprio, aberto por um
rótulo em negrito e travessão (`—`, não hífen):

```markdown
## REJEIÇÃO DE ERROS

Depois de haver explanado a verdadeira doutrina da eleição e da reprovação, o
Sínodo condena e rejeita os seguintes erros:

**Erro 1** — O completo e total decreto da eleição para a salvação é a vontade
de Deus de salvar aos que irão crer e perseverar na fé e na obediência.

**Refutação** — Esse erro é um engano e contradiz claramente à Escritura…

**Erro 2** — Há vários tipos de eleição divina para a vida eterna…
```

- A numeração dos erros reinicia em `1` a cada capítulo (9, 7, 9 e 9 erros).
- `**Refutação**` nunca é numerada: ela pertence ao erro imediatamente anterior.
- As seções de Rejeição não têm bloco de referências; as citações aparecem no
  próprio corpo da refutação, conforme § 1.3.

### 4.5 Conclusão

`# CONCLUSÃO`, com parágrafos corridos e uma lista ordenada de 1 a 7 para as
sete acusações enumeradas no original.

---

## 5. Os Salmos

Documento de referência dos **textos cantados**: em dúvida sobre uma convenção
não prevista para salmos ou hinos, siga o que ele faz.

### 5.1 Hierarquia

| Nível | Forma | Ocorrências |
| --- | --- | --- |
| `#` | `# SALMOS` | Título do documento, versalete |
| `#` | `# CLASSIFICAÇÃO LITÚRGICA DOS SALMOS` | Índice temático, abre o arquivo |
| `##` | `## SALMO 1A` | 283 variantes |

- Não há nível de agrupamento entre o documento e a variante: é uma sequência
  plana, na ordem do saltério.
- `## SALMO NX` traz **apenas** a designação impressa. Não há título temático —
  ao contrário da Belga e de Dort, o salmo não tem assunto próprio, e inventar
  um seria autoria.
- O índice litúrgico de abertura é transcrito como veio, sem virar tabela.

### 5.2 Variantes

O sufixo de letra **não é ordinal**: é a versificação/melodia impressa.

- 150 salmos em 283 variantes. Fora o Salmo 119: 106 salmos com `A` e `B`, 43
  apenas com `A`.
- `A` é quase sempre o **Saltério de Genebra**; `B` é uma melodia alternativa
  (`Arlington`, `New Britain`, `Melita`, `Finlandia`, `Passion Chorale`…).
- O **Salmo 119** é publicado em 22 seções de oito versículos, cada uma com as
  suas variantes, num total de 28: `## SALMO 119.1-8A`, `## SALMO 119.9-16B` etc.

A atribuição vem no bloco imediatamente após o título, em itálico, sem os
parênteses do impresso:

```markdown
## SALMO 1B

_CBS - Arlington_
```

### 5.3 Estrofe e linha cantada

- A estrofe abre com o número em negrito, sozinho na sua linha física:
  `**N**`. A numeração reinicia em `1` a cada variante e é contígua.
- Cada linha cantada ocupa **uma linha física**, sem marcador de quebra dura
  (§ 1.1).
- A estrofe inteira é um bloco: linha em branco só entre estrofes, nunca
  dentro.
### 5.3.1 Refrão

Um bloco de linhas **sem** `**N**`, situado **entre** duas estrofes numeradas,
é refrão. No impresso ele não tem rótulo — distingue-se só pela indentação — e
por isso é marcado como **citação em bloco**, com `>` colado ao início de cada
linha, sem espaço:

```markdown
**1**
Despede-nos, Senhor, Jesus,
No fim do teu culto aqui;

>Despede-nos com tua paz,
>Despede-nos em teu amor!

**2**
Conduze-nos, Senhor Jesus,
```

Duas condições, ambas necessárias:

- **sem número de estrofe** — se tem `**N**`, é estrofe;
- **entre estrofes** — um bloco não numerado **depois da última** estrofe não é
  refrão: é fecho litúrgico, e leva outra marcação (§ 5.3.2).

Nos salmos não ocorre nenhum refrão; nos hinos são 34 (§ 6.3).

### 5.3.2 Fecho litúrgico

O `Amém` que encerra a unidade não é estrofe nem refrão: é fecho. No impresso
vem como bloco próprio depois da última estrofe. Fica em **bloco próprio, em
itálico**:

```markdown
E será na minha boca
Agradável teu louvor.

_Amém._
```

O critério é estrutural, não de vocabulário: só a linha que é **exatamente**
`Amém` ou `Amém.` **e** é a última com conteúdo da unidade. Um "Amém" que faz
parte de uma linha cantada continua sendo letra e não recebe marcação alguma —
por exemplo `Eternamente! Amém! Amém!` (hino 16), `Creio na vida eterna, sim.
Amém.` (hino 7) ou o hino 97 inteiro, que é `Amém, amém, amém.`

A pontuação do impresso é preservada: o hino 64 traz `Amém` sem ponto, e sai
como `_Amém_`.

Ocorre em 12 hinos (§ 6.4) e em nenhum salmo.

### 5.4 Versículos

- `<sup>N</sup>` **precede** a linha em que o versículo começa, separado por um
  espaço — ao contrário do marcador de nota, que vem depois da pontuação
  (§ 1.5).
- Intervalos usam hífen dentro da tag: `<sup>4-5</sup>`, `<sup>72-73</sup>`.
- Quando o versículo começa no meio de uma linha cantada, o marcador fica no
  meio da linha, onde o impresso o traz.
- A numeração é a do salmo bíblico: não reinicia por estrofe, e uma variante
  pode não começar em `1`.

```markdown
**3**
<sup>5</sup> Por isso,\_os ímpios não subsistirão
E, no juízo, todos cairão.
<sup>6</sup> Dos justos Deus conhece\_o caminhar,
```

### 5.5 Elisão

O sublinhado marca **sinalefa** — duas sílabas cantadas como uma. É conteúdo,
não formatação, e por isso vem sempre **escapado**: `\_`. Sem o escape o
Markdown o leria como itálico e corromperia a leitura da estrofe inteira.

```markdown
Que nunca anda\_em ímpia sugestão,
```

São 5.999 ocorrências. Nunca normalize nem remova: a elisão é instrução de
canto.

### 5.6 Modelo completo

```markdown
## SALMO 1A

_CBS - Saltério de Genebra_

**1**
<sup>1</sup> Quão bem-aventurado é\_o varão
Que nunca anda\_em ímpia sugestão,
Não se detém no\_andar de pecadores,
Nem se associa\_aos escarnecedores,
<sup>2</sup> Mas seu prazer na lei de Deus está
E\_em dia\_e noite nela meditar.

**2**
<sup>3</sup> Tal como\_arbusto,\_à beira de\_água\_está,
Que,\_em tempo próprio,\_o fruto ele dá.
```

---

## 6. Os Hinos

Segue as convenções de § 5 — linha cantada por linha física, `**N**` de estrofe,
refrão em citação de bloco. Esta seção registra só o que é próprio do hinário.

### 6.1 Hierarquia

| Nível | Forma | Ocorrências |
| --- | --- | --- |
| `#` | `# HINOS` | Título do documento, versalete |
| `#` | `# CLASSIFICAÇÃO LITÚRGICA DOS HINOS` | Índice, abre o arquivo |
| `#` | `# CHAMADO À ADORAÇÃO` | 16 seções litúrgicas |
| `##` | `## 9. VAMOS NÓS LOUVAR A DEUS!` | 97 hinos |

- Diferença central em relação aos salmos: existe um **nível de agrupamento**.
  As 16 seções litúrgicas usam `#`, como os capítulos de Dort (§ 4.1), e são
  irmãs do título do documento, não filhas.
- `## N. TÍTULO` traz número **e** título, em versalete, na mesma linha — ao
  contrário da Belga, que separa número e assunto em dois níveis.
- A numeração dos hinos é contínua de 1 a 97 e **atravessa** as seções: a seção
  agrupa, não renumera.

As 16 seções, na ordem: `CÂNTICOS DE TEXTOS BÍBLICOS`, `CONFISSÃO DE FÉ`,
`CHAMADO À ADORAÇÃO`, `LOUVOR E ADORAÇÃO`, `LEI, CONFISSÃO E PERDÃO`,
`LEITURA E PREGAÇÃO DA PALAVRA`, `ORAÇÃO E SÚPLICA`, `OFERTAS E GRATIDÃO`,
`EVANGELHO`, `ATOS REDENTIVOS: NASCIMENTO`, `ATOS REDENTIVOS: MORTE`,
`ATOS REDENTIVOS: RESSURREIÇÃO`, `ATOS REDENTIVOS: ASCENSÃO`,
`ATOS REDENTIVOS: RETORNO DE CRISTO`, `IGREJA E SACRAMENTOS`,
`ENCERRAMENTO E DESPEDIDA`.

### 6.2 Cabeçalho do hino

A atribuição segue § 5.2 — itálico, sem os parênteses do impresso. Os
**cânticos de textos bíblicos** (hinos 1 a 6) trazem antes dela uma linha de
referência bíblica, **sem** itálico:

```markdown
## 1. OS DEZ MANDAMENTOS

Êxodo 20.1-17
_Vítor Olivier_
```

A referência usa a forma do impresso (`Êxodo 20.1-17`, livro por extenso), que
**não** é a forma abreviada de § 1.4 — aquela vale para o aparato dos textos
confessionais, não para este cabeçalho.

### 6.3 Refrão

34 dos 97 hinos têm refrão, marcado conforme § 5.3.1: 9, 13, 14, 19, 23, 37,
40, 43, 44, 50, 52, 54, 56, 57, 58, 60, 61, 62, 63, 65, 68, 70, 71, 72, 76, 77,
80, 81, 83, 84, 87, 88, 94, 96.

### 6.4 Fecho litúrgico

12 hinos encerram com `_Amém._` em bloco próprio, conforme § 5.3.2: 21, 22, 24,
40, 41, 42, 45, 47, 59, 64, 80, 90. O hino **64** é o único sem ponto (`_Amém_`).

Não confundir com os hinos em que "Amém" é letra e não fecho — 5, 7, 16, 25,
35, 39, 63 e 97 —, que não levam marcação.

### 6.5 Versículos

Só os cânticos de textos bíblicos (hinos **1 a 5**) trazem `<sup>N</sup>`, com
as regras de § 5.4. Os demais 92 hinos não têm numeração de versículo: são
composições, não versificação de um texto bíblico.

### 6.6 Hinos sem número de estrofe

Cinco hinos — **16, 25, 26, 30 e 97** — não trazem número de estrofe no
impresso, por serem doxologias ou peças curtas de uma estrofe só (*Glória seja
ao Pai*, *Santo, santo, santo*, *Justo é o Senhor*, *A Deus supremo benfeitor*,
*Amém tríplice*). Recebem `**1**` mesmo assim, para que toda unidade tenha ao
menos uma estrofe. **Não** são caso de estrofe perdida na conversão.

### 6.7 Modelo completo

```markdown
# CHAMADO À ADORAÇÃO

## 9. VAMOS NÓS LOUVAR A DEUS!

_Manuel Avelino de Souza_

**1**
Vamos nós louvar a Deus!
Vamos! Vamos!

>Exaltado seja nosso Deus e Pai!
>Exaltado! Para sempre o exaltai!

**2**
Nosso Deus, eterno Pai,
Santo, Santo,
```

---

## 7. Resumo das diferenças

### 7.1 Entre os textos confessionais

| Aspecto | Heidelberg | Belga | Dort |
| --- | --- | --- | --- |
| Divisão maior | `# ~ PARTE N ~ …` + seções temáticas | — | `# ~ … CAPÍTULO … ~ …` |
| Agrupamento | `## DIA DO SENHOR N` | — | — |
| Unidade | `### P.N. Pergunta?` | `## ARTIGO N` + `### Título` | `## ARTIGO N` + `### Título` |
| Numeração da unidade | Contínua (1–129) | Contínua (1–37) | Reinicia por capítulo |
| Abertura do corpo | `R. ` | — | — |
| Marcador `<sup>N</sup>` | Sim | Sim | Não |
| Bloco de referências | Lista numerada | Lista numerada | Parágrafo único |
| Negrito | Não | Não | Só `**Erro N**` / `**Refutação**` |
| Seção final | — | — | `## REJEIÇÃO DE ERROS` por capítulo, `# CONCLUSÃO` |

### 7.2 Entre as duas famílias

| Aspecto | Textos confessionais | Textos cantados |
| --- | --- | --- |
| Linha física | Um parágrafo por linha | Uma **linha cantada** por linha |
| Quebra de linha | Apresentação, a cargo do editor | Conteúdo, significativa |
| Subdivisão da unidade | Parágrafo | Estrofe, aberta por `**N**` |
| `<sup>N</sup>` | Chave de nota, **depois** da pontuação | Versículo bíblico, **antes** do trecho |
| Numeração do marcador | Reinicia a cada unidade | Segue o texto bíblico |
| Intervalo no marcador | Não ocorre | `<sup>4-5</sup>` |
| Bloco de referências | Fecha a unidade | Não existe |
| Sublinhado | Só itálico | Itálico **e** elisão (escapada) |
| Negrito | Só Dort (`**Erro N**`) | Número de estrofe |
| Citação em bloco | Não ocorre | Refrão (`>`) |
| Itálico em bloco isolado | Não ocorre | Atribuição e fecho (`_Amém._`) |

### 7.3 Entre os dois textos cantados

| Aspecto | Salmos | Hinos |
| --- | --- | --- |
| Agrupamento | — (sequência plana) | `#` por seção litúrgica (16) |
| Unidade | `## SALMO 1A` (283) | `## 9. TÍTULO` (97) |
| Título na unidade | Só a designação | Número **e** título |
| Numeração | Do saltério, com variante `A`/`B` | Contínua 1–97, atravessa as seções |
| Referência bíblica no cabeçalho | Não | Só nos hinos 1–6 |
| `<sup>N</sup>` de versículo | Em todos | Só nos hinos 1–5 |
| Refrão | Nenhum | 34 |
| Fecho `_Amém._` | Nenhum | 12 |
| Elisão `\_` | 5.999 | Nenhuma |

---

## 8. Desvios conhecidos

Pontos em que os arquivos ainda não seguem esta especificação. São dívidas
registradas, não alternativas aceitáveis.

> **O inventário executável vive em `ferramentas/pendencias-confissoes.txt`.**
> Esta seção descreve as classes de desvio e o que já se sabe sobre cada uma;
> o arquivo lista as 13 ocorrências, uma por linha, e o
> `ferramentas/validar_confissoes.py` reprova qualquer desvio **novo**. Prosa e
> registro podem divergir — o registro é que é verificado.

### 8.1 Formato

- **Salmos, 79A:** a linha `\- Quão grandioso\_és tu! \-` traz o hífen inicial
  escapado para não virar item de lista. É o único caso; se aparecerem outros,
  a convenção precisa entrar em § 1.1.
- **Heidelberg:** a maioria dos títulos de pergunta traz dois espaços após
  `###` (`###  P.1.`) em vez de um; é indiferente para a renderização, mas não
  é uniforme. As perguntas 68, 74 e 124 usavam `##` em vez de `###` e o
  `DIA DO SENHOR 26` tinha espaço extra: **corrigidos** em 2026-08-02.
- **Heidelberg, P.23:** o bloco do Credo mistura numeração romana solta
  (`I .`, `II .`) com a lista ordenada de 12 itens; precisa de uma decisão de
  forma.

### 8.2 Texto (pendente de revisão de conteúdo)

As duas primeiras entradas são **divergências propositais** entre o Markdown e
o PDF: o arquivo está certo, a fonte está errada. Qualquer regeração a partir do
PDF reintroduz o erro — reaplique-as.

- **Salmos, 145A:** o último versículo vem impresso como `12` onde deveria ser
  `21` (*"Profira a minha boca os seus louvores"*, Sl 145.21) — dígitos
  transpostos na fonte. **Já corrigido no arquivo** para `<sup>21</sup>`.
- **Hinos, 1:** o impresso numera `… 14, 15, 15, 16`, repetindo o versículo 15 e
  parando em 16, embora o cabeçalho declare `Êxodo 20.1-17`. O segundo `15`
  (*"Contra o teu próximo não digas mentiras"*) é Êx 20.16, e o `16`
  (*"E não cobice"*) é Êx 20.17. **Já corrigido no arquivo** para `15, 16, 17`.
- **Confissão Belga:** marcador ausente no corpo, embora a referência exista no
  bloco — art. 7 (nota 5), 16 (6), 21 (9), 26 (1 e 5), 30 (5), 37 (3 e 14).
- **Confissão Belga, art. 23: CORRIGIDO** (2026-07-27). A quebra de página 36
  do PDF transpôs um bloco para o fim do artigo, partindo `mesmos` em `mes` e
  `mos` e deixando `(Sl 143.2)` colado à metade errada. O bloco foi devolvido
  ao lugar e a palavra recolada; nenhuma outra palavra mudou, e o arquivo tem
  exatamente o mesmo número de caracteres. A leitura foi conferida contra o PDF
  e é corroborada pelo aparato: a nota 8 (Lc 16.15; Fp 3.4-9) trata da
  autoconfiança e por isso fecha a frase de `nós mesmos`, não a citação de Davi.
- **Confissão Belga, art. 26:** § 8.2 registrava colunas entrelaçadas também
  aqui. Uma varredura de todo o documento contra o PDF — alinhamento palavra a
  palavra, procurando blocos de prosa presentes num lado e ausentes no outro —
  **não achou nada** no art. 26 nem em nenhum outro. O art. 23 era o único.
  O que resta no art. 26 é marcador de nota ausente, já listado acima.
- **Confissão Belga, art. 8:** `Jo 5.1726` — versículo improvável, dígitos
  colados. A leitura provável é `5.17-26` (mesmo livro em continuação, como
  `Jo 1.14; 5.17-26`), mas por tocar em *quais* versículos são citados fica
  **pendente de confirmação editorial**, não aplicada. As demais referências
  malformadas da Belga (`Jd .8`, `2Jo .8`, `2Jo .9`, `Jd .15`) foram
  **corrigidas** em 2026-08-22 — ver § 8.3.
- **Heidelberg:** `SE NHOR` e `SENHOR` alternam no mesmo documento (P.92 e
  seguintes).

### 8.3 Aparato de referências (levantado pelo validador)

Classes encontradas por `ferramentas/validar_confissoes.py` — desvios de
**forma** em relação a § 1.4 e § 1.6, não afirmações sobre o conteúdo. As
ocorrências estão em `ferramentas/pendencias-confissoes.txt`.

Em 2026-08-22 um lote de forma fechou a maior parte destas classes, todas de
correção segura (não tocam em prosa nem em quais versículos são citados):

- **Dois-pontos no lugar do ponto** (`Ap 22:18` etc.) — **resolvido.**
- **Entrada sem ponto final** — **resolvido**, junto das quebras abaixo.
- **Espaço antes do versículo em livro de capítulo único** (`Jd .8`, `2Jo .9`)
  — **resolvido** para `Jd 8`, `2Jo 9`; é a forma do próprio corpus (`Jd 20`,
  `Jd 24`).
- **Sigla colada ao capítulo** (`Rm1.16`, `Jo17.24`, `Rm10.10`) — **resolvido.**
- **Espaço dentro da sigla** (`2 Sm`, `2 Tm`, `1 Jo`) — **resolvido**; § 1.4
  escreve `1Co`, e a lista canônica traz `2Sm`, `2Tm`, `1Jo`.
- **Duas chaves na mesma linha** — o caso mais grave, porque a segunda chave
  some do aparato. As oito ocorrências foram quebradas em uma chave por linha,
  **exceto P.30** (adiante). Separá-las expôs chaves antes escondidas: a maioria
  casou com o marcador do corpo (resolvendo `marcador-sem-chave`); o P.117
  revelou uma chave sem marcador — abaixo.
- **Sigla divergente do corpus** — o Heidelberg escrevia `Ex` (13×) e `Fl` (9×)
  onde o impresso escreve `Êx` e `Fp`. **Normalizado** para `Êx`/`Fp`. Não era
  decisão em aberto: § 1.4 registrou em 2026-07-27 a convenção da edição
  impressa, e `Êx` é forma **atestada** 19× no PDF, nunca `Ex`; a Belga e Dort já
  seguiam, o Heidelberg era o único que destoava. O `1Cor` isolado da Belga
  (art. 11) já fora corrigido antes.

Restam duas classes, que **não** são de correção automática — dependem de
conferência contra o impresso, não de normalização:

- **Chave sem marcador no corpo** (10) — a referência existe no bloco, mas falta
  o `<sup>N</sup>` no texto: Belga art. 7, 16, 21, 26, 30, 37 (detalhe das notas
  em § 8.2); Heidelberg P.25, P.47, P.63, P.117. Exige localizar **onde** o
  marcador entra — revisão de conteúdo.
- **Heidelberg P.30, bloco embaralhado** — `1. 1Co 1.12, 13; Gl 5.4 2. Cl 1.19,
  20;` com o rótulo `2.` repetido na linha seguinte. A leitura provável é
  `2. Cl 1.19, 20; 2.10; 1Jo 1.7.` (o `2.10` continua Colossenses), mas fundir e
  descartar o rótulo repetido é decisão de estrutura, não quebra mecânica.

### 8.4 Resíduo de diagramação

- **Linha em branco dupla** (2 em Dort, 1 no Heidelberg) e **espaço no fim de
  linha** (1 no Heidelberg): **corrigidos** em 2026-08-02.
- **Espaços múltiplos internos** — 927 na Belga, 977 em Dort, 569 no
  Heidelberg. **Não são desvio**: § 1.1 manda preservá-los. Ficam registrados
  aqui só para que o conversor decida explicitamente o que fazer com eles ao
  emitir JSON, em vez de decidir por omissão.

### 8.6 Correções de digitalização declaradas

Em 2026-08-02, a leitura linha a linha dos cinco textos (`docs/ACHADOS.md`)
fechou 193 defeitos mecânicos. Os que tocam os textos **cantados** fazem o
Markdown divergir do impresso, e por isso são declarados no `validar.py`, não
absorvidos por uma regeneração do digest:

- `DIVERGENCIAS` — numeração de versículo. Além do 145A já registrado em § 8.2,
  entraram `36A` (o impresso traz `10` duas vezes; a primeira é o v. 9) e `96A`
  (traz `3` duas vezes; a primeira é o v. 2).
- `CORRECOES_LEXICAS` — palavras. `Juda`→`Judá`, `tiro`→`Tiro`, `Cão`→`Cam`,
  `Ihes`→`lhes`, `Prostou`→`Prostrou`, `opróbio`→`opróbrio` e mais 15 pares,
  além da anotação editorial `Sem proposta de mudança` que o hino 95 carregava
  como se fosse letra.

O digest continua sendo retrato fiel do PDF: a correção é somada aos dois lados
da comparação. Reverter qualquer uma delas no Markdown **quebra** o validador —
é assim que a divergência se mantém honesta em vez de virar dívida silenciosa.

Nos textos **confessionais** não há PDF versionado nem digest, então as
correções aparecem só no diff. O registro em
`ferramentas/pendencias-confissoes.txt` caiu de 71 para 51 ocorrências, e Dort
zerou.

### 8.5 O PDF não é a fonte de verdade destes arquivos

O `fontes/As Tres Formas de Unidade - Nova Edicao 2018.pdf` (não versionado)
**não** está para as confissões como os PDFs dos salmos e hinos estão para os
textos cantados. Alinhando a Confissão Belga inteira, palavra por palavra:

| | |
| --- | --- |
| PDF | 9.642 palavras |
| Markdown | 8.629 palavras |
| sem correspondência | ~5% |

A diferença não é ruído de extração; é revisão editorial deliberada e
sistemática — `Antigo Testamento` → `Velho Testamento`, singular → plural
(`nossa consciência` → `nossas consciências`), `Essa` → `Esta`, e a
capitalização reverencial (`nele` → `nEle`).

Consequências práticas:

- o PDF **serve** para arbitrar uma passagem específica, e foi assim que a
  transposição do art. 23 se resolveu sem ambiguidade;
- o PDF **não serve** como corretor mecânico nem como lado direito de uma
  checagem de integridade léxica ao estilo de `ferramentas/validar.py`. Um
  digest dele acusaria centenas de divergências, quase todas propositais.

Por isso `validar_confissoes.py` confere estrutura e não texto — a decisão
é essa, não uma limitação a superar.
