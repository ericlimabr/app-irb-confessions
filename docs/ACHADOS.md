# Achados da leitura linha a linha

Leitura integral e manual dos cinco textos-fonte, conferidos contra
`docs/FORMATO.md`. Feita em 2026-08-02, sobre 21.764 linhas.

**Itens ~~riscados~~ já foram corrigidos** — 193 correções mecânicas aplicadas
em 2026-08-02, sob revisão editorial. O que continua de pé exige decisão de
quem edita: ou porque a leitura certa não é única, ou porque a convenção ainda
não foi escolhida.

O critério da correção foi estreito de propósito: só entrou o que tinha
**resposta única** — o caractere presente estava errado, ou a variante irmã do
mesmo texto dava a forma exata. Ficaram de fora aspas, `Fl`/`Fp`, maiúscula
reverencial, ortografia pré-1990, elisões, e toda referência bíblica que
precisa de conferência contra o impresso.

As correções que afastam o Markdown do impresso estão **declaradas** em
`ferramentas/validar.py` (`DIVERGENCIAS` e `CORRECOES_LEXICAS`) e descritas em
`docs/FORMATO.md` § 8.6. Reverter qualquer uma delas quebra o validador.

Ver também `docs/FORMATO.md` § 8 e `ferramentas/pendencias-confissoes.txt`, que
caiu de 71 para 51 ocorrências.

Os números de linha valem para o estado dos arquivos **antes** das correções.

## Decisões pendentes

Cada decisão abaixo destrava um lote de correções que hoje estão paradas.
**Marque uma opção por decisão** trocando `[ ]` por `[x]`; eu aplico o lote e
escrevo a regra no `docs/FORMATO.md`.

Onde o próprio repositório já implica uma resposta, ela vem marcada
**← recomendado**. Onde é escolha sua, não há recomendação.

As decisões que não são convenção, e sim leitura de um trecho específico
("o que este verso queria dizer?"), estão em `docs/LEITURAS.md`.

---

### D0 · A regra de desempate

Governa D5, D6, D12 e boa parte de `LEITURAS.md`. Quando o impresso traz uma
forma que o português não admite, o que vale?

O `README.md` diz para não corrigir por conta própria; as 193 correções de
2026-08-02 foram feitas sob sua autorização. Falta transformar isso em regra.

- [ ] **D0a** Corrigir erro mecânico (grafia, concordância, digitação), preservar escolha de estilo e de época ← recomendado
- [ ] **D0b** Preservar tudo do impresso; só registrar
- [ ] **D0c** Corrigir tudo que o português atual condena, inclusive estilo
- [ ] **D0d** Outra: ______________________

### D1 · Aspas de citação

**Destrava** 7 pares · **Onde** § 8 · A convenção já existe de facto.

Confessionais: 326 aspas retas, **zero** curvas. Cantados: 150 curvas. Sobram
7 pares retos nos Salmos 3A, 31A, 87B, 89B, 110B, 120B e 132B.

- [ ] **D1a** Confirmar a regra por família; trocar os 7 pares por curvas ← recomendado
- [ ] **D1b** Retas em todo o corpus (mexe em 150 nos cantados)
- [ ] **D1c** Curvas em todo o corpus (mexe em 326 nos confessionais)
- [ ] **D1d** Registrar as duas como aceitas em § 1.3

### D2 · Ponto dentro ou fora das aspas

**Destrava** ~6 · **Onde** § 7.3, § 8

Hoje há as três formas: `…assim."`, `…assim".` e, no 122B, `…assim.".`

- [ ] **D2a** Ponto dentro quando a citação é frase completa; fora quando é fragmento ← recomendado
- [ ] **D2b** Sempre dentro
- [ ] **D2c** Sempre fora

### D3 · Sigla de Filipenses: `Fl` ou `Fp`

**Destrava** 9 · **Onde** § 5.4

O § 1.4 já decidiu `Fp` (edição impressa, 37 ocorrências no PDF). O Heidelberg
usa as duas: `Fp` 5 vezes, `Fl` 9. Mas o Heidelberg foi revisado à mão por
você contra o impresso — então talvez `Fl` seja escolha, não descuido.

- [ ] **D3a** Aplicar § 1.4: uniformizar para `Fp` ← recomendado
- [ ] **D3b** Manter `Fl` no Heidelberg e abrir exceção em § 1.4
- [ ] **D3c** Uniformizar para `Fl` em todo o corpus (revoga § 1.4)

### D4 · Espaço dentro da sigla

**Destrava** 4 · **Onde** § 5.4

`2 Sm`, `2 Tm`, `1 Jo` no Heidelberg, ao lado de `1Sm`, `2Tm`, `1Jo`. O § 1.4
escreve `1Co`, sem espaço.

- [ ] **D4a** Uniformizar para sem espaço ← recomendado
- [ ] **D4b** Deixar como está

### D5 · `SE NHOR` ou `SENHOR`

**Destrava** 9 · **Onde** § 8

`SENHOR` aparece 67 vezes, `SE NHOR` 9. O espaço vem da renderização em
versalete no PDF — não é palavra.

- [ ] **D5a** Uniformizar para `SENHOR` ← recomendado
- [ ] **D5b** Preservar `SE NHOR` onde o impresso traz

### D6 · Ortografia pré-1990

**Destrava** 9 · **Onde** § 3.3

`estória`, `não-criada`, `auto-exame`, `co-eterno`, `tão-somente` (5×). Depende
de D0.

- [ ] **D6a** Preservar: são documentos históricos ← recomendado
- [ ] **D6b** Atualizar para o Acordo de 1990
- [ ] **D6c** Preservar nas confissões, atualizar nos cantados

### D7 · Reticências

**Destrava** 7 · **Onde** § 8

Convivem `…` (3), `...` (2) e `....` (2).

- [ ] **D7a** Sempre `…` ← recomendado
- [ ] **D7b** Sempre `...`

### D8 · Travessão curto `–`

**Destrava** 2 · **Onde** § 8

Só o Salmo 45A usa `–`. O resto dos cantados usa `-`; Dort usa `—` nos rótulos
de erro (§ 4.4).

- [ ] **D8a** Trocar os 2 por `-`, como no resto dos cantados ← recomendado
- [ ] **D8b** Trocar por `—`
- [ ] **D8c** Deixar

