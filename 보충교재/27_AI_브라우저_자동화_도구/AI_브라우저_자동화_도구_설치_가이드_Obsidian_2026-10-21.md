---
title: AI 브라우저 자동화 도구별 설치 및 실습 가이드
aliases:
  - Claude Code 브라우저 자동화 설치 교안
  - Playwright Ego Lite Aside 설치
created: 2026-10-21
updated: 2026-10-21
tags:
  - AI/BrowserAutomation
  - ClaudeCode
  - MCP
  - 설치가이드
  - 강의/실습
status: complete
---

# AI 브라우저 자동화 도구별 설치 및 실습 가이드

> [!info] 대상과 범위
> **대상:** 처음 설치해 보는 수강생, Claude Code 사용자, 금융·자동차 산업 AX 실습자  
> **운영체제:** **macOS / Windows PowerShell** (명령이 다른 경우 반드시 구분)  
> **기준일:** **2026-10-21**. 공식 문서 기준이며 실제 버전·배포 방식은 변경될 수 있습니다.  
> **범위:** ① Ego Lite ② Aside ③ agent-browser ④ Playwright CLI ⑤ Playwright MCP ⑥ Playwright Python ⑦ Browser Use ⑧ Stagehand v4 ⑨ Chrome DevTools MCP ⑩ Skyvern.  
> **설치 여부:** 본 문서는 **설치 절차 안내서**입니다. 여러분의 PC에 실제 설치를 수행하거나 설치 성공을 검증한 문서는 아닙니다.

> [!success] 권장 진도
> 1차시: **agent-browser → Playwright CLI** (누구나 실습 가능)  
> 2차시: **Ego Lite → Aside** (AI 브라우저 체험)  
> 3차시: **Playwright MCP → Chrome DevTools MCP** (Claude Code 연동)  
> 심화: **Playwright Python → Browser Use → Stagehand v4 → Skyvern**.  
> **처음부터 모두 설치하지 마세요.** 하나씩 설치하고, 정상 동작을 확인한 뒤 다음으로 이동합니다.

## 0. 도구와 설치 난이도 한눈에 보기

| 도구 | 무엇을 설치하나? | 예상 난이도 | Claude Code 연결 | API 키 필요? |
|---|---|---|---|---|
| Ego Lite | 전용 브라우저 앱 + `ego-browser` Skill | ★ | Skill | 첫 공개 페이지 열기는 불필요 |
| Aside | 브라우저 앱 + 선택적 CLI/MCP | ★★ | MCP 또는 자체 AI | Aside 계정 필요; 외부 모델 키는 선택적 |
| agent-browser | CLI + 테스트용 Chrome + Skill | ★ | Skill | 기본 브라우저 조작에는 불필요 |
| Playwright CLI | CLI + Skill | ★★ | Skill | 불필요 |
| Playwright MCP | MCP 서버 | ★★ | MCP | 불필요 |
| Playwright Python | Python 패키지 + Chromium | ★★ | 코드 실행 | 불필요 |
| Browser Use | Python 패키지 + 브라우저 + LLM | ★★★ | CLI/Skill 또는 Python | AI 작업은 모델 자격 증명 필요 |
| Stagehand v4 | Python/TypeScript SDK + 브라우저 + LLM | ★★★ | 코드 생성·실행 | 로컬 AI 작업은 모델 API 키 필요 |
| Chrome DevTools MCP | Chrome + MCP/Plugin | ★★ | MCP 또는 Plugin | 불필요 |
| Skyvern | Python 앱 또는 Docker 서비스 | ★★★★ | API/워크플로 연계 | AI 모델 설정 필요 |

**중요:** 여기서 'API 키 불필요'란 **브라우저 제어 도구 자체에는 별도 LLM API 키가 필요하지 않다**는 의미입니다. Claude Code 이용권 또는 로그인은 별개입니다. 무료 오픈소스 설치와 LLM·클라우드 사용 비용도 다릅니다.

---

# Part I. 공통 준비: 처음 한 번만

## 1. 용어 4개만 이해하기

- **터미널(Terminal):** 명령어를 입력하는 창. Mac은 `Terminal`, Windows는 `PowerShell`을 사용합니다.
- **Node.js / npm / npx:** 자바스크립트 프로그램 실행기 / 설치 명령 / 패키지 실행 명령.
- **Skill:** Claude Code가 특정 도구의 사용법을 배우도록 하는 지침 묶음. **Skill을 추가하는 것만으로 도구 본체가 항상 설치되는 것은 아닙니다.**
- **MCP:** Claude Code와 다른 프로그램의 기능을 연결하는 규약. MCP 서버는 보통 Claude Code가 필요할 때 실행합니다.

## 2. 공통 사전 확인

**Mac:** `응용 프로그램 → 유틸리티 → 터미널` 실행  
**Windows:** 시작 메뉴에서 `PowerShell` 검색 → 실행 (대체로 **관리자 권한 불필요**)

터미널에 아래 명령을 **한 줄씩** 입력하고 Enter를 누릅니다. Windows에서도 동일한 명령을 쓸 수 있습니다.

```bash
node --version
npm --version
npx --version
python --version
claude --version
```

- 버전 숫자가 보이면 설치되어 있는 것입니다.
- `command not found` / `'node' is not recognized`라면 아직 설치되지 않았거나 PATH 인식이 되지 않은 상태입니다.
- `python` 명령이 없는 Mac에서는 `python3 --version`을 시도합니다.
- Claude Code의 **데스크톱 Code 모드**를 사용 중이면 CLI의 `claude` 명령이 없어도 되는 구성일 수 있습니다. 이때는 앱 내부 Skill/MCP 설정을 사용하세요.

