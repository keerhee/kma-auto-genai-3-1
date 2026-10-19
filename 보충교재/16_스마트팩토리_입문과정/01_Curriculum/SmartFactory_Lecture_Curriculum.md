---
title: 스마트 팩토리 강의노트 커리큘럼
aliases: [Smart Factory Curriculum, 스마트 팩토리 12주 과정]
tags: [smart-factory, manufacturing-AI, predictive-maintenance, curriculum]
version: v1.0
---

# 스마트 팩토리 강의노트 커리큘럼
**Smart Factory — 데이터·AI로 다시 짜는 제조 운영**

> [!summary] 한 줄 요약
> 공장을 **"설비의 집합"이 아니라 "데이터가 흐르는 의사결정 시스템"** 으로 다시 보게 만드는 12주 과정. 기본 개념 → 데이터 인프라 → AI 응용(예지보전·품질·스케줄링) → 디지털 트윈 → 투자·조직 순으로 논리를 쌓는다.

---

## 0. 과정 개요

| 항목 | 내용 |
|---|---|
| 대상 | 제조업 재직자(생산·설비·품질·IT·전략기획), MBA |
| 기간 | 12주 × 3시간 (총 36시간) |
| 주차 구성 | 기본 지식 30분 → 이론 60분 → 케이스 스터디 45분 → 실습 45분 |
| 실습 도구 | Python(Colab), Claude, 공개 데이터셋(NASA C-MAPSS, AI4I 2020, SECOM 등) |
| 산출물 | 주차별 강의노트(md) · 덱 · 실습 노트북, 최종 프로젝트 보고서 |

### 과정 전체를 관통하는 질문
1. 우리 공장의 데이터는 **어디서 생겨서 어디로 흐르는가?** (ISA-95 계층)
2. 그 데이터로 **어떤 의사결정을 자동화·고도화할 수 있는가?** (예지보전·품질·스케줄링)
3. 그 투자는 **OEE·TCO로 얼마의 가치를 만드는가?** (ROI)

### 논리 흐름
```
Part I  왜·무엇 (개념·성숙도·KPI)
   ↓
Part II 데이터 인프라 (IIoT · OT/IT 통합 · MES)
   ↓
Part III AI 응용 (예지보전 · 품질 · 스케줄링 · 로봇)
   ↓
Part IV 통합 (디지털 트윈 · 데이터 생태계)
   ↓
Part V  실행 (보안 · ROI · 조직 · 로드맵)
```

---

## Part I. 스마트 팩토리의 기본 개념

### Week 1. 스마트 팩토리란 무엇인가 — Industry 4.0에서 Industry 5.0까지
- **기본 지식**: 자동화(Automation) vs 스마트화(Smartization), CPS(Cyber-Physical System)의 정의
- **이론**
  - 1~4차 산업혁명과 제조 패러다임 변화 (Mass Production → Mass Customization)
  - Industry 4.0 9대 기술 (IIoT, Big Data, Cloud, Simulation, AR, Additive Manufacturing, Cybersecurity, Robotics, Horizontal/Vertical Integration)
  - Industry 5.0: Human-centric · Sustainable · Resilient
  - 독일 RAMI 4.0, 미국 Smart Manufacturing, 한국 스마트공장 보급사업 비교
- **케이스**: WEF Global Lighthouse Network — 등대공장(Lighthouse Factory) 선정 기준과 국내 선정 사례
- **실습**: 자사 공정 한 라인을 골라 "현재 수작업·판단 포인트" 지도 그리기

### Week 2. 성숙도와 KPI — OEE부터 TCO까지
- **기본 지식**: 왜 KPI부터 정하는가 — 기술 도입이 목적이 되는 실패 패턴
- **이론**
  - 스마트공장 수준 확인 체계(기초–중간1–중간2–고도화), Acatech Industrie 4.0 Maturity Index
  - OEE(Overall Equipment Effectiveness) 분해

$$
\text{OEE} = \underbrace{\frac{\text{가동시간}}{\text{계획시간}}}_{\text{Availability}} \times \underbrace{\frac{\text{이론 사이클타임}\times\text{생산량}}{\text{가동시간}}}_{\text{Performance}} \times \underbrace{\frac{\text{양품수}}{\text{생산량}}}_{\text{Quality}}
$$

  - 6대 로스(Six Big Losses), MTBF·MTTR, PPM, 리드타임, TCO per Unit
- **케이스**: OEE 70%→85% 개선 사례 — 어느 로스를 먼저 잡았는가
- **실습**: 가상 라인 데이터로 OEE 계산·로스 트리 작성 (Claude로 개선 우선순위 도출)

