---
title: 스마트 팩토리 1일 8시간 압축 과정
aliases: [Smart Factory 1-Day, 스마트 팩토리 압축판]
tags: [smart-factory, predictive-maintenance, curriculum, 1-day]
version: v1.0
source: SmartFactory_Lecture_Curriculum.md (12주판)
---

# 스마트 팩토리 1일 8시간 압축 과정
**데이터가 흐르는 공장 — 개념에서 예지보전 AI까지**

> [!summary] 한 줄 요약
> 전반 4시간에 **"공장 데이터는 어디서 생겨 어디로 흐르는가"** 를, 후반 4시간에 **"그 데이터로 무엇을 예측하고 얼마의 가치를 만드는가"** 를 다룬다. 핵심 응용은 예지보전(Predictive Maintenance).

---

## 0. 과정 개요

| 항목 | 내용 |
|---|---|
| 대상 | 제조업 재직자(생산·설비·품질·IT·전략기획), MBA |
| 시간 | 09:00–18:00 (점심 13:00–14:00), 총 8시간 |
| 구성 | 블록마다 기본 지식 → 이론 → 케이스 → 실습 |
| 도구 | Claude, Python(Colab, 사전 작성 노트북), 공개 데이터셋 |
| 산출물 | ① 라인 OEE 로스 트리 ② 예지보전 분석 보고서 ③ AI 과제 ROI 한 장 |

### 12주판 → 1일판 압축 원칙
| 12주판 | 1일판 처리 |
|---|---|
| Part I 개념·KPI (1–2주) | 블록 1로 통합 |
| Part II 데이터 인프라 (3–4주) | 블록 2로 통합 |
| Part III 예지보전 (5–6주) | 블록 3·4 — **가장 많은 시간 배정** |
| 품질·스케줄링·로봇 (7–9주) | 블록 2 케이스와 블록 4 확장 슬라이드로 개관 |
| 디지털 트윈·보안·ROI·조직 (10–12주) | 블록 5로 통합 |

---

## 전반 4H — 스마트 팩토리의 구조

### 블록 1 (09:00–10:30, 90분) 스마트 팩토리란 무엇인가 — 개념과 KPI
- **기본 지식 (15분)**: 자동화 vs 스마트화, CPS(Cyber-Physical System)의 정의
- **이론 (35분)**
  - Industry 4.0 9대 기술 → Industry 5.0(Human-centric·Sustainable·Resilient)
  - 성숙도: 스마트공장 수준 확인 체계, Acatech Maturity Index
  - OEE 분해와 6대 로스(Six Big Losses)

$$
\text{OEE} = \text{Availability} \times \text{Performance} \times \text{Quality}
$$

- **케이스 (20분)**: WEF 등대공장(Lighthouse Factory) — 선정 기준과 국내 사례 / Toyota(프로세스 중심) vs Tesla(AI 중심) vs Palantir(데이터 중심)
- **실습 (20분)**: 가상 라인 데이터로 OEE 계산 → 로스 트리 작성 → Claude로 개선 우선순위 도출
  - 산출물 ①

### 휴식 (10:30–10:40)

### 블록 2 (10:40–13:00, 140분) 공장 데이터 아키텍처와 AI 응용 지도
- **기본 지식 (15분)**: OT(Operational Technology)와 IT의 차이, 공장 데이터가 갇히는 이유
- **이론 (55분)**
  - ISA-95 5계층(센서 → PLC → SCADA/HMI → MES → ERP)과 Unified Namespace(UNS)
  - 표준 프로토콜: OPC UA, MQTT
  - IIoT 센서(진동·온도·전류·음향·비전)와 Edge vs Cloud 판단 기준
  - MES 핵심 기능: 작업지시·실적·추적성(Traceability)
  - **AI 응용 지도**: 예지보전 · 비전 품질검사 · Virtual Metrology · APS 스케줄링 · RAG 기반 현장 코파일럿
- **케이스 (40분)**
  - Siemens Amberg — 수직 통합의 효과
  - 레거시 PLC 공장의 리트로핏(retrofit)과 엣지 게이트웨이
  - BMW·NVIDIA Omniverse 가상 공장 (디지털 트윈 개관)
