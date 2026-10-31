---
title: IC Roast Room 구현 프롬프트
tags: [연기금, ClaudeCode, roast-room, 실습]
created: 2026-10-20
source: IC_Roast_Room_구현가이드.pptx
---

# IC Roast Room 구현 프롬프트

> [!info] 쓰는 법
> 위에서부터 차례로 코드 블록을 복사해 Claude Code 입력창에 붙여 넣는다. 블록마다 `확인`을 보고 다음으로 넘어간다.
> 완성본(정답)은 이 가이드 폴더 옆의 `../ic-roast-room/`이다. 원작은 [nateherkai/roast-room](https://github.com/nateherkai/roast-room) (MIT, © 2026 AI Automation Society)이다.

---

## STEP 00 · 완성본 먼저 보기

Claude Code에서 `ic-roast-room` 폴더를 열고 붙여 넣는다.

```text
회의실 화면을 켜 줘.
그리고 sessions 폴더에 있는 예제 회의를 화면에서 다시 보는 방법을 알려 줘.
```

- 확인: http://localhost:4730 → 오른쪽 위 '지난 회의'에서 예제를 고르면 위원이 한 명씩 말하고 판정 카드가 뜬다.

---

## STEP 01 · 설치 확인

> [!note] 사람이 직접
> Claude 앱 설치 → Pro 이상 계정 로그인 → Code 탭에서 새 폴더 `my-roast-room`을 만들어 연다.

```text
이 컴퓨터에 Node.js 20 이상이 설치돼 있는지 확인해 줘.
없으면 설치하고, 설치된 버전을 보여 줘.
```

- 확인: 허락 창이 뜨면 무엇을 하려는지 읽고 '허용'을 누른다.

## STEP 02 · 프로젝트 규칙

```text
이 폴더에 CLAUDE.md를 써 줘. 이 프로젝트는 연기금 투자위원회(IC) 안건을
가상 위원 7명이 세 라운드 토론하고, 의장이 점수로 판정하는 도구다.
규칙: 한국어로 답한다. 위원은 실제 인물이 아니라 공개 저작을 요약한
시뮬레이션이며, 따옴표로 직접 인용하지 않는다. 투자 권유가 아니다.
회의 기록은 sessions/날짜-안건/ 폴더에 남긴다.
```

- 확인: `CLAUDE.md`가 생긴다. 고칠 곳은 "3번 규칙을 이렇게 바꿔 줘"처럼 시킨다.

---

## STEP 03 · 위원 명단

```text
.claude/skills/roast-room/references/seats.md에 위원 명단을 써 줘.
Swensen(정책 포트폴리오·대체투자), Dalio(매크로 국면), Marks(사이클·신용),
Bogle(비용), Asness(증거·팩터), Ambachtsheer(거버넌스), Taleb(꼬리위험·유동성).
위원마다 맡는 질문 한 줄, 영문 key(swensen 등), 서로 부딪히는 짝을 적고,
간이 위원회(--quick)에 앉힐 4명을 고르는 규칙도 넣어 줘.
```

- 확인: 위원 7행 표와 부딪히는 짝 4쌍. 위원 구성을 바꾸려면 여기서 바꾼다.

## STEP 04 · brain (위원의 기억)

```text
brains/의 규격을 references/brain-spec.md로 먼저 써 주고, 그 규격대로
Taleb 위원의 brain을 .claude/skills/roast-room/brains/nassim-taleb/에 만들어 줘.
웹 검색으로 책·논문·증언 20~40개를 찾아 sources.md에 S001부터 번호를 붙이고
실제로 있는 자료인지 확인해 줘. 나머지 7개 파일은 seats.md의 질문에 맞춰
요약하고 문장마다 출처 번호를 달아 줘. 따옴표 직접 인용은 하지 마.
```

- 확인: `brains/nassim-taleb/`에 `.md` 8개. 위원 한 명에 10~20분 걸린다.

Taleb이 잘 나오면 이어서:

```text
나머지 6명도 같은 규격으로, 서브에이전트로 동시에 만들어 줘.
```

## STEP 05 · 위원 설명서 (서브에이전트)

```text
.claude/agents/council-taleb.md를 만들어 줘. Taleb 위원석 서브에이전트다.
자기 brain 폴더만 읽고, 맡은 질문 하나를 끝까지 밀고, 근거마다 출처 번호를 단다.
따옴표 인용과 실제 인물 행세는 금지한다. 쓸 수 있는 도구는 Read·Grep·Glob뿐이다.
같은 틀로 council-swensen.md 등 나머지 6명도 만들어 줘.
```

- 확인: Claude Code를 **새로 열고** `/agents`를 치면 `council-` 7개가 보인다.

## STEP 06 · 발언 양식과 채점 규칙

```text
references/round-prompts.md에 라운드 1·2·3의 위원 지시문을 써 줘.
라운드 1 카드는 SEAT · STANCE · OPTION SCORES · PILLAR SCORE · CONFIDENCE ·
RUIN RISK · DOOR · THE CALL · WHY 1~3 양식이고, 필드 이름은 영어로 고정한다.
라운드 2는 다른 위원 반박, 라운드 3은 의결안에 Endorse · Amend · Dissent 표결이다.
references/scoring.md에는 가중평균 점수, 판정 구간, RUIN RISK 상한을 써 줘.
```

- 확인: 판정 구간이 7.5~10 GO · 6.0~7.4 GO WITH CONDITIONS · 4.5~5.9 RESHAPE · 4.5 미만 DON'T DO IT (+ WAIT)인지 본다.

## STEP 07 · 의장 스킬 `/roast-room`

```text
.claude/skills/roast-room/SKILL.md로 /roast-room 스킬을 만들어 줘. 의장 순서는
① 안건에서 빠진 정보를 한 번에 최대 4개 묻는다 ② sessions/날짜-안건/에 brief.md
③ 라운드 1: 위원 7명을 한 메시지로 동시에 부르고 round-1.md에 쟁점 정리
④ 라운드 2 토론 → round-2.md ⑤ 의결안 ⑥ 라운드 3 표결 ⑦ 계산 후 verdict.md
옵션 --quick(4명 · 2라운드), --seats(위원 지정), ask(위원 한 명에게 질문)도 넣어 줘.
```

- 확인: 입력창에 `/roast-room`을 치기 시작하면 목록에 뜬다. 여기까지가 위원회 본체다.

---

## STEP 08 · 첫 회의 (간이 위원회)

```text
/roast-room --quick 운용자산 200조 원 공적연금입니다. 사모신용 비중을 3%에서
6%로 2년 안에 늘릴지, 3개 빈티지로 4.5%까지 나눠 갈지, 현 3%를 유지할지
결정해야 합니다. 대체투자 미집행 약정이 총자산의 4%, 연간 급여 지급은 3%입니다.
목표는 10년 기준 정책 벤치마크 대비 연 30bp 초과이고, 팀은 즉시 확대 쪽입니다.
```

- 확인: 의장이 빠진 숫자를 먼저 묻는다 → 답하면 `sessions/` 새 폴더에 `brief.md` · `round-1.md` · `round-2.md` · `verdict.md`.
- 간이 위원회는 서브에이전트 8번 안팎, 전체 위원회는 21번. 처음엔 `--quick`.

---

## STEP 09 · 화면 파일 규약

```text
references/live-room.md에 화면용 파일 규약을 써 줘. council.json(안건 · 선택지 ·
가중치), cruxes.json(쟁점), draft.json(의결안), verdict.json(판정)의 키 이름과
예시를 정하고, 각 파일을 쓰는 시점을 표로 적어 줘. SKILL.md도 그 시점에
파일을 쓰도록 고쳐 줘. 라운드 파일은 위원마다 '## Marks'처럼 영어 제목을 단다.
```

- 확인: `verdict.json`을 맨 마지막에 쓰도록 되어 있다.

## STEP 10 · 회의실 화면

```text
Node.js 기본 기능만으로 회의실 화면을 만들어 줘.
· app/server.mjs가 sessions를 지켜보다 새 파일을 화면에 보낸다
· 위원 7명이 둥근 탁자에 앉고 발언하는 위원에 자막이 뜬다
· npm start → localhost:4730
다 되면 화면을 켜 줘.
```

- 확인: STEP 08의 회의를 '지난 회의'에서 골라 재생되면 성공.

## STEP 11 · 마무리 (한 줄씩 따로)

```text
위원 7명을 실제 얼굴과 닮지 않은 캐릭터로 그리고, 말할 때 입이 움직이게 해 줘.
```

```text
판정 카드에 'PDF 내려받기' 버튼을 달아 줘. 한글 글꼴도 넣어 줘.
```

```text
회의 기록 속 인용이 brain에 실제로 있는지 검사하는 스크립트를 만들어 줘.
```

선택 (Voicebox가 있을 때만):

```text
내 컴퓨터의 음성 합성 프로그램 Voicebox가 켜져 있으면 발언을 읽게 해 줘.
```

- 확인: brain에 없는 인용이 나오면 판정 보고서에서 그 문장을 지운다.

---

## 부록 A · 원본을 받아 고치는 길

```text
github.com/nateherkai/roast-room 저장소를 이 폴더에 받아 줘. 구조를 설명하고,
위원 7명을 투자위원회 위원으로 바꾸는 순서를 제안해 줘. LICENSE 파일은 그대로 둬.
```

```text
원작의 위원 7명(council-bezos.md 등)을 seats.md 명단의 투자위원회 위원으로 바꿔 줘.
지울 파일과 고칠 파일(app/lib/seats.mjs 포함)을 먼저 보여 주고, 내가 허락하면 바꿔 줘.
```

| 할 일 | STEP |
|---|---|
| 그대로 한다 | 01 · 03 · 04 · 05 |
| 고쳐 쓴다 | 02 · 06 · 07 |
| 거의 그대로 | 09 · 10 |
| 더한다 | 11 |

> [!warning] brain 7개가 가장 큰 일이다
> 원본을 받아도 STEP 04는 그대로 한다.

## 부록 B · 막혔을 때

| 증상 | 붙여 넣을 말 |
|---|---|
| 화면이 비어 있다 | `회의 기록이 sessions 폴더 어디에 생겼는지 찾아 줘` |
| 위원이 안 불린다 | `/agents에 council- 7개가 있는지 확인하고 없으면 고쳐 줘` |
| 회의가 너무 길다 | `같은 안건을 --quick으로 다시 돌려 줘` |
| 카드 양식이 깨졌다 | `양식이 빠진 카드를 찾아 그 위원만 다시 불러 줘` |
| 4730이 이미 쓰인다 | `4730을 쓰는 프로그램을 찾아 끄고 화면을 다시 켜 줘` |

고친 뒤에는:

```text
왜 그랬는지 CLAUDE.md에 한 줄 적어 줘.
```

> [!caution]
> 위원은 공개 저작을 요약한 시뮬레이션이며 실제 인물의 견해가 아니다. 결과는 투자 권유가 아니다. API 키를 넣는 모드는 회의당 약 25회 호출이 과금된다.
