"""② VOC — Claude 분류표 + 키워드 사전 → output/03_VOC키워드.xlsx

입력
  working/VOC_분류.csv     차종,번호,리뷰,주제,감정,키워드   (키워드는 ';'로 구분, 사전의 대표키워드 사용)
  working/VOC_키워드사전.csv 대표키워드,감정,묶은 표현
  input/Day2_*_VOC리뷰*_가상.csv  원 데이터 라벨(대조용)
"""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import ACCENT, NEG, NEU, OUTPUT, VOC_INPUTS, WORKING, read_csv, stale_reason, write_xlsx  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

SRC = {car: Path(f).name for car, f in VOC_INPUTS.items()}

# 판단 결과가 지금 input을 보고 만든 것인지 먼저 확인한다 (수정 2)
for art in ("working/VOC_분류.csv", "working/VOC_키워드사전.csv"):
    why = stale_reason(art, expect=[f"input/{f}" for f in SRC.values()])
    if why:
        sys.exit(f"[중단] {art}: {why} — VOC-감정분석 스킬로 다시 분류하세요.")

cls = read_csv(str(WORKING / "VOC_분류.csv"))
dic = read_csv(str(WORKING / "VOC_키워드사전.csv"))

# 사전에 없는 키워드가 있으면 멈춘다 — 사전 확정은 사람 확인 지점(CLAUDE.md §7-2)
kw = cls.assign(키워드=cls["키워드"].fillna("").str.split(";")).explode("키워드")
kw["키워드"] = kw["키워드"].str.strip()
kw = kw[kw["키워드"] != ""]
unknown = sorted(set(kw["키워드"]) - set(dic["대표키워드"]))
if unknown:
    sys.exit(f"[중단] 키워드 사전에 없는 키워드: {unknown} — 사전을 먼저 확정하세요.")

# 원 데이터 라벨과 대조
src = SRC
cmp_rows = []
for car, f in src.items():
    orig = read_csv(f)[["번호", "리뷰", "주제", "감정"]].rename(
        columns={"리뷰": "리뷰_원본", "주제": "주제_원본", "감정": "감정_원본"})
    mine = cls[cls["차종"] == car]
    m = mine.merge(orig, on="번호", how="outer", indicator=True)
    # 번호만 맞고 리뷰가 다르면 다른 데이터다 — 조용히 대조하지 않는다 (수정 2)
    bad = m[(m["_merge"] != "both") | (m["리뷰"] != m["리뷰_원본"])]
    if len(bad):
        sys.exit(f"[중단] {car}: 분류표와 원 데이터의 리뷰가 {len(bad)}건 다름(번호 {bad['번호'].tolist()[:10]}) — 다시 분류하세요.")
    for r in m.itertuples():
        cmp_rows.append({"차종": car, "번호": r.번호, "주제_Claude": r.주제, "주제_원본": r.주제_원본,
                         "감정_Claude": r.감정, "감정_원본": r.감정_원본,
                         "일치": "O" if (r.주제 == r.주제_원본 and r.감정 == r.감정_원본) else "X"})
cmp = pd.DataFrame(cmp_rows)

sheets = [{"name": "분류표", "df": cls,
           "notes": ["가상 데이터(실습용) — 생성 리뷰이며 실제 고객 의견이 아니다.",
                     "주제·감정·키워드는 Claude 분류 결과다. '라벨대조' 시트에서 원 데이터 라벨과 비교한다."]}]

topics = ["주행", "충전", "디자인", "가격", "서비스"]
summary = []
for car in src:
    sub = cls[cls["차종"] == car]
    ct = pd.crosstab(sub["주제"], sub["감정"]).reindex(index=topics, columns=["긍정", "부정", "중립"], fill_value=0)
    ct = ct.reset_index().rename(columns={"index": "주제"})
    sheets.append({"name": f"{car}_주제x감정", "df": ct,
                   "notes": [f"{car} 리뷰 {len(sub)}건 · 가상 데이터(실습용) · 건수 = 리뷰 수"],
                   "chart": {"kind": "stacked", "cat": "주제", "vals": ["긍정", "부정", "중립"],
                             "title": f"{car} 주제별 긍·부정 리뷰 수 (가상 데이터)", "y_title": "건",
                             "colors": [ACCENT, NEG, NEU]}})
    for sent in ["긍정", "부정"]:
        k = kw[(kw["차종"] == car) & (kw["감정"] == sent)]
        top = (k.groupby("키워드").size().rename("빈도").sort_values(ascending=False, kind="stable")
               .head(5).reset_index())
        sheets.append({"name": f"{car}_{sent}Top5", "df": top,
                       "notes": [f"{car} {sent} 리뷰에서 나온 키워드 빈도 상위 5 · 가상 데이터(실습용)",
                                 "빈도 = 그 키워드가 붙은 리뷰 수 (한 리뷰에 같은 키워드는 1회)",
                                 "빈도가 같으면 가나다순이다. 빈도 1건짜리 순위는 근거가 약하다 — 주제×감정 시트와 함께 읽는다."],
                       "chart": {"kind": "bar", "cat": "키워드", "vals": ["빈도"],
                                 "title": f"{car} {sent} 키워드 Top5", "y_title": "건",
                                 "colors": [ACCENT if sent == "긍정" else NEG]}})
        for r in top.itertuples():
            summary.append({"차종": car, "감정": sent, "순위": r.Index + 1, "키워드": r.키워드, "빈도": r.빈도})

agree = (cmp["일치"] == "O").mean()
sheets.append({"name": "라벨대조", "df": cmp,
               "notes": [f"주제·감정 모두 일치: {(cmp['일치']=='O').sum()}/{len(cmp)}건 ({agree:.0%})",
                         "불일치 행은 사람이 원문을 읽고 어느 쪽이 맞는지 판단한다."]})
sheets.append({"name": "키워드사전", "df": dic, "notes": ["같은 뜻의 표현을 대표키워드 하나로 묶은 표 — 사람 확인 후 확정"]})

out = write_xlsx(OUTPUT / "03_VOC키워드.xlsx", sheets)
pd.DataFrame(summary).to_csv(WORKING / "VOC_키워드Top5.csv", index=False, encoding="utf-8-sig")
print(f"[완료] {out}")
print(f"  분류 {len(cls)}건 · 원 라벨 일치 {agree:.0%}")
for car in src:
    neg = [s for s in summary if s["차종"] == car and s["감정"] == "부정"][:3]
    print(f"  {car} 부정 상위: " + ", ".join(f"{s['키워드']}({s['빈도']})" for s in neg))
