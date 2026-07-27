#!/usr/bin/env python3
"""
Extrator dos textos cantados: PDF -> Markdown no formato de docs/FORMATO.md.

    python3 ferramentas/extrair.py salmos
    python3 ferramentas/extrair.py hinos --conferir

Depende de `pdftotext` (poppler-utils). A extracao usa `-layout`, que preserva
a coluna do texto: e' dela que saem todos os sinais usados aqui.

--------------------------------------------------------------------------
Sinais, todos tipograficos — nada e' inferido do sentido do texto
--------------------------------------------------------------------------

ESTROFE x VERSICULO. Um numero sozinho na linha pode ser qualquer um dos dois.
Na ordem de confianca:

  1. ZWSP (U+200B) colado ao numero  -> estrofe. O gerador do PDF marca assim,
     mas nao de forma uniforme: parte das estrofes sai sem o marcador.
  2. Numero seguido de outro numero  -> estrofe (o segundo e' o versiculo).
  3. Comparacao de indentacao. O numero de VERSICULO e' sobrescrito: o
     pdftotext empurra para a direita a linha que o segue, deixando-a mais
     funda que a seguinte a ela. O de ESTROFE fica sozinho, e a linha que o
     segue esta na indentacao normal do bloco — igual a seguinte.

        7                       <- versiculo: L1 (ind 3) != L2 (ind 0)
           No dia da tragedia,
        Mas o Senhor a mim...

         1                      <- estrofe: L1 (ind 10) == L2 (ind 10)
              Creio em Deus Pai,
              Deus que da terra...

     A comparacao e' relativa de proposito. Um teste absoluto ("a linha
     seguinte esta na coluna 0") funciona nos salmos e falha nos hinos 7 e 8,
     que sao diagramados inteiramente indentados.

  Intervalo ('4-5') e' sempre versiculo: estrofe nunca vem em intervalo.

REFRAO. Bloco sem numero de estrofe, situado ENTRE duas estrofes.
FECHO.  Bloco sem numero de estrofe, situado DEPOIS da ultima, e cujo texto e'
        exatamente 'Amem'/'Amem.'. Ver docs/FORMATO.md § 5.3.1 e § 5.3.2.
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ZW = "\u200b"

RE_NUM   = re.compile(r"^\s*(\d{1,3})(-\d{1,3})?\s*$")
RE_SALMO = re.compile(r"^SALMO (\d{1,3}(?:\.\d+-\d+)?)([A-Z])$")
RE_HINO  = re.compile(r"^(\d{1,3})\.\s+(.+?)\s*$")
RE_REFBIB = re.compile(r"^[1-3]?\s?[A-ZÀ-Ú][a-zà-ú]+ \d+[.:]\d")
RE_FECHO  = re.compile(r"^Am[ée]m\.?$")

# Marcador de versiculo solto no meio da linha cantada, nas tres formas que
# a fonte usa: entre espacos, em intervalo, ou colado a marca de elisao.
RE_INLINE = re.compile(
    r"<sup>(\d{1,3})(?:-(\d{1,3}))?</sup>"
    r"|(?<= )(\d{1,3})(?:-(\d{1,3}))?(?= )"
    r"|(?<=\\_)(\d{1,3})(?= )"
)

# --------------------------------------------------------------------------
# Divergencias propositais entre o Markdown e o PDF — docs/FORMATO.md § 8.2.
# O impresso esta errado e o arquivo esta certo; sem isto, toda regeracao
# reintroduz o erro. Cada troca e' verificada: se nao casar, o script aborta.
# --------------------------------------------------------------------------
CORRECOES: dict[str, list[tuple[str, str]]] = {
    "salmos": [
        # Sl 145.21; a fonte transpoe os digitos e imprime '12'.
        ("<sup>12</sup> Profira", "<sup>21</sup> Profira"),
    ],
    "hinos": [
        # Ex 20.16 e 20.17; a fonte repete o versiculo 15 e para em 16.
        ("<sup>15</sup> Contra o teu", "<sup>16</sup> Contra o teu"),
        ("<sup>16</sup> E não cobice", "<sup>17</sup> E não cobice"),
    ],
}

COLECOES = {
    "salmos": {
        "pdf":      RAIZ / "fontes/salmos/Salmos - letras.pdf",
        "saida":    RAIZ / "fontes/salmos/Salmos - letras.md",
        "titulo":   "SALMOS",
        "capa":     1,      # paginas de rosto/indice antes do corpo
        "secoes":   False,  # tem agrupamento por secao?
    },
    "hinos": {
        "pdf":      RAIZ / "fontes/hinos/Hinos - letras.pdf",
        "saida":    RAIZ / "fontes/hinos/Hinos - letras.md",
        "titulo":   "HINOS",
        "capa":     3,
        "secoes":   True,
    },
}


def ind(linha: str) -> int:
    return len(linha) - len(linha.lstrip())


def marcador(linha: str):
    """(texto, tem_zwsp, e_intervalo) se a linha for so um numero; senao None."""
    m = RE_NUM.match(linha.replace(ZW, ""))
    if not m:
        return None
    return m.group(1) + (m.group(2) or ""), ZW in linha, m.group(2) is not None


def vazia(linha: str) -> bool:
    """ZWSP sozinho nao e' conteudo, mas str.strip() nao o remove."""
    return not linha.replace(ZW, "").strip()