- **실습 (30분)**: 자사(또는 가상) 공정 한 라인의 데이터 흐름도 그리기 — "어떤 데이터가 어느 계층에 있고, 어디서 끊기는가"

---

## 점심 (13:00–14:00)

---

## 후반 4H — 예지보전 AI 활용

### 블록 3 (14:00–15:30, 90분) 예지보전 이론 — 정비 전략·이상 탐지·RUL
- **기본 지식 (15분)**: 사후보전(BM) → 예방보전(PM) → 상태기반보전(CBM) → 예지보전(PdM) → 처방보전(RxM)
- **이론 (45분)**
  - P-F 곡선(Potential Failure → Functional Failure): 일찍 잡을수록 가치가 큰 이유
  - 진동 지표: RMS, 첨도(kurtosis), FFT와 베어링 결함 주파수
  - 이상 탐지: SPC 관리도, Isolation Forest, Autoencoder 재구성오차
  - RUL(Remaining Useful Life) 예측과 Weibull 신뢰도

$$
R(t) = \exp\!\left[-\left(\frac{t}{\eta}\right)^{\beta}\right]
$$

  - 정비 시점 결정: 조기 교체 비용 vs 고장 비용
- **케이스 (30분)**: GE 항공엔진·현대차 예지보전 — 비계획 정지 감소 효과 / PoC는 성공했지만 확산에 실패한 사례(Pilot Purgatory)

### 휴식 (15:30–15:40)

### 블록 4 (15:40–17:10, 90분) 예지보전 실습 — 센서 데이터에서 정비 보고서까지
- **실습 1 (35분) 이상 탐지**: 베어링 진동 데이터(CWRU/IMS) → RMS·첨도 추출 → 이상 점수와 임계값 설정
- **실습 2 (35분) RUL 예측**: NASA C-MAPSS 터보팬 엔진 → 사전 작성 노트북으로 LightGBM RUL 예측 → 정비 우선순위표
- **실습 3 (20분) AI 보고서**: 결과 그래프·표를 Claude에 넣어 **예지보전 분석 보고서** 초안 작성 (현황 → 위험 설비 → 권고 정비 일정 → 기대 효과)
  - 산출물 ②
- 확장 슬라이드(시간 여유 시): 비전 품질검사, 정비 매뉴얼 RAG 챗봇

### 블록 5 (17:10–18:00, 50분) 투자 경제성과 실행 로드맵
- **이론 (25분)**
  - 예지보전 ROI 구조: 가동률 개선 + 정비비 절감 + 품질 비용 감소

$$
\text{NPV} = -I_0 + \sum_{t=1}^{T}\frac{\Delta \text{가동률 가치}_t + \Delta \text{정비 비용}_t + \Delta \text{품질 비용}_t}{(1+r)^t}
$$

  - OT 보안(IEC 62443) 최소 체크리스트
  - 단계별 로드맵: 가시화 → 분석 → 예측 → 자율화, Human-in-the-loop
- **실습·정리 (25분)**: 오늘의 예지보전 과제를 ROI 한 장으로 정리(Claude로 민감도 분석) → 공유
  - 산출물 ③

---

## 시간표 요약

| 시간 | 블록 | 주제 | 형식 |
|---|---|---|---|
| 09:00–10:30 | 1 | 개념·성숙도·OEE | 이론·케이스·실습 |
| 10:40–13:00 | 2 | 데이터 아키텍처·AI 응용 지도 | 이론·케이스·실습 |
| 14:00–15:30 | 3 | 예지보전 이론 | 이론·케이스 |
| 15:40–17:10 | 4 | 예지보전 실습 | 실습 |
| 17:10–18:00 | 5 | ROI·로드맵 | 이론·실습 |

## 사전 준비
- 실습 노트북 2종(이상 탐지·RUL)은 **사전 작성본 제공** — 수강생은 실행·해석에 집중
- 데이터는 노트북에서 직접 내려받음(CWRU/IMS, NASA C-MAPSS)
- Claude 계정, Colab 접속 확인

## 별도 워크북 후보
- OEE·ROI 손계산 수치예제
- Weibull 신뢰도·RUL 손계산 예제
