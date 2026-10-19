---
title: "Financial Insight KG — 실전 활용 사례집"
subtitle: "설치는 끝났다는 가정 · 이렇게 물으면 이렇게 된다"
type: "use-case-guide"
level: "beginner"
tags: [financial-insight-kg, use-cases, claude-code]
related: ["financial-insight-kg-manual", "financial-insight-kg-manual-v2"]
---

# Financial Insight KG — 실전 활용 사례집

> [!abstract] 전제
> 시스템은 이미 만들어져 있습니다(V1 초급 완료). 여러분이 하는 일은 두 가지뿐입니다.
> **자료 넣기** — URL 붙여넣고 "추가해줘". **질문하기** — 자연어로 묻기.
> 아래는 그 두 가지로 실제 무슨 일이 일어나는지를 사례별로 보여줍니다.

각 사례는 `[입력]` 질문 → `[처리]` 내부에서 벌어지는 일 → `[출력]` 결과 순서입니다.

---

## 사례 1. 실적 발표 준비 (전체 파이프라인)

가장 기본. 자료 몇 개를 넣고, 준비를 통째로 맡깁니다.

> [!example] [입력] Claude Code 창
> ```text
> 이거 추가해줘
> https://youtu.be/aaa   (SemiAnalysis 실적 프리뷰)
> https://semianalysis.com/x   (GPU 공급 분석)
> ./NVIDIA_10Q.pdf
>
> NVIDIA 실적 발표 준비해줘
> ```

> [!note] [처리] 내부에서
> 수집(자막·본문·PDF 추출) → 주장 추출(Claim) → 근거 연결(Evidence) → 그래프 저장 → 인사이트 쿼리(Reasoning) → 카드 생성.

> [!success] [출력] 인사이트 카드
> ```text
> Driver:       AI Capex Cycle
> Transmission: AI Capex → GPU 수요 → 데이터센터 매출 → Gross Margin
> Constraint:   GPU 공급 부족
> Falsifier:    Hyperscaler capex 가이던스 하향 시 논리 약화
> Next Action:  Gross Margin 확인 · Broadcom·Marvell도 조사
> ```

---

## 사례 2. 아직 주목 안 받은 수혜 기업 찾기

시장이 아직 안 본 곳을 찾는 질문. 이게 이 시스템의 핵심 가치입니다.

> [!example] [입력]
> ```text
> AI capex 주장은 급증했는데 아직 실적에 안 잡힌 기업은?
> ```

> [!note] [처리]
> 그래프에서 "같은 Driver를 말하는 주장이 최근 급증 + 아직 Outcome 없음"인 기업을 탐색.

> [!success] [출력]
> ```text
> 후보: Broadcom, Marvell, Vertiv, Eaton
> 이유: AI capex → 네트워킹·전력장비로 파급되나 실적 반영 전
> ```

---

## 사례 3. 왜 주가가 안 올랐나

사람이 찾기 어려운 "원인은 맞는데 결과가 안 난" 연결을 짚어냅니다.

> [!example] [입력]
> ```text
> AI capex는 늘었는데 Broadcom 주가는 왜 안 올랐지?
> ```

> [!note] [처리]
> Driver는 살아 있으나 그 사이 Constraint(제약)가 결과를 막고 있는지 경로를 추적.

> [!success] [출력]
> ```text
> Driver: AI capex (유효) → Constraint: 재고 과다 → Outcome: 주가 횡보
> 해석: 투자 증가는 맞지만 재고가 많아 아직 실적에 안 잡힘
> ```

---

## 사례 4. 누가 제일 잘 맞히나

논평가를 사람 통째가 아니라 "주제별"로 평가합니다.

> [!example] [입력]
> ```text
> 반도체는 누구 말이 제일 잘 맞아?
> ```

> [!note] [처리]
> commentator × topic × company × horizon 단위 신뢰도(실제 결과로 갱신됨)를 조회.

> [!success] [출력]
> ```text
> 반도체:  SemiAnalysis 0.86 (높음)   유튜버 A 0.31 (낮음)
> 거시:    유튜버 A 0.88 (높음)
> → 반도체는 SemiAnalysis, 거시는 유튜버 A를 먼저 참고
> ```

---

## 사례 5. "만약 ~라면" 시나리오 (V2 기능)

가정형 질문. V2의 Counterfactual 모듈이 있어야 동작합니다.

> [!example] [입력]
> ```text
> 미국 금리가 1% 내리면 어떤 기업이 먼저 영향받아?
> ```

> [!note] [처리]
> 금리 → 금융환경 → 성장주 → 반도체 경로를 단계별로 추론. 근거가 약하면 "근거 부족"으로 답함.

> [!success] [출력]
> ```text
> 경로: 금리↓ → 성장주 밸류 ↑ → 반도체 수혜
> 먼저·크게: NVIDIA > Broadcom > (제약: 공급) …
> Falsifier: 금리 인하가 경기침체 신호면 반대로 작용
> ```

---

## 사례 6. 매일 아침 Watchlist (V2 기능)

자동 수집 + Watchlist를 켰다면(V2), 아침에 열어보기만 하면 됩니다.

> [!example] [입력]
> ```text
> 오늘 Watchlist 보여줘
> ```

> [!success] [출력]
> ```text
> [매수 후보] Broadcom (신규) · Marvell (유지)   근거·Falsifier 첨부
> [경계]     ○○ (재고 과다)
> ※ 조사 후보 · 매매 지시 아님
> ```

---

## 한눈에 — 질문 → 결과

| 물으면 | 나온다 |
|---|---|
| "NVIDIA 실적 준비해줘" | 1페이지 인사이트 카드 |
| "주장 늘었는데 결과 안 난 기업은?" | 아직 안 본 수혜 후보 |
| "왜 주가가 안 올랐지?" | 막고 있는 Constraint |
| "반도체는 누가 잘 맞혀?" | 주제별 신뢰도 랭킹 |
| "금리 1% 내리면?" (V2) | 단계별 영향 시나리오 |
| "오늘 Watchlist 보여줘" (V2) | 매수·경계 후보 목록 |

> [!important] 항상 따라오는 것
> 모든 결과에는 **근거 링크**와 **Falsifier**(이 논리가 깨지는 조건)가 붙습니다. 시스템은 리서치 보조이고, 최종 판단은 사람이 합니다.

> [!quote] 한 줄 요약
> 여러분은 "URL 추가"와 "자연어 질문"만 합니다. 시스템이 그래프를 뒤져, 사람이 놓친 연결과 아직 안 본 후보를 근거와 함께 되돌려줍니다.