### D9 · Sufixo de versículo `a`/`b`

**Destrava** 4 · **Onde** § 3.2

`Ap 1.5b`, `Jo 10.10b`, `Rm 13.4a`, `Ap 14.7a` na Belga. O § 1.4 não prevê,
mas o sufixo carrega informação real (metade do versículo).

- [ ] **D9a** Admitir na spec: acrescentar a `Rm 13.4a` aos exemplos do § 1.4 ← recomendado
- [ ] **D9b** Remover os sufixos

### D10 · Referência entre parênteses dentro da chave

**Destrava** 7 · **Onde** § 5.2

`Sl 45.7 (Hb 1.9)` no Heidelberg: a primeira é o texto, a segunda é onde o
Novo Testamento o cita. O § 1.6 não prevê.

- [ ] **D10a** Admitir na spec como "referência de citação" ← recomendado
- [ ] **D10b** Converter para `;`, perdendo a distinção
- [ ] **D10c** Remover as segundas

### D11 · Rótulo de autoria desconhecida

**Destrava** 3 · **Onde** § 7.4

`_autor desconhecido_` 23 vezes, `_Autor desconhecido_` 3 (nos hinos).

- [ ] **D11a** Minúscula em todos ← recomendado
- [ ] **D11b** Maiúscula em todos

### D12 · Pontuação final de estrofe

**Destrava** 28 · **Onde** § 7.3

28 estrofes terminam sem `.`, `!` ou `?`, enquanto as irmãs terminam. Pode ser
enjambement deliberado. Depende de D0.

- [ ] **D12a** Acrescentar ponto onde as estrofes irmãs o têm
- [ ] **D12b** Deixar: a quebra pode ser sintática
- [ ] **D12c** Caso a caso — abro uma lista em `LEITURAS.md`

### D13 · Elisão inconsistente na mesma unidade

**Destrava** 71 casos em 47 variantes · **Onde** § 7.2

Medi o corpus inteiro: 384 pares de palavras aparecem elididos **e** soltos,
1.064 vezes. Isso não é descuido — a elisão é instrução de canto e depende da
melodia, então o mesmo par legitimamente elide num salmo e não noutro.
Estreitando para a **mesma variante**, sobram 71 casos em 47 variantes; mesmo
esses podem ser legítimos, porque linhas diferentes da mesma melodia têm
contagens silábicas diferentes.

- [ ] **D13a** Não normalizar; registrar em § 5.5 que a elisão é métrica, não ortográfica ← recomendado
- [ ] **D13b** Uniformizar dentro de cada variante pela forma majoritária
- [ ] **D13c** Conferir os 71 contra a partitura (trabalho manual seu)

### D14 · Elisão fora da regra do § 5.5

**Destrava** 4 · **Onde** § 7.2

`o\_seu`, `todos\_os`, `Não\_te`, `Jogados\_os` juntam consoante com vogal, o
que não é sinalefa. Ou o `\_` está errado, ou o § 5.5 está incompleto.

- [ ] **D14a** Remover os 4 `\_`
- [ ] **D14b** Conferir contra a partitura antes de mexer
- [ ] **D14c** Ampliar o § 5.5 para cobrir ligação entre consoante e vogal

### D15 · Capitalização dos nomes de melodia

**Destrava** 36 · **Onde** § 7.4

Dos 90 nomes, 54 são de uma palavra. Dos 36 restantes, 20 estão em Title Case
(`All The Way`, `A La Nanita Nana`) e 16 em frase (`Peace, be still`,
`What Wondrous Love is This`, `Come near me, o my savior`).

- [ ] **D15a** Reproduzir a grafia da fonte de cada melodia, caso a caso ← recomendado
- [ ] **D15b** Title Case em todos
- [ ] **D15c** Só a inicial maiúscula em todos

### D16 · Maiúscula reverencial

**Destrava** ~7 · **Onde** § 4.3, § 6.3

Dort tem `ele deixa`, `o Seu filho unigênito`, `seu salvador`, `lhe pertencem`
em minúscula, ao lado de `Ele`, `Filho`, `Salvador`, `Lhe`. Nos hinos,
`filho` minúsculo 3 vezes contra `Filho` 16.

Lembrete: § 8.5 mostrou que a capitalização reverencial é **revisão editorial
deliberada** do Markdown em relação ao PDF (`nele`→`nEle`, `Sua` 43×). Então
estas minúsculas podem ser pontos que a revisão não alcançou.

- [ ] **D16a** Uniformizar para maiúscula, completando a revisão já iniciada ← recomendado
- [ ] **D16b** Preservar a forma do impresso caso a caso
- [ ] **D16c** Uniformizar para minúscula

---

## Como ler

Três níveis, usados no texto todo:

- **grave** — muda o sentido ou perde texto. Nenhum leitor reconstrói sozinho.
- **forma** — desvio declarado de uma seção do `FORMATO.md`.
- **revisar** — suspeita; precisa de decisão editorial ou conferência contra o
  impresso.

## Panorama

| Documento | Linhas | Graves | O que mais pesa |
| --- | --- | --- | --- |
| A Confissão Belga | 570 | 1 | Asterisco como chamada de nota no art. 36; ~20 referências malformadas |
| Os Cânones de Dort | 655 | 3 | Dois parágrafos partidos ao meio e uma referência perdida |
| O Catecismo de Heidelberg | 1.379 | 6 | Três trechos embaralhados e três marcadores sem a tag `<sup>` |
| Hinos - letras | 3.213 | 2 | Anotação editorial virou letra; fronteira de seção deslocada em dois hinos |
| Salmos - letras | 15.947 | 2 | Caractere de elisão errado; palavra partida entre duas linhas cantadas |

Os 14 achados graves estão nas seções 1 e 2, porque atravessam documentos e têm
uma causa comum: a extração do PDF.

---

## 1. Texto embaralhado ou perdido

A mesma classe do artigo 23 da Belga, já corrigido: colunas do impresso que se
interpolaram na extração. São os únicos achados que alteram o sentido.

### Heidelberg, P.14 — linha 142 — **grave** — **CORRIGIDO**

Duas frases fundidas, com um pedaço de palavra da resposta anterior no meio:

