"""③ 차트 클리닉 — 원본 데이터 + Claude 진단표 → output/04_차트클리닉_전후비교.xlsx

사용: python working/scripts/s3_clinic.py [원본CSV] [브랜드] [원본이미지]
  인자를 주면 working/차트클리닉_설정.json에 저장하고, 결과화면(s9)과 run_all도 같은 대상을 쓴다.
  인자가 없으면 설정 파일 → 기본값(input의 예시 자료, A사) 순으로 쓴다.

입력
  원본CSV                         월,브랜드,EV판매대수(대),EV시장전체(대),점유율(%),집계기준,비고
  working/차트클리닉_진단표.csv   진단항목,원칙·함정,원본의 문제,근거,고치는 법
  working/차트클리닉_메시지.txt   첫 줄 = 고친 차트 제목(한 줄 메시지)
두 판단 파일은 stamp.py로 원본CSV·원본이미지와 묶여 있어야 한다. 입력이 바뀌었으면 멈춘다.

고친 방향(기본): 브랜드 점유율을 선 차트로, 집계기준을 별도 계열로 나눠 단절을 보이게 한다.
"""
import json
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import (ACCENT, CLINIC_CFG, MUTED, OUTPUT, ROOT, WORKING, clinic_config,  # noqa: E402
                   read_csv, stale_reason, write_xlsx)

cfg = clinic_config()
for key, i in (("원본CSV", 1), ("브랜드", 2), ("원본이미지", 3)):
    if len(sys.argv) > i:
        cfg[key] = sys.argv[i]
if len(sys.argv) > 1:
    CLINIC_CFG.write_text(json.dumps(cfg, ensure_ascii=False, indent=2), encoding="utf-8")
src, brand = cfg["원본CSV"], cfg["브랜드"]

for art in ("working/차트클리닉_진단표.csv", "working/차트클리닉_메시지.txt"):
    why = stale_reason(art, expect=[src, cfg["원본이미지"]])
    if why:
        sys.exit(f"[중단] {art}: {why} — 차트-클리닉 스킬로 다시 진단하세요.")

raw = read_csv(str(ROOT / src))
if brand not in set(raw["브랜드"]):
    sys.exit(f"[중단] {src}에 브랜드 '{brand}'가 없음: {sorted(set(raw['브랜드']))}")
diag = read_csv(str(WORKING / "차트클리닉_진단표.csv"))
msg = (WORKING / "차트클리닉_메시지.txt").read_text(encoding="utf-8").strip().splitlines()[0]

a = raw[raw["브랜드"] == brand].reset_index(drop=True)
bases = list(dict.fromkeys(a["집계기준"]))
fixed = pd.DataFrame({"월": a["월"]})
for b in bases:
    fixed[f"점유율(%) · {b}"] = a["점유율(%)"].where(a["집계기준"] == b)
fixed["판매·등록대수(대)"] = a["EV판매대수(대)"]
fixed["집계기준"] = a["집계기준"]

# 기준별 평균 — 이 숫자가 '급등' 여부를 말해 준다
stats = a.groupby("집계기준", sort=False)["점유율(%)"].agg(["mean", "min", "max", "count"]).round(1).reset_index()
stats.columns = ["집계기준", "평균 점유율(%)", "최저(%)", "최고(%)", "개월 수"]

out = write_xlsx(OUTPUT / "04_차트클리닉_전후비교.xlsx", [
    {"name": "진단표", "df": diag,
     "notes": [f"원본 차트: {cfg['원본이미지']} · 원본 데이터: {src}",
               "진단 기준: 본 강의 차트 원칙 4가지 + 인트로 통계 함정(판매/등록·분모·기간)"]},
    {"name": "고친차트", "df": fixed,
     "notes": [f"한 줄 메시지: {msg}",
               ("계열을 집계기준별로 나눴다 — 기준이 바뀐 지점에서 앞뒤를 같은 선으로 잇지 않는다."
                if len(bases) > 1 else f"집계기준: {bases[0]} 하나 — 기준 혼재 없음"),
               f"분모: 월별 EV시장전체(대) · 출처: {Path(src).name}" + (" (가상 데이터)" if "가상" in src else "")],
     "chart": {"kind": "line", "cat": "월", "vals": [c for c in fixed.columns if c.startswith("점유율")],
               "title": msg, "y_title": "%", "colors": [MUTED, ACCENT]}},
    {"name": "기준별_요약", "df": stats,
     "notes": ["기준이 다른 두 구간의 평균 차이는 실제 변화와 기준 변경 효과가 섞인 값이다 — 원인을 나눌 수 없다."]},
    {"name": "원본데이터", "df": raw, "notes": ["수정하지 않은 사본" + (" · 가상 데이터(실습용)" if "가상" in src else "")]},
])
print(f"[완료] {out}")
print(stats.to_string(index=False))