### 2-1. Node.js가 없다면

1. 공식 사이트 [https://nodejs.org/](https://nodejs.org/)를 엽니다.
2. **LTS(장기 지원)** 설치 파일을 고릅니다. Mac은 시스템에 맞는 macOS 설치 파일, Windows는 Windows 설치 파일을 사용합니다.
3. 설치 마법사에서 기본값으로 설치합니다. Windows의 PATH 등록 옵션은 유지합니다.
4. **터미널을 완전히 닫고 다시 열어** `node --version`, `npm --version`을 재확인합니다.

> [!warning] 설치 프로그램 출처
> 블로그가 제공하는 압축파일이나 알 수 없는 설치 스크립트보다 **공식 웹사이트**를 우선하세요. 설치 시 관리자 권한을 요구하면 출처와 이유를 확인하세요.

### 2-2. Python이 없다면 (심화 도구 수강생만)

1. [https://www.python.org/downloads/](https://www.python.org/downloads/)에서 Python 설치 파일을 내려받습니다.
2. Windows는 설치 과정에서 **Add Python to PATH** 여부를 확인합니다.
3. 아래 중 자신의 환경에 맞는 명령으로 확인합니다.

```bash
# macOS
python3 --version

# Windows PowerShell
py --version
```

Browser Use 실습은 **Python 3.12**, Skyvern은 공식 지원 **Python 3.11~3.13**, Stagehand v4 Python SDK는 **3.11 이상**을 사용합니다. 여러 도구를 함께 설치한다면 프로젝트별 가상환경을 권장합니다.

### 2-3. Claude Code 확인

- 설치된 경우 터미널에서 `claude`를 입력하여 시작할 수 있습니다.
- 설치되지 않았다면 공식 [Claude Code 설치 안내](https://code.claude.com/docs/en/setup)를 따릅니다.
- **Claude Code 채팅창의 명령**(`/mcp`, `/plugin` 등)과 **터미널 명령**(`npm`, `claude mcp ...`)은 입력 위치가 다릅니다.

### 2-4. 수강생용 작업 폴더

**Mac:**

```bash
mkdir -p ~/browser-class
cd ~/browser-class
```

**Windows PowerShell:**

```powershell
New-Item -ItemType Directory -Force "$HOME\browser-class"
Set-Location "$HOME\browser-class"
```

> [!tip] 보안 기본값
> 첫 실습은 `https://example.com`, 공식 문서 등 **로그인 없는 웹사이트**만 사용합니다. **브라우저 전체 프로필·비밀번호·쿠키를 처음부터 복사하지 마세요.** Claude Code의 권한 확인을 함부로 해제하지 않습니다.

---

# Part II. 도구별 설치 및 확인

## ① Ego Lite — 앱 설치형 AI 브라우저

**추천:** 별도 AI 작업 Space에서 Claude Code가 페이지를 읽고 조작하는 모습을 직접 보고 싶은 경우.  
**공식:** [macOS 설치](https://www.egolite.app/document/ko/docs/quick-start) · [Windows 베타 설치](https://www.egolite.app/document/ko/docs/windows/quick-start) · [Mac Claude Code 연결](https://www.egolite.app/document/ko/docs/claude-code) · [Windows Claude Code 연결](https://www.egolite.app/document/ko/docs/windows/claude-code)

### 설치 A: macOS

- [ ] 1. 공식 [Mac 설치 안내](https://www.egolite.app/document/ko/docs/quick-start)에서 **Mac용 다운로드**를 누릅니다.
- [ ] 2. 받은 **DMG** 파일을 열고 화면의 안내대로 앱을 설치합니다.
- [ ] 3. `ego(lite)`를 실행해 초기 설정을 완료합니다.
- [ ] 4. **Chrome 데이터 가져오기는 처음에는 건너뜁니다.** 필요할 때 별도 실습 계정만 이용하세요.
- [ ] 5. Claude Code를 완전히 종료하고 다시 열어 Skill 목록에서 `ego-browser`를 확인합니다.

### 설치 B: Windows

- [ ] 1. 공식 [Windows 베타 설치 안내](https://www.egolite.app/document/ko/docs/windows/quick-start)에서 **Windows용 다운로드 (beta)**를 선택합니다.
- [ ] 2. 설치 프로그램을 실행하고 안내대로 설치합니다.
- [ ] 3. 초기 설정을 완료합니다. **베타 버전은 안정성 차이가 있을 수 있습니다.**
- [ ] 4. Claude Code의 **로컬 Code 세션**을 실행하여 `ego-browser` Skill을 찾습니다.
- [ ] 5. 안 보이면 ego(lite)를 재실행하고 Claude Code도 재시작합니다.

### 연결 / 테스트

Claude Code **채팅창**에서:

```text
/ego-browser
```

이후 입력:

```text
ego-browser를 사용해 https://example.com 을 열어 줘.
페이지 제목과 첫 문단을 읽어 요약해 줘.
로그인, 다운로드, 외부 전송, 게시, 구매는 수행하지 마.
```

**성공 판정:** Ego Lite에 에이전트용 Space가 열리고, Claude Code가 페이지 정보를 설명합니다.

### Skill이 없을 때만 시도하는 추가 방법

터미널:

```bash
npx skills add citrolabs/ego-lite
```

이 명령은 **Skill 추가 경로**입니다. 브라우저 앱 자체 설치와 구분하세요.

> [!danger] 권한에 대한 주의
> Ego Lite 공식 예시는 `Bypass permissions` 등 넓은 권한을 사용하는 경우가 있습니다. 그러나 **초보자 교안은 최소 권한·매 단계 확인을 기본값**으로 합니다. `claude --dangerously-skip-permissions`를 복사해 실행하도록 권하지 않습니다. 권한이 막히면 요청된 명령과 파일 접근 범위를 검토한 후 **필요한 행동만 승인**하세요.

---

## ② Aside — 자체 AI 업무 브라우저 + CLI/MCP

**추천:** 브라우저 안에서 자연어로 여러 페이지에 걸친 작업을 직접 위임하고 싶은 경우.  
**공식:** [설치 시작](https://docs.aside.com/help/get-started) · [CLI/MCP](https://docs.aside.com/help/developers) · [공식 다운로드](https://aside.com/download)

> [!important] 운영체제 확인
> 2026-10-21에 확인한 Aside **공식 시작 가이드에서는 macOS 15.0 이상**을 설치 요구사항으로 명시합니다. 개발자 안내에는 Windows 탭이 보이지만, **Windows용 브라우저 정식 설치 절차까지 확증되는 것은 아닙니다.** Windows 수강생은 공식 다운로드 페이지의 현재 지원 여부를 먼저 확인하고, 지원되지 않으면 Ego Lite 또는 agent-browser 실습으로 대체하세요.

### 설치 A: 브라우저 앱 (macOS)

- [ ] 1. [https://aside.com/download](https://aside.com/download)에서 설치 파일을 받습니다.
- [ ] 2. Aside 앱을 설치하고 실행합니다.
- [ ] 3. 계정을 만들거나 로그인합니다.
- [ ] 4. 기존 Chrome 데이터 가져오기·비밀번호 관리자 설정은 **선택사항**입니다. 최초 수업에서는 가져오지 않습니다.
- [ ] 5. 앱의 Task/Side panel에서 첫 작업을 실행합니다.

첫 작업(앱 입력창):

```text
Open https://example.com. Tell me the page title and a short summary.
Read only. Do not click sign-in, submit forms, or download files.
```

### 설치 B: CLI (선택)

**가장 안전한 초보 경로:** Aside 앱의 **Developer Settings**에서 CLI 설치·업데이트 버튼을 사용합니다. 공식 문서에 소개된 macOS 터미널 설치 명령은 아래와 같습니다. 네트워크에서 스크립트를 받아 즉시 실행하는 방식이므로 **수강생에게 무조건 복붙하도록 지시하지 않습니다.**

```bash
# macOS — 공식 설치 방식이지만 반드시 출처와 내용을 검토
curl -fsSL https://releases.aside.com/install.sh | bash
```

설치 후 새 터미널에서:

```bash
aside --help
aside account status
```

로그인이 추가로 필요하면 공식 문서의 `aside login --email` 절차를 따르고, 앱의 **Settings → Account → Devices**에서 코드 승인을 완료합니다. 인증 파일은 비공개 경로에 보관합니다.

### Claude Code에 MCP 연결 (CLI가 설치된 경우)

터미널:

```bash
claude mcp add aside -- aside mcp
claude mcp list
```

**Claude Code 채팅창**에서 `/mcp`로 연결 상태를 확인합니다. 실행 파일 경로 문제로 연결되지 않으면 Aside **Developer Settings가 표시하는 CLI 경로**로 바꿔야 합니다.

**성공 판정:** `aside` CLI가 실행되고 Claude Code에서 `aside` MCP가 연결된 것으로 보이며, 공개 페이지 열기 요청을 수행합니다.

> [!warning] Windows 수강생
> Mac용 `curl ... | bash` 명령을 Windows PowerShell에 그대로 붙여넣지 않습니다. 앱과 CLI 모두 현재 Windows 배포가 공식적으로 확인되는 경우에만, 해당 OS 전용 안내를 따르세요.

---

## ③ agent-browser — 수강생 기본 CLI 추천

**추천:** Mac/Windows에서 Claude Code로 반복 가능한 웹 탐색 실습.  
**공식:** [설치](https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/installation/page.mdx) · [Skill](https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/skills/page.mdx)

### 설치 (macOS / Windows 공통)

터미널 또는 PowerShell:

```bash
npm install -g agent-browser
agent-browser install
agent-browser --help
```

- 첫 줄: CLI를 설치합니다.
- 둘째 줄: 자동화용 Chrome을 다운로드합니다. (별도의 네트워크 다운로드가 있을 수 있음)
- 셋째 줄: 도움말이 보이면 CLI가 실행되는 상태입니다.

### Claude Code Skill 설치

```bash
npx skills add vercel-labs/agent-browser
```

> [!note] 기억하기
> `npm install -g`는 **프로그램 설치**, `npx skills add`는 **Claude Code 등에 사용법을 전달하는 Skill 설치**입니다. 둘 다 필요할 수 있습니다.

### 직접 검증

```bash
agent-browser open https://example.com
agent-browser snapshot
agent-browser close
```

**성공 판정:** `Example Domain` 관련 내용이 터미널에 나타납니다.

### Claude Code 첫 요청

```text
설치된 agent-browser를 사용해 https://example.com 에 접속해.
제목, 본문 요약, 최종 URL을 알려 주고 작업을 종료해.
이때 로그인이나 폼 제출은 하지 마.
```

> [!tip] 여러 AI 세션 동시 실행
> agent-browser 기본 세션을 여러 에이전트가 공유하면 탭이 충돌할 수 있습니다. 공동 실습에서는 **에이전트별 별도 세션**을 사용하는 것이 좋습니다. 자세한 `session` 사용법은 설치된 `agent-browser skills get core`와 공식 Skill을 참고하세요.

---

## ④ Playwright CLI — 코딩 에이전트용 자동화

**추천:** 웹앱 기능 테스트, 동일 절차의 반복 실행, 스크린샷 생성.  
**공식:** [Playwright CLI README](https://github.com/microsoft/playwright-cli/blob/main/README.md) · [CLI 시작 가이드](https://github.com/microsoft/playwright/blob/main/docs/src/getting-started-cli.md)

### 설치 (macOS / Windows 공통)

```bash
npm install -g @playwright/cli@latest
playwright-cli --help
```

### Claude Code Skill 설치

```bash
playwright-cli install --skills
```

여러 프로젝트에서 공통으로 사용하려면 다음처럼 **전역 설치**를 선택할 수도 있습니다.

```bash
playwright-cli install --skills -g
```

### 직접 검증

```bash
playwright-cli open https://example.com --headed
playwright-cli snapshot
playwright-cli screenshot
playwright-cli close
```

- `--headed`: 브라우저 창을 실제로 보여 줍니다.
- `snapshot`: 페이지 구조를 문자로 확인합니다.
- `screenshot`: 화면을 이미지로 저장합니다.

**성공 판정:** 브라우저 창이 열리고 화면의 구조를 읽을 수 있으며, 스크린샷 명령이 성공합니다.

### Claude Code 첫 요청

```text
Playwright CLI를 이용해 https://demo.playwright.dev/todomvc/ 를 테스트해.
할 일 한 개를 추가하고, 화면의 결과를 확인해.
실패 시 메시지를 보고해. 샘플 사이트 외 다른 곳에는 입력하지 마.
```

> [!warning] 이름이 비슷한 패키지
> 공식 설치 대상은 **`@playwright/cli`**입니다. 오래된 다른 이름의 `playwright-cli` 패키지를 무심코 `npx`로 실행하지 않도록 주의하세요.

---

## ⑤ Playwright MCP — Claude Code에 브라우저 도구 직접 연결

**추천:** Skill 대신 MCP를 통해 Claude Code가 브라우저 액션을 직접 호출하도록 하려는 경우.  
**공식:** [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp)

### 설치 (Mac/Windows 공통)

터미널 또는 PowerShell:

```bash
claude mcp add playwright npx @playwright/mcp@latest
claude mcp list
```

> [!note] 설치 위치
> 위 명령은 **터미널**에 입력합니다. Claude Code **채팅창**에서는 `/mcp`를 입력하여 상태를 확인합니다. `claude` 실행 파일이 없는 데스크톱 앱 환경은 앱의 MCP 설정 기능을 사용하세요.

### 검증

Claude Code 채팅창:

```text
Playwright MCP로 https://example.com 을 열고
페이지 제목만 읽어 줘. 파일 수정이나 로그인은 하지 마.
```

**성공 판정:** `/mcp`에서 Playwright 서버가 연결되고, Claude Code가 페이지 제목을 반환합니다.

### Playwright CLI와 MCP가 둘 다 필요한가?

아닙니다. **초보자 실습은 CLI만**, MCP가 필요한 수업에서 별도로 추가합니다. 두 방식을 무조건 함께 활성화하면 선택·권한 관리가 혼란스러울 수 있습니다.

---

## ⑥ Playwright Python — 금융 데이터 수집/테스트용 개발 기초

**추천:** Python·pandas와 연결해 테스트나 허용된 공개 웹페이지 수집을 구현할 때.  
**공식:** [Playwright Python](https://playwright.dev/python/docs/intro)

### Mac 설치

```bash
mkdir -p ~/browser-class/playwright-python
cd ~/browser-class/playwright-python
python3 -m venv .venv
source .venv/bin/activate
python -m pip install playwright
python -m playwright install chromium
```

### Windows PowerShell 설치

```powershell
New-Item -ItemType Directory -Force "$HOME\browser-class\playwright-python"
Set-Location "$HOME\browser-class\playwright-python"
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install playwright
.\.venv\Scripts\python.exe -m playwright install chromium
```

### 실습 파일 `test_page.py`

```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    page.goto("https://example.com")
    print("TITLE:", page.title())
    print("URL:", page.url)
    page.screenshot(path="example.png")
    browser.close()
```

**Mac 실행:**

```bash
python test_page.py
```

**Windows 실행:**

```powershell
.\.venv\Scripts\python.exe test_page.py
```

**성공 판정:** `TITLE: Example Domain` 등이 표시되고 `example.png`가 생성됩니다.

> [!note] 실습 해석
> Python용 Playwright는 **브라우저 자동화 라이브러리**입니다. 별도의 AI 모델 없이 동작합니다. 동작을 자동 판단하게 만들려면 LLM 등을 추가해야 합니다.

---

## ⑦ Browser Use — AI가 판단하며 웹을 탐색

**추천:** 비정형 웹페이지에서 AI 에이전트를 실험해 보고 싶은 개발자.  
**공식:** [Browser Use 오픈소스 Quickstart](https://docs.browser-use.com/open-source/quickstart) · [GitHub](https://github.com/browser-use/browser-use)

### Mac 설치 (가상환경)

```bash
mkdir -p ~/browser-class/browser-use
cd ~/browser-class/browser-use
python3 -m pip install uv
uv venv --python 3.12
source .venv/bin/activate
uv pip install browser-use
uvx browser-use install
```

### Windows PowerShell 설치

```powershell
New-Item -ItemType Directory -Force "$HOME\browser-class\browser-use"
Set-Location "$HOME\browser-class\browser-use"
py -m pip install uv
uv venv --python 3.12
uv pip install --python .\.venv\Scripts\python.exe browser-use
uvx browser-use install
```

`uv` 명령을 찾을 수 없으면 **터미널을 새로 열거나** [uv 공식 설치 안내](https://docs.astral.sh/uv/getting-started/installation/)에 따라 설치합니다.

### 첫 AI 작업을 위한 API 키

1. 사용할 모델 공급자(예: Browser Use Cloud / 다른 LLM)의 공식 페이지에서 **개인 API 키**를 발급합니다.
2. 프로젝트 폴더에 `.env` 파일을 생성합니다. 다음은 **빈 값 예시**입니다.

```dotenv
BROWSER_USE_API_KEY=여기에_본인_키
```

3. **절대 Obsidian 공개 Vault, GitHub, 수업 과제 zip에 실제 API 키를 포함하지 않습니다.**
4. 아래 Python 스크립트는 Browser Use 공식 `ChatBrowserUse` 예시를 간단히 바꾼 것입니다.

`run_agent.py`:

```python
import asyncio
from dotenv import load_dotenv
from browser_use import Agent, ChatBrowserUse

load_dotenv()

async def main():
    agent = Agent(
        task="Open https://example.com and report the page title. Do not click or submit forms.",
        llm=ChatBrowserUse(),
    )
    result = await agent.run()
    print(result.final_result())

asyncio.run(main())
```

**Mac 실행:** `uv run --python .venv/bin/python run_agent.py`  
**Windows 실행:** `uv run --python .\.venv\Scripts\python.exe run_agent.py`

**성공 판정:** AI 에이전트가 페이지를 방문해 제목을 설명합니다. 모델 사용·클라우드 브라우저 사용은 비용이 발생할 수 있습니다.

### Claude Code로 설치를 맡기는 공식 방식

아래 프롬프트를 Claude Code에 붙여넣어도 됩니다. **실행되는 설치 명령을 먼저 보여 달라**고 요청하세요.

```text
공식 github.com/browser-use/browser-use README를 확인한 뒤,
Python 3.12와 uv를 사용해 browser-use를 설치해 줘.
기존 설치와 버전을 먼저 검사하고, 추가 설치 전에 확인받아.
가능하면 browser-use skill install 명령으로 Skill을 등록해 줘.
로그인 프로필을 연결하거나 API 키를 읽기 전에 별도 승인받아.
```

---

## ⑧ Stagehand v4 — 자연어 + 정교한 코드 혼합

**추천:** 안정적인 수집 파이프라인에 자연어 `act` / `extract` / `observe`를 섞는 심화 실습.  
**공식 v4:** [Quickstart](https://docs.stagehand.dev/v4/first-steps/quickstart) · [Installation](https://docs.stagehand.dev/v4/first-steps/installation)

> [!important] v4를 쓰세요
> 인터넷 검색에서 흔히 나타나는 **v2·v3 예제의 `new Stagehand({ env: ... })`와 v4 코드**는 구조가 다릅니다. 이 교안은 **v4** 기준입니다. 기존 예제를 붙여넣다가 오류가 나면 공식 v4 문서를 확인하세요.

### 경로 A: Python으로 설치 — 권장

**Mac:**

```bash
mkdir -p ~/browser-class/stagehand-v4
cd ~/browser-class/stagehand-v4
python3 -m venv .venv
source .venv/bin/activate
python -m pip install stagehand
```

**Windows PowerShell:**

```powershell
New-Item -ItemType Directory -Force "$HOME\browser-class\stagehand-v4"
Set-Location "$HOME\browser-class\stagehand-v4"
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install stagehand
```

로컬 작업을 하려면 **Google Chrome**이 설치되어 있어야 합니다. `OPENAI_API_KEY`처럼 선택한 모델 공급자의 **API 키가 추가로 필요**합니다. Stagehand 로컬 실행은 모델 키를 자동으로 제공하지 않습니다.

설치 확인(프로젝트 가상환경의 Python 사용):

```bash
# Mac 가상환경 활성화 후
python -c "import stagehand; print('stagehand imported')"
```

```powershell
# Windows PowerShell
.\.venv\Scripts\python.exe -c "import stagehand; print('stagehand imported')"
```

**성공 판정 1차:** 모듈을 가져오는 데 오류가 없습니다. 이 검사는 실제 브라우저 작동이나 API 키 연결까지 검증하지는 않습니다.

### 경로 B: TypeScript로 설치 — 개발자용

**macOS / Windows 공통(Node.js 22.18 이상):**

```bash
mkdir stagehand-ts
cd stagehand-ts
npm init -y
npm install @browserbasehq/stagehand 'zod@~4.4.3'
```

Windows PowerShell에서는 위 명령의 작은따옴표가 사용 가능한 환경이 일반적입니다. 실패하면 다음과 같이 큰따옴표로 바꿉니다.

```powershell
npm install @browserbasehq/stagehand "zod@~4.4.3"
```

**v4가 지원하는 Zod 4.4.x 범위를 유지**합니다. Chrome과 모델 API 키는 별도 준비합니다.

### 실제 브라우저 작동 검증 (Python 예제)

모델 키는 환경변수로 전달합니다. **키를 Markdown·Python 코드 안에 직접 적지 마세요.**

`stagehand_test.py`:

```python
import asyncio
import os
from pydantic import BaseModel
from stagehand import Stagehand, local_browser

class Extracted(BaseModel):
    value_proposition: str

async def main():
    browser = await local_browser.launch()
    try:
        sh = await Stagehand.create(
            browser=browser,
            model="openai/gpt-5.4-mini",  # 실행 전 공식 지원 모델 목록 확인
            model_api_key=os.environ["OPENAI_API_KEY"],
        )
        try:
            page = (await browser.context.pages())[0]
            await page.goto("https://stagehand.dev")
            data = await sh.extract("Extract the value proposition", Extracted)
            print(data.data)
        finally:
            await sh.close()
    finally:
        await browser.close()

asyncio.run(main())
```

- 실행 전에 터미널 세션에 모델 키를 **비공개로** 설정하거나 안전한 비밀 관리 방법을 사용합니다.
- Mac 가상환경에서 `python stagehand_test.py`, Windows에서는 `.\.venv\Scripts\python.exe stagehand_test.py`.
- 모델이 지원되지 않는다는 오류가 나오면 [현재 Stagehand 모델 가이드](https://docs.stagehand.dev/v4/add-ons/models)에서 실제 지원되는 모델로 교체합니다.

**성공 판정:** 브라우저가 열리고 사이트 내용이 구조화된 필드로 반환됩니다.

---

## ⑨ Chrome DevTools MCP — 웹앱 개발·오류 수정용

**추천:** 페이지 콘솔 오류, 네트워크 요청, 웹앱의 동작 분석.  
**공식:** [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) · [Claude Code 설정](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/client-configurations.md)

### 선행 조건

- Node.js **현재 LTS**
- Google Chrome **현재 안정 버전**
- Claude Code

### 방법 A: Claude Code Plugin (Skills 포함, 권장)

> [!note] 아래는 터미널이 아니라 **Claude Code 대화 입력창**에서 실행하는 `/plugin` 명령입니다.

```text
/plugin marketplace add ChromeDevTools/chrome-devtools-mcp
```

이어서:

```text
/plugin install chrome-devtools-mcp@chrome-devtools-plugins
```

Claude Code를 재시작하고 `/skills` 및 `/mcp`로 로딩 여부를 확인합니다.

### 방법 B: MCP만 설치

방법 A와 **중복 설치하지 않는 것이 좋습니다.** 터미널에서:

```bash
claude mcp add chrome-devtools --scope user npx chrome-devtools-mcp@latest
claude mcp list
```

### 설치 전 자체 진단

```bash
npx chrome-devtools-mcp@latest --help
```

### Claude Code 첫 요청

```text
Chrome DevTools MCP를 사용해 https://example.com 을 열어.
페이지 제목, 콘솔 오류 유무, 네트워크 요청 실패 유무를 확인해.
사이트를 수정하거나 폼을 제출하지 마.
```

**성공 판정:** 연결된 MCP를 통해 페이지 검사 결과가 돌아옵니다.

> [!warning] 개인정보·기업 사이트
> DevTools 도구는 네트워크 응답과 콘솔에 담긴 민감한 정보를 볼 수 있습니다. 최초 실습에 계정 페이지·사내 사이트·투자자 포털을 사용하지 않습니다.

---

## ⑩ Skyvern — 업무 워크플로 자동화 (심화)

**추천:** 여러 단계로 이루어진 조직의 브라우저 업무를 자동화하고 실행 상태를 관리하려는 경우.  
**공식:** [Skyvern GitHub 설치](https://github.com/skyvern-ai/skyvern)

### 선택 A: Python 간편 설치 (macOS 우선)

**필요:** Python 3.11~3.13. Windows는 빌드 도구와 Rust 요구사항이 있어 초보자는 아래 Docker 방식을 권장합니다.

```bash
mkdir -p ~/browser-class/skyvern
cd ~/browser-class/skyvern
python3 -m venv .venv
source .venv/bin/activate
python -m pip install "skyvern[all]"
skyvern quickstart
```

**성공 판정:** 초기 설정과 로컬 서비스 시작 절차가 진행됩니다. 모델 API 키 등 추가 설정이 필요할 수 있습니다. 기본 데이터베이스 및 설정은 실행하는 버전의 안내를 우선합니다.

### 선택 B: Docker Compose (Mac/Windows 공통, 심화 실습)

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/)을 공식 사이트에서 설치하고 실행합니다.
2. `docker --version`, `docker compose version`이 동작하는지 확인합니다.
3. [Git](https://git-scm.com/downloads)을 설치한 뒤 터미널/PowerShell에서 아래를 실행합니다.

```bash
git clone https://github.com/skyvern-ai/skyvern.git
cd skyvern
```

**Mac:**

```bash
cp .env.example .env
```

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

4. `.env`에서 **선택한 모델 제공자 키와 필요한 설정**을 안전하게 기입합니다. **GitHub에 올리지 않습니다.**
5. 프로젝트 디렉터리에서:

```bash
docker compose up -d
docker compose ps
```

6. 브라우저에서 [http://localhost:8080](http://localhost:8080)을 엽니다.

**성공 판정:** 컨테이너가 실행되고 로컬 서비스 화면이 표시됩니다.

> [!warning] 설치 공간·비용
> Docker 이미지 및 DB는 다른 도구보다 디스크·메모리를 많이 사용할 수 있습니다. LLM API 사용 요금은 별도입니다. 수업에서는 Skyvern을 **선택 과목**으로 권장합니다.

---

# Part III. 설치가 안 될 때 (오류 해결)

## 1. `command not found`, `not recognized`

1. 설치 뒤 **터미널/PowerShell을 완전히 종료하고 다시 열기**.
2. `node --version`, `npm --version`, `claude --version` 등 개별적으로 확인.
3. 본체 설치와 Skill 설치를 혼동하지 않았는지 확인.
4. Windows에서 PowerShell 대신 **CMD**로 일부 명령을 시험해 보되, 무작정 실행 정책을 완화하지 말 것.

## 2. `npx`나 `npm` 설치가 실패한다

- Node.js LTS와 npm 버전을 확인합니다.
- 회사/학교 방화벽, 프록시 또는 보안 프로그램이 다운로드를 막는지 확인합니다.
- 기존 프로젝트의 설치 충돌이 의심되면 **빈 실습 폴더**에서 다시 시도합니다.
- 무조건 `sudo npm ...`, 관리자 모드, 안티바이러스 해제부터 시도하지 마세요.

## 3. 브라우저 창이 나타나지 않는다

- `--headless`로 실행 중인지 확인합니다.
- Playwright CLI는 `playwright-cli open URL --headed`를 사용합니다.
- agent-browser / Playwright Python이 브라우저 다운로드를 마쳤는지 확인합니다.
- Chrome이 이미 실행되어 충돌하면 자동화용 임시 브라우저를 종료하고 재시도합니다.

## 4. Claude Code에서 Skill이 안 보인다

- 실제 Skill이 설치된 위치(`~/.claude/skills/` 등)를 확인합니다.
- Claude Code를 **완전히 종료하고 다시 실행**합니다.
- 데스크톱 앱의 **Code 모드**와 Cowork 등 다른 모드가 다를 수 있습니다.
- Ego Lite는 초기 설정에서 Skill 설치가 완료되었는지 확인합니다.

## 5. MCP가 연결되지 않는다

터미널:

```bash
claude mcp list
```

Claude Code 채팅창:

```text
/mcp
```

- `npx`가 정상 작동하는지 확인합니다.
- Windows에서는 `npx.cmd` 경로 인식 문제가 있을 수 있으니 MCP 도구의 Windows 공식 문제 해결 문서를 확인합니다.
- **서버 연결**과 **실제 브라우저 실행**은 별도의 성공 판정으로 확인합니다.

## 6. API 키가 없거나 오류가 난다

- Playwright/agent-browser 같은 순수 제어 도구와 Browser Use/Stagehand/Skyvern의 LLM 사용 비용을 구분합니다.
- ChatGPT Plus나 Claude 구독이 해당 개발 API 사용료를 자동으로 포함하지는 않습니다.
- 모델 이름이 만료되었거나 지원되지 않을 때는 **공식 모델 목록**을 확인합니다.
- API 키를 프롬프트에 붙여넣거나 스크린샷에 노출하지 마세요.

## 7. 로그인이 필요한 사이트에서 막힌다

1. 사이트의 **정상 로그인 절차**를 사용합니다.
2. MFA·CAPTCHA는 **사용자가 직접 완료**합니다.
3. 에이전트에게 비밀번호·복구 코드 등을 보내지 않습니다.
4. 읽기·탐색과 **게시·전송·삭제·결제** 권한을 분리합니다.
5. 이용약관·robots 정책·저작권·개인정보 및 데이터 계약을 준수합니다.

---

# Part IV. 강의 실습 시나리오

## 실습 A. 10분 내 공개 웹페이지 확인 (필수)

**목표:** agent-browser를 설치하고, 같은 정보가 눈에 보이는지 확인합니다.

- [ ] Node / npm 확인
- [ ] `npm install -g agent-browser`
- [ ] `agent-browser install`
- [ ] `agent-browser open https://example.com`
- [ ] `agent-browser snapshot`
- [ ] `agent-browser close`
- [ ] Claude Code에 요약 요청
- [ ] 출력과 실제 페이지를 대조

**제출물:** `설치_확인.md` (OS, 명령어, 예상 결과, 실제 결과, 오류 여부)

## 실습 B. 자동차 산업 AX: 밸류체인 공개정보 조사

**Claude Code 프롬프트:**

```text
역할: 자동차 산업 리서치 조교
도구: 설치된 agent-browser (없으면 Playwright CLI)
작업:
1. 공개된 기관·기업의 공식 웹사이트에서 국내 자동차 기업 3곳을 조사한다.
2. 각 기업의 밸류체인 역할(완성차/부품/배터리/소재/소프트웨어)을 구분한다.
3. 각 항목에 공식 출처 URL과 확인 날짜를 기록한다.
4. results.csv와 자동차_산업_요약.md 파일을 만든다.
5. 임의의 관계를 추측해 추가하지 않는다.
제약: 로그인·폼 제출·대량 수집·우회·다운로드·게시 금지.
```

**표 구조:** `회사명 | 밸류체인 | 근거 문장(요약) | 공식 URL | 확인 날짜`

## 실습 C. 금융교육: 웹 자동화와 공식 API 구별

**목표:** 브라우저로 찾아볼 정보와 API/공식 데이터로 받아야 할 정보를 구분합니다.

1. **웹 브라우저:** 공개 데이터 설명 문서, 변수 정의, 제공 범위, 라이선스 확인.
2. **공식 API/다운로드:** 권한을 가진 연구자가 데이터 파일과 종목 특성 데이터를 확보.
3. **Python 정제:** 날짜·종목키·단위·결측치 검증.
4. **qdl() 통합:** 데이터를 공통 포맷으로 연결.
5. **Obsidian:** 데이터 출처·변수 정의·버전 이력 기록.

> [!warning] WRDS 및 유료 연구 DB
> 브라우저 로그인 자동화로 **계약·다운로드 제한·접근통제를 우회하는 실습은 하지 않습니다.** 허용된 WRDS 인터페이스, 공식 Python 접근 방식, 학교/기관 라이선스를 우선하세요.

## 실습 D. Claude Code에게 설치를 맡기기 (안전형 통합 프롬프트)

```text
내 컴퓨터에서 브라우저 자동화 실습 도구를 설치하는 조교 역할을 해 줘.
대상은 초보자이며 Windows PowerShell 또는 macOS 터미널이다.

1. 먼저 OS, 셸, Node.js/npm, Python, Claude Code 및 도구의 기존 설치 상태를 확인해.
2. 이미 설치된 프로그램은 다시 설치하지 마.
3. 설치 대상은 한 번에 하나만: 먼저 agent-browser.
4. 공식 GitHub/문서의 최신 명령과 내 OS에서의 실행 가능 여부를 대조해.
5. 실행하려는 설치 명령, 예상 파일 변경, 네트워크 접근을 설명하고 내 승인을 받아.
6. 설치 뒤 버전 또는 도움말, 예제 페이지 연결, 종료까지 검증해.
7. 결과를 설치_기록.md에 명령/출력/성공 여부/오류/재시도 방법으로 기록해.
8. 비밀번호, 쿠키, API 키를 읽거나 노출하지 말고, 불필요한 관리자 권한 또는
   권한 확인 생략 모드를 사용하지 마.
9. 성공 확인 전에는 다음 도구를 설치하지 마.
```

---

# Part V. 운영·보안 체크리스트

- [ ] 각 도구가 **실행할 수 있는 권한**(조회/입력/전송/삭제/결제)을 설명할 수 있다.
- [ ] 개발·교육용 브라우저 프로필과 일상업무 로그인 프로필을 분리했다.
- [ ] AI에 기존 Chrome 비밀번호·쿠키 전체를 무심코 이전하지 않았다.
- [ ] Skill과 MCP는 공식 저장소·유지보수 주체를 확인하고 설치했다.
- [ ] Claude Code 권한을 포괄적으로 해제하지 않았다.
- [ ] LLM/API 사용 요금이 발생하는 단계가 무엇인지 알고 있다.
- [ ] 수집 데이터의 출처, 확인 날짜, 사용 허가 범위를 기록했다.
- [ ] GitHub에 `.env`, 자격 증명 파일, 쿠키, 개인 문서를 올리지 않는다.
- [ ] 설치 명령과 정상 결과를 `설치_기록.md`로 남긴다.

## 도구별 권장 완료 상태

| 학습 단계 | 설치를 완료하면 좋은 도구 | 완료 기준 |
|---|---|---|
| 입문 | agent-browser | `example.com` 열기·스냅샷·종료 |
| 입문+ | Playwright CLI | 화면 열기·스냅샷·스크린샷 |
| 브라우저 UX | Ego Lite (또는 Aside) | 별도 브라우저에서 공개 페이지 읽기 |
| 개발 | Playwright MCP 또는 DevTools MCP | Claude Code에서 공개 페이지 점검 |
| Python 연구 | Playwright Python | 화면 캡처 PNG + URL 기록 |
| 심화 AI | Browser Use / Stagehand | API 키 별도 관리 + 구조화 추출 |
| 엔터프라이즈 | Skyvern | 서비스 기동 + 안전한 작업 실행 |

---

# Part VI. 공식 출처 (2026-10-21 확인)

1. **Ego Lite macOS Quickstart** — https://www.egolite.app/document/ko/docs/quick-start
2. **Ego Lite Windows beta Quickstart** — https://www.egolite.app/document/ko/docs/windows/quick-start
3. **Ego Lite Claude Code** — https://www.egolite.app/document/ko/docs/claude-code
4. **Ego Lite Windows Claude Code** — https://www.egolite.app/document/ko/docs/windows/claude-code
5. **Ego Lite GitHub** — https://github.com/citrolabs/ego-lite
6. **Aside Get started** — https://docs.aside.com/help/get-started
7. **Aside CLI / MCP** — https://docs.aside.com/help/developers
8. **agent-browser Installation** — https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/installation/page.mdx
9. **agent-browser Skill** — https://github.com/vercel-labs/agent-browser/blob/main/docs/src/app/skills/page.mdx
10. **Playwright CLI** — https://github.com/microsoft/playwright-cli
11. **Playwright MCP** — https://github.com/microsoft/playwright-mcp
12. **Playwright Python** — https://playwright.dev/python/docs/intro
13. **Browser Use Quickstart** — https://docs.browser-use.com/open-source/quickstart
14. **Browser Use GitHub** — https://github.com/browser-use/browser-use
15. **Stagehand v4 Quickstart** — https://docs.stagehand.dev/v4/first-steps/quickstart
16. **Stagehand v4 Installation** — https://docs.stagehand.dev/v4/first-steps/installation
17. **Chrome DevTools MCP** — https://github.com/ChromeDevTools/chrome-devtools-mcp
18. **Chrome DevTools Claude 설정** — https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/client-configurations.md
19. **Skyvern** — https://github.com/skyvern-ai/skyvern
20. **Claude Code MCP 안내** — https://code.claude.com/docs/en/mcp

---

# 부록. Obsidian에 넣는 방법

1. Obsidian에서 사용할 **Vault**를 엽니다.
2. Vault 안에 `02_Resources/AI_Browser_Automation/` 등 원하는 폴더를 생성합니다.
3. 이 Markdown 파일을 해당 폴더로 복사합니다.
4. Obsidian의 파일 탐색기에서 파일을 클릭해 엽니다.
5. `- [ ]`는 클릭 가능한 체크리스트, `> [!tip]` 등은 Obsidian 콜아웃입니다.
6. 실습할 때는 원본을 유지하고 **학생별 사본**을 만들어 체크리스트를 기록하면 좋습니다.

> [!summary] 가장 간단한 결론
> **전원 공통:** `agent-browser` 설치 → `example.com`으로 검증.  
> **한 단계 확장:** Playwright CLI.  
> **브라우저 중심 사용자:** Ego Lite 또는 Aside.  
> **금융 연구 자동화:** 공식 API 우선 + Playwright Python + (필요 시) Stagehand v4.  
> **실습 원칙:** **어디서 실행 → 무엇을 입력 → 어떤 결과를 확인** 순서를 반드시 지킵니다.