---

## Part II. 데이터 인프라

### Week 3. 공장 데이터 아키텍처 — ISA-95와 OT/IT 통합
- **기본 지식**: OT(Operational Technology)와 IT의 차이, 왜 공장 데이터는 갇혀 있는가
- **이론**
  - ISA-95 5계층 (Level 0 센서 → Level 1 PLC → Level 2 SCADA/HMI → Level 3 MES → Level 4 ERP)
  - 자동화 피라미드에서 **Unified Namespace(UNS)** 로의 전환
  - 표준 프로토콜: OPC UA, MQTT, Modbus, PROFINET
- **케이스**: 레거시 PLC 공장의 데이터 수집 프로젝트 — 리트로핏(retrofit)과 엣지 게이트웨이
- **실습**: MQTT 시뮬레이터로 센서 데이터 발행·구독 체험

### Week 4. IIoT·엣지·클라우드와 MES
- **기본 지식**: 센서 종류(진동·온도·전류·음향·비전)와 샘플링 주기
- **이론**
  - Edge vs Cloud 컴퓨팅 의사결정 기준 (지연·대역폭·보안)
  - 시계열 DB(Historian), 데이터 레이크하우스
  - MES 핵심 기능: 작업지시·실적·추적성(Traceability)·LOT 관리
- **케이스**: Siemens Amberg · Bosch IIoT 플랫폼 — 수직 통합의 효과
- **실습**: 공정 시계열 데이터 정제(결측·이상치·리샘플링(resampling)) 노트북

---

## Part III. AI 응용

### Week 5. 예지보전 I — 정비 전략과 이상 탐지
- **기본 지식**: 사후보전(BM) → 예방보전(PM) → 상태기반보전(CBM) → 예지보전(PdM) → 처방보전(RxM)
- **이론**
  - P-F 곡선(Potential Failure → Functional Failure)과 탐지 시점의 가치
  - 진동 분석 기초: FFT, RMS, 첨도(kurtosis), 베어링 결함 주파수
  - 비지도 이상 탐지: 통계적 공정관리(SPC), Isolation Forest, Autoencoder 재구성오차
- **케이스**: 현대차·GE 항공엔진 예지보전 — 비계획 정지 감소 효과
- **실습**: 진동 데이터로 이상 점수 산출 및 임계값 설정

### Week 6. 예지보전 II — 잔여수명(RUL) 예측과 정비 의사결정
- **기본 지식**: RUL(Remaining Useful Life)의 정의와 "예측이 정비 계획으로 이어지는 조건"
- **이론**
  - 열화 모형, 생존분석(Weibull 신뢰도)

$$
R(t) = \exp\!\left[-\left(\frac{t}{\eta}\right)^{\beta}\right], \qquad h(t) = \frac{\beta}{\eta}\left(\frac{t}{\eta}\right)^{\beta-1}
$$

  - 지도학습 RUL: LightGBM, LSTM/1D-CNN, 구간형 예측
  - 비용 기반 정비 시점 최적화: 조기 교체 비용 vs 고장 비용
- **케이스**: NASA C-MAPSS 터보팬 엔진 벤치마크
- **실습**: C-MAPSS로 RUL 예측 → 정비 일정표 생성 (Claude로 정비 보고서 초안 작성)

### Week 7. AI 품질 관리 — 비전 검사와 공정 품질 예측
- **기본 지식**: 샘플링 검사 vs 전수 검사, 1종·2종 오류의 현장 비용
- **이론**
  - 머신비전 결함 검출: CNN 분류, 객체 탐지, 이상 탐지(PatchCore 등)
  - 공정 변수 → 품질 예측(Virtual Metrology), 반도체·배터리 공정 사례
  - 근본 원인 분석(RCA)과 SHAP 기반 설명
- **케이스**: 반도체 SECOM 데이터, 배터리 셀 외관 검사
- **실습**: SECOM 데이터로 불량 예측 + 주요 공정 변수 해석

### Week 8. 생산 계획·스케줄링 최적화
- **기본 지식**: MPS·MRP·APS의 관계, 병목(Bottleneck)과 제약이론(TOC)
- **이론**
  - Job Shop Scheduling, 혼합정수계획(MIP), 휴리스틱·메타휴리스틱
  - 수요 예측과 생산 계획 연동, 강화학습 기반 동적 스케줄링
  - 에너지 비용을 반영한 스케줄링 (탄소·전력 피크)
- **케이스**: 다품종 소량 생산 라인의 APS 도입 전후
- **실습**: OR-Tools로 소형 Job Shop 문제 풀기

