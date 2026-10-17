"""간단판 설치 가이드 그림 (zeroone 팔레트). 실행: /usr/bin/python3 gen.py"""
from xml.sax.saxutils import escape
import cairosvg

PAPER, WHITE, INK, LIME, TEAL, BODY, MUTED, HAIR, RED = (
    "#F7F5F0", "#FFFFFF", "#071A1D", "#B7F34A", "#0B6B68", "#102027", "#64757D", "#DDE3E2", "#C00000")
KR, MONO = "Noto Sans CJK KR", "Menlo"


def T(x, y, s, size=32, color=BODY, weight=700, anchor="middle", font=KR):
    return (f'<text x="{x}" y="{y}" font-family="{font}" font-size="{size}" font-weight="{weight}" '
            f'fill="{color}" text-anchor="{anchor}" dominant-baseline="middle">{escape(s)}</text>')


def R(x, y, w, h, fill, stroke=None, rx=8, sw=2, dash=None):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    if dash: st += f' stroke-dasharray="{dash}"'
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{st}/>'


DEFS = (f'<defs><marker id="ah" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto" '
        f'markerUnits="strokeWidth"><path d="M0,1 L8,5 L0,9 z" fill="{TEAL}"/></marker></defs>')


def save(name, w, h, body):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
           f'{DEFS}<rect width="{w}" height="{h}" fill="{PAPER}"/>{"".join(body)}</svg>')
    cairosvg.svg2png(bytestring=svg.encode(), write_to=f"fig/{name}.png", output_width=w * 2, output_height=h * 2)
    print(f"fig/{name}.png ratio {w}/{h}")


def box(x, y, w, h, kind, lines, num=None):
    fill = {"white": WHITE, "dark": INK, "lime": LIME}[kind]
    out = [R(x, y, w, h, fill, HAIR if kind == "white" else None)]
    ct = {"white": BODY, "dark": LIME, "lime": INK}[kind]
    cb = {"white": MUTED, "dark": WHITE, "lime": INK}[kind]
    cm = {"white": TEAL, "dark": LIME, "lime": INK}[kind]
    rows = ([(num, 34, "n")] if num else []) + lines
    gap = 14
    total = sum(s for _, s, _ in rows) * 1.25 + gap * (len(rows) - 1)
    cy = y + (h - total) / 2
    for t, s, role in rows:
        cy += s * 1.25 / 2
        col, font, wt = {"n": (cm if kind != "lime" else TEAL, KR, 700), "t": (ct, KR, 700),
                         "m": (cm, MONO, 700), "b": (cb, KR, 400)}[role]
        out.append(T(x + w / 2, cy, t, s, col, wt, font=font))
        cy += s * 1.25 / 2 + gap
    return out


def flow(name, steps, w=1600, h=420, top=20):
    n = len(steps); gap = 56; bw = (w - 20 - gap * (n - 1)) / n; bh = h - top * 2
    body = []
    for i, (kind, num, lines) in enumerate(steps):
        x = 10 + i * (bw + gap)
        body += box(x, top, bw, bh, kind, lines, num)
        if i < n - 1:
            body.append(f'<line x1="{x + bw + 6}" y1="{top + bh / 2}" x2="{x + bw + gap - 10}" y2="{top + bh / 2}" '
                        f'stroke="{TEAL}" stroke-width="5" marker-end="url(#ah)"/>')
    save(name, w, h, body)


