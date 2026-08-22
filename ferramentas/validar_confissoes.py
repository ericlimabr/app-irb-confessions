#!/usr/bin/env python3
"""
Validador dos textos confessionais: confere a estrutura contra docs/FORMATO.md.

    python3 ferramentas/validar_confissoes.py            # os tres documentos
    python3 ferramentas/validar_confissoes.py belgic     # so um
    python3 ferramentas/validar_confissoes.py --gravar-pendencias

Sai com codigo != 0 se algo falhar — serve como portao de CI.

--------------------------------------------------------------------------
O que ele confere, e o que deliberadamente nao confere
--------------------------------------------------------------------------
Confere **forma**: hierarquia de titulos, numeracao das unidades, marcadores
de nota contra o bloco de referencias, gramatica das citacoes biblicas (§ 1.4)
e residuo de extracao. Nao precisa do PDF e nao depende de nenhuma decisao em
aberto — roda em qualquer clone.

NAO confere o **texto**. Comparar a prosa com a edicao impressa exige resolver
antes a capitalizacao reverencial (Ele/ele, Sua/sua, Evangelho/evangelho), que
e' decisao editorial pendente. Enquanto isso, a fidelidade do texto continua
sendo responsabilidade humana; isto aqui garante que a estrutura em volta dela
esta' integra.

Tambem nao inventa correcao. Todo achado e' relatado com a unidade e o trecho,
para decisao humana — § 1.1 manda preservar ate' os espacos multiplos herdados
da diagramacao, e normalizar por conta propria e' proibido.

--------------------------------------------------------------------------
Pendencias
--------------------------------------------------------------------------
Os defeitos ja' conhecidos ficam em ferramentas/pendencias-confissoes.txt e
nao derrubam o portao — se derrubassem, o CI nasceria vermelho e ninguem
olharia mais para ele. Mas o registro e' fechado nos dois sentidos:

  * achado que NAO esta' no arquivo reprova. E' regressao.
  * pendencia que deixou de ser observada reprova. Ou foi corrigida e o
    registro ficou para tras, ou o parser parou de enxerga-la — os dois casos
    pedem a mao de alguem.

Depois de corrigir um defeito, regenere o arquivo com --gravar-pendencias em
vez de edita-lo a mao; o diff mostra o que saiu da lista.

Granularidade: a chave e' (documento, unidade, codigo), sem o detalhe. Duas
referencias malformadas no mesmo artigo ocupam uma linha so', e corrigir uma
delas nao muda o registro — a pendencia so' cai quando a ultima do par sai.
E' de proposito: guardar o detalhe faria o arquivo mudar a cada reformulacao
de mensagem, e o registro deixaria de ser legivel no diff. O preco e' que o
portao nao mede progresso parcial dentro de uma unidade.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ZWSP = "​"
NBSP = " "

DOCUMENTOS = {
    "belgic": {
        "md": RAIZ / "fontes/belgic/A Confissão Belga.md",
        "titulo": "A CONFISSÃO BELGA",
        "unidade": re.compile(r"^## ARTIGO (\d+)\s*$"),
        "rotulo": "ARTIGO ",
        "esperadas": 37,
        "capitulos": None,
        "chaveadas": True,      # § 3.2 — marcadores <sup>N</sup> + lista numerada
    },
    "heidelberg": {
        "md": RAIZ / "fontes/heidelberg/O Catecismo de Heidelberg.md",
        "titulo": "O CATECISMO DE HEIDELBERG",
        "unidade": re.compile(r"^#{2,3}\s+P\.(\d+)\."),
        "rotulo": "P.",
        "esperadas": 129,
        "capitulos": None,
        "chaveadas": True,
    },
    "dort": {
        "md": RAIZ / "fontes/dort/Os Cânones de Dort.md",
        "titulo": "OS CÂNONES DE DORT",
        "unidade": re.compile(r"^## ARTIGO (\d+)\s*$"),
        "rotulo": "ARTIGO ",
        "esperadas": 59,
        "capitulos": [18, 9, 17, 15],   # § 4.1 — numeracao reinicia por capitulo
        "chaveadas": False,             # § 4.2 — sem marcadores
    },
}

PENDENCIAS_TXT = RAIZ / "ferramentas/pendencias-confissoes.txt"

CABECALHO_PENDENCIAS = """\
# Defeitos conhecidos dos textos confessionais, um por linha:
#
#     documento | unidade | codigo
#
# 'DOCUMENTO' como unidade = achado do arquivo inteiro. Linhas com # sao
# comentario. Gerado por:
#
#     python3 ferramentas/validar_confissoes.py --gravar-pendencias
#
# Estar aqui NAO e' absolvicao: e' o inventario do que ja' se sabe e ainda nao
# se corrigiu, para que o portao continue acusando o que for novo. Corrigiu um
# defeito? Regenere este arquivo — o validador reprova se uma pendencia
# registrada deixar de ser observada, justamente para a lista nao envelhecer.
#
# Alguns achados sao candidatos a revisao editorial, nao erro provado. Ver a
# nota sobre 'abreviacao-fora-da-lista' em problemas_de_referencia().
"""


def ler_pendencias() -> set[tuple[str, str, str]]:
    if not PENDENCIAS_TXT.exists():
        return set()
    out = set()
    for n, linha in enumerate(PENDENCIAS_TXT.read_text(encoding="utf-8").splitlines(), 1):
        if not linha.strip() or linha.startswith("#"):
            continue
        campos = [c.strip() for c in linha.split("|")]
        if len(campos) != 3:
            sys.exit(f"erro: {PENDENCIAS_TXT.name}:{n}: esperava 3 campos: {linha!r}")
        out.add(tuple(campos))
    return out


def gravar_pendencias(itens) -> None:
    linhas = sorted(f"{d} | {u} | {c}\n" for d, u, c in itens)
    PENDENCIAS_TXT.write_text(CABECALHO_PENDENCIAS + "".join(linhas), encoding="utf-8")


# --------------------------------------------------------------------------
# Referencias biblicas — § 1.4
# --------------------------------------------------------------------------
# A convencao e' a da edicao impressa (decisao editorial de 2026-07-27).
# As 49 primeiras foram extraidas do PDF de origem, contando so' as que
# aparecem duas vezes ou mais — e' o inventario atestado, nao um palpite.
# Note 'Êx' com circunflexo: e' assim que o impresso escreve, 19 vezes, e
# nunca 'Ex'. A Belga segue; o Heidelberg diverge e por isso e' acusado.
LIVROS_ATESTADAS = {
    "Gn", "Êx", "Lv", "Nm", "Dt", "1Sm", "2Sm", "1Rs", "2Cr", "Jó", "Sl",
    "Pv", "Ec", "Is", "Jr", "Ez", "Dn", "Jl", "Am", "Mq", "Na", "Hc", "Zc",
    "Ml", "Mt", "Mc", "Lc", "Jo", "At", "Rm", "1Co", "2Co", "Gl", "Ef", "Fp",
    "Cl", "1Ts", "2Ts", "1Tm", "2Tm", "Tt", "Hb", "Tg", "1Pe", "2Pe", "1Jo",
    "2Jo", "Jd", "Ap",
}
# Livros que nenhum dos tres documentos cita. A forma abaixo e' inferida do
# mesmo padrao das atestadas; se um texto novo citar um deles, confira contra
# a edicao antes de confiar.
LIVROS_INFERIDAS = {
    "Js", "Jz", "Rt", "2Rs", "1Cr", "Ed", "Ne", "Et", "Ct", "Lm", "Os", "Ob",
    "Jn", "Sf", "Ag", "Fm", "3Jo",
}
LIVROS = LIVROS_ATESTADAS | LIVROS_INFERIDAS
SIGLA = re.compile(r"\b([1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3})(?=[\s\d.])")
MAIOR_VERSICULO = 176            # Sl 119, o capitulo mais longo


def problemas_de_referencia(entrada: str) -> list[str]:
    """Desvios de § 1.4 numa entrada do bloco de referencias.

    So' roda dentro do bloco: em prosa, § 1.3 permite o nome do livro por
    extenso ("Assim tambem em Genesis 3.22"), que aqui seria falso positivo.

    Sobre a sigla: § 1.4 da' seis exemplos e nao enumera os 66 livros. A
    lista canonica e' a da edicao impressa — decisao editorial de
    2026-07-27, registrada em FORMATO.md § 1.4. Ver LIVROS_ATESTADAS.
    """
    ruins = []
    if not entrada.rstrip().endswith("."):
        ruins.append("entrada nao termina em ponto")
    for sigla in SIGLA.findall(re.sub(r"^\d+\.\s+", "", entrada)):
        if sigla not in LIVROS:
            ruins.append(f"'{sigla}' fora da lista de siglas de § 1.4")
    if re.search(r"\b[1-3]\s+[A-ZÀ-Ú][a-zà-úé]{1,3}\s\d", entrada):
        ruins.append("espaco dentro da sigla (§ 1.4 escreve 1Co, nao 1 Co)")
    for sigla, resto in re.findall(r"([1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3})(\s*\d+[.:]\d+)", entrada):
        if sigla not in LIVROS:
            continue
        if ":" in resto:
            ruins.append(f"{sigla}{resto.strip()} — dois-pontos no lugar do ponto")
        if not resto.startswith(" "):
            ruins.append(f"{sigla}{resto.strip()} — sem espaco apos a sigla")
    if re.search(r"[1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3}\s+\.", entrada):
        ruins.append("espaco antes do ponto do capitulo")
    for cap, ver in re.findall(r"(\d{1,3})\.(\d{1,4})", entrada):
        if int(ver) > MAIOR_VERSICULO:
            ruins.append(f"{cap}.{ver} — versiculo improvavel, digitos colados?")
    return sorted(set(ruins))


def parece_referencia(entrada: str) -> bool:
    """A entrada carrega ao menos uma sigla biblica conhecida?

    Serve para achar a **fronteira** do bloco de § 1.6, nao para julga-lo:
    basta um livro reconhecido. Exigir que todos fossem reconhecidos faria
    uma sigla divergente (`Êx`, `Fl`) derrubar o bloco inteiro e produzir
    dezenas de marcadores orfaos inexistentes — foi o que aconteceu na
    primeira versao. A forma das citacoes quem julga e'
    problemas_de_referencia().

    O que fica de fora sao as listas ordenadas de conteudo: o Credo em P.23,
    os Dez Mandamentos em P.92, as sete acusacoes da Conclusao de Dort.
    """
    corpo = re.sub(r"^\d+\.\s+", "", entrada)
    return any(s in LIVROS for s in SIGLA.findall(corpo))


# --------------------------------------------------------------------------
# Leitura
# --------------------------------------------------------------------------
def titulos(linhas: list[str]) -> list[tuple[int, int, str]]:
    """(indice, nivel, texto) de cada titulo ATX, fora de cerca de codigo."""
    out, cerca = [], False
    for i, l in enumerate(linhas):
        if l.startswith("```"):
            cerca = not cerca
            continue
        if cerca:
            continue
        m = re.match(r"^(#{1,6})\s+(.*)$", l)
        if m:
            out.append((i, len(m.group(1)), m.group(2).strip()))
    return out


def unidades(cfg, linhas):
    """[(nome, numero, linhas_do_corpo)] — o corpo vai ate' o proximo titulo de
    nivel igual ou superior ao da propria unidade."""
    tits = titulos(linhas)
    out = []
    for pos, (i, nivel, _) in enumerate(tits):
        m = cfg["unidade"].match(linhas[i])
        if not m:
            continue
        fim = next((j for j, n2, _ in tits[pos + 1:] if n2 <= nivel), len(linhas))
        out.append((f"{cfg['rotulo']}{m.group(1)}", int(m.group(1)), linhas[i + 1:fim]))
    return out


def marcadores(corpo: str) -> list[int]:
    """§ 1.5 — consecutivos vao numa tag so': <sup>9 10</sup>."""
    out = []
    for m in re.finditer(r"<sup>([\d\s]+)</sup>", corpo):
        out += [int(x) for x in m.group(1).split()]
    return out


