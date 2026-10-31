# IC Roast Room — 가상 투자위원회 7인 토론 앱

연기금·공제회·보험사 같은 기관투자가의 투자위원회(IC) 안건을 가상 위원 7명(Swensen · Dalio · Marks · Bogle · Asness · Ambachtsheer · Taleb)이 토론하고, 점수가 붙은 판정과 PDF 보고서를 돌려주는 Claude Code 스킬과 회의실 화면이다. 원작 [nateherkai/roast-room](https://github.com/nateherkai/roast-room)(MIT)을 기관투자가용으로 개작했다.

| 폴더 | 내용 |
|---|---|
| `IC_Roast_Room_구현가이드/` | 구현 가이드 덱 39장(PDF, 편집용 pptx는 강사 폴더에만)과 단계별 프롬프트 md — 원작을 받아 기관투자가판으로 바꾸는 과정을 STEP별로 따라 한다 |
| `ic-roast-room/` | 완성본(정답) — 위원 7명 에이전트 · roast-room 스킬 · 회의실 화면(Node 20, 별도 패키지 없음) · 예시 회의 1건 |
| `IC_Roast_Room.zip` | 이 폴더 전체를 묶은 것(README · 구현 가이드 PDF · 프롬프트 md · 완성본) — 하나만 받아 풀면 끝까지 따라 할 수 있다. 덱은 PDF로만 들어 있다. 폴더를 고치면 zip도 다시 만든다 |

## 빨리 보기

1. `IC_Roast_Room.zip`을 풀고, Claude Code(데스크톱 앱 Code 탭)에서 `ic-roast-room` 폴더를 연다.
2. `npm start` → 브라우저에서 `http://localhost:4730` 회의실 화면.
3. `/roast-room`에 안건을 주면 위원들이 토론하고 판정(GO · GO WITH CONDITIONS · RESHAPE · WAIT · DON'T DO IT)을 낸다.

구독 플랜만으로 동작한다(API 키 불필요). `.env.example`은 회의실이 직접 API로 회의를 돌리게 할 때만 쓴다.

가이드 덱에 나오는 "강의노트 폴더의 ic-roast-room"은 이 폴더의 `ic-roast-room/`을 말한다.
