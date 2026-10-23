---
title: Claude Code로 만드는 나만의 GitHub 사이트 — 실라부스
course: 저장소 · 배포 · 회원관리 실무 과정
version: v1.0 (2026-10-19)
---

# Claude Code로 만드는 나만의 GitHub 사이트

> 저장소 만들기에서 배포, Supabase 회원·데이터 관리까지 — 6개 파트 10시간 과정

## 1. 과정 개요

| 항목 | 내용 |
|---|---|
| 대상 | 코딩 경험이 없는 재직자·수강생 (생성형 AI 실무 과정 수료생 또는 병행 수강생) |
| 목표 | 백지 상태에서 자기 GitHub 저장소를 만들고, 웹사이트로 배포하고, 로그인·과제 제출이 되는 회원제 사이트까지 직접 운영한다 |
| 방식 | 개념(기본 지식) → 사례 → Claude Code 실습 → 점검. 명령어는 직접 외우지 않고 Claude Code에 한국어로 지시한다 |
| 총 시간 | 10시간 (6개 파트) |
| 준비물 | 노트북(macOS·Windows), Claude Pro 이상 구독(Claude Code 사용 조건), 이메일 계정 |
| 최종 산출물 | ① 내 GitHub 저장소 ② 배포된 강의자료 사이트 ③ Supabase 회원제 과제 제출 사이트 |
| 참고 저장소 | 강사 저장소 `keerhee/kma-auto-genai-3-1` (날짜별 폴더 + README + GitHub Pages 사이트) |

## 2. 과정의 흐름

```
Part 1  GitHub 기본 개념        "저장소란 무엇인가"
   ↓
Part 2  백지에서 저장소 만들기   "Claude Code로 내 저장소를 만든다"
   ↓
Part 3  배포와 GitHub Pages     "올리기(push)와 배포는 다르다"
   ↓
Part 4  Vercel · Cloudflare    "어디에 배포할지 고른다"
   ↓
Part 5  Supabase 회원·데이터    "로그인과 데이터는 Supabase에 맡긴다"
   ↓
Part 6  실습 프로젝트           "과정 사이트를 완성해 배포한다"
```

## 3. 파트별 구성

### Part 1. GitHub와 Git의 기본 개념 (1H)

| 구분 | 내용 |
|---|---|
| 학습 목표 | 저장소(repository)·커밋(commit)·푸시(push)·README의 정의와 쓰임을 설명할 수 있다 |
| 기본 지식 | Git과 GitHub의 차이, 로컬 저장소와 원격 저장소, 공개(public)·비공개(private) 저장소 |
| 사례 | 강사 저장소 `kma-auto-genai-3-1` 해부 — Day0~Day6 폴더, README 표, `index.html`, `.nojekyll`, `_build` |
| 점검 | "저장소·커밋·푸시를 한 문장씩으로 설명하기" |

### Part 2. Claude Code로 백지에서 저장소 만들기 (2H)

| 구분 | 내용 |
|---|---|
| 학습 목표 | Claude Code에 한국어로 지시해 저장소를 만들고 GitHub에 올릴 수 있다 |
| 기본 지식 | 터미널, Claude Code 설치(네이티브 설치), `gh` CLI, `!` 직접 실행, `.gitignore` |
| 실습 | 0단계 준비(가입·설치·로그인) → 1단계 뼈대 → 2단계 자료 넣기 → 3단계 커밋·푸시 → 5단계 반복 업데이트 |
| 사례 | 공개 저장소에 올라간 비밀 키 — Toyota T-Connect(2017~2022, 약 29.6만 건 이메일 노출), GitGuardian 2026 보고서(2025년 공개 GitHub 신규 노출 비밀값 약 2,900만 건) |
| 점검 | 내 저장소 주소 제출, `.gitignore`에 무엇을 넣었는지 설명 |

### Part 3. 배포의 이해와 GitHub Pages (1H)

| 구분 | 내용 |
|---|---|
| 학습 목표 | push(업로드)와 배포(deploy)의 차이를 설명하고, GitHub Pages로 사이트를 공개할 수 있다 |
| 기본 지식 | 정적 사이트(static site), `index.html`, 도메인과 URL, 자동 재배포 |
| 실습 | Settings → Pages 켜기(또는 Claude Code에 지시), Actions 탭에서 배포 확인, 사이트 첫 화면 만들기 |
| 제약 | 사이트 1GB, 월 100GB(권장 한도), 무료 계정은 public 저장소만, 온라인 비즈니스·민감 정보 처리 용도 금지 |
| 점검 | 내 사이트 주소(`아이디.github.io/저장소`) 제출 |

### Part 4. 배포 플랫폼 비교 — Vercel과 Cloudflare (1.5H)