def bloco_de_referencias(linhas: list[str]) -> list[str]:
    """Ultimo bloco da unidade (§ 1.6), se for lista de citacoes.

    Pega a corrida contigua de linhas `N. ...` que fecha a unidade e so' a
    aceita se a maioria das entradas for citacao. Aceitar entrada malformada
    e' proposital: se o bloco parasse na primeira entrada quebrada, um erro de
    digitacao no meio faria as chaves seguintes sumirem e o validador acusaria
    dezenas de marcadores orfaos que nao existem.
    """
    fim = len(linhas)
    while fim and not linhas[fim - 1].strip():
        fim -= 1
    ini = fim
    while ini and re.match(r"^\d+\.\s", linhas[ini - 1].strip()):
        ini -= 1
    bloco = [l.strip() for l in linhas[ini:fim]]
    if not bloco:
        return []
    return bloco if sum(map(parece_referencia, bloco)) * 2 >= len(bloco) else []


# --------------------------------------------------------------------------
# Coleta
# --------------------------------------------------------------------------
def coletar(doc: str) -> tuple[list[tuple[str, str, str]], list[str]]:
    """(achados, invariantes_quebradas). Achado = (unidade, codigo, detalhe)."""
    cfg = DOCUMENTOS[doc]
    texto = cfg["md"].read_text(encoding="utf-8")
    linhas = texto.split("\n")
    achados: list[tuple[str, str, str]] = []
    duras: list[str] = []

    def dura(cond, msg):
        print(f"  {'OK ' if cond else '!! '}{msg}")
        if not cond:
            duras.append(f"{doc}: {msg}")

    unids = unidades(cfg, linhas)
    print(f"\n=== {doc} ===")
    print(f"  {cfg['md'].name} — {len(unids)} unidades")

    # Invariantes: quebrar qualquer uma delas significa que o documento deixou
    # de ser o que a spec descreve. Nunca viram pendencia.
    dura(len(unids) == cfg["esperadas"],
         f"{cfg['esperadas']} unidades de conteudo (achou {len(unids)})")
    tits = titulos(linhas)
    dura(bool(tits) and tits[0][1] == 1 and tits[0][2] == cfg["titulo"],
         f"abre com '# {cfg['titulo']}'")
    numeros = [n for _, n, _ in unids]
    if cfg["capitulos"]:
        esperado = [i for qtd in cfg["capitulos"] for i in range(1, qtd + 1)]
        dura(numeros == esperado, f"numeracao reinicia por capitulo {cfg['capitulos']}")
    else:
        dura(numeros == list(range(1, len(numeros) + 1)),
             "unidades numeradas 1..N sem furo nem repeticao")

    for nome, _, corpo_linhas in unids:
        corpo = "\n".join(corpo_linhas)
        marc = marcadores(corpo)
        refs = bloco_de_referencias(corpo_linhas)
        chaves = [int(re.match(r"^(\d+)\.", l).group(1)) for l in refs]

        def achar(codigo, detalhe):
            achados.append((nome, codigo, detalhe))

        if not cfg["chaveadas"]:
            if marc:
                achar("marcador-em-dort", "§ 4.2 nao preve <sup> nos Canones")
            continue

        if marc and not refs:
            achar("sem-bloco-refs", f"{len(marc)} marcador(es) e nenhum bloco de citacoes")
        if marc != sorted(marc):
            achar("marcador-fora-de-ordem", str(marc))
        if chaves and chaves != list(range(1, len(chaves) + 1)):
            achar("chaves-fora-de-1..N", str(chaves))
        if refs:
            orfas = sorted(set(chaves) - set(marc))
            if orfas:
                achar("chave-sem-marcador", f"chave(s) {orfas} sem <sup> no corpo")
            soltos = sorted(set(marc) - set(chaves))
            if soltos:
                achar("marcador-sem-chave", f"<sup>{soltos}</sup> sem entrada no bloco")
        for l in refs:
            # § 1.6 — uma chave por linha
            if len(re.findall(r"(?:^|\s)\d+\.\s+[1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3}[\s\d]", l)) > 1:
                achar("chaves-na-mesma-linha", l[:72])
            for p in problemas_de_referencia(l):
                achar("referencia-malformada", f"{l[:28]}… → {p}")

        if re.search(r"\S<sup>", corpo):
            achar("marcador-colado", "§ 1.5 pede espaco antes de <sup>")
        for m in re.finditer(r"(\w{2,})\(([1-3]?[A-ZÀ-Ú][a-zà-úé]{1,3}) \d", corpo):
            achar("texto-truncado", f"…{m.group(1)}({m.group(2)} … — coluna entrelacada?")

    # Residuo de extracao e desvios de forma do arquivo inteiro.
    for codigo, achado, detalhe in [
        ("zwsp", ZWSP in texto, f"{texto.count(ZWSP)} ocorrencia(s)"),
        ("nbsp", NBSP in texto, f"{texto.count(NBSP)} ocorrencia(s)"),
        ("cerca-de-codigo", "```" in texto, ""),
        ("espaco-no-fim-da-linha", bool(re.search(r"[ \t]+$", texto, re.M)),
         f"{len(re.findall(r'[ \t]+$', texto, re.M))} linha(s)"),
        ("linha-em-branco-dupla", bool(re.search(r"\n{3,}", texto)),
         f"{len(re.findall(chr(10) + '{3,}', texto))} ocorrencia(s)"),
        ("lista-com-asterisco", bool(re.search(r"^\* ", texto, re.M)),
         "§ 1.7 usa hifen como marcador de lista"),
    ]:
        if achado:
            achados.append(("DOCUMENTO", codigo, detalhe))

    return achados, duras


