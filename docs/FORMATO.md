# Especificação de Formato

Este documento define como os três textos confessionais deste repositório são
estruturados em Markdown. Os arquivos ficam em `fontes/{coleção}/`:

| Arquivo | Unidade de conteúdo | Notas de referência |
| --- | --- | --- |
| `O Catecismo de Heidelberg.md` | Pergunta e resposta (129) | Numeradas, com marcador no texto |
| `A Confissão Belga.md` | Artigo (37) | Numeradas, com marcador no texto |
| `Os Cânones de Dort.md` | Artigo (59, reiniciados por capítulo) | Sem numeração, em bloco único |

O Catecismo de Heidelberg é o documento de referência: quando houver dúvida
sobre uma convenção não prevista aqui, siga o que ele faz.

---

## 1. Convenções comuns aos três documentos

### 1.1 Arquivo e blocos

- Markdown, codificação UTF-8, uma linha em branco entre blocos.
- **Cada parágrafo ocupa uma única linha física.** Não há quebra de linha
  manual dentro do parágrafo — a quebra visual fica a cargo do editor.
- Os espaços múltiplos internos herdados da diagramação original
  (`e  à  Sua imagem`) são preservados. Não são erro de formato e não devem
  ser normalizados.

### 1.2 Ênfase

- Itálico com sublinhado: `_texto_`. Nunca asteriscos.
- Negrito (`**texto**`) é usado **apenas** nos rótulos `**Erro N**` e
  `**Refutação**` dos Cânones de Dort (§ 4.4).

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

### 1.6 Bloco de referências

Fecha cada unidade de conteúdo, como último bloco, precedido de linha em branco.

Nos documentos com notas numeradas (Heidelberg e Confissão Belga), é uma lista
ordenada com **uma chave por linha**, terminada em ponto:

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

## 5. Resumo das diferenças

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

---

## 6. Desvios conhecidos

Pontos em que os arquivos ainda não seguem esta especificação. São dívidas
registradas, não alternativas aceitáveis.

### 6.1 Formato

- **Heidelberg:** as perguntas 68, 74 e 124 usam `##` em vez de `###`. A maioria
  dos títulos de pergunta traz dois espaços após `###` (`###  P.1.`) em vez de
  um; é indiferente para a renderização, mas não é uniforme.
- **Heidelberg:** o `DIA DO SENHOR 26` tem espaço extra após `##`.
- **Heidelberg, P.23:** o bloco do Credo mistura numeração romana solta
  (`I .`, `II .`) com a lista ordenada de 12 itens; precisa de uma decisão de
  forma.

### 6.2 Texto (pendente de revisão de conteúdo)

- **Confissão Belga:** marcador ausente no corpo, embora a referência exista no
  bloco — art. 7 (nota 5), 16 (6), 21 (9), 26 (1 e 5), 30 (5), 37 (3 e 14).
- **Confissão Belga:** trechos com colunas entrelaçadas na extração do PDF,
  ainda sem sentido corrido — art. 23 (`…confiados em nós mes(Sl 143.2)`) e
  art. 26.
- **Confissão Belga:** referências com erro de digitalização — `Jo 5.1726`
  (art. 8, provavelmente `5.17-26`), `Jd .8`, `2Jo .9`, `Ap 22:18` (dois-pontos
  em vez de ponto).
- **Heidelberg:** `SE NHOR` e `SENHOR` alternam no mesmo documento (P.92 e
  seguintes).
