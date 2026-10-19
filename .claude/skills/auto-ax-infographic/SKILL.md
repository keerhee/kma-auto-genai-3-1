---
name: auto-ax-infographic
description: 한국 자동차 산업 시장·공급망·생산·품질·영업·VOC·예지보전 내용을 11가지 인포그래픽으로 만들고 검증하는 AX 교육 전용 Claude Code 스킬.
---

# Auto AX Infographic Skill

이 스킬은 **자동차 산업 교육용 별도 스킬**이며 금융교육 스킬을 변경하거나 참조하도록 요구하지 않는다.

## 호출할 때

다음 의도의 요청에 사용한다: 자동차 시장 시각화, OEM 비교, EV 데이터 차트, 예지보전 인포그래픽, 공장 공정 흐름도, 생산/CS 업무 혁신, 자동차 산업 온톨로지, 자동차 AX 교육 슬라이드.

## 6단계 워크플로

1. 업무 문제: 어떤 질문에 답하는 그림인지 한 문장으로 작성.
2. 데이터: 파일/출처/기간/단위와 `real | synthetic | template` 종류를 구분.
3. 유형: `references/style_catalog.md`의 11종 중 하나 선택.
4. 생성: 제목→핵심 메시지→도형/차트→수치/출처→실습 질문, 16:9. 초보자 수준 16pt 이상, 본문 20pt 권장.
5. 검증: `references/data_validation.md`를 따른다. 직접 계산할 수 있는 데이터는 원본 CSV로 계산.
6. 산출: PNG 또는 PPTX(가능하면 편집 가능), Markdown/Obsidian 링크 및 검증 메모. 파일을 만들 도구가 없으면 설치 확인 후 대체 가능한 산출물을 제시.

## 강행 제한

- 실측 값, 공시, 판매·등록 수치, 재무지표, 기업 간 공급 관계를 **임의 생성 금지**.
- `등록`과 `판매`, `출하`와 `인도`, 전기차 BEV와 PHEV, `Tier`와 소유 관계를 구분.
- 가상 센서/VOC에는 슬라이드 앞쪽에 **실습용 가상 데이터**를 표기.
- 프롬프트는 데이터가 없을 때 '출처 보류'·'확인 필요'라고 답하도록 설계.
- 예지보전 탐지값으로 고장을 확정하거나 설비 자동 정지를 유도하지 말 것; 인간 검토 승인 단계 필요.

## 참고

- `references/style_catalog.md`: 11종 선택표
- `references/data_validation.md`: 업종 특화 데이터·에지 검증
- 실습 데이터: `data/README.md` 및 `data/Day2`, `data/Day4`, `data/Day5`, `data/Day6`
- 교육 저장소: https://github.com/keerhee/kma-auto-genai-3-1