```
…não há criatura que possa suportar o peso da ira eterna de cado que
o homem cometeu. Deus contra o pecado, nem libertar outros dessa ira.
```

Leitura: "…da ira eterna de Deus contra o pecado, nem libertar outros dessa
ira." O fragmento `cado que o homem cometeu.` é o rabo de `pe-cado`, vindo do
parágrafo anterior da mesma pergunta.

### Heidelberg, P.85 — linhas 880-882 — **grave**

Dois parágrafos inteiros interpolados um no outro:

```
…serão proibidos presbíteros e do reino de Cristo pelo próprio Deus.
Serão novamente recebidos como membros de Cristo e da igreja quande
participar dos sacramentos e excluídos da congregação cristã pelos do
prometerem e demonstrarem arrependimento real.
```

E `quande` → `quando`.

### Heidelberg, P.85 — linha 878 — **grave** — **CORRIGIDO**

Hifenização de quebra de linha do PDF que ficou no texto: `devem ser de-
nunciados à igreja`.

### Heidelberg, P.87 — linha 904 — **grave** — **CORRIGIDO**

Sobra colada do parágrafo seguinte: `R. Não, de modo nenhum. do céu.`

### Dort, cap. II, Refutação 1 — linhas 269-271 — **grave** — **CORRIGIDO**

Parágrafo partido ao meio, contra § 1.1. A frase termina em `E o profeta`, vem
uma linha em branco, e recomeça em `Isaías, referindo-se ao Salvador, diz:`.

### Dort, cap. III/IV, Refutação 7 — linhas 465-467 — **grave** — **CORRIGIDO**

Mesma quebra: o parágrafo encerra em `:` e a citação _"Dar-vos-ei coração
novo…"_ vira bloco separado.

### Dort, cap. III/IV, Refutação 3 — linha 449 — **grave**

Referência bíblica perdida na extração:

```
E contrário ao que Paulo escreveu em : _"entre os quais…"_
```

Sumiu o nome do livro depois de `em`, e sobrou espaço antes dos dois-pontos. A
citação é Ef 2.3.

### Hinos, hino 95 — linha 3187 — **grave** — **CORRIGIDO**

Anotação editorial do original entrou como linha cantada: a estrofe 6 termina
em `Sem proposta de mudança`.

---

## 2. Marcação quebrada

Defeitos que o conversor encontra antes do leitor.

### Heidelberg — linhas 423, 501, 1084 — **grave** — **CORRIGIDO**

Marcador de nota que perdeu a tag `<sup>` e virou dígito solto no corpo:

```
P.40   …senão pela morte do Filho de Deus. 2
P.49   …e não as que são da terra. 4
P.104  …instrução e disciplina 1 e que também seja paciente com as suas
       fraquezas e defeitos, 2 pois é a vontade de Deus nos governar
       pelas mãos deles. 3
```

### Hinos — linha 630 (índice em 19-27) — **grave** — **CORRIGIDO**

Fronteira de seção litúrgica deslocada. O índice e o § 6.1 põem os hinos 9 a 15
em `CHAMADO À ADORAÇÃO`; no corpo, `# LOUVOR E ADORAÇÃO` vem **antes do hino
14**. Dois hinos na seção errada.

### Salmo 100B — linhas 10197 e 10212 — **grave** — **CORRIGIDO**

A elisão está marcada com **U+035C** (combining double breve below) em vez do
`\_` que o § 5.5 estabelece:

```
E ͜ apresentai-vos com louvor.
Porque ͜ o Senhor bondoso é;
```

São as duas únicas ocorrências do caractere em todo o corpus.

### Salmo 105B — linhas 11074-11075 — **grave**

Palavra partida entre duas linhas físicas, contra o § 5.3 (a linha cantada *é*
a linha física):

```
Cantai-lhe salmos, gloriai-
Vos no seu nome e buscai
```

### Salmo 12B — linhas 1160-1188 — **forma**

Não tem nenhum `<sup>N</sup>`, embora o § 7.3 diga que a numeração de versículo
aparece em *todos* os salmos. O 12A tem.

### Marcador de versículo duplicado — **forma**

- Salmo 36A, linhas 3538 e 3543 — `<sup>10</sup>` duas vezes; o primeiro é o
  v. 9 (*"Porque está em ti, Senhor, / Da vida o manancial"*).
- Salmo 96A, linhas 9891 e 9896 — `<sup>3</sup>` duas vezes; o primeiro é o v. 2.
- Salmo 143A, linhas 15266 e 15269 — `<sup>11</sup>` duas vezes.

### Marcador de versículo ausente — **forma**

Salmo 50A (falta o 17; o 50B traz), Salmo 26A (falta o 3), Salmo 78A (falta o 6).

### Marcadores que se sobrepõem — **forma**

Salmo 90A (`4`, depois `4-5`, depois `5`), Salmo 105A (`14` seguido de `14-15`),
Salmo 132B (`13-15` seguido de `15`).

### Salmo 108A — linha 11569 — **forma**

Abre aspas e nunca fecha: `Disse: "me regozijarei,` — a estrofe termina e a
seguinte segue sem aspas. O 60A traz o mesmo texto sem aspas nenhuma.

### Belga, art. 36 — linha 533 — **forma**

Asterisco como chamada de nota, contra o § 1.2 (nunca asteriscos) e o § 1.5 (o
marcador é `<sup>N</sup>`). O texto da nota está colado no fim do mesmo
parágrafo:

```
…para que * o reino de Cristo possa vir…
…entre os homens. * As palavras a seguir foram eliminadas nesse ponto,
em 1905, pelo Sínodo Geral…
```

---

## 3. A Confissão Belga

### 3.1 Palavras erradas — **forma**

