---
title: 나만의 GitHub 사이트 만들기 — 과정 자료 목록
course: 저장소 · 배포 · 회원관리 실무 과정
package: GitHub_Deploy_Supabase_Course_All.zip
version: v1.0 (2026-10-19)
tags:
  - 강의자료
  - GitHub
  - ClaudeCode
  - Supabase
  - 배포
---

# 나만의 GitHub 사이트 만들기 — 과정 자료 목록

> [!summary] 패키지 구성
> `GitHub_Deploy_Supabase_Course_All.zip` 에는 파일 8개가 들어 있다.
> - PPT 6개 (네이비 field 덱, 총 81장)
> - 실라부스 1개 — [[Syllabus_GitHub_Deploy_Supabase]]
> - 실습 템플릿 개정판 1개 — `supabase-course-template-II.zip` (publishable 키 기준)

| 파트 | 파일 | 장수 | 시간 |
|---|---|---|---|
| Part 1 | `Part1_GitHub_Basics.pdf` | 10 | 1H |
| Part 2 | `Part2_Create_Repo_with_Claude_Code.pdf` | 16 | 2H |
| Part 3 | `Part3_Deploy_GitHub_Pages.pdf` | 11 | 1H |
| Part 4 | `Part4_Vercel_vs_Cloudflare.pdf` | 12 | 1.5H |
| Part 5 | `Part5_Supabase_Auth_Data.pdf` | 16 | 2H |
| Part 6 | `Part6_Project_Course_Site.pdf` | 16 | 2.5H |

---

## Part 1 · GitHub와 Git의 기본 개념 (10장)

1. 표지
2. 이번 파트에서 가져갈 세 가지
3. 버전 관리가 없으면 파일 이름이 버전 기록이 된다
4. Git은 기록하고 GitHub는 보관·공유한다 — 다이어그램
5. 다섯 개 용어로 저장소의 구조를 설명할 수 있다
6. 공개 범위는 저장소를 만들 때 먼저 정한다
7. 강사 저장소는 날짜 폴더와 사이트 파일로 구성된다 — 사례
8. README는 저장소를 처음 보는 사람을 위한 안내문이다
9. 점검 질문
10. 종합

## Part 2 · Claude Code로 백지에서 저장소 만들기 (16장)

1. 표지
2. 세 가지 메시지
3. Claude Code는 터미널에서 일하는 AI 에이전트다
4. 본인 인증만 사람이 하고 나머지는 지시로 해결한다
5. 설치는 운영체제별 명령 한 줄로 끝난다
6. GitHub 로그인은 본인이 브라우저에서 승인한다
7. 첫 지시 한 문장으로 저장소의 뼈대가 생긴다
8. 자료를 넣은 뒤 README를 실제 파일에 맞춘다
9. 커밋·저장소 생성·푸시를 한 번에 지시한다
10. 이후 수정은 같은 문장 하나로 반복한다
11. .gitignore는 올라가면 안 되는 파일을 미리 막는다
12. 공개 저장소에 올라간 키 하나가 5년 동안 노출됐다 — Toyota 사례
13. 공개 GitHub에 새는 비밀값은 해마다 늘고 있다 — GitGuardian 사례
14. 큰 파일은 GitHub가 경고하거나 막는다
15. 점검 질문
16. 종합

## Part 3 · 배포의 이해와 GitHub Pages (11장)

1. 표지
2. 세 가지 메시지
3. 정적 사이트는 미리 만든 파일을 그대로 보여 준다
4. push는 저장소를 채우고 Pages는 사이트를 연다 — 다이어그램
5. 사이트의 첫 화면은 index.html이 정한다
6. Pages는 지시 한 문장이나 설정 화면 네 번 클릭으로 켠다
7. 배포가 끝났는지는 Actions 탭의 초록 체크로 확인한다
8. GitHub Pages는 무료지만 용도와 한도가 정해져 있다
9. 강사 저장소는 덱을 PDF로만 공개하고 첫 화면을 자동 생성한다 — 사례
10. 점검 질문
11. 종합

## Part 4 · 배포 플랫폼 비교 — Vercel과 Cloudflare (12장)