def validar(doc: str, pendencias: set) -> list[str]:
    achados, falhas = coletar(doc)

    vistos = {(doc, u, c) for u, c, _ in achados}
    novos = [(u, c, d) for u, c, d in achados if (doc, u, c) not in pendencias]
    obsoletas = sorted({k for k in pendencias if k[0] == doc} - vistos)

    print(f"  -- {len(achados) - len(novos)} achado(s) ja' registrado(s)")
    for u, c, d in novos:
        print(f"  !! NOVO  {u}: {c} — {d}")
        falhas.append(f"{doc}: {u}: {c} — {d}")
    for _, u, c in obsoletas:
        print(f"  !! pendencia {u}/{c} nao foi observada — corrigida? regenere o registro")
        falhas.append(f"{doc}: pendencia obsoleta: {u}/{c}")
    if not novos and not obsoletas:
        print("  OK nenhum achado fora do registrado")
    return falhas


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("documento", nargs="?", choices=sorted(DOCUMENTOS))
    p.add_argument("--gravar-pendencias", action="store_true",
                   help=f"regrava {PENDENCIAS_TXT.name} com os achados de agora e sai")
    a = p.parse_args()

    docs = [a.documento] if a.documento else sorted(DOCUMENTOS)

    if a.gravar_pendencias:
        if a.documento:
            sys.exit("erro: --gravar-pendencias regrava o arquivo inteiro; nao aceita um documento so'")
        itens = {(d, u, c) for d in docs for u, c, _ in coletar(d)[0]}
        gravar_pendencias(itens)
        print(f"\n{PENDENCIAS_TXT.relative_to(RAIZ)}: {len(itens)} pendencia(s)")
        return 0

    pendencias = ler_pendencias()
    falhas: list[str] = []
    for d in docs:
        falhas += validar(d, pendencias)

    print()
    if falhas:
        print(f"FALHOU — {len(falhas)} verificacao(oes):")
        for f in falhas:
            print(f"  - {f}")
        return 1
    print("tudo certo.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
