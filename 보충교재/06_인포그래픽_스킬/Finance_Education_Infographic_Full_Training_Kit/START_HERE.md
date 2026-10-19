# Finance & Education Infographic Kit — Visual Edition v1.1

## 패키지 내용

- `Finance_Education_Infographic_Master_Guide.md`: **표준 Markdown**, 이미지 11종을 상대경로로 포함
- `Finance_Education_Infographic_Master_Guide.docx`: **Word / Google Docs 호환 문서**, 그림 11종 + 개요 이미지 직접 삽입
- `Obsidian-Vault/Finance-Infographic/Infographic-Master-Guide.md`: Obsidian 이미지 위키 임베드 버전
- `Obsidian-Vault/Finance-Infographic/assets/`: PNG 11종 + SVG 11종 + 갤러리 개요
- `finance-infographic/SKILL.md`: Claude Code 스킬
- `finance-infographic/assets/style-reference/`: 스킬에서 재사용할 이미지 11종 PNG/SVG
- `finance-infographic/references/`: 유형 가이드, 데이터·수식 검증 규칙, 스타일 이미지 설명
- `finance-infographic/scripts/build_prompt.py`: 유형별 제작 프롬프트 생성기
- `finance-infographic/scripts/test_build_prompt.py`: 테스트
- `finance-infographic/examples/`: 산업 온톨로지·연구 검증 예제

## Obsidian에 설치 (Windows/macOS 공통)

1. Obsidian에서 사용할 Vault 폴더를 엽니다.
2. ZIP의 `Obsidian-Vault/Finance-Infographic/` 폴더 전체를 Vault에 복사합니다.
3. `Finance-Infographic/Infographic-Master-Guide.md`를 엽니다.
4. Reading View 또는 Live Preview로 전환하면 이미지가 보입니다.
5. 이미지가 보이지 않으면 `assets` 폴더가 그대로 들어왔는지 확인하고 중복 파일 이름을 점검합니다.

## Claude Code 스킬 설치

ZIP의 `finance-infographic` 폴더 전체를 아래 경로로 복사합니다.

- macOS/Linux: `~/.claude/skills/finance-infographic/`
- Windows: `%USERPROFILE%\.claude\skills\finance-infographic\`

## 기능 검사

```bash
python finance-infographic/scripts/build_prompt.py --list
python -m unittest discover -s finance-infographic/scripts -p 'test_*.py'
```

## 출처 범위

원본 제공 SNS 캡처로 확인된 유형은 #1/#2/#3/#5이며, #4/#6~#11은 독자적 확장안입니다. **11개 참고 이미지는 모두 이 패키지를 위해 새로 제작한 이미지로, 원저자의 포스터 원본이 아닙니다.** 이미지에 등장하는 통계값과 가상 거래관계는 설명을 위한 예시이며 최신 사실 자료가 아닙니다.

## Google Docs

https://docs.google.com/document/d/1L1Mtj76oo2W-a0u8KJPh-UFO3zYrS8XjEa1dm4AGfh8/edit