| Onde | Linha | Achado |
| --- | --- | --- |
| art. 6 | 80 | ~~`aos livro de Ester` → `aos livros`~~ |
| art. 6 | 82 | ~~`muitos menos podem diminuir` → `muito menos`~~ |
| art. 7 | 88 | ~~`as boasvindas` → `boas-vindas`~~ |
| art. 8, título | 99 | ~~`distincto em três pessoas` → `distinto`~~ |
| art. 8 | 101 | ~~`não está divido em três` → `dividido`; `não é o Pai nem, o Filho` (vírgula solta)~~ |
| art. 9 | 114 | ~~`os mulçumanos` → `muçulmanos`~~ |
| art. 13 | 160 | ~~`guardando as Sua criaturas` → `as Suas`; `de tal modo que … que nem mesmo` (`que` duplicado)~~ |
| art. 19 | 242 | ~~`mantém as sua características` → `as suas`~~ |
| art. 20 | 256 | ~~`imortalidade e vida eternal` → `vida eterna`~~ |
| art. 22 | 287 | ~~`com se a própria fé` → `como se`~~ |
| art. 23 | 300 | ~~`e, nos conceder a ousadia` (vírgula solta)~~ |
| art. 26 | 346 | ~~`compadecerse` → `compadecer-se`; `Pois Ele , subsistindo` (espaço antes da vírgula); `dever <sup>7</sup> .` (marcador antes do ponto)~~ |
| art. 28 | 390 | ~~`dos remidos e, que fora dela` (vírgula solta)~~ |
| art. 29 | 410 | ~~`pois todas seitas que há hoje` → `todas as seitas`~~ |
| art. 32 | 462 | ~~`embora seja util e bom` → `útil`; `os governantes da Igreja entre  se  estabeleçam` → provavelmente `entre si estabeleçam`~~ |
| art. 34 | 485 | ~~`separados de todos as outras pessoas` → `todas as outras`~~ |
| art. 35 | 508 | ~~`testifica que tão realmente que tomamos` (`que` duplicado); `do Seu corpo e, o vinho` (vírgula solta)~~ |
| art. 36 | 533 | ~~`condição ou classse` → `classe`; `para que _"para que vivamos…"_` (duplicado); marcador `<sup>5</sup>` no meio da oração~~ |
| art. 37 | 547-551 | ~~`juizo` e `juizes` → `juízo`, `juízes`; `mal-feitores` → `malfeitores`; `Vem, Senhor Jesus !` (espaço antes do `!`); marcador `<sup>1</sup>` no meio da oração~~ |

### 3.2 Referências bíblicas — **forma**

- ~~**`l` minúsculo por `1`**, resíduo de OCR: `lCo 2.10` e `1Cor 3:16` (art. 11~~
  n. 2), `lTm 4.3` (art. 12 n. 1), `lPe 5.8` (art. 12 n. 4), `lTm 6.20`
  (art. 29 n. 7).
- ~~**`L` maiúsculo**: `CL 1.18` e `GL 5.17` (art. 29 n. 8 e 13) → `Cl`, `Gl`.~~
- ~~**Hífen perdido**: `Mt 18.1517` (art. 29 n. 5) → `18.15-17`. É a mesma classe~~
  do `Jo 5.1726` já registrado no § 8.2 do `FORMATO.md`, mas este **não está**
  no registro.
- ~~**Dois-pontos**: `Ap 22:18` (art. 7), `Mt 3:16` (art. 9), `Cl 1:16` (art. 10),~~
  `1Cor 3:16` (art. 11).
- ~~**Ponto no lugar de ponto e vírgula**: `Jo 10.29. Jo 17. 2` (art. 16),~~
  `1Co 1.30, 31. 1Co 4.7` (art. 24), `1Co 6.11. Ef 5.26` (art. 34).
- ~~**Espaço depois do ponto**: `Jo 17. 2` (art. 16), `Gn 17. 10-12` (art. 34),~~
  `Hb 11. 39` e `Dn 12. 2` (art. 37).
- ~~**Vírgula sem espaço**: `1Co 8.4,6` (art. 1), `Jd 20,21` e `Ap 1.4,5`~~
  (art. 9), `At 4.27,28` (art. 13), `Fp 2.6,7` e `At 1.3,11` (art. 19).
- **Sufixo de versículo** `a`/`b` — `Ap 1.5b`, `Jo 10.10b`, `Rm 13.4a`,
  `Ap 14.7a`: o § 1.4 não prevê. Precisa entrar na spec ou sair do texto.
  (**revisar**)

### 3.3 Suspeitas de conteúdo — **revisar**

- art. 7, linha 88 — _"provai os espíritos se procedem de Deus"_ atribuído a
  `1Jo 4.21`. O texto é 1Jo 4.1.
- art. 9, linha 114 — `No livro de Gênesis 1.27 e 26`, com a ordem invertida.
- art. 35, linha 510 — `(1Co 10.28, 29)`. O texto é 1Co 11.28, 29.
- art. 37, linha 551 — `Vem, Senhor Jesus! (Ap 22.10)`. O texto é Ap 22.20. E
  `(Mt 10.32) e dos anjos eleitos (Mt 10.32)`, com a mesma referência duas vezes.
- **Crase indevida**: `Àquele a quem chamam de Deus… existia` (art. 10),
  `contraria à ordenança` (art. 28), `fraqueza à qual combatem` (art. 29),
  `almeja à vida eterna` (art. 34).
- **Ortografia pré-1990**: `estória` (art. 6), `não-criada` (art. 19),
  `auto-exame` (art. 35), `tão-somente` (art. 37). Provavelmente deliberado —
  vale registrar a decisão.

---

## 4. Os Cânones de Dort

Além dos três achados graves da seção 1.

### 4.1 Palavras erradas — **forma**

