"""CSV 한 장을 xlsx로 옮긴다 (도구 선택 기준표, 주간 수집 결과 등).

사용: python working/scripts/csv2xlsx.py <입력.csv> <output/NN_이름.xlsx> [시트이름] [노트 ...]
여러 CSV를 한 xlsx로 묶을 때는 입력에 와일드카드(따옴표로 감싸기)를 쓴다 — 행을 이어 붙인다.
"""
import glob
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import ROOT, write_xlsx  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8")

if len(sys.argv) < 3:
    sys.exit(__doc__)
pattern, out = sys.argv[1], Path(sys.argv[2])
sheet = sys.argv[3] if len(sys.argv) > 3 else out.stem
notes = sys.argv[4:]
files = sorted(glob.glob(pattern)) or sorted(glob.glob(str(ROOT / pattern)))
if not files:
    sys.exit(f"[중단] 파일 없음: {pattern}")
df = pd.concat([pd.read_csv(f, encoding="utf-8-sig") for f in files], ignore_index=True)
if not out.is_absolute():
    out = ROOT / out
write_xlsx(out, [{"name": sheet, "df": df, "notes": notes + [f"원천: {', '.join(Path(f).name for f in files)}"]}])
print(f"[완료] {out} · {len(df)}행 · 원천 {len(files)}개")