| 구분 | 내용 |
|---|---|
| 학습 목표 | 용도·비용·한도를 기준으로 GitHub Pages, Vercel, Cloudflare 중 하나를 고를 수 있다 |
| 기본 지식 | 정적 호스팅과 서버 기능(서버리스 함수), 무료 플랜의 한도 초과 시 동작(정지·대기·계속 서비스) |
| 실습 | Vercel Import 배포, Cloudflare Workers 정적 자산 배포(웹 연결 / `wrangler`) |
| 사례 | Netlify 10만 4,500달러 청구서(2024.2) — 정적 사이트 하나가 DDoS로 약 190TB 트래픽 |
| 점검 | 세 가지 상황(공개 강의자료 / 비공개 업무 사이트 / 웹앱)에 맞는 플랫폼 고르기 |

### Part 5. Supabase로 회원·데이터 관리하기 (2H)

| 구분 | 내용 |
|---|---|
| 학습 목표 | 화면(배포 플랫폼)과 백엔드(Supabase)를 나누는 구조를 이해하고, RLS로 데이터를 보호하는 원리를 설명할 수 있다 |
| 기본 지식 | 인증(Auth)·데이터베이스(Postgres)·저장소(Storage), 행 수준 보안(RLS, Row Level Security), API 키 체계(publishable·secret, 기존 anon·service_role은 2026년 말 폐기 예정) |
| 실습 | 프로젝트 생성(Seoul 리전), Supabase MCP를 Claude Code에 연결(`project_ref`·`read_only` 옵션) |
| 사례 | Lovable CVE-2025-48757 — RLS 누락으로 170개 프로젝트, 303개 엔드포인트의 데이터가 로그인 없이 조회됨 |
| 점검 | "publishable 키가 공개돼도 괜찮은 이유"와 "secret 키를 절대 공개하면 안 되는 이유" 설명 |

### Part 6. 실습 프로젝트 — 과정 사이트 완성과 배포 (2.5H)

| 구분 | 내용 |
|---|---|
| 학습 목표 | 템플릿으로 로그인·과제 제출·관리자 화면이 있는 사이트를 만들고 배포·운영할 수 있다 |
| 템플릿 | `supabase-course-template` — `index.html`·`my.html`·`admin.html`·`app.js`·`config.js`·`schema.sql`·`CLAUDE.md` |
| 실습 | 1 프로젝트 생성 → 2 `schema.sql` 실행 → 3 연결 정보 입력 → 4 로컬 확인 → 5 관리자 지정 → 6 GitHub·배포 → 7 배포 주소를 Supabase에 등록 |
| 확장 과제 | 구글 로그인, 출석 테이블, 공지 게시판(관리자만 작성), 제출률 차트 — 모두 Claude Code에 지시 |
| 발표 | 내 사이트 시연 + "내가 건 RLS 정책 한 가지" 설명 |

## 4. 평가

| 항목 | 비중 | 기준 |
|---|---|---|
| 저장소·배포 | 30% | 저장소 구조와 README, 배포 주소가 정상 동작하는가 |
| 보안 점검 | 30% | 비밀 키 미노출, 모든 테이블 RLS 활성화, 본인 데이터만 조회되는가 |
| 최종 프로젝트 | 40% | 회원가입 → 제출 → 관리자 피드백 흐름이 끊김 없이 동작하는가, 확장 기능 1개 이상 |

## 5. 운영 원칙

- **명령어는 외우지 않는다.** Claude Code에 한국어로 지시하고, 로그인처럼 사람이 직접 해야 하는 단계만 직접 한다.
- **올리기 전에 확인한다.** 회사 내부 자료, 개인정보, 비밀 키는 공개 저장소에 올리지 않는다.
- **무료 플랜의 한도를 안다.** 각 서비스의 한도와 한도 초과 시 동작을 알고 쓴다.
- **보안은 RLS가 지킨다.** 테이블을 만들면 RLS를 켜고 정책을 건다. 정책이 "있는지"가 아니라 "막는지"를 직접 시험한다.

## 6. 참고 자료

- GitHub Docs, *GitHub Pages limits* — https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- GitHub Docs, *About large files on GitHub* — https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github
- Claude Code Docs, *Advanced setup* — https://code.claude.com/docs/en/setup
- Vercel Docs, *Hobby Plan* — https://vercel.com/docs/plans/hobby
- Cloudflare Docs, *Workers limits* — https://developers.cloudflare.com/workers/platform/limits/
- Supabase Docs, *API keys* — https://supabase.com/docs/guides/api/api-keys
- Supabase Docs, *MCP* — https://supabase.com/docs/guides/getting-started/mcp
- TechCrunch, *Toyota customer email addresses exposed* (2022.10)
- The Hacker News, *The State of Secrets Sprawl 2026* (2026.3)
- Superblocks, *Lovable vulnerability explained* (CVE-2025-48757)