| Onde | Linha | Achado |
| --- | --- | --- |
| I, art. 7 | 57 | ~~`chamá-los e trazêlos` → `trazê-los`~~ |
| I, art. 14 | 113 | ~~`para qual ela foi` → `para a qual`~~ |
| I, art. 16 | 129 | ~~`não apagará o pavil que fumega` → `pavio`~~ |
| I, Erro 2 | 157 | ~~`uma eleição para a fé e, uma outra` (vírgula solta)~~ |
| I, Erro 6 | 173 | ~~`Alguns dos eleitos podem e até mesmo perecem eternamente` (frase truncada)~~ |
| I, Refutação 4 | 167 | ~~`choca-se diretamente com ensinamento` → `com o ensinamento`~~ |
| II, art. 6 | 235 | ~~`haver alguma defeito` → `algum defeito`~~ |
| II, Erro 1 | 267 | ~~`em todas as sua partes` → `todas as suas`~~ |
| II, Erro 4 | 281 | ~~`Deus o Pai fez com homem` → `com o homem`~~ |
| III/IV, art. 6 | 343 | ~~`tanto na antiga quanto da nova dispensação` → `quanto na nova`~~ |
| III/IV, art. 15 | 415 | ~~`chama à existência às coisas que não existem` → `as coisas`~~ |
| III/IV, Refutação 6 | 461 | ~~`_"converteme, e serei convertido"_` → `converte-me`~~ |
| V, art. 5 | 515 | ~~`ferem gravamente as suas consciências` → `gravemente`~~ |
| V, art. 6 | 523 | ~~`ou, que cometam o pecado` (vírgula solta)~~ |
| V, art. 12 | 571 | ~~`a reflexão sobre esses benefício` → `esses benefícios`~~ |
| V, Refutação 1 | 607 | ~~`acusação contra os elietos de Deus` → `eleitos`~~ |
| V, Refutação 9 | 641 | ~~`Cristo não orou penas pelos apóstolos` → `apenas`~~ |
| Conclusão | 645 | ~~`disputados nos Paises Baixos` → `Países`; `agiram de modo demasiado imprópria e contrário` → `impróprio`~~ |
| Conclusão | 653 | ~~o item 7 da lista termina sem ponto final~~ |

### 4.2 Referências e pontuação — **forma**

- ~~II, art. 8, linha 253 — `Jn 10.28` → `Jo 10.28` (`Jn` é Jonas). E `Ef 5.25-27`~~
  aparece duas vezes no mesmo bloco.
- ~~III/IV, art. 5, linha 337 — `7:10.13`, que erra duas coisas de uma vez:~~
  dois-pontos *e* ponto no lugar do hífen.
- ~~**Dois-pontos**: `Hb 7.22, 9:15` (II, Ref. 2), `Ef 1.9; 2:14` (III/IV art. 7),~~
  `22:1-8; 23:37` (art. 9), `2Co 4.6; 5:17` (art. 12), `Rm 14.10; 4:17` (art. 15).
- ~~III/IV, Refutação 4, linha 453 — `(Gn 6.5 e 8.21)` e `(Sl 51.19 e Mt 5.6)`; o~~
  § 1.4 pede ponto e vírgula.
- ~~**Espaço antes de pontuação**, sempre depois de um parêntese: `(a  Rebeca) :`~~
  (I art. 10), `(…de pecado) ;` (V Ref. 4), `(Simão) ,` (V Ref. 9).
- ~~V, Refutação 6, linha 175 — `O eleito não pode ser desviado, Mt 24.24;`:~~
  referência inline sem parênteses, contra o § 1.3.

### 4.3 Inconsistências internas — **revisar**

- **Maiúscula reverencial**: `ele deixa os não-eleitos` (I.6) ao lado de `Ele
  conhece`; `o Seu filho unigênito` (II.2 e II.4) ao lado de `Seu Filho
  Unigênito` (I.2); `seu salvador` (II.9); `dos que lhe pertencem` (V.6).
- **Hífen e reticências**: `tão-somente` vs `tão somente`; `não-eleitos` vs
  `não eleito`; `boas-obras` vs `boas obras`; `…` vs `...` (e `....` na Belga).
- V, art. 4, linha 507 — travessão fora do lugar (`por Satanás - a cometer
  sérios e atrozes pecados, mas…`) e `queda … descritas nas Escrituras` →
  `descrita`.

---

## 5. O Catecismo de Heidelberg

Além dos quatro graves da seção 1 e dos marcadores sem tag da seção 2. Tudo o
que segue é escorregão mecânico — concordância quebrada, palavra faltando,
acento perdido — e não escolha editorial.

### 5.1 Palavras erradas — **forma**

| Onde | Linha | Achado |
| --- | --- | --- |
| Parte II, título | 119 | ~~`# ~ PARTE II ~ Nossa Salvaçao` → `Salvação`~~ |
| P.34 | 363 | ~~`Por você O chama de 'nosso Senhor'?` → `Por que você O chama`~~ |
| P.47 | 482 | ~~`segundo a Sua natureza divindade, majestade, graça e Espírito` (sobrou `natureza`)~~ |
| P.52 | 529 | ~~`Ela lançará todos os Seus e meus inimigos` → `Ele` (Cristo)~~ |
| P.55 | 570 | ~~`cada um têm o dever` → `tem`~~ |
| P.61 | 626 | ~~`Por quê você diz que é justo` → `Por que`~~ |
| P.66 | 670 | ~~`por causa dos sacrifícios de Cristo ofertado na cruz` → `do sacrifício … ofertado`~~ |
| P.80 | 829 | ~~`em segundo lugar,que pelo Espírito Santo` (falta o espaço)~~ |
| P.84 | 868 | ~~`se testifica a todo os incrédulos` → `todos os`~~ |
| P.85 | 876 | ~~`devem ser… admoestado mais de uma vez` → `admoestados`~~ |
| P.86 | 893 | ~~`R. Por que Cristo, tendo nos remido` → `Porque`~~ |
| P.94 | 971 | ~~`por amor a minha salvação` → `à minha salvação`~~ |
| P.99 | 1022 | ~~`façamos mau uso o Nome de Deus` → `do Nome`~~ |
| P.103 | 1068 | ~~`para ouvir à Palavra de Deus` (crase indevida)~~ |
| P.113 | 1174, 1176 | ~~`jamais deveriam se levantar` → `deveria`; `a todo o pecado e, nos deleitar` (vírgula solta)~~ |
| P.114 | 1184 | ~~`com sincero fervor e propósito -não apenas segundo` (travessão colado)~~ |
| P.121 | 1255 | ~~`'que estás nos céu'` → `nos céus`~~ |
| P.128 | 1364 | ~~`Com é que você conclui a sua oração?` → `Como é que`~~ |

### 5.2 Referências bíblicas — **forma**

- ~~P.10, linha 106 — `Ef 5.6 Hb 9.27`: falta o ponto e vírgula entre as duas.~~
- ~~P.80, linha 833 — `10..10-18`: ponto duplicado.~~
- ~~P.73, linha 737 — `Ap 1.5; 7-14` → `7.14`: hífen no lugar do ponto.~~
- ~~P.85, linha 884 — `1Co 5.3-5; 11-13`, sem capítulo.~~
- ~~P.101, linha 1053 — `Gn 21.24; 31-53` → `31.53`.~~
- ~~P.20, P.83, P.117 — `Mt 7 .14`, `Jo 20. 21-23`, `1Jo 5.14, 15 ;`: espaço no~~
  lugar errado.
