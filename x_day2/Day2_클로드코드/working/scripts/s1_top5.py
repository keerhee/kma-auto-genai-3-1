"""① EV 시장 — Top5 막대 + 2025 제조사별 + 연도별 추이 → output/01_EV시장_Top5.xlsx

입력: input/Day2_국내EV판매_Top5_실데이터.csv 와 working/수집_EV_Top5_*.csv 중 가장 최근에 바뀐 파일
수집 CSV도 input과 같은 열 구성을 쓴다:
  순위,모델명,제조사,판매량(대),기준기간,집계기준(판매/등록),출처URL
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import OUTPUT, market_tables, top5_table, write_xlsx  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

# 열 이름이 '판매량'이어도 집계기준이 등록이면 '등록대수'로 바꿔 적는다 (CLAUDE.md §2)
top, qty_col, basis_kind, src = top5_table()

m = market_tables()
makers, total, yearly = m["makers"], m["total"], m["yearly"]

period = top["기준기간"].iloc[0]
lead = top.iloc[0]
msg = f"{period} 국내 EV {qty_col[:-3]} 1위 {lead['모델명']} {int(lead[qty_col]):,}대 — 2위의 {lead[qty_col] / top.iloc[1][qty_col]:.1f}배"

out = write_xlsx(OUTPUT / "01_EV시장_Top5.xlsx", [
    {
        "name": "Top5",
        "df": top,
        "formulas": {"Top5 내 비중": "=D{r}/SUM(D$2:D${last})"},
        "number_formats": {"Top5 내 비중": "0.0%", qty_col: "#,##0"},
        "notes": [
            f"기준: {top['집계기준'].iloc[0]} · 기간: {period} · 출처: {top['출처URL'].iloc[0]}",
            f"입력 파일: {src.name}",
            "'Top5 내 비중'은 다섯 모델 합계 대비 비중이다. 시장 전체 점유율이 아니다(시장 전체 합계는 이 자료에 없음).",
            ("원문 기사는 '판매'로 표기했지만 수치는 등록 대수다."
             if basis_kind == "등록" and top["집계기준"].astype(str).str.contains("판매").any() else ""),
        ],
        "chart": {"kind": "bar", "cat": "모델명", "vals": [qty_col], "title": msg, "y_title": "대"},
    },
    {
        "name": f"{m['label']}_제조사별",
        "df": makers,
        "formulas": {"전체 대비 비중": f"=B{{r}}/{total}"},
        "number_formats": {"전체 대비 비중": "0.0%", m["qty"]: "#,##0"},
        "notes": [
            f"분모: {m['label']}년 전체 전기차 {m['basis']} {total:,}대 ({m['org']}, {m['total_url']})",
            m["diff_note"],
            "표에 없는 나머지 제조사는 '기타'이며 이 자료로는 나눌 수 없다.",
        ],
        "chart": {"kind": "bar", "cat": "제조사", "vals": [m["qty"]],
                  "title": f"{m['label']} 국내 EV {m['basis']} 상위 {len(makers)}사 ({m['org']})", "y_title": "대"},
    },
    {
        "name": "연도별_추이",
        "df": yearly,
        "number_formats": {m["yqty"]: "#,##0"},
        "notes": [
            f"기준: {m['ybasis']} · 출처: {yearly['출처URL'].iloc[0]} ({m['yorg']})",
            "월별 12개월 시계열은 믿을 만한 출처가 없어 연간 값으로 대신했다(input/data_README.md).",
        ],
        "chart": {"kind": "line", "cat": "연도", "vals": [m["yqty"]], "title": m["trend"], "y_title": "대"},
    },
])
print(f"[완료] {out}")
print(f"  입력: {src.name} · 수량 열: {qty_col}")
print(f"  제목: {msg}")
