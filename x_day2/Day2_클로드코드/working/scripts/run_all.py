"""전체 갱신 — input이 바뀐 뒤 산출물을 다시 만든다.

사용: python working/scripts/run_all.py

1. input 파일 지문(해시)을 지난 실행과 비교해 바뀐 파일을 보고한다.
2. 스크립트만으로 다시 만들 수 있는 산출물은 다시 만든다(01 · 02 · 05).
3. Claude가 판단해 만든 파일(VOC 분류·키워드 사전, 차트클리닉 진단표·메시지)은
   판단 기록(working/_판단기록.json)과 지금 input을 대조한다.
   - 맞으면 해당 산출물(03 · 04)을 다시 만든다.
   - 안 맞으면 만들지 않고 "다시 판단 필요"로 보고한다. 결과화면에는 경고 카드가 뜬다.
     예전 input 기준 산출물은 잘못 배포되지 않게 output/_이전판/으로 옮긴다(지우지 않는다).
4. 결과화면(00)을 다시 만든다.

종료 코드: 0 = 모두 최신 · 2 = 다시 판단할 항목이 있음 · 1 = 스크립트 오류
"""
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import INPUT, OUTPUT, ROOT, VOC_INPUTS, WORKING, clinic_config, file_hash, stale_reason  # noqa: E402

PY = sys.executable
S = "working/scripts/"
MANIFEST = WORKING / "_input_manifest.json"
LOG = WORKING / "갱신기록.md"
VOC_SRC = list(VOC_INPUTS.values())


def run(args: list[str]) -> tuple[bool, str]:
    r = subprocess.run([PY] + args, cwd=ROOT, capture_output=True, text=True, encoding="utf-8",
                       env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"})
    out = (r.stdout + r.stderr).strip()
    return r.returncode == 0, out


def set_aside(product: str) -> None:
    """예전 input 기준 산출물을 output/_이전판/으로 옮긴다(지우지 않는다)."""
    old = OUTPUT / product
    if old.exists():
        dest = OUTPUT / "_이전판" / f"{old.stem}_{datetime.now():%Y%m%d_%H%M%S}{old.suffix}"
        dest.parent.mkdir(exist_ok=True)
        old.replace(dest)
        print(f"    예전 산출물 옮김: output/{product} → {dest.relative_to(ROOT).as_posix()}")


# 1. input 변화
now = {p.relative_to(ROOT).as_posix(): file_hash(p) for p in sorted(INPUT.iterdir()) if p.is_file()}
before = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}
changed = [k for k in now if k in before and before[k] != now[k]]
added = [k for k in now if k not in before]
removed = [k for k in before if k not in now]
print("── 1. input 변화")
if not before:
    print("  (첫 실행 — 비교 기준 없음)")
for title, lst in (("바뀜", changed), ("새로 생김", added if before else []), ("사라짐", removed)):
    for k in lst:
        print(f"  {title}: {k}")
if before and not (changed or added or removed):
    print("  변화 없음")

results, errors, stale = [], [], {}

# 2. 스크립트만으로 다시 만드는 산출물
print("── 2. 스크립트 산출물")
steps = [("01 EV 시장", [S + "s1_top5.py"])]
if (WORKING / "AI도구_선택기준표.csv").exists():
    steps.append(("02 도구 기준표", [S + "csv2xlsx.py", "working/AI도구_선택기준표.csv",
                                    "output/02_AI도구_선택기준표.xlsx", "도구기준표"]))
if list(WORKING.glob("주간수집_*.csv")):
    steps.append(("05 주간 수집", [S + "csv2xlsx.py", "working/주간수집_*.csv",
                                  "output/05_주간수집_누적.xlsx", "주간수집", "예시 파일이 섞여 있으면 실제 수집분과 구분할 것"]))
for name, args in steps:
    ok, out = run(args)
    (results if ok else errors).append(name)
    print(f"  {'완료' if ok else '실패'}: {name}" + ("" if ok else f"\n    {out}"))

# 3. Claude 판단 산출물
print("── 3. Claude 판단 산출물")
cfg = clinic_config()
judged = [
    ("03 VOC 키워드", "VOC-감정분석", ["working/VOC_분류.csv", "working/VOC_키워드사전.csv"], VOC_SRC,
     [S + "s2_voc.py"], "03_VOC키워드.xlsx"),
    ("04 차트 클리닉", "차트-클리닉", ["working/차트클리닉_진단표.csv", "working/차트클리닉_메시지.txt"],
     [cfg["원본CSV"], cfg["원본이미지"]], [S + "s3_clinic.py"], "04_차트클리닉_전후비교.xlsx"),
]
for name, skill, arts, expect, args, product in judged:
    if not (ROOT / arts[0]).exists():
        print(f"  건너뜀: {name} — 아직 만든 적 없음")
        continue
    why = {a: w for a in arts if (w := stale_reason(a, expect=expect))}
    if why:
        stale[name] = (skill, why)
        print(f"  다시 판단 필요: {name} → {skill} 스킬")
        for a, w in why.items():
            print(f"    {a}: {w}")
        set_aside(product)
        continue
    ok, out = run(args)
    (results if ok else errors).append(name)
    print(f"  {'완료' if ok else '실패'}: {name}" + ("" if ok else f"\n    {out}"))
    if not ok:
        set_aside(product)   # 실패하면 예전 산출물이 최신처럼 남지 않게 한다

# 4. 결과화면
print("── 4. 결과화면")
ok, out = run([S + "s9_html.py"])
(results if ok else errors).append("00 결과화면")
print(f"  {'완료' if ok else '실패'}: 00 결과화면" + (" (다시 판단할 탭은 경고 카드로 표시)" if stale and ok else "")
      + ("" if ok else f"\n    {out}"))

# 기록
MANIFEST.write_text(json.dumps(now, ensure_ascii=False, indent=2), encoding="utf-8")
if not LOG.exists():
    LOG.write_text("# 갱신 기록\n\n| 시각 | 바뀐 input | 다시 만든 산출물 | 다시 판단 필요 | 오류 |\n|---|---|---|---|---|\n",
                   encoding="utf-8")
with LOG.open("a", encoding="utf-8") as f:
    diff = "첫 실행(비교 기준 없음)" if not before else (", ".join(Path(k).name for k in changed + added + removed) or "없음")
    f.write(f"| {datetime.now():%Y-%m-%d %H:%M} | {diff} "
            f"| {', '.join(results) or '없음'} | {', '.join(stale) or '없음'} | {', '.join(errors) or '없음'} |\n")

print("── 요약")
print(f"  다시 만듦: {', '.join(results) or '없음'}")
print(f"  다시 판단 필요: {', '.join(f'{k}({v[0]})' for k, v in stale.items()) or '없음'}")
print(f"  오류: {', '.join(errors) or '없음'}")
sys.exit(1 if errors else 2 if stale else 0)