def limpar(texto: str) -> str:
    """Escapa o que o Markdown leria como marcacao e nao e'."""
    t = texto.replace(ZW, "").strip().replace("_", r"\_")
    if t.startswith("-") and not t.startswith("--"):
        t = "\\" + t          # hifen inicial viraria item de lista
    return t


class Unidade:
    def __init__(self, ident: str, titulo: str):
        self.id = ident
        self.titulo = titulo
        self.cabecalho: list[str] = []      # referencia biblica e/ou atribuicao
        self.blocos: list[tuple[str | None, list[str]]] = []   # (rotulo, linhas)


def extrair_texto(pdf: Path) -> str:
    if not shutil.which("pdftotext"):
        sys.exit("erro: pdftotext nao encontrado (instale poppler-utils)")
    if not pdf.exists():
        sys.exit(f"erro: PDF nao encontrado: {pdf}")
    r = subprocess.run(["pdftotext", "-layout", str(pdf), "-"],
                       capture_output=True, text=True, check=True)
    return r.stdout


def analisar(corpo: str, colecao: str, secoes: set[str]):
    """Devolve (unidades, {indice_da_unidade: secao_que_a_precede})."""
    linhas = [l.rstrip() for l in corpo.split("\n")]
    unidades: list[Unidade] = []
    marcas: dict[int, str] = {}
    atual: Unidade | None = None
    rotulo: str | None = None
    acumulado: list[str] = []
    pendente: str | None = None       # versiculo aguardando a proxima linha
    depois_de_branco = False

    def proxima(i: int):
        j = i + 1
        while j < len(linhas) and vazia(linhas[j]):
            j += 1
        return j if j < len(linhas) else None

    def e_estrofe(i: int, linha: str) -> bool:
        j1 = proxima(i)
        if j1 is None:
            return True
        if marcador(linhas[j1]):
            return True
        j2 = proxima(j1)
        if j2 is None or marcador(linhas[j2]) or e_titulo(linhas[j2]):
            return ind(linhas[j1]) == 0
        return ind(linhas[j1]) == ind(linhas[j2])

    def e_titulo(linha: str) -> bool:
        s = linha.replace(ZW, "").strip()
        if colecao == "salmos":
            return bool(RE_SALMO.match(s))
        m = RE_HINO.match(s)
        return bool(m and m.group(2) == m.group(2).upper() and len(m.group(2)) > 3)

    def fechar_bloco():
        nonlocal rotulo, acumulado
        if acumulado:
            atual.blocos.append((rotulo, acumulado))
        rotulo, acumulado = None, []

    def fechar_unidade():
        nonlocal atual
        if atual is not None:
            fechar_bloco()
            unidades.append(atual)
        atual = None

    for i, linha in enumerate(linhas):
        if vazia(linha):
            depois_de_branco = True
            continue
        nu = linha.replace(ZW, "").strip()

        if secoes and nu in secoes:
            fechar_unidade()
            marcas[len(unidades)] = nu
            depois_de_branco = False
            continue

        if e_titulo(linha):
            fechar_unidade()
            if colecao == "salmos":
                m = RE_SALMO.match(nu)
                atual = Unidade(m.group(1) + m.group(2), f"SALMO {m.group(1)}{m.group(2)}")
            else:
                m = RE_HINO.match(nu)
                atual = Unidade(m.group(1), f"{m.group(1)}. {m.group(2)}")
            pendente, depois_de_branco = None, False
            continue

        if atual is None:
            depois_de_branco = False
            continue

        mk = marcador(linha)

        # cabecalho: so antes de qualquer conteudo
        if not atual.blocos and rotulo is None and not acumulado and mk is None:
            if nu.startswith("("):
                atual.cabecalho.append(nu)
                depois_de_branco = False
                continue
            if colecao == "hinos" and not atual.cabecalho and RE_REFBIB.match(nu):
                atual.cabecalho.append(nu)
                depois_de_branco = False
                continue
        if (atual.cabecalho and atual.cabecalho[-1].startswith("(")
                and not atual.cabecalho[-1].endswith(")")
                and not atual.blocos and not acumulado):
            atual.cabecalho[-1] += " " + nu          # atribuicao quebrada em duas
            depois_de_branco = False
            continue

        if mk is not None:
            texto, zwsp, intervalo = mk
            if intervalo or not (zwsp or e_estrofe(i, linha)):
                pendente = texto
            else:
                fechar_bloco()
                rotulo = texto
            depois_de_branco = False
            continue

        # fecho liturgico: 'Amem' sozinho, em bloco proprio, no fim da unidade
        # (o que vier depois tem de ser o titulo seguinte, nao mais letra)
        seguinte = proxima(i)
        if (depois_de_branco and RE_FECHO.match(nu)
                and (seguinte is None or e_titulo(linhas[seguinte])
                     or (secoes and linhas[seguinte].strip() in secoes))):
            fechar_bloco()
            atual.blocos.append(("fecho", [nu]))
            depois_de_branco = False
            continue

        # refrao: bloco indentado, sem numero, apos linha em branco
        if depois_de_branco and (acumulado or atual.blocos) and ind(linha) >= 5:
            fechar_bloco()

        texto = limpar(linha)
        if pendente is not None:
            texto = f"<sup>{pendente}</sup> {texto}"
            pendente = None
        acumulado.append(texto)
        depois_de_branco = False

    fechar_unidade()
    return unidades, marcas


