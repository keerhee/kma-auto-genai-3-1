# 자동차 산업 AX 인포그래픽 스킬

Claude Code 프로젝트 전용 스킬: `/.claude/skills/auto-ax-infographic/SKILL.md` (저장소 루트 기준)

## 바로 사용하기

1. `git clone https://github.com/keerhee/kma-auto-genai-3-1.git` 후 저장소 디렉터리에서 Claude Code 실행.
2. `/skills` 명령으로 `auto-ax-infographic` 확인.
3. 입력 예: `/auto-ax-infographic 2026년 8월 국내 EV 신규등록 Top 5를 데이터 출처와 함께 16:9 인포그래픽으로 만들어줘.`

## 모든 프로젝트에서 사용하기

저장소 폴더에서 다음처럼 복사한다.

```bash
mkdir -p ~/.claude/skills
cp -R .claude/skills/auto-ax-infographic ~/.claude/skills/
```

Claude Code를 재시작하고 `/skills`로 확인한다.

## 데이터와 범위

- `data/README.md`: 실제·가상·템플릿 데이터 차이와 출처·정의 안내
- `data/Day2/`: EV 신규등록 차트와 VOC 실습
- `data/Day4/`: 직무별 반복업무 AX
- `data/Day5/`: 가상 설비센서 예지보전
- `data/Day6/`: 5사×5축 캡스톤
- 금융교육용 `finance-infographic`은 **별도 저장소/스킬**로 관리하며 이 저장소에 포함하지 않는다.

스킬은 지침 문서이며 인포그래픽 렌더러나 외부 데이터 수집 도구를 자동으로 설치하지 않는다.
