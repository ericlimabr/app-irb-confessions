# Ferramentas

Duas frentes independentes:

| | textos cantados | textos confessionais |
| --- | --- | --- |
| coleções | `fontes/salmos/`, `fontes/hinos/` | `fontes/belgic/`, `heidelberg/`, `dort/` |
| origem | extraídos de PDF por `extrair.py` | formatados à mão |
| validação | `validar.py` — contra o PDF ou o digest | `validar_confissoes.py` — só estrutura |

Requisitos:

- `pdftotext` (pacote `poppler-utils`). Sem dependências Python.
- Os PDFs de origem em `fontes/salmos/` e `fontes/hinos/`. Eles **não são
  versionados** (`.gitignore`) por serem binários grandes, então um clone novo
  não os traz. O `extrair.py` depende deles. O `validar.py` não: sem o PDF ele
  roda em modo reduzido, conferindo o texto contra o digest versionado
  (`--sem-pdf`, abaixo).

O Markdown, esse sim versionado, é a fonte editorial — é o produto que
interessa. Os scripts servem para reproduzi-lo e conferi-lo.

## `extrair.py` — PDF → Markdown

```bash
python3 ferramentas/extrair.py salmos              # regera o .md
python3 ferramentas/extrair.py hinos --conferir    # não grava; diff e sai != 0
```

Reproduz `fontes/{salmos,hinos}/*.md` a partir dos PDFs, no formato de
`docs/FORMATO.md` § 5 e § 6. A saída é determinística e **idêntica** ao que
está versionado — é isso que `--conferir` verifica.

O texto do PDF sozinho não diz onde uma estrofe começa. O extrator decide por
três sinais tipográficos, nesta ordem de confiança:

1. **ZWSP** (U+200B) colado ao número → estrofe. É o marcador do gerador do
   PDF, mas não é uniforme: parte das estrofes sai sem ele.
2. **Número seguido de número** → o primeiro é estrofe, o segundo é versículo.
3. **Comparação de indentação.** O número de versículo é sobrescrito, então o
   `pdftotext` empurra para a direita a linha seguinte, deixando-a mais funda
   que a próxima. O de estrofe fica sozinho, e a linha seguinte está na
   indentação normal do bloco — igual à próxima.

