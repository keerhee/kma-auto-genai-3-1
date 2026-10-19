# 07_스킬모음_24종 — 슬라이드·인포그래픽·모션그래픽 스킬 모음

Claude Code에서 쓰던 스킬 24개를 분야별로 나눠 zip으로 묶은 폴더입니다(2026-10-17 기준).
zip 하나에 스킬 폴더가 하나씩 들어 있고, 그 안에 `SKILL.md`가 있어서 그대로 설치할 수 있습니다.

```
07_스킬모음_24종/
├─ ppt/           13개 — PPT·슬라이드 덱
├─ infographic/    3개 — 도해·다이어그램·수식 그림
├─ motion/         7개 — 모션그래픽·설명 영상
└─ document/       1개 — 한글(HWP·HWPX) 공문서
```

---

## 설치 방법

**Claude Code (터미널·데스크톱 앱 Code 탭)**

```bash
# 모든 프로젝트에서 쓰기 — 사용자 스킬 폴더에 풀기
unzip ppt/zeroone-pitch-deck.zip -d ~/.claude/skills/

# 이 프로젝트에서만 쓰기 — 프로젝트 폴더 안에 풀기
unzip ppt/zeroone-pitch-deck.zip -d .claude/skills/
```

풀고 나서 Claude Code를 새로 시작하면 `/skills` 목록에 나타납니다.
"제로원 덱으로 만들어줘"처럼 스킬 설명에 있는 표현으로 부르면 됩니다.

**claude.ai · Claude 데스크톱 앱 (Chat)**

설정 → 기능(Capabilities) → 스킬에서 zip 파일을 그대로 올립니다.

---

## ppt/ — PPT·슬라이드 덱 (13개)

### 스타일이 정해진 덱 (pptxgenjs·python-pptx)

| 스킬 | 크기 | 한 줄 설명 | 이렇게 부른다 |
|---|---:|---|---|
| `zeroone-pitch-deck` | 62K | 다크 잉크 표지 + 아이보리 본문 + 라임 포인트의 사업제안·IR형 덱. 슬라이드마다 결론 한 줄 | "제로원 덱", "사업제안 PPT" |
| `report-navy-deck` | 33K | 네이비 표지 + 화이트 본문의 리포트형 강의 덱. 번호 메시지 카드 | "네이비 리포트 덱" |
| `report-white-deck` | 5.2K | 미니멀 화이트 리포트형 덱. 큰 제목 + 얇은 본문 + hairline | "리포트형 PPT", "깔끔한 강의 PPT" |
| `apple-white-deck` | 28K | 애플 keynote 톤의 화이트 미니멀 덱 | "애플 스타일", "화이트 미니멀 PPT" |
| `jj-brief-deck` | 38K | 블루 상단바 + 섹션 탭 칩의 설명자료(브리핑)형 덱 | "JJ 덱", "정책 설명자료" |
| `jaykong-research-deck` | 9.1K | 기관 리서치 톤 장표. KEY INSIGHT 박스, 비교 차트 | "리서치 장표", "Jaykong 톤" |
| `bj-deck` | 205K | 크림 배경·골드 바·네이비 카드의 발제·리뷰형 덱 | "bj덱" |
| `auto-ppt` | 9.3M | 다크 네이비 + 오렌지 테마 덱 (템플릿 모듈 포함) | "다크 PPT", "다크 테마 발표자료" |

### 편집·변환용

| 스킬 | 크기 | 한 줄 설명 | 이렇게 부른다 |
|---|---:|---|---|
| `pptx` | 170K | PPTX 읽기·편집·생성 기본 스킬 (Anthropic 기본 제공) — **저장소에는 없음**: Anthropic 라이선스라 공개 배포하지 않으며, claude.ai와 Claude Code에 기본으로 들어 있다 | ".pptx 파일 고쳐줘" |
| `slide-master` | 6.6M | SVG로 그린 페이지를 클릭 편집되는 네이티브 PPTX 도형으로 변환 | "SVG로 PPT", "편집되는 PPT" |
| `image-fullbleed-deck` | 4.7K | 완성된 인포그래픽·카드뉴스 이미지를 꽉 차는 PPT로 묶기 | "이미지를 PPT로", "카드뉴스 PPT" |

### HTML 슬라이드

| 스킬 | 크기 | 한 줄 설명 | 이렇게 부른다 |
|---|---:|---|---|
| `html-ppt` | 4.6M | 템플릿 기반 HTML 프레젠테이션 (여러 스타일·애니메이션) | "발표자료 만들어줘", "HTML 슬라이드" |
| `web-slides` | 23K | 라이브러리 없이 순수 HTML·CSS·JS로 만드는 웹 슬라이드 | "웹 슬라이드", "바닐라 JS 프레젠테이션" |

---

## infographic/ — 도해·다이어그램 (3개)

