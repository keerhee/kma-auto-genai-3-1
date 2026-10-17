# _build — 설치 가이드 간단판 빌드

```bash
cd x_code_manual/_build
/usr/bin/python3 gen.py                                  # 그림 fig/*.png (cairosvg)
NODE_PATH=/Users/keerhee/Project/node_modules node build.js   # ../Claude_설치가이드_간단판.pptx
cd .. && soffice --headless --convert-to pdf Claude_설치가이드_간단판.pptx --outdir .
python3 _build/qa_overflow.py Claude_설치가이드_간단판.pptx      # 넘침 검사
python3 _build/verify_render.py Claude_설치가이드_간단판.pptx    # 렌더 겹침 검사
```

- 장표 문구는 `build.js`, 그림 속 단계 상자는 `gen.py`에서 고친다.
- 사이트용 사본: PDF를 `../Day0/Day0_4_Claude_설치가이드.pdf`로 복사한 뒤 `python3 _build/make_site.py`(저장소 루트 기준).
- 템플릿은 zeroone-pitch-deck 스킬 v1.10의 `template.js`.
