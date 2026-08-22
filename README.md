# Confissões — App IRB

Fonte editorial dos **três símbolos de unidade** das Igrejas Reformadas, em
português, mantidos como texto revisável antes de virarem conteúdo do **App
IRB**.

Este repositório guarda o **texto**, não o binário. Ele é a origem canônica de
onde os documentos confessionais são revisados e aprovados; o formato de
consumo do app (JSON validado, `content.db`) é gerado a partir daqui, rio
abaixo.

---

## Estrutura

```
fontes/            textos-fonte em Markdown, por coleção
  belgic/            A Confissão Belga.md
  heidelberg/        O Catecismo de Heidelberg.md
  dort/              Os Cânones de Dort.md
  salmos/            Salmos - letras.md   + o PDF de origem
  hinos/             Hinos - letras.md    + o PDF de origem
docs/              FORMATO.md (formato), CONVERSOR.md (decisões da conversão),
                   ACHADOS.md (revisão linha a linha + decisões de convenção),
                   LEITURAS.md (trechos que precisam de decisão editorial)
ferramentas/       extrair.py (PDF → Markdown), validar.py (portão de CI)
content/           JSON gerado pelo conversor (ainda não existe)
```

As pastas das três confissões usam os identificadores de coleção do App IRB
(`belgic`, `heidelberg`, `dort`) e espelham a saída `content/{coleção}/` que o
conversor vai gerar. `salmos/` e `hinos/` ainda estão em português e **não**
seguem essa regra — ver `docs/CONVERSOR.md` F4.

Onde há PDF na pasta, ele é a **fonte de origem**: os `.md` foram extraídos
dele e são validados contra ele. As duas pontas vivem em `ferramentas/` —
`extrair.py` regenera o Markdown a partir do PDF, `validar.py` confere um
contra o outro e sai com erro se divergirem. Rode `validar.py` antes de abrir
PR.

## Os textos

| Coleção | Documento | Estrutura |
| --- | --- | --- |
| `heidelberg` | Catecismo de Heidelberg | 129 perguntas e respostas, em 52 Dias do Senhor, sob 3 partes |
| `belgic` | Confissão Belga (Confissão de Fé) | 37 artigos, sequência plana |
| `dort` | Cânones de Dort | 59 artigos em 4 capítulos, com Rejeição de Erros por capítulo e Conclusão |
| `salmos` | Salmos (saltério cantado) | 150 salmos em 283 variantes, 1.805 estrofes; Salmo 119 em 22 seções |
| `hinos` | Hinos | 97 hinos, 333 estrofes, sob 16 seções litúrgicas; 34 com refrão |

O repositório é um **vault do Obsidian** (`.obsidian/`), então pode ser aberto
diretamente no Obsidian para leitura e edição confortáveis. Nada no fluxo
depende do Obsidian: os arquivos são Markdown UTF-8 comum.

---

## Regra inviolável: o texto é exato

A precisão do texto é requisito do projeto. **Não** parafraseie, "corrija",
modernize ou normalize os textos confessionais por conta própria — nem a
grafia, nem a pontuação, nem os espaços múltiplos herdados da diagramação
original (ver `docs/FORMATO.md` § 1.1). Espaço duplo interno é preservado
deliberadamente; não é erro de formato.

Toda alteração de texto passa por **revisão editorial** antes de ser aceita.
Correções de digitalização e desvios conhecidos ficam registrados em
`docs/FORMATO.md` § 8 — são dívidas rastreadas, não licença para editar à vontade.

`docs/ACHADOS.md` é o inventário da leitura linha a linha dos cinco textos: o
que foi encontrado, onde, e em que nível (grave, forma, revisar). Abre com as
**decisões de convenção** pendentes (D0-D16) em caixas de seleção; marcar uma
opção destrava o lote correspondente. `docs/LEITURAS.md` traz as decisões que
não são convenção, e sim leitura de um trecho (B1-B35).

---

## Como contribuir

1. Leia `docs/FORMATO.md` inteiro antes de tocar em qualquer arquivo. O **Catecismo
   de Heidelberg** é o documento de referência: em dúvida sobre uma convenção
   não prevista, siga o que ele faz.
2. Mantenha as convenções comuns (§ 1): um parágrafo por linha física, itálico
   com `_sublinhado_`, marcadores de nota `<sup>N</sup>`, bloco de referências
   fechando cada unidade.
3. Respeite as diferenças por documento (§ 7) — sobretudo que os **Cânones de
   Dort** não usam marcadores `<sup>N</sup>` e trazem as referências em
   parágrafo único, não em lista numerada.
4. Nos **textos cantados** (§ 5 salmos, § 6 hinos) as regras mudam: a quebra de
   linha é conteúdo, o `<sup>N</sup>` é versículo bíblico e vem antes do trecho,
   o `\_` marca elisão de canto — nunca o desescape — e o refrão vai em citação
   de bloco.
5. Abra um PR. A revisão editorial é o portão humano de aprovação.

---

## Relação com o App IRB

O aplicativo é **offline-first**: ele nunca busca conteúdo na rede para *ler*.
Estes textos entram no app por duas vias, ambas derivadas deste repositório:

- **Semente embarcada** — convertidos para o formato-fonte JSON do app,
  validados e compilados em `content.db`, que viaja dentro do build.
- **Atualização de conteúdo (sync)** — os mesmos textos, empacotados como
  *snapshots* assinados e publicados; o app verifica a assinatura e o `sha256`
  antes de aplicar, e só substitui uma coleção por uma **versão maior**.

A conversão Markdown → JSON e a publicação vivem no lado do app (ver os specs
`SPEC-FORMATO-FONTE`, `SPEC-BUILD-DE-CONTEUDO`, `SPEC-CANAL-DE-CONTEUDO` e
`SPEC-REPOSITORIO-DE-CONTEUDO` do repositório `app-irb`). Aqui a
responsabilidade é uma só: **o texto correto, no formato de `docs/FORMATO.md`.**

---

## Direitos

Textos confessionais históricos, nesta tradução para o português. A definição
de licença/atribuição é do responsável editorial do projeto.
