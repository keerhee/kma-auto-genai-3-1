"""판단 기록 남기기 — Claude가 읽고 판단해 만든 파일이 어떤 입력을 보고 만들어졌는지 적는다.

사용: python working/scripts/stamp.py <판단 결과 파일> <입력 파일> [<입력 파일> ...]
예:   python working/scripts/stamp.py working/VOC_분류.csv input/Day2_아이오닉5_VOC리뷰30건_가상.csv input/Day2_모델Y_VOC리뷰20건_가상.csv

입력 파일이 나중에 바뀌면 run_all.py와 각 스크립트가 이 기록을 보고 "다시 판단 필요"로 멈춘다.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import ROOT, _rel, stamp  # noqa: E402

if len(sys.argv) < 3:
    sys.exit(__doc__)
art, inputs = _rel(sys.argv[1]), sys.argv[2:]
for p in [art] + inputs:
    if not (ROOT / _rel(p)).exists():
        sys.exit(f"[중단] 파일 없음: {p}")
stamp(art, inputs)
print(f"[기록] {art} ← {', '.join(_rel(p) for p in inputs)}")
