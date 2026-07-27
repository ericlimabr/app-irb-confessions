# Ferramentas

Pipeline dos **textos cantados** (`fontes/salmos/`, `fontes/hinos/`). Os três
textos confessionais não passam por aqui: foram formatados à mão, sem PDF de
origem.

Requisitos:

- `pdftotext` (pacote `poppler-utils`). Sem dependências Python.
- Os PDFs de origem em `fontes/salmos/` e `fontes/hinos/`. Eles **não são
  versionados** (`.gitignore`) por serem binários grandes, então um clone novo
  não os traz — sem eles, os dois scripts abaixo não rodam. O Markdown, esse
  sim versionado, é o produto que interessa; os scripts servem para reproduzi-lo
  e conferi-lo quando o PDF estiver à mão.

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
python3 ferramentas/validar.py          # as duas coleções
python3 ferramentas/validar.py hinos
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

## Fluxo de trabalho

Edição normal é **no Markdown**, que é a fonte editorial. Rode `validar.py`
antes de abrir PR.

`extrair.py` só se justifica quando o PDF for substituído por uma edição nova.
Nesse caso ele **sobrescreve** o Markdown: confira o diff antes de aceitar, e
lembre que revisões editoriais feitas só no Markdown se perdem.