1. 표지
2. 세 가지 메시지
3. 정적 호스팅과 서버 기능은 다른 서비스다
4. 세 플랫폼은 무료 조건과 한도 초과 동작이 다르다 — 비교표
5. 무엇을 배포하는지가 플랫폼을 정한다 — 선택 트리
6. Vercel은 저장소를 가져오기만 하면 배포된다
7. 명령으로 배포할 때도 로그인만 직접 한다
8. Cloudflare도 저장소 연결 한 번으로 배포된다
9. 명령 배포는 설정 파일 하나와 wrangler로 끝난다
10. 무료 정적 사이트 하나에 10만 달러 청구서가 날아왔다 — Netlify 사례
11. 점검 질문
12. 종합

## Part 5 · Supabase로 회원·데이터 관리하기 (16장)

1. 표지
2. 세 가지 메시지
3. 회원제 사이트에는 화면 뒤에서 일하는 백엔드가 필요하다
4. 사이트는 publishable 키로 Supabase에 요청한다 — 구조도
5. Supabase의 세 기능이 회원·과제·파일을 나눠 맡는다
6. RLS는 같은 표에서도 사람마다 보이는 행을 다르게 한다
7. 같은 질의라도 로그인한 사람에 따라 결과가 달라진다 — RLS 그림
8. 화면에 넣어도 되는 키는 publishable 키 하나뿐이다
9. RLS 누락 하나로 170개 서비스의 데이터가 열렸다 — Lovable 사례
10. 프로젝트 생성은 대시보드에서 2분이면 끝난다
11. MCP를 연결하면 Claude Code가 DB를 직접 다룬다
12. 테이블과 보안 정책은 한 번의 지시로 함께 만든다
13. 무료 플랜은 과정 기간에 쓰기에 충분하다
14. 회원 데이터는 최소한만 받고 과정이 끝나면 지운다
15. 점검 질문
16. 종합

## Part 6 · 실습 프로젝트 — 과정 사이트 완성과 배포 (16장)

1. 표지
2. 세 가지 메시지
3. 템플릿은 화면 세 개와 설정 파일 네 개로 이루어진다
4. 일곱 단계는 세 장소를 오가며 진행한다 — 단계도
5. 회원 한 명이 여러 과제를 내고 파일은 본인 폴더에 쌓인다 — 데이터 모델
6. schema.sql의 네 블록은 각각 다른 위험을 막는다
7. 프로젝트를 만들고 schema.sql을 한 번 실행한다
8. 연결 정보 두 줄을 넣고 내 컴퓨터에서 먼저 확인한다
9. 관리자는 SQL 한 줄로 지정한다
10. 배포한 뒤 그 주소를 Supabase에 등록해야 가입이 완성된다
11. 완성 후에는 정책이 실제로 막는지 직접 시험한다
12. 막히는 곳은 대부분 다섯 군데다
13. 기능 하나를 골라 Claude Code에 추가를 지시한다
14. 발표는 시연과 정책 설명 두 가지로 평가한다
15. 점검 질문
16. 과정 종합

---

## 부속 파일

### 실라부스

- `Syllabus_GitHub_Deploy_Supabase.md` — 6개 파트, 10시간, 평가 기준, 참고 자료

### 실습 템플릿 `supabase-course-template-II.zip`

| 파일 | 역할 |
|---|---|
| `index.html` | 로그인 · 회원가입 |
| `my.html` | 내 과제 제출 · 목록 · 피드백 확인 |
| `admin.html` | 회원 목록 · 전체 제출 · 피드백 작성 · CSV |
| `app.js` | 세 화면의 공통 스크립트 (Supabase 연결) |
| `config.js` | Supabase 주소와 publishable 키 (본인 값으로 교체) |
| `style.css` | 화면 스타일 |
| `supabase/schema.sql` | 테이블 · RLS 정책 · 비공개 버킷 설정 |
| `README.md` | 초보자용 7단계 따라 하기 안내 |
| `CLAUDE.md` | Claude Code가 지킬 작업 규칙 (RLS 필수 등) |
| `.gitignore` | 올리지 않을 파일 목록 |

> [!note] 버전
> 처음 만든 템플릿 `supabase-course-template.zip` (anon 키 기준)은 비교용으로 따로 보관하며, 이 패키지에는 넣지 않았다.