- ~~P.104, linha 1086 — `Mt 22.21, Rm 13.1-8`: vírgula entre livros diferentes.~~
- ~~**Sem ponto final** em 11 chaves: linhas 22, 69, 190, 215, 287, 296, 332, 381,~~
  572, 1186 e 1379 (a última linha do arquivo).
- ~~**Dois-pontos**: linhas 19, 22, 32, 127, 203.~~
- **Parênteses na chave** (P.31, P.32, P.94): `Sl 45.7 (Hb 1.9)`,
  `Dt 6.5; (Mt 22.37)`. O § 1.6 não prevê. (**revisar**)
- **Capítulo inexistente** (**revisar**): `Ef 11.6` em P.91 (Efésios tem 6),
  `1Ts 6.16-18` em P.116 (1Ts tem 5), `Jo 3.14` em P.87 (parece ser 1Jo 3.14),
  `Jo 6.35, 40, 40-54` em P.76 (repete o 40).

### 5.3 Estrutura — **forma**

- ~~P.71 e P.109, linhas 713 e 1132 — `R .` com espaço antes do ponto. A linha 713~~
  tem ainda **espaço em branco no fim**.
- ~~P.68, P.74, P.124 — título de pergunta em `##` em vez de `###`. Já em § 8.1.~~
- P.25, P.47, P.63 — `<sup>1</sup>` **dentro do título** da pergunta.
- P.23, P.24, P.71 e P.77 — sem bloco de referências, que o § 1.6 pede por
  unidade.
- P.92, linha 946 — `R. _"Então, falou Deus todas estas palavras:` abre itálico
  e aspas e não fecha na linha.
- P.119, linhas 1232-1241 — a Oração do Senhor usa 3 espaços de indentação nas
  sete primeiras linhas e **4** nas três últimas.
- P.38, linha 406 — aspas no lugar errado, engolindo a interrogação:
  `'padeceu sob' o julgamento de 'Pôncio Pilatos?'`.
- P.30, linha 316 — `\[Ou Jesus não é um salvador perfeito…\]`, com colchetes
  escapados. Construção única no corpus.

### 5.4 Inconsistências internas — **revisar**

- **Aspas de citação não-bíblica** oscilam entre `'…'` (P.26, P.27, P.33, P.35,
  P.38, P.121) e `"…"` (P.37, P.44, P.46, P.50, P.52, P.54-58, P.73, P.79,
  P.98, P.129).
- **`Fl` e `Fp`** para Filipenses no mesmo arquivo: `Fl` em P.35, P.40, P.45,
  P.52, P.55, P.57, P.60; `Fp` em P.42, P.80, P.94, P.114, P.115.
- **`2 Sm` / `2 Tm` / `1 Jo`** com espaço ao lado de `1Sm` / `2Tm` / `1Jo` sem.

---

## 6. Hinos - letras

### 6.1 Palavras erradas — **forma**

| Onde | Linha | Achado |
| --- | --- | --- |
| hino 32 | 1088 | ~~`_lssac Watts_` → `Isaac` (`l` por `I`, a classe do `lCo` da Belga)~~ |
| hinos 37 e 38 | 1260, 1291 | ~~`_Johnn Henry Sammis_` → `John`. Os dois hinos trazem a **mesma** atribuição, o que também merece conferência~~ |
| hino 74 | 2438 | ~~`_William Walsbam How_` → `Walsham`~~ |
| hino 73, estrofe 3 | 2434 | ~~`Cantem sempre glória Deus.` → `glória a Deus` (as estrofes 1 e 2 trazem a forma certa)~~ |

**revisar**: hino 78, linhas 2599-2600 — o ponto parte a frase no meio
(`que sempre fez tremer. / O mundo poderoso:`); a leitura é "fez tremer o mundo
poderoso". Hino 75, linhas 2507-2510 — `Passada a grande prova / Tiveste de
enfrentar,` (falta o `que`). Hino 48, linha 1625 — `Vem socorre ao que padece`
→ `Vem socorrer`.

### 6.2 Numeração e atribuição

- **revisar** — hino 5, linhas 362-370: os marcadores `<sup>12</sup>` e
  `<sup>13</sup>` parecem adiantados em uma linha. *"As nossas faltas, perdoar"*
  é Mt 6.12 e não leva marcador; o `12` está em *"E não nos deixes… cair"*, que
  é 6.13. Mesma classe do erro do hino 1, já corrigido no § 8.2.
- **forma** — hino 97, linhas 3210-3213: **não tem linha de atribuição**. É o
  único dos 97.
- **revisar** — `Salomão Luiz Ginsburg` (hinos 37 e 38) vs `Salomão Luís
  Ginsburg` (hino 52): a mesma pessoa, duas grafias.
- **revisar** — barra sem espaço à esquerda: `século II/ João` (16),
  `Assis/ William` (18), `How/ João` (74). Os demais usam ` / `.

### 6.3 Marcação e pontuação

- **revisar** — aspas curvas `“…”` nos hinos 20, 43, 62, 64 e 70, onde o resto
  do corpus usa `"`.
- **revisar** — hino 23: `(2x)` como marca de repetição, três vezes (linhas 882,
  887, 893). Construção única, não prevista no § 5.3.
- **revisar** — hino 20, linhas 780-788: a estrofe 1 tem 8 linhas e as demais 4;
  as quatro últimas se repetem como refrão, mas estão fundidas na estrofe. O
  hino não consta da lista de refrões do § 6.3.
- **forma** — estrofes sem pontuação final: `Triunfa na batalha` (hino 55,
  estrofe 2) e `À destra de Deus` (hino 81, estrofe 4).
- **revisar** — `filho` e `cordeiro` em minúscula referindo-se a Cristo nos
  hinos 20, 28, 55 e 76, ao lado de `Filho` e `Cordeiro` nos hinos 74 e 77. O
  hino 54 traz `sangue remidor` nas estrofes e `sangue Remidor` no refrão.