# g1 — 무엇을 설치하나
def g1():
    W, H = 1600, 560
    cols = [
        ("lime", "기본 · 필수", "Claude", "데스크톱 앱", ["대화와 Code가", "앱 하나에"]),
        ("white", "보완", "VS Code", "편집기", ["파일을 보며", "작업할 때"]),
        ("white", "보완", "Claude Code", "VS Code 확장", ["편집기 안에서", "Claude 사용"]),
        ("white", "선택", "Git", "윈도우 권장", ["없어도 동작", "깔아 두면 안정"]),
    ]
    bw, gap = 300, 26
    b = []
    for i, (kind, tag, name, sub, desc) in enumerate(cols):
        x = 10 + i * (bw + gap)
        b += [R(x, 10, bw, 540, LIME if kind == "lime" else WHITE, None if kind == "lime" else HAIR),
              T(x + bw / 2, 62, tag, 30, INK if kind == "lime" else TEAL),
              T(x + bw / 2, 170, name, 40, INK),
              T(x + bw / 2, 230, sub, 30, INK if kind == "lime" else MUTED, 400),
              f'<line x1="{x + 40}" y1="290" x2="{x + bw - 40}" y2="290" stroke="{INK if kind == "lime" else HAIR}" stroke-width="2"/>',
              T(x + bw / 2, 360, desc[0], 30, BODY, 400), T(x + bw / 2, 410, desc[1], 30, BODY, 400)]
    # Node.js — 필요 없음
    x = 10 + 4 * (bw + gap)
    w5 = W - 10 - x
    b += [R(x, 10, w5, 540, PAPER, MUTED, dash="12 8"),
          T(x + w5 / 2, 62, "필요 없음", 30, RED),
          T(x + w5 / 2, 170, "Node.js", 40, MUTED),
          f'<line x1="{x + 40}" y1="150" x2="{x + w5 - 40}" y2="190" stroke="{RED}" stroke-width="5"/>',
          T(x + w5 / 2, 230, "따로 안 깐다", 30, MUTED, 400),
          T(x + w5 / 2, 360, "앱·확장에", 30, BODY, 400), T(x + w5 / 2, 410, "이미 들어 있음", 30, BODY, 400)]
    save("g1_overview", W, H, b)


def g2():
    flow("g2_desktop", [
        ("white", "01", [("내려받기", 34, "t"), ("claude.com/", 28, "m"), ("download", 28, "m")]),
        ("white", "02", [("설치 파일 실행", 34, "t"), ("관리자 권한", 30, "b"), ("필요 없음", 30, "b")]),
        ("white", "03", [("로그인", 34, "t"), ("브라우저에서", 30, "b"), ("승인", 30, "b")]),
        ("dark", "04", [("Code 열기", 34, "t"), ("왼쪽 Code 선택", 30, "b"), ("(오른쪽은 대화)", 28, "b")]),
        ("lime", "05", [("폴더 선택", 34, "t"), ("Local →", 30, "b"), ("Select folder", 30, "b")]),
    ])


def g3():
    flow("g3_vscode", [
        ("white", "01", [("내려받기", 34, "t"), ("code.visual", 28, "m"), ("studio.com", 28, "m")]),
        ("white", "02", [("설치", 34, "t"), ("윈 User Installer", 28, "b"), ("맥 응용 프로그램으로", 28, "b")]),
        ("white", "03", [("실행", 34, "t"), ("윈 시작 메뉴", 28, "b"), ("맥 응용 프로그램", 28, "b")]),
        ("lime", "04", [("폴더 열기", 34, "t"), ("파일 →", 30, "b"), ("폴더 열기", 30, "b")]),
    ])


def g4():
    flow("g4_extension", [
        ("white", "01", [("확장 화면", 34, "t"), ("Ctrl+Shift+X", 26, "m"), ("(맥 Cmd+Shift+X)", 24, "b")]),
        ("white", "02", [("검색", 34, "t"), ("Claude Code", 30, "b"), ("제작자 Anthropic", 28, "b")]),
        ("white", "03", [("Install", 34, "t"), ("설치 단추", 30, "b"), ("누르기", 30, "b")]),
        ("dark", "04", [("Spark 아이콘", 34, "t"), ("편집기", 30, "b"), ("오른쪽 위", 30, "b")]),
        ("lime", "05", [("Sign in", 34, "t"), ("브라우저에서", 30, "b"), ("승인", 30, "b")]),
    ])


for f in (g1, g2, g3, g4):
    f()