### Week 9. 로봇·물류 자동화와 현장의 생성형 AI
- **기본 지식**: 산업용 로봇 vs 협동로봇(Cobot), AGV vs AMR
- **이론**
  - 유연 생산(셀 생산·모듈러 라인), 휴머노이드의 현장 투입 논의
  - 생성형 AI·LLM 에이전트의 공장 적용: 작업표준서 검색(RAG), 설비 매뉴얼 Q&A, 정비 이력 요약, 코파일럿형 HMI
- **케이스**: Tesla 기가팩토리 vs Toyota TPS — AI 중심 vs 프로세스 중심 공장
- **실습**: 설비 매뉴얼·정비 이력으로 RAG 챗봇 시제품 만들기 (Claude Code)

---

## Part IV. 통합

### Week 10. 디지털 트윈과 제조 데이터 생태계
- **기본 지식**: 디지털 모델 → 디지털 섀도 → 디지털 트윈의 구분
- **이론**
  - 제품·공정·공장 트윈, 시뮬레이션 기반 가상 시운전(Virtual Commissioning)
  - Asset Administration Shell(AAS), 데이터 스페이스(Catena-X, Manufacturing-X)
  - 공급망 가시성과 탄소 추적(PCF)
- **케이스**: BMW·NVIDIA Omniverse 가상 공장, Palantir Foundry 제조 적용
- **실습**: 간이 라인 시뮬레이션(SimPy)으로 병목 What-if 분석

---

## Part V. 실행

### Week 11. OT 보안·투자 경제성(ROI)
- **기본 지식**: 왜 OT 보안은 IT 보안과 다른가 — 가용성 우선
- **이론**
  - IEC 62443, Purdue 모델 기반 네트워크 분리, 랜섬웨어 생산 중단 사례
  - 스마트 팩토리 투자 평가: NPV·회수기간, 예지보전 ROI 구조

$$
\text{NPV} = -I_0 + \sum_{t=1}^{T}\frac{\Delta \text{가동률 가치}_t + \Delta \text{품질 비용}_t + \Delta \text{정비 비용}_t}{(1+r)^t}
$$

  - PoC 함정(Pilot Purgatory)과 확산(Scale-up) 조건
- **케이스**: 공장 랜섬웨어 사고, 예지보전 PoC는 성공했지만 확산에 실패한 사례
- **실습**: 자사 과제 하나의 ROI 시트 작성 (Claude로 민감도 분석)

### Week 12. 조직·로드맵·최종 발표
- **기본 지식**: 디지털 전환은 기술이 아니라 KPI·조직 정렬의 문제
- **이론**
  - 역할 재설계: 데이터 엔지니어·공정 데이터 사이언티스트·현장 챔피언
  - 단계별 로드맵(가시화 → 분석 → 예측 → 자율화)
  - Human-in-the-loop와 현장 수용성
- **최종 프로젝트 발표**: "우리 공장의 첫 번째 AI 과제" — 문제 정의·데이터·모델·KPI·ROI·로드맵

---

## 부록

### A. 실습 데이터셋
| 주차 | 데이터 | 용도 |
|---|---|---|
| 5 | CWRU Bearing / IMS Bearing | 진동 이상 탐지 |
| 6 | NASA C-MAPSS | RUL 예측 |
| 7 | UCI SECOM, AI4I 2020 | 품질·고장 예측 |
| 8 | 자체 생성 Job Shop 인스턴스 | 스케줄링 |
| 10 | SimPy 가상 라인 | 디지털 트윈 What-if |

### B. 평가
| 항목 | 비중 |
|---|---|
| 주차별 실습 산출물 | 40% |
| 케이스 판단 퀴즈 (수치를 주고 해석·판단을 묻는 문항) | 20% |
| 최종 프로젝트 보고서·발표 | 40% |

### C. 별도 덱(스페셜 세션) 후보
- 진동 신호처리 손계산 워크북 (FFT·RMS·결함 주파수)
- Weibull 신뢰도 손계산 워크북
- OEE·ROI 수치예제 워크북

### D. 주요 참고문헌
- Kagermann et al., *Recommendations for implementing the strategic initiative INDUSTRIE 4.0*, acatech
- WEF, *Global Lighthouse Network* 연차 보고서
- ISA-95 / IEC 62264, IEC 62443 표준
- Jardine, Lin & Banjevic (2006), *A review on machinery diagnostics and prognostics implementing CBM*
- Saxena et al. (2008), *Damage propagation modeling for aircraft engine run-to-failure simulation* (C-MAPSS)