- **revisar** — os títulos do corpo acrescentam `!` que o índice não tem (hinos
  9, 13, 16, 26, 27, 31, 62, 66). O índice também usa `##` para as 16 seções
  litúrgicas, enquanto o corpo usa `#`.

---

## 7. Salmos - letras

15.947 linhas, 283 variantes. Além dos dois graves da seção 2 e dos marcadores
de versículo já listados ali.

### 7.1 Palavras erradas — **forma**

| Onde | Linha | Achado |
| --- | --- | --- |
| 60A e 108A | 5878, 11575 | ~~`Juda é meu legislador` → `Judá`. Duas ocorrências: é sistemático~~ |
| 83A | 8646 | ~~`Como os de tiro, a Filístia` → `Tiro` (os salmos 87A e 87B trazem maiúscula)~~ |
| 78B | 8082 | ~~`De Cão, nas tendas` → `Cam` (o 78A, linha 7892, traz `Cam`)~~ |
| 78A | 7830 | ~~`Prostou também de Israel seus jovens` → `Prostrou`~~ |
| 147B | 15697 | ~~`Os suprimentos Ihes prepara` → `lhes` (`I` por `l`, o espelho do `lCo`)~~ |
| 74A | 7477 | ~~`"vamos destrui-los logo."` → `destruí-los`~~ |
| 69A | 6864 | ~~`tudo aquilo que se se move` (`se` duplicado)~~ |
| 107A | 11505 | ~~`E se multiplicaram;;` (ponto e vírgula duplicado)~~ |
| 22B | 2186 | ~~`pois nele tem prazer.!` (ponto e exclamação juntos)~~ |
| 89B | 9309 | ~~`do opróbio feito a teus amados` → `opróbrio`~~ |
| 110B | 11842 | `Durante a migra, bebe de torrentes` (palavra inexistente; o 110A traz "Pelo caminho, bebe na torrente") |
| 94A | 9646 | ~~`Quando prudentes vós serei?` → `sereis` (o 94B traz "Quando sábios vós sereis?")~~ |
| 72B | 7206, 7230 | `E vai-los proteger` → `vai protegê-los`; `Do Israel seu rei` → `De Israel` |
| 82B | 8603 | ~~`Tu que reside nas alturas` → `resides`~~ |
| 62A | 6031 | ~~`Nem na rapina vos gloriem` → `glorieis`~~ |
| 42B | 4370 | ~~`Ao insultos receber` → `Aos insultos`~~ |
| 44A | 4533, 4545 | ~~`esmagaste à nós` (crase indevida); `O que prescruta o coração` → `perscruta`~~ |
| 49A | 4919 | ~~`São néscios, mas tem seguidores` → `têm`~~ |
| 27A | 2662 | ~~`Tê valência e coragem` → `Tem`~~ |
| 54A | 5327 | `Escuta\_ó Deus, a minha prece` (falta a vírgula do vocativo) |
| 148B | 15825 | `Que da qual não passará.` |
| 24B | 2396, 2398, 2404 | ~~`Portais eternais, levantais-vos ao Rei` três vezes; a linha 2408 traz `levantai-vos`, a forma certa, e sem a vírgula~~ |

### 7.2 Elisão fora da regra do § 5.5 — **forma**

A sinalefa junta vogal com vogal. Estes quatro juntam consoante:

```
5B    Cova\_aberta\_é\_o\_seu falar
25B   Nem de todos\_os erros meus
103B  Não\_te esqueças de nem um só
141B  Jogados\_os ossos pelo chão
```

**revisar** — a mesma frase aparece ora elidida ora não: `Meu auxílio\_é meu
Senhor` (linhas 4265, 4298) ao lado de `Meu auxílio é meu Senhor` (linha 4295),
no mesmo salmo 42A. Também `Minha alma\_assim` vs `Minha alma,\_assim` vs
`minha\_alma`; e `em meio à` vs `em meio\_à`.

### 7.3 Pontuação de estrofe — **forma**

- **Sem ponto final** (~20 estrofes): linhas 2544, 3144, 3348, 3841, 4511, 5656,
  6300, 7846, 8105, 9562, 9762, 9822, 11177, 11507, 11551, 11581, 11737, 12169,
  12632, 12760, 13344, 14067, 15469, 15471, 15501.
- ~~Salmo 136A, linhas 14462 e 14546 — o refrão `Para sempre, durará.` perde o~~
  ponto final em **2 das 24** estrofes. Fácil de automatizar, dado o quanto o
  resto é regular.
- ~~**Espaço antes de pontuação**: `tua é a noite ;` (74A, linha 7501),~~
  `que deveis temer .` (76A, 7628), `e voamos nós .` (90B, 9412),
  `a minha vereda .` (142B, 15193).
- ~~Salmo 122B, linha 13478 — `"Vamos à Casa de Deus.".`: ponto dentro **e** fora~~
  das aspas. O 122A traz só dentro.

### 7.4 Atribuição e nomes de melodia

- ~~**forma** — 117B, linha 12359: `_CBS - Last uns erfreunen_` → `Lasst uns~~
  erfreuen`. Dois erros no nome da melodia alemã.
- **forma** — 115A, linha 12165: `_LFG / Vítor Olivier - …_`, com iniciais não
  expandidas. É o único do corpus; todos os outros autores vêm por extenso.
- ~~**forma** — **três rótulos diferentes** para autoria desconhecida:~~
  `autor desconhecido` (a maioria), `autor não informado` (79B, linha 8204) e,
  nos hinos, `Autor desconhecido` com maiúscula.
- **revisar** — capitalização de melodia: `All The Way` e `A La Nanita Nana` em
  Title Case, ao lado de `Peace, be still`, `Come near me, o my savior`,
  `What Wondrous Love is This`, `Forgive blessed shade`.

### 7.5 Trechos que pedem revisão em bloco — **revisar**

**Salmo 102B, linhas 10395-10523.** A paráfrase inteira está áspera e em vários
pontos agramatical:

```
Ouve-me, Senhor, a prece,        ← 2ª pessoa
Meus clamores reconheça.         ← 3ª pessoa
…
Dos que pedem que atende,
Cândido fui meus caminhos.
Me\_uma geração segure.
Céus e terra te adotas,
```

