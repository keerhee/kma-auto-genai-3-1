#!/usr/bin/env python3
"""
zeroone-pitch-deck 전용 matplotlib 스타일 헬퍼 (v1.9).

데이터 차트(시계열·분포·산점도·비교·민감도)를 이 덱 팔레트로 그려
figImg / figureSlide / figurePanelSlide에 바로 얹을 PNG를 만든다.

핵심 규칙 (SKILL.md §7.4)
  1) 배경은 아이보리(#F7F5F0)로 칠한다 — 투명·흰 배경은 슬라이드 위에서 사각형으로 뜬다.
  2) 크기는 §7.2의 비율 프리셋(wide / square / panel)으로 고른다.
  3) 글씨는 슬라이드에서 16pt 하한을 지키도록 키운다 (프리셋별 자동).
  4) 한글은 Noto Sans CJK KR. 수식 라벨은 mathtext($\\sigma_t$)로 — 텍스트로 풀어쓰지 않는다.
  5) 계열 색 순서: teal → blue → amber → muted. 라임은 '결과·도착점' 계열 하나에만.

사용:
    from zo_mpl import fig, save, C
    f, ax = fig("wide")                       # 1600×620 비율
    ax.plot(x, y, color=C["teal"], label="기준")
    ax.plot(x, y2, color=C["lime_dk"], label="결과")   # 강조 계열
    save(f, "chart.png")                      # → ratio 를 출력한다
    # build.js:  T.figureSlide(T.slide(), {..., path:"chart.png", ratio:1600/620})
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager

C = {
    "ink": "#071A1D", "paper": "#F7F5F0", "white": "#FFFFFF",
    "lime": "#B7F34A", "lime_dk": "#7DBE1E",   # 라인·작은 마커는 라임이 묽어 보여 진한 라임 사용
    "teal": "#0B6B68", "body": "#102027", "red": "#C00000",
    "blue": "#4677F5", "amber": "#F3A33C", "muted": "#64757D", "hair": "#DDE3E2",
}
CYCLE = [C["teal"], C["blue"], C["amber"], C["muted"], C["body"]]

# 이름: (가로in, 세로in, 기본 폰트pt) — 200dpi로 저장하면 §7.2의 px 크기가 된다
PRESETS = {
    "wide":   (8.0, 3.1, 15),   # 1600×620  → figureSlide 전체폭 (슬라이드에서 약 1.47배 확대)
    "square": (6.0, 3.6, 15),   # 1200×720  → 정방형에 가까운 전체폭
    "panel":  (5.6, 3.6, 15),   # 1120×720  → figurePanelSlide 우측 (실제 표시 폭 약 5.6~6in)
    # 그림 크기를 키우면 슬라이드에서 축소되어 글씨가 작아진다 — 표시 폭에 가깝게 잡는다
}
DPI = 200


def _font():
    for name in ("Noto Sans KR", "Noto Sans CJK KR", "Noto Sans CJK JP", "Noto Sans CJK SC"):
        try:
            font_manager.findfont(name, fallback_to_default=False)
            return name
        except Exception:
            continue
    return "DejaVu Sans"


def style(base_pt=14):
    plt.rcParams.update({
        "font.family": _font(),
        "axes.unicode_minus": False,
        "mathtext.fontset": "cm",          # 수식 라벨은 LaTeX(Computer Modern) 외관
        "font.size": base_pt,
        "axes.titlesize": base_pt + 3, "axes.titleweight": "bold",
        "axes.labelsize": base_pt + 1, "axes.labelcolor": C["body"],
        "xtick.labelsize": base_pt, "ytick.labelsize": base_pt,
        "xtick.color": C["muted"], "ytick.color": C["muted"],
        "legend.fontsize": base_pt, "legend.frameon": False,
        "axes.edgecolor": C["hair"], "axes.linewidth": 1.0,
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.grid": True, "grid.color": C["hair"], "grid.linewidth": 0.8,
        "axes.prop_cycle": matplotlib.cycler(color=CYCLE),
        "lines.linewidth": 2.6, "lines.markersize": 7,
        "figure.facecolor": C["paper"], "axes.facecolor": C["paper"],
        "savefig.facecolor": C["paper"], "text.color": C["body"],
    })


def fig(preset="wide", nrows=1, ncols=1, **kw):
    w, h, pt = PRESETS[preset]
    style(pt)
    return plt.subplots(nrows, ncols, figsize=(w, h), **kw)


def save(f, path):
    """아이보리 배경으로 저장하고 figImg 에 넘길 ratio 를 출력한다."""
    f.tight_layout(pad=0.6)
    w, h = f.get_size_inches()
    f.savefig(path, dpi=DPI, facecolor=C["paper"])
    plt.close(f)
    px_w, px_h = round(w * DPI), round(h * DPI)
    print(f"[zo_mpl] {path}  {px_w}×{px_h}  ratio:{px_w}/{px_h}")
    return px_w / px_h


if __name__ == "__main__":       # 자가 점검: 세 프리셋을 한 장씩 그린다
    import numpy as np
    x = np.arange(60)
    rng = np.random.default_rng(0)
    f, ax = fig("wide")
    ax.plot(x, np.cumsum(rng.normal(0, 1, 60)), label="기준 시나리오")
    ax.plot(x, np.cumsum(rng.normal(0.15, 1, 60)), color=C["lime_dk"], label="제안 시나리오")
    ax.set_title(r"누적 성과 $\sum_{t} r_t$"); ax.legend(loc="upper left")
    save(f, "zo_demo_wide.png")
    f, ax = fig("panel")
    ax.hist(rng.normal(0, 1, 2000), bins=40, color=C["teal"], alpha=0.85)
    ax.set_xlabel(r"수익률 $r_t$"); ax.set_ylabel("빈도")
    save(f, "zo_demo_panel.png")