| 스킬 | 크기 | 한 줄 설명 | 이렇게 부른다 |
|---|---:|---|---|
| `svg-infographic` | 5.6M | 구조도·흐름도·비교·로드맵 같은 SVG 인포그래픽을 그려 PNG로 굽기 | "인포그래픽", "구조도 그려줘" |
| `obsidian-infographic` | 5.4K | Obsidian·GitHub에서 한 화면에 들어오는 Mermaid·SVG·표 | "mermaid", "강의노트 시각화" |
| `latex-svg-render` | 15K | LaTeX 수식과 SVG 도해를 PNG로 렌더 (한글 폰트 처리 포함) | "수식 PNG", "SVG 한글 깨진다" |

---

## motion/ — 모션그래픽·설명 영상 (7개)

| 스킬 | 크기 | 한 줄 설명 | 이렇게 부른다 |
|---|---:|---|---|
| `motion-studio` | 2.4M | 글·문서를 9:16 쇼츠나 16:9 모션그래픽 영상으로. 캔버스 초안 → 효과·전환·소리 | "모션그래픽 만들어줘", "쇼츠 만들어줘" |
| `showreel` | 193K | 콘셉트부터 음악·나레이션·검수까지 하는 한국어 홍보·소개 영상 | "쇼릴", "홍보 영상" |
| `remotion-motion-catalog` | 12K | 효과 이름(자막·전환·차트 등 106종)으로 Remotion 모션그래픽 | "lower third", "키네틱 타이포" |
| `flow-diagram-video` | 38K | 노드·화살표가 단계별로 나타나는 구조·절차 설명 영상 (무음 + 자막 바) | "흐름도 영상", "업무 절차 영상" |
| `concept-explainer-video` | 2.1M | 나레이션에 맞춰 카드가 나타나는 다크 네이비 개념 설명 영상 | "개념 설명 영상", "explainer video" |
| `motion-lecture` | 26K | 덱이나 대본을 Remotion으로 다시 그리는 나레이션 강의영상 | "MotionLecture로", "모션그래픽 강의영상" |
| `ic-webtoon-short` | 605K | 개념 하나를 6컷 9:16 웹툰 숏폼(30~45초)으로 | "웹툰 숏폼" |

---

## document/ — 한글 공문서 (1개)

| 스킬 | 크기 | 한 줄 설명 | 이렇게 부른다 |
|---|---:|---|---|
| `kordoc` | 6.7K | HWP·HWPX·PDF·이미지 읽기(OCR 포함), 마크다운 → 공문서 HWPX 생성, 서식 빈칸 채우기, 서식 보존 패치, 신구대조, 표기법 검수, 개인정보 마스킹 | "한글 파일 읽어줘", "보고서를 hwpx로", "신구대조표", "공문서 표기법 검사" |

`kordoc` CLI 4.22.5(2026-10-16 배포)에 맞춰 새로 정리한 판입니다. 이전 스킬(4.18.8 기준)에 없던 내용은 이렇습니다.
- **새 명령:** `compare`(신구대조), `lint`(행정업무운영 편람 표기법·개조식 문체), `levels`(견본 서식 따라 하기)
- **generate 옵션:** 기관 서식 `--agency`, 용지·다단·머리말 설정
- **OCR 옵션:** 모델 선택, 전 페이지 재인식, 읽은 줄 좌표 내보내기

설치가 따로 필요 없고(`npx -y kordoc`), Node.js만 있으면 됩니다.

**예제:** `document/kordoc_예제.zip` — 운영 결과 보고서 원고를 검수 → 공문서 HWPX 생성 → 미리보기 → 신구대조 → 개인정보 가리기까지 해 본 결과물과 README가 있습니다.

---

## 쓰기 전에 알아 둘 것

- **필요한 도구:** 스킬은 사용법을 적은 문서라 프로그램을 따로 깔아 주지 않습니다. 처음 쓸 때 빠진 도구가 있으면 Claude Code가 설치를 제안합니다.
  - 덱 만들기: Node.js + `pptxgenjs` 또는 Python + `python-pptx`, PDF 검수에는 LibreOffice
  - 그림 굽기: `cairosvg` 또는 헤드리스 브라우저(Playwright)
  - 영상: Node.js + Remotion, `ffmpeg`
- **나레이션 영상 (`concept-explainer-video`, `motion-lecture`):** 기본값이 이 맥에서 쓰던 Voicebox 복제음성입니다. 다른 PC에서는 edge-tts처럼 설치 없이 쓰는 음성을 고르도록 지시합니다.
- **워드마크 없음:** 덱 스킬은 기관명·로고를 기본으로 넣지 않습니다. 넣으려면 요청할 때 따로 말합니다.
- **자매 스킬:** 덱 스킬은 수식(`latex-svg-render`)이나 도해(`svg-infographic`)와 함께 쓰도록 짜여 있습니다. 두 zip을 같이 설치하면 결과가 좋습니다.