def marcar_inline(linhas: list[str]) -> list[str]:
    """
    Envolve em <sup> os numeros de versiculo que ficaram no meio da linha.
    So marca o que continua a sequencia: o numero tem de ser (ultimo + 1) e
    ficar abaixo do proximo marcador ja existente.
    """
    fichas = []
    for i, l in enumerate(linhas):
        if l.startswith((">", "_", "**")) or not l.strip():
            continue
        for m in RE_INLINE.finditer(l):
            posto = m.group(1) is not None
            if posto:
                a, b = int(m.group(1)), m.group(2)
            elif m.group(3) is not None:
                a, b = int(m.group(3)), m.group(4)
            else:
                a, b = int(m.group(5)), None
            fichas.append({"i": i, "m": m, "posto": posto,
                           "a": a, "b": int(b) if b else None})

    ultimo, edicoes = 0, {}
    for k, f in enumerate(fichas):
        if f["posto"]:
            ultimo = f["b"] or f["a"]
            continue
        seguinte = next((x["a"] for x in fichas[k + 1:] if x["posto"]), None)
        fim = f["b"] or f["a"]
        # '<=' e nao '<': o hino 1 imprime o versiculo 15 duas vezes (§ 8.2),
        # e a correcao que desfaz isso so roda depois da renderizacao
        if f["a"] == ultimo + 1 and (seguinte is None or fim <= seguinte):
            rot = f"{f['a']}-{f['b']}" if f["b"] else str(f["a"])
            edicoes.setdefault(f["i"], []).append((f["m"].start(), f["m"].end(), rot))
            ultimo = fim

    saida = list(linhas)
    for i, subs in edicoes.items():
        s = saida[i]
        for ini, fim_, rot in sorted(subs, reverse=True):
            s = s[:ini] + f"<sup>{rot}</sup>" + s[fim_:]
        saida[i] = s
    return saida


