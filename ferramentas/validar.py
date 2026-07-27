#!/usr/bin/env python3
"""
Validador dos textos cantados: confere os .md contra os PDFs de origem.

    python3 ferramentas/validar.py            # tudo
    python3 ferramentas/validar.py salmos     # so uma colecao

Sai com codigo != 0 se algo falhar — serve como portao de CI.

--------------------------------------------------------------------------
Sobre a independencia deste script
--------------------------------------------------------------------------
Ele NAO importa o extrair.py: le o PDF por conta propria e compara. Ainda
assim, a classificacao estrofe/versiculo parte da mesma premissa tipografica
que o extrator usa, e uma premissa errada erraria nos dois lugares — foi
exatamente o que deixou os hinos 7 e 8 passarem por validos.

Por isso o peso desta ferramenta esta nas verificacoes que NAO dependem
daquela premissa:

  * integridade lexica — multiconjunto de palavras do PDF x do Markdown.
    Detecta qualquer perda, duplicacao ou invencao de texto, independente
    de como as estrofes foram divididas.
  * invariantes internas do Markdown — sequencias 1..N, ausencia de lixo de
    extracao, forma dos marcadores.

As divergencias propositais de docs/FORMATO.md § 8.2 estao declaradas em
DIVERGENCIAS: sao esperadas, e o validador falha se alguma DEIXAR de existir
(sinal de que uma regeracao as apagou).
"""
from __future__ import annotations

import argparse
import collections
import re
import shutil
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ZW = "​"

COLECOES = {
    "salmos": {
        "pdf":   RAIZ / "fontes/salmos/Salmos - letras.pdf",
        "md":    RAIZ / "fontes/salmos/Salmos - letras.md",
        "capa":  1,
        "titulo_pdf": re.compile(r"^SALMO (\d{1,3}(?:\.\d+-\d+)?[A-Z])$"),
        "titulo_md":  re.compile(r"^## SALMO (\S+)$\n(.*?)(?=^## SALMO |\Z)", re.S | re.M),
        "doc": "SALMOS",
    },
    "hinos": {
        "pdf":   RAIZ / "fontes/hinos/Hinos - letras.pdf",
        "md":    RAIZ / "fontes/hinos/Hinos - letras.md",
        "capa":  3,
        "titulo_pdf": re.compile(r"^(\d{1,3})\. [A-ZÀ-Ú].{3,}$"),
        "titulo_md":  re.compile(r"^## (\d{1,3})\. [^\n]+\n(.*?)(?=^#{1,2} |\Z)", re.S | re.M),
        "doc": "HINOS",
    },
}

# docs/FORMATO.md § 8.2 — o Markdown diverge do PDF de proposito.
# (unidade, o que o PDF traz, o que o Markdown tem de ter)
DIVERGENCIAS = {
    "salmos": [("145A", "12", "21")],
    "hinos":  [("1", "15", "16"), ("1", "16", "17")],
}

isnum = lambda l: re.fullmatch(r"\s*\d{1,3}(-\d{1,3})?\s*", l.replace(ZW, "")) is not None
ind   = lambda l: len(l) - len(l.lstrip())


def texto_do_pdf(pdf: Path) -> str:
    if not shutil.which("pdftotext"):
        sys.exit("erro: pdftotext nao encontrado (instale poppler-utils)")
    r = subprocess.run(["pdftotext", "-layout", str(pdf), "-"],
                       capture_output=True, text=True, check=True)
    return r.stdout


def ler_pdf(cfg):
    """Marcadores por unidade, direto do PDF."""
    paginas = texto_do_pdf(cfg["pdf"]).split("\f")
    linhas = [l.rstrip() for l in
              "\n".join(p.strip("\n") for p in paginas[cfg["capa"]:]).split("\n")]

    def prox(i):
        j = i + 1
        while j < len(linhas) and not linhas[j].replace(ZW, "").strip():
            j += 1
        return j if j < len(linhas) else None

    def estrofe(i, l):
        if "-" in l.replace(ZW, "").strip():
            return False
        if ZW in l:
            return True
        j1 = prox(i)
        if j1 is None:
            return True
        if isnum(linhas[j1]):
            return True
        j2 = prox(j1)
        if j2 is None or isnum(linhas[j2]) or cfg["titulo_pdf"].match(linhas[j2].replace(ZW, "").strip()):
            return ind(linhas[j1]) == 0
        return ind(linhas[j1]) == ind(linhas[j2])

    unid, cur = {}, None
    for i, l in enumerate(linhas):
        s = l.replace(ZW, "").strip()
        if not s:
            continue
        m = cfg["titulo_pdf"].match(s)
        if m:
            cur = m.group(1)
            unid[cur] = {"st": [], "vs": []}
            continue
        if cur is None:
            continue
        if isnum(l):
            unid[cur]["st" if estrofe(i, l) else "vs"].append(s)
        else:
            for mm in re.finditer(r"(?<= )(\d{1,3}(?:-\d{1,3})?)(?= )|(?<=_)(\d{1,3})(?= )", s):
                unid[cur]["vs"].append(mm.group(1) or mm.group(2))
    return unid, "\n".join(linhas), "\n".join(paginas[:cfg["capa"]])