O terceiro é relativo de propósito. Um teste absoluto ("a linha seguinte está
na coluna 0") funciona nos salmos e falha nos hinos 7 e 8, que são diagramados
inteiramente indentados — foi assim que os dois passaram por válidos por um
bom tempo.

### Correções declaradas

`CORRECOES`, no topo do arquivo, guarda as divergências propositais entre o
Markdown e o PDF registradas em `docs/FORMATO.md` § 8.2 — casos em que o
impresso está errado. Sem elas, toda regeração reintroduz o erro. Cada troca é
verificada: se não casar exatamente uma vez, o script aborta em vez de gravar
um arquivo silenciosamente errado.

## `validar.py` — confere o Markdown contra o PDF

```bash
python3 ferramentas/validar.py            # as duas coleções, contra os PDFs
python3 ferramentas/validar.py hinos
python3 ferramentas/validar.py --sem-pdf  # clone sem os PDFs (CI)
```

Sai com código != 0 se algo falhar. É o candidato natural a *status check* de
CI.

Não importa o `extrair.py`: lê o PDF por conta própria. Mas convém saber o
limite dessa independência — a classificação estrofe/versículo parte da mesma
premissa tipográfica, e **uma premissa errada erraria nos dois lugares**. Foi
exatamente o que aconteceu com os hinos 7 e 8: o validador concordava com o
extrator e reportava "OK".

Por isso o peso está nas verificações que não dependem daquela premissa:

- **integridade léxica** — multiconjunto de palavras do PDF contra o do
  Markdown. Pega qualquer perda, duplicação ou invenção de texto, seja qual
  for a divisão de estrofes;
- **invariantes internas** — sequências `1..N` sem furo, ausência de lixo de
  extração (cercas de código, NBSP, ZWSP), forma dos marcadores, nenhum número
  solto no meio da letra;
- **presença das divergências de § 8.2** — falha se uma regeração as apagar.

### Testado contra defeito real

As verificações foram exercitadas com mutações deliberadas, e cada uma reprova:

| Mutação | O que acusa |
| --- | --- |
| desfazer a correção do `145A` | sequência de versículos + divergência ausente |
| remover um `**N**` de estrofe | contagem de estrofes + furo em `1..N` |
| apagar uma palavra da letra | palavra do PDF ausente |
| recolapsar o hino 7 | contagem de estrofes + sequência de versículos |

O último é o caso histórico: é o defeito que passou pelo validador antigo.

### Os dois modos: com e sem o PDF

Como o PDF não é versionado, o validador roda de dois jeitos. `--sem-pdf`
força o modo reduzido; sem a flag, ele usa o PDF se encontrar e cai no modo
reduzido se não encontrar, dizendo qual referência está usando.

| | com o PDF | `--sem-pdf` |
| --- | :---: | :---: |
| mesmas unidades nos dois lados | ✓ | — |
| contagem de estrofes bate | ✓ | — |
| sequência de versículos bate | ✓ | — |
| estrofes `1..N` sem furo | ✓ | ✓ |
| **integridade léxica** | contra o PDF | contra o digest |
| invariantes de forma, números soltos | ✓ | ✓ |
| divergências de § 8.2 presentes | ✓ | ✓ |
| digest confere com o PDF | ✓ | — |

As três que faltam são de *proveniência*: comparam estrutura com a fonte, e
não há como fazê-las sem a fonte. Elas nunca são omitidas em silêncio — saem
marcadas como puladas.

### O digest

`ferramentas/digests/{salmos,hinos}.txt` guarda o multiconjunto de palavras do
PDF, uma linha `palavra N`, gerado por:

```bash
python3 ferramentas/validar.py --gerar-digest    # precisa dos PDFs
```

A integridade léxica já reduzia o PDF a esse `Counter` — layout, ordem e
pontuação nunca entraram na conta. O digest só grava o que seria recalculado,
para que a checagem continue existindo em um clone sem o PDF. A verificação é
a mesma; muda a origem do lado direito.

Ele **não é testemunha independente do PDF**, é um instantâneo: quem regenerar
o digest junto com um Markdown corrompido passa por `--sem-pdf`. Duas coisas
seguram isso:

1. o arquivo é revisável — o diff mostra exatamente que palavras entraram ou
   saíram (`-Senhor 147` / `+Senhor 146` é bem mais visível que a mesma perda
   enterrada em 429 KB de Markdown);
2. **toda rodada local confere o digest contra o PDF.** Digest desatualizado ou
   ajustado à mão reprova na máquina de quem tem a fonte.

Regenerar o digest é ato deliberado, e só se justifica quando o PDF muda.

## `validar_confissoes.py` — confere a estrutura das três confissões

```bash
python3 ferramentas/validar_confissoes.py                     # os três
python3 ferramentas/validar_confissoes.py belgic
python3 ferramentas/validar_confissoes.py --gravar-pendencias
```

Não lê PDF e não depende de nenhuma decisão em aberto — roda em qualquer
clone, e por isso está no CI junto do outro.

Confere **forma**, não texto: hierarquia de títulos, contagem e numeração das
unidades (37 artigos, 129 perguntas, 59 artigos reiniciados por capítulo),
marcadores `<sup>N</sup>` contra o bloco de referências de § 1.6, gramática
das citações de § 1.4 e resíduo de extração.

Conferir a **prosa** contra a edição impressa continua fora do alcance: exige
resolver antes a capitalização reverencial (`Ele`/`ele`, `Sua`/`sua`), que é
decisão editorial pendente. Este validador garante a estrutura em volta do
texto, não o texto.

### Pendências

`ferramentas/pendencias-confissoes.txt` lista os defeitos já conhecidos, um
por linha (`documento | unidade | código`). Eles **não** derrubam o portão —
se derrubassem, o CI nasceria vermelho e ninguém olharia mais para ele. O
registro é fechado nos dois sentidos:

- achado que não está no arquivo reprova (é regressão);
- pendência que deixou de ser observada reprova — ou foi corrigida e o
  registro ficou para trás, ou o parser parou de enxergá-la.

Corrigiu algo? Regenere com `--gravar-pendencias` em vez de editar à mão.

A chave é (documento, unidade, código), sem o detalhe: duas referências
malformadas no mesmo artigo ocupam uma linha só, e a pendência só cai quando
a última sai. É de propósito — guardar o detalhe faria o arquivo mudar a cada
reformulação de mensagem. O preço é não medir progresso parcial dentro de uma
unidade.

Uma ressalva sobre o código `abreviacao-fora-da-lista`: § 1.4 dá seis exemplos
de sigla e não enumera os 66 livros. A lista do script é deduzida daquele
padrão, não é a letra da spec. O que ela acusa são **candidatos a revisão** —
tipicamente o mesmo livro abreviado de dois jeitos no corpus (`Ex`/`Êx`,
`Fp`/`Fl`) — não erro provado.

### Testado contra defeito real

| Mutação | O que acusa |
| --- | --- |
| ponto → dois-pontos numa referência limpa | `referencia-malformada` como achado novo |
| apagar um `<sup>N</sup>` do corpo | `chave-sem-marcador` |
| quebrar o título de uma pergunta | contagem de unidades + numeração `1..N` |
| corrigir todas as pendências de uma unidade | pendência obsoleta no registro |

## Fluxo de trabalho

Edição normal é **no Markdown**, que é a fonte editorial. Rode `validar.py` e
`validar_confissoes.py` antes de abrir PR.

`extrair.py` só se justifica quando o PDF for substituído por uma edição nova.
Nesse caso ele **sobrescreve** o Markdown: confira o diff antes de aceitar, e
lembre que revisões editoriais feitas só no Markdown se perdem.