**Salmos 140B, 141B, 147A, 147B e 148B** (linhas 15015, 15113, 15663, 15742,
15825): mesma coisa em escala menor — mistura de formas verbais imperativas,
palavras fora de ordem, versos sem sentido recuperável (`Ungido é me a
repreensão`, `Capte-os nas redes que nos fazem`, `Oh! Quando é que, assim que
ocorre,`, `Jacó a palavra entendida`).

**Próclise em frase negativa**: `Não deixe-nos, Senhor` (linha 9305) → `Não nos
deixe`; `Jamais retirarei-lhes` (9269) → `Jamais lhes retirarei`; `Que seja-lhe
agradável` (10896) → `Que lhe seja`.

**Registro destoante**: `Acaso, eu como bife de animal?` (50A, linha 4977 — o
50B traz "Do boi a carne"); `Os homens de classe baixa` (62A, 6021); `De banha
farta minha alma está` (63B, 6171).

**Grafias divergentes**: `Neguev` (126A) vs `Neguebe` (126B); `Hermom` (89A) vs
`Hermon` (89B); `fieldade` por *fidelidade* nos salmos 25B, 36A, 54A, 88A e
115A; `Senhor das Hostes` vs `Senhor das hostes` dentro do próprio 84A.

---

## 8. Inconsistências que atravessam o corpus

Não são erros de um documento: são convenções que ainda não foram decididas.
Cada uma pede uma linha no `FORMATO.md` antes de virar regra de validador.

| Convenção em disputa | Formas encontradas | Onde |
| --- | --- | --- |
| Aspas de citação | retas nos confessionais (326, zero curvas), curvas nos cantados (150) | convenção já existe por família; sobram **7 pares retos** nos Salmos |
| Ponto e aspas | dentro, fora, e `.".` | Salmos 10B, 12A, 45A, 122B |
| Reticências | `…` · `...` · `....` | Dort, Belga |
| Sigla de Filipenses | `Fl` e `Fp` | dentro do próprio Heidelberg |
| Espaço na sigla | `2 Sm` e `2Sm` | Heidelberg P.35, P.63, P.72, P.98 |
| `SENHOR` | `SE NHOR` e `SENHOR` | Heidelberg P.92 vs P.94; Belga art. 23 |
| Autoria desconhecida | três rótulos distintos | Salmos e Hinos |
| Maiúscula reverencial | `Ele`/`ele`, `Filho`/`filho` | Dort caps. I e II; Hinos 20, 28, 55, 76 |
| Espaço antes de pontuação | 8 ocorrências | Belga, Dort, Heidelberg, Salmos |
| Travessão | `-` · `–` · `—` | o Salmo 45A é o único `–` do corpus |

---

## 8.1 · Marcadores de nota ausentes na fonte — **a corrigir no futuro**

Nove unidades confessionais têm uma **chave de referência sem o marcador
`<sup>N</sup>` correspondente no corpo**: a lista numerada de referências traz o
item _N_, mas o superscrito _N_ não aparece no texto. Enquanto o conversor
achatava os marcadores (decisão D1, revogada pelo R1 em 2026-08-24), o defeito
ficava invisível; ao **preservar os marcadores** no corpo (para casarem por
posição com as referências), ele aflorou na exibição.

**Não corrigido agora** — é texto confessional e depende de conferência contra o
impresso pela autoridade editorial. Fica registrado para correção futura **na
fonte** (`fontes/belgic/A Confissão Belga.md` e
`fontes/heidelberg/O Catecismo de Heidelberg.md`): inserir o `<sup>N</sup>`
ausente no ponto certo do texto.

Já inventariado em `ferramentas/pendencias-confissoes.txt` como
`chave-sem-marcador` e vigiado por `ferramentas/validar_confissoes.py` (o portão
reprova se um caso NOVO surgir). A tabela abaixo diz **qual número** falta:

| Documento | Unidade | Nº de refs | Marcador(es) ausente(s) no corpo |
| --- | --- | --- | --- |
| Belga | art. 7 | 6 | **5** |
| Belga | art. 16 | 6 | **6** |
| Belga | art. 21 | 11 | **9** |
| Belga | art. 26 | 14 | **1, 5** |
| Belga | art. 30 | 8 | **5** |
| Belga | art. 37 | 18 | **3, 14** |
| Heidelberg | P. 25 | 2 | **1** |
| Heidelberg | P. 47 | 3 | **1** |
| Heidelberg | P. 63 | 2 | **1** |

A numeração das referências na exibição continua **completa e correta** (1…N por
posição); o que falta é só o superscrito no meio do texto. Corrigido um caso na
fonte, regenere o inventário
(`python3 ferramentas/validar_confissoes.py --gravar-pendencias`) e rode
`npm run convert` para propagar ao `content/`.

---

## 9. O que passou

Vale registrar o que a leitura **confirmou**, para que ninguém volte a conferir.

- Belga: 37 artigos, numeração contínua, um bloco de referências por artigo.
- Dort: 4 capítulos com 18, 9, 17 e 15 artigos; erros numerados 9, 7, 9 e 9; uma
  `REJEIÇÃO DE ERROS` por capítulo e uma `CONCLUSÃO` só no fim.
- Heidelberg: 129 perguntas, 52 Dias do Senhor, 3 partes.
- Hinos: 97 hinos em numeração contínua, atravessando as 16 seções litúrgicas.
- Hinos: os 34 refrões do § 6.3 conferem, um a um.
- Hinos: os 12 `_Amém._` do § 6.4 conferem, e o hino 64 é mesmo o único sem ponto.
- Hinos: 16, 25, 26, 30 e 97 recebem `**1**` como o § 6.6 manda.
- Hinos: a correção da numeração do hino 1 (`15, 16, 17`) está aplicada.
- Hinos: `<sup>N</sup>` só nos hinos 1-5 e cabeçalho bíblico só nos hinos 1-6,
  como o § 7.3 descreve.
- Salmos: 283 variantes; o Salmo 119 em 22 seções e 28 variantes, exatamente
  como o § 5.2 registra.
- Salmos: a correção do 145A (`<sup>21</sup>`) está aplicada.
- Salmos: nenhum refrão e nenhum `_Amém._`, como o § 5.3.1 e o § 5.3.2 preveem.
- Salmos: `\- Quão grandioso\_és tu! \-` no 79A é mesmo o único hífen escapado
  do corpus.