def renderizar(unidades, marcas, titulo_doc, capa) -> str:
    saida = [f"# {titulo_doc}", ""] + capa
    for i, u in enumerate(unidades):
        if i in marcas:
            saida += [f"# {marcas[i]}", ""]
        saida += [f"## {u.titulo}", ""]
        for c in u.cabecalho:
            saida.append(f"_{c[1:-1].strip()}_" if c.startswith("(") and c.endswith(")") else c)
        if u.cabecalho:
            saida.append("")

        # a estrofe 1 sai sem numero em parte das unidades; recupera-se pela
        # sequencia: se o primeiro bloco nao tem rotulo e o resto comeca em 2
        blocos = list(u.blocos)
        if blocos and blocos[0][0] is None:
            resto = [r for r, _ in blocos[1:] if r not in (None, "fecho")]
            if not resto or resto[0] != "1":
                blocos[0] = ("1", blocos[0][1])

        numeradas = [k for k, (r, _) in enumerate(blocos) if r not in (None, "fecho")]
        ultima = numeradas[-1] if numeradas else -1

        corpo: list[str] = []
        for k, (rot, linhas) in enumerate(blocos):
            if rot == "fecho":
                corpo += [f"_{linhas[0]}_", ""]
            elif rot is None:
                if k < ultima:                       # entre estrofes -> refrao
                    corpo += [">" + l for l in linhas] + [""]
                else:
                    corpo += linhas + [""]
            else:
                corpo += [f"**{rot}**"] + linhas + [""]
        saida += marcar_inline(corpo)

    while saida and not saida[-1]:
        saida.pop()
    return re.sub(r"\n{3,}", "\n\n", "\n".join(saida)) + "\n"


def montar_capa(paginas: list[str], secoes: set[str]) -> list[str]:
    capa: list[str] = []
    for l in "\n".join(paginas).split("\n"):
        s = l.replace(ZW, "").strip()
        if not s:
            if capa and capa[-1] != "":
                capa.append("")
            continue
        if s.startswith("CLASSIFICAÇÃO"):
            capa += [f"# {s}", ""]
        elif s in secoes:
            if capa and capa[-1] != "":
                capa.append("")
            capa += [f"## {s}", ""]
        else:
            capa.append(limpar(l))
    while capa and not capa[-1]:
        capa.pop()
    capa.append("")
    return capa


def aplicar_correcoes(md: str, colecao: str) -> str:
    for antes, depois in CORRECOES.get(colecao, []):
        if md.count(antes) != 1:
            sys.exit(f"erro: correcao de § 8.2 nao casou exatamente uma vez "
                     f"em {colecao}: {antes!r} ({md.count(antes)}x). "
                     f"O PDF mudou? Revise CORRECOES.")
        md = md.replace(antes, depois, 1)
    return md


def gerar(colecao: str) -> str:
    cfg = COLECOES[colecao]
    paginas = extrair_texto(cfg["pdf"]).split("\f")
    capa_pgs, corpo_pgs = paginas[:cfg["capa"]], paginas[cfg["capa"]:]

    secoes: set[str] = set()
    if cfg["secoes"]:
        for l in "\n".join(capa_pgs).split("\n"):
            s = l.strip()
            if (s and s == s.upper() and not re.match(r"^\d", s)
                    and len(s) > 3 and not s.startswith("CLASSIFICAÇÃO")):
                secoes.add(s)

    corpo = "\n".join(p.strip("\n") for p in corpo_pgs)
    unidades, marcas = analisar(corpo, colecao, secoes)
    md = renderizar(unidades, marcas, cfg["titulo"], montar_capa(capa_pgs, secoes))
    return aplicar_correcoes(md, colecao)


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("colecao", choices=sorted(COLECOES))
    p.add_argument("--conferir", action="store_true",
                   help="nao grava; compara com o arquivo existente e sai != 0 se diferir")
    a = p.parse_args()

    md = gerar(a.colecao)
    destino = COLECOES[a.colecao]["saida"]

    if a.conferir:
        atual = destino.read_text(encoding="utf-8") if destino.exists() else ""
        if atual == md:
            print(f"OK  {destino.name}: identico ao gerado do PDF")
            return 0
        import difflib
        d = list(difflib.unified_diff(atual.split("\n"), md.split("\n"),
                                      "no repositorio", "gerado do PDF", lineterm="", n=1))
        print(f"DIFERE  {destino.name}: {len(d)} linhas de diff")
        print("\n".join(d[:60]))
        return 1

    destino.write_text(md, encoding="utf-8")
    print(f"gravado {destino.relative_to(RAIZ)}  ({len(md.encode()):,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