def ler_md(cfg):
    md = cfg["md"].read_text(encoding="utf-8")
    unid = {}
    for m in cfg["titulo_md"].finditer(md):
        sec = m.group(2)
        unid[m.group(1)] = {
            "st": re.findall(r"^\*\*(\d+)\*\*$", sec, re.M),
            "vs": re.findall(r"<sup>([\d-]+)</sup>", sec),
            "txt": sec,
        }
    return md, unid


def palavras(s: str) -> collections.Counter:
    s = s.replace(ZW, "").replace("\\_", "_").replace("\\-", "-")
    s = re.sub(r"<sup>[\d-]+</sup>", " ", s)
    s = re.sub(r"^\s*\d{1,3}(-\d{1,3})?\s*$", " ", s, flags=re.M)
    return collections.Counter(re.findall(r"[^\W\d_]+", s, re.UNICODE))


def aplicar_divergencias(colecao, ref):
    """Reescreve a referencia do PDF com as correcoes declaradas em § 8.2."""
    for uid, de, para in DIVERGENCIAS.get(colecao, []):
        vs = ref[uid]["vs"]
        for k in range(len(vs) - 1, -1, -1):     # a ultima ocorrencia
            if vs[k] == de:
                vs[k] = para
                break
    return ref


def validar(colecao: str) -> list[str]:
    cfg = COLECOES[colecao]
    ref, corpo_pdf, capa_pdf = ler_pdf(cfg)
    md, got = ler_md(cfg)
    ref = aplicar_divergencias(colecao, ref)
    falhas: list[str] = []

    def checar(cond, msg):
        print(f"  {'OK ' if cond else '!! '}{msg}")
        if not cond:
            falhas.append(f"{colecao}: {msg}")

    print(f"\n=== {colecao} ===")
    print(f"  unidades: PDF {len(ref)} | Markdown {len(got)}")

    checar(set(ref) == set(got), "as unidades do PDF e do Markdown sao as mesmas")

    ruins = [u for u in ref if u in got
             and len(got[u]["st"]) != max(len(ref[u]["st"]), 1)]
    checar(not ruins, f"contagem de estrofes bate com o PDF  {ruins[:6]}")

    ruins = [u for u, d in got.items()
             if [int(x) for x in d["st"]] != list(range(1, len(d["st"]) + 1))]
    checar(not ruins, f"estrofes numeradas 1..N sem furo  {ruins[:6]}")

    ruins = [u for u in ref if u in got and got[u]["vs"] != ref[u]["vs"]]
    checar(not ruins, f"sequencia de versiculos bate com o PDF  {ruins[:6]}")

    perdidas = palavras(capa_pdf + "\n" + corpo_pdf) - palavras(md)
    extras = palavras(md) - palavras(capa_pdf + "\n" + corpo_pdf)
    extras.pop(cfg["doc"], None)          # o h1 do documento e' nosso
    checar(not perdidas, f"nenhuma palavra do PDF ausente  {perdidas.most_common(5)}")
    checar(not extras, f"nenhuma palavra inventada  {extras.most_common(5)}")

    # --- invariantes de forma (docs/FORMATO.md § 5 e § 6) ---
    checar("```" not in md, "sem cercas de codigo residuais")
    checar(ZW not in md and " " not in md, "sem ZWSP nem NBSP residuais")
    checar(not re.search(r"[ \t]+$", md, re.M), "sem espaco no fim de linha")
    checar(not re.search(r"\n{3,}", md), "sem linha em branco dupla")
    checar(not re.search(r"^> ", md, re.M), "refrao com '>' colado, sem espaco")
    checar(not [l for l in md.split("\n") if re.fullmatch(r"Am[ée]m\.?", l.strip())],
           "nenhum fecho 'Amem' sem italico")

    soltos = []
    for uid, d in got.items():
        linhas = d["txt"].split("\n")
        try:
            ini = next(i for i, l in enumerate(linhas) if re.fullmatch(r"\*\*\d+\*\*", l))
        except StopIteration:
            ini = 0
        for l in linhas[ini:]:
            if not l.strip() or l.startswith(("**", "_", "#")):
                continue
            corpo = re.sub(r"<sup>[\d-]+</sup>", "", l)
            corpo = re.sub(r"\(\d+x\)", "", corpo)      # '(2x)' e' repeticao
            soltos += [(uid, n.group()) for n in re.finditer(r"\d+", corpo)]
    checar(not soltos, f"nenhum numero solto na letra  {soltos[:6]}")

    for uid, de, para in DIVERGENCIAS.get(colecao, []):
        checar(uid in got and para in got[uid]["vs"],
               f"divergencia declarada de § 8.2 presente: {uid} {de}->{para}")

    return falhas


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("colecao", nargs="?", choices=sorted(COLECOES))
    a = p.parse_args()

    falhas: list[str] = []
    for c in ([a.colecao] if a.colecao else sorted(COLECOES)):
        falhas += validar(c)

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
