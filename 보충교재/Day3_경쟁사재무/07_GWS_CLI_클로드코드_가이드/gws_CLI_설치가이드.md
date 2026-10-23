# Google Workspace CLI(gws) 설치·초기 세팅 가이드

> 기준일 2026-10-20 · gws 최신 릴리스 **v0.22.5**(2026-03-31) · 원본: YouTube 강의 화면 캡처 66장(공개본은 이름·이메일을 가린 덱 PDF로)
> 공식 저장소: <https://github.com/googleworkspace/cli>

`gws`는 Drive·Gmail·Calendar·Sheets·Docs·Chat 등 Google Workspace 전체를 명령어 하나로 다루는 CLI(Command-Line Interface, 명령줄 도구)다. 결과가 모두 JSON으로 나와서 Claude Code 같은 AI 에이전트가 쓰기 좋다.

- 사람은 에이전트와만 대화한다. 흐름은 **나 → 에이전트 → gws → 구글 서비스**다.
- 구글이 만든 도구지만 **공식 지원 제품은 아니다**(README 명시). v1.0 전이라 바뀌는 부분이 있을 수 있다.

---

## 0. 전체 순서 한눈에

| 단계 | 할 일 | 어디서 |
|---|---|---|
| 1 | 구글 Cloud 프로젝트 준비 | Cloud 콘솔 |
| 2 | 쓸 API 켜기(Drive·Docs·Sheets·Gmail…) | Cloud 콘솔 › API 및 서비스 › 라이브러리 |
| 3 | OAuth 동의 화면: **대상 = 외부** + 테스트 사용자에 본인 추가 | Google 인증 플랫폼 |
| 4 | OAuth 클라이언트(**데스크톱 앱**) 만들고 **JSON 바로 다운로드** | Google 인증 플랫폼 › 클라이언트 |
| 5 | JSON을 `~/.config/gws/client_secret.json`에 저장 | 내 PC |
| 6 | gws 설치 | 터미널 |
| 7 | `gws auth login -s drive,gmail,...` 로그인 | 터미널 + 브라우저 |
| 8 | `gws drive files list` 로 읽기 테스트 | 터미널 |
| 9 | (권장) 에이전트 스킬 설치 `npx skills add …` | 터미널 |

### 영상과 달라진 점

| 항목 | 영상 | 이 가이드(최신) |
|---|---|---|
| OAuth 대상 | **내부**로 만들었다가 나중에 외부로 고침 | 처음부터 **외부**. 개인 Gmail 계정은 내부를 쓸 수 없다 |
| 테스트 사용자 | 나중에 추가 | 외부 선택 직후 **본인 이메일을 바로 추가**. 빠뜨리면 "액세스 차단됨" 오류 |
| 클라이언트 JSON | 언급 없음 | 2025년 4월부터 **만들 때 한 번만** 보이고 다운로드할 수 있다. 창을 닫기 전에 바로 받는다 |
| 첫 명령 | `gws auth setup` 실행 → `gcloud CLI not found` 오류 | gcloud가 없으면 **수동 설정(이 가이드) + `gws auth login`** 이 기본 경로 |
| 로그인 범위 | 기본(전체) | `-s drive,gmail,...`로 **필요한 서비스만**. 테스트 모드는 약 25개 범위까지만 허용 |
| 설치 방법 | `npm install -g` | npm도 되지만 공식 권장은 **GitHub Releases 바이너리**. 맥은 `brew`도 된다 |

---

## 1. 준비물

- **Node.js 18 이상**: `npm`으로 설치할 때만 필요하다. 바이너리로 설치하면 필요 없다.
- **구글 계정**: 개인 `@gmail.com`도 된다.
- **Google Cloud 프로젝트**: OAuth 인증 정보를 만들 그릇이다.

### 1-1. Cloud 콘솔 들어가기

1. <https://console.cloud.google.com> 에 접속해 로그인한다.
2. 처음이면 약관 동의 화면이 나온다. 영상에서는 **무료 체험($300 크레딧)**에 가입하며 결제 정보까지 넣었다.
   - 무료 체험이 끝나도 자동으로 청구되지 않는다(직접 유료 계정으로 전환해야 과금).
   - 참고: Drive·Gmail·Docs 같은 Workspace API는 결제 계정 없이도 쓸 수 있으니, 무료 체험 가입은 필수가 아니다.
3. 상단 프로젝트 선택기에 `My First Project`가 보이면 그대로 써도 된다. 새로 만들어도 된다.

---

## 2. 쓸 API 켜기

**왼쪽 메뉴(≡) › API 및 서비스 › 라이브러리**에서 서비스 이름을 검색하고 **사용 설정**을 누른다.


| 쓰려는 것 | 켤 API |
|---|---|
| 구글 드라이브 | Google Drive API |
| 구글 문서 | Google Docs API |
| 구글 스프레드시트 | Google Sheets API |
| 지메일 | Gmail API |
| 캘린더 | Google Calendar API |
| 슬라이드·폼·태스크·챗 | Google Slides / Forms / Tasks / Chat API |


> 나중에 켜지 않은 API를 부르면 `403 accessNotConfigured` 오류가 나고, gws가 켜는 링크(`enable_url`)를 보여 준다. 링크에서 **사용 설정**을 누르고 10초쯤 기다린 뒤 다시 실행하면 된다.

---

## 3. OAuth 동의 화면: 처음부터 "외부"로

**API 및 서비스 › OAuth 동의 화면**에 들어가면 **Google 인증 플랫폼**으로 넘어간다. "아직 구성되지 않음"이 보이면 **시작하기**를 누른다.

### 3-1. 프로젝트 구성(4단계)

1. **앱 정보**: 앱 이름(예: `gws-cli`)과 사용자 지원 이메일(본인)을 넣는다.
2. **대상**: **외부(External)**를 고른다. ← 영상과 다른 부분


   - **내부(Internal)**는 Google Cloud **조직**(회사 Workspace 도메인)에 속한 프로젝트에서만 고를 수 있다. 개인 Gmail 계정에는 조직이 없어서 내부로 가면 막히고, 결국 외부로 다시 바꿔야 한다. 영상이 이 과정을 그대로 보여 준다.
   - 외부를 골라도 처음엔 **테스트 모드**로 시작한다. 등록한 테스트 사용자만 로그인할 수 있으니 외부에 공개되지 않는다.
3. **연락처 정보**: 본인 이메일을 넣는다.
4. **완료**: "Google API 서비스: 사용자 데이터 정책"에 동의하고 **만들기**를 누른다.

### 3-2. 테스트 사용자에 본인 추가 (꼭 해야 함)

**Google 인증 플랫폼 › 대상 › 테스트 사용자 › + Add users**에서 **로그인할 본인 Gmail 주소**를 넣고 저장한다.

> 이걸 빠뜨리면 로그인할 때 **"액세스 차단됨(Access blocked)" / 403** 오류가 난다. 오류 원인 1위다.

알아 둘 테스트 모드 제한(공식 도움말 기준):

| 제한 | 내용 | 대처 |
|---|---|---|
| 테스트 사용자 수 | 최대 100명 | 개인용은 문제없다 |
| 로그인 유효기간 | 동의 후 **7일**이면 만료되고 refresh token도 함께 끊긴다 | 일주일에 한 번 `gws auth login`을 다시 한다. 매번이 귀찮으면 대상 화면에서 **앱 게시(프로덕션)**를 누른다 |
| "확인되지 않은 앱" 경고 | 테스트 모드에서는 정상이다 | **고급 → (앱 이름)(으)로 이동** 또는 **계속**을 누른다 |
| 범위 수 | 약 25개까지만 동의할 수 있다 | 로그인할 때 서비스를 골라서 쓴다(7단계) |

---

## 4. OAuth 클라이언트 만들기와 JSON 다운로드

**Google 인증 플랫폼 › 클라이언트 › + 클라이언트 만들기**(또는 **API 및 서비스 › 사용자 인증 정보 › + 사용자 인증 정보 만들기 › OAuth 클라이언트 ID**)로 들어간다.

1. **애플리케이션 유형**: **데스크톱 앱**을 고른다.


   > 웹 애플리케이션 등 다른 유형으로 만들면 로그인할 때 `redirect_uri_mismatch` 오류가 난다. 그때는 클라이언트를 지우고 데스크톱 앱으로 다시 만든다.
2. **이름**: 기본값 `데스크톱 클라이언트 1`을 그대로 둬도 된다. **만들기**를 누른다.


3. **"OAuth 클라이언트 생성됨" 창이 뜨면 바로 `JSON 다운로드`를 누른다.** ← 최신 변경 사항
   - 2025년 4월부터 Google은 **클라이언트 보안 비밀번호(client secret)를 만들 때 한 번만** 보여 주고 받게 한다. 창을 닫은 뒤에는 콘솔에서 전체 비밀번호를 다시 볼 수도, JSON을 다시 받을 수도 없다.
   - 놓쳤다면 클라이언트 상세 화면에서 **보안 비밀번호를 새로 추가**하고 그때 바로 받거나, 클라이언트를 지우고 새로 만든다.
   - 받은 파일 이름은 `client_secret_123…apps.googleusercontent.com.json`처럼 길다.

### 4-0. 리디렉션 URI(localhost)는 넣지 않는다

"외부로 하면 리디렉션 URI에 `http://localhost`를 넣어야 한다"는 설명이 인터넷에 돈다. **데스크톱 앱 클라이언트에는 해당하지 않는다.**

| 구분 | 데스크톱 앱(이 가이드) | 웹 애플리케이션 |
|---|---|---|
| 리디렉션 URI 입력 칸 | **없다.** 만들기 화면에 유형·이름만 나온다(위 캡처) | 「승인된 리디렉션 URI」에 주소를 정확히 등록해야 한다 |
| localhost | Google이 루프백 주소(`http://localhost:포트`, `127.0.0.1`)를 **자동 허용** | `http://localhost:51065`처럼 **포트까지 똑같이** 등록해야 한다 |
| gws와 궁합 | 그대로 된다 | gws는 로그인할 때마다 **포트를 임의로 바꾼다** → 한 번 등록해도 다음 로그인에서 `redirect_uri_mismatch` |

- **외부/내부 선택은 리디렉션과 관계없다.** 대상(외부)은 "누가 로그인할 수 있나"를 정하고, 리디렉션은 클라이언트 유형이 정한다.
- 로그인 때 터미널에 찍히는 주소를 보면 `…&redirect_uri=http://localhost:51065&…`처럼 들어 있다. gws가 그 포트에 임시 서버를 열고 구글이 보낸 승인 코드를 받는 구조다.
- 브랜딩의 **승인된 도메인**에도 localhost를 넣을 필요가 없다(넣을 수도 없다).
- 리디렉션 URI 칸을 찾고 있다면 클라이언트를 **웹 애플리케이션으로 잘못 만든 것**이다. 지우고 데스크톱 앱으로 다시 만든다.
- 예외: 회사 Workspace 관리자가 데스크톱(설치형) 로그인 방식을 막아 둔 경우 `Error 400: admin_policy_enforced`가 난다. 이건 개인 Gmail과 무관하고, 관리자에게 허용을 요청해야 한다(gws에 포트 고정 옵션은 2026-10 현재 없다).

### 4-1. JSON 파일을 gws 자리로 옮기기

gws는 기본으로 아래 경로의 `client_secret.json`을 읽는다. 이름을 **`client_secret.json`으로 바꿔** 넣는다.

**macOS / Linux**

```bash
mkdir -p ~/.config/gws
mv ~/Downloads/client_secret_*.json ~/.config/gws/client_secret.json
chmod 600 ~/.config/gws/client_secret.json
```

**Windows (명령 프롬프트)**

```bat
mkdir "%USERPROFILE%\.config\gws"
move "%USERPROFILE%\Downloads\client_secret_*.json" "%USERPROFILE%\.config\gws\client_secret.json"
```

- 위치를 바꾸고 싶으면 환경변수 `GOOGLE_WORKSPACE_CLI_CONFIG_DIR`로 지정한다.
- 파일 대신 `GOOGLE_WORKSPACE_CLI_CLIENT_ID`와 `GOOGLE_WORKSPACE_CLI_CLIENT_SECRET` 환경변수로 넣어도 된다.
- 이 JSON은 **비밀번호와 같다.** 깃 저장소·메일·채팅에 올리지 않는다.

---

## 5. gws 설치

셋 중 하나만 하면 된다.

| 방법 | 명령 | 비고 |
|---|---|---|
| **바이너리**(공식 권장) | [GitHub Releases](https://github.com/googleworkspace/cli/releases)에서 OS에 맞는 파일을 받아 압축을 풀고 `gws`를 PATH에 둔다 | Node 불필요 |
| npm | `npm install -g @googleworkspace/cli` | 영상 방식. 내부적으로 위 바이너리를 받아 온다 |
| Homebrew(맥·리눅스) | `brew install googleworkspace-cli` | |

설치 확인:

```bash
gws --version
```

---

## 6. 로그인: `gws auth setup` 말고 `gws auth login`

영상에서는 `gws auth setup`부터 실행했다가 아래 오류가 났다.


```json
{"error": {"code": 400, "message": "gcloud CLI not found. Install it from https://cloud.google.com/sdk/docs/install", "reason": "validationError"}}
```

`gws auth setup`은 **gcloud CLI로 프로젝트·API·클라이언트를 자동으로 만들어 주는 명령**이라 gcloud가 있어야 한다. 3~4단계에서 콘솔로 직접 만들었다면 setup은 건너뛰고 바로 로그인한다.

```bash
# 필요한 서비스만 골라 로그인한다(테스트 모드 범위 약 25개 제한 회피)
gws auth login -s drive,gmail,sheets,docs,calendar
```

1. 브라우저가 열리면 **테스트 사용자로 등록한 계정**을 고른다.
2. "Google에서 확인하지 않은 앱" 경고가 나오면 **고급 → 이동(안전하지 않음)** 또는 **계속**을 누른다.
3. 권한 체크박스가 나오면 **모두 선택** 후 **계속**을 누른다.
4. 터미널에 `"status": "success"`가 나오면 끝이다.

- 인증 정보는 OS 키체인(맥 키체인·Windows 자격 증명 관리자)에 AES-256-GCM으로 암호화해 저장된다.
- `recommended` 범위 묶음(85개 이상)을 고르면 테스트 모드에서는 **실패**한다. 특히 `@gmail.com` 계정이 그렇다.

> **gcloud를 쓰고 싶다면**: [gcloud CLI](https://cloud.google.com/sdk/docs/install)를 설치하고 `gcloud auth login`을 한 뒤 `gws auth setup`을 실행하면 1~4단계를 자동으로 처리한다. 그래도 개인 Gmail 계정은 **외부 + 테스트 사용자** 원칙이 같다.

---

## 7. 첫 테스트는 읽기 명령부터

쓰기보다 **읽기 명령으로 먼저 확인**한다.

**macOS / Linux / PowerShell 7**

```bash
gws drive files list --params '{"pageSize": 5}'
```

**Windows 명령 프롬프트**(작은따옴표가 안 먹으니 큰따옴표 안의 따옴표를 `\"`로 이스케이프한다)

```bat
gws drive files list --params "{\"pageSize\": 5}"
```


- 드라이브가 비어 있으면 `"files": []`가 나온다. 정상이다.
- 드라이브에 폴더를 하나 만들고 다시 실행해서 목록에 보이면 연결이 끝난 것이다.

자주 쓰는 예:

```bash
gws gmail +triage                                   # 안 읽은 메일 요약
gws calendar +agenda                                # 다가오는 일정
gws sheets spreadsheets create --json '{"properties": {"title": "Q1 Budget"}}'
gws schema drive.files.list                         # 요청·응답 형식 보기
gws drive files list --params '{"pageSize": 100}' --page-all   # 전체 페이지(NDJSON)
```

---

## 8. (권장) 에이전트 스킬 설치

지금의 AI 에이전트는 gws를 잘 모르고, 검색할 문서도 많지 않다. 구글이 저장소에 **에이전트용 설명서(Agent Skills, `SKILL.md` 100개 이상)**를 넣어 두었으니, 이걸 깔아야 에이전트가 gws를 제대로 쓴다.

```bash
# 전부 설치
npx skills add https://github.com/googleworkspace/cli

# 필요한 것만
npx skills add https://github.com/googleworkspace/cli/tree/main/skills/gws-drive
npx skills add https://github.com/googleworkspace/cli/tree/main/skills/gws-gmail
```

설치 중 묻는 것:

1. **설치할 스킬**: 스페이스로 고르고 엔터.
2. **설치할 에이전트**: Universal(Amp·Cline·Codex·Cursor·Gemini CLI·GitHub Copilot 등)은 항상 포함된다. 추가 목록에서 **Claude Code**를 스페이스로 고른다.


3. **설치 범위**: **Global**(홈 디렉터리, 모든 프로젝트에서 사용)을 권장한다.
4. **Proceed with installation?** → **Yes**.

Gemini CLI를 쓰면 확장으로도 설치할 수 있다: `gemini extensions install https://github.com/googleworkspace/cli`

---

## 9. 막힐 때

| 증상 | 원인 | 해결 |
|---|---|---|
| `gcloud CLI not found` | `gws auth setup`은 gcloud가 필요하다 | 수동 설정(3~4단계) 후 `gws auth login`. 또는 gcloud 설치 |
| "액세스 차단됨" / 403 (로그인 중) | 테스트 사용자에 본인이 없다 | 대상 › 테스트 사용자에 이메일 추가 후 다시 로그인 |
| 대상에서 "내부"를 골랐더니 막힘 | 개인 계정에는 Cloud 조직이 없다 | 대상 › 사용자 유형 **외부로 변경** + 테스트 사용자 추가 |
| "Google에서 확인하지 않은 앱" | 테스트 모드에서 정상 | 고급 → 이동 / 계속 |
| 범위가 너무 많다는 오류 | 테스트 모드는 범위 약 25개 제한 | `gws auth login -s drive,gmail,calendar`처럼 서비스를 줄인다 |
| `redirect_uri_mismatch` | 클라이언트 유형이 데스크톱 앱이 아니다(웹 앱 + localhost 등록으로 우회해도 포트가 매번 바뀌어 다시 깨진다) | 클라이언트를 지우고 **데스크톱 앱**으로 다시 만들어 JSON을 새로 받는다. 리디렉션 URI는 넣지 않는다 |
| SSH로 접속한 원격 서버에서 로그인 창이 안 돌아옴 | 브라우저가 서버의 localhost에 닿지 않는다 | 브라우저가 있는 PC에서 로그인 → `gws auth export --unmasked > credentials.json` → 서버에서 `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` 지정 |
| `Error 400: admin_policy_enforced` | 회사 관리자가 데스크톱 로그인 방식을 차단 | 관리자에게 앱 허용 요청(개인 Gmail은 해당 없음) |
| `403 accessNotConfigured` | 그 API를 안 켰다 | 출력된 `enable_url`에서 사용 설정 → 10초 뒤 재시도 |
| 일주일 뒤 갑자기 인증 실패 | 테스트 모드 로그인은 7일 만료 | `gws auth login` 다시 실행. 또는 앱 게시 |
| 클라이언트 JSON을 다시 받고 싶음 | 2025-04부터 비밀번호는 만들 때만 공개 | 보안 비밀번호를 새로 추가해 그때 받거나 클라이언트를 새로 만든다 |

---

## 부록: 인증 정보 우선순위·환경변수

| 우선순위 | 출처 | 설정 방법 |
|---|---|---|
| 1 | 액세스 토큰 | `GOOGLE_WORKSPACE_CLI_TOKEN` |
| 2 | 인증 정보 파일(서비스 계정 등) | `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE` |
| 3 | 암호화 저장된 로그인 | `gws auth login` |
| 4 | 평문 인증 정보 | `~/.config/gws/credentials.json` |

- 서버·CI에서 쓰려면 브라우저가 있는 PC에서 로그인한 뒤 `gws auth export --unmasked > credentials.json`으로 내보내고, 서버에서 `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE`로 지정한다.
- 환경변수는 `.env` 파일에 둬도 된다.

### 참고 자료

- gws README: <https://github.com/googleworkspace/cli>
- 클라이언트 관리(보안 비밀번호는 생성 시에만 공개): <https://support.google.com/cloud/answer/15549257>
- 앱 대상 관리(내부/외부, 테스트 사용자 100명, 7일 만료): <https://support.google.com/cloud/answer/15549945>
- Google Auth Platform 변경 공지(2025-04): <https://developers.googleblog.com/usability-and-safety-updates-to-google-auth-platform/>
- gcloud CLI 설치: <https://cloud.google.com/sdk/docs/install>
- 데스크톱 앱 OAuth(루프백 리디렉션): <https://developers.google.com/identity/protocols/oauth2/native-app>
- gws 로그인 리디렉션 실례(`redirect_uri=http://localhost:<임의 포트>`): <https://github.com/googleworkspace/cli/issues/557>

---

## 부록 2: 웹 애플리케이션 클라이언트로 할 때 달라지는 것

> 본문(데스크톱 앱)과 같은 부분은 빼고, **달라지는 것만** 적는다.
> 내 PC의 Claude Code·터미널에서 gws를 쓰는 것이 목적이면 **데스크톱 앱이 정답**이다. 웹 애플리케이션은 회사 Workspace 관리자가 데스크톱 로그인 방식을 막아(`admin_policy_enforced`) 어쩔 수 없을 때 쓰는 우회책이다.

### 차이 한눈에

| 항목 | 데스크톱 앱 (본문) | 웹 애플리케이션 |
|---|---|---|
| 만들기 화면 칸 | 유형 · 이름만 | + 승인된 JavaScript 원본 · 승인된 리디렉션 URI |
| localhost 리디렉션 | 아무 포트나 자동 허용 | 등록한 주소(포트까지)만 허용 |
| gws 로그인 | 그대로 된다 | 로그인마다 새 포트를 등록해야 한다 |
| JSON 맨 위 키 | `"installed"` | `"web"` |
| 쓰는 경우 | 개인 Gmail · 일반 사용(권장) | 회사가 데스크톱 로그인을 막았을 때 |

그대로인 것: 외부 대상, 테스트 사용자, API 켜기, JSON 저장 위치(`~/.config/gws/client_secret.json`), 설치 명령.

### 만들기 화면에서 달라지는 칸

1. **애플리케이션 유형**: 웹 애플리케이션
2. **승인된 JavaScript 원본**: 비워 둔다
3. **승인된 리디렉션 URI**: 처음엔 비워 둔다. 포트는 `gws auth login`을 실행해야 알 수 있다.
4. **만들기** → JSON 다운로드(본문과 같다)

### 로그인 절차 (매번)

1. `gws auth login -s drive,gmail,…` 실행. **터미널 창은 닫지 않는다**(닫으면 포트가 바뀐다).
2. 브라우저 주소 또는 오류 화면 세부정보에서 `redirect_uri=http://localhost:51065`를 확인한다.
3. 콘솔 → 클라이언트 → **승인된 리디렉션 URI**에 그 주소를 끝에 `/` 없이 그대로 추가하고 저장한다.
4. 몇 분 기다린 뒤 브라우저에서 같은 주소로 다시 승인한다. 설정 반영에는 5분~몇 시간이 걸릴 수 있다(콘솔 안내 문구).
5. 다음 로그인 때(테스트 모드 7일 만료 포함) 포트가 바뀌면 2~4단계를 반복한다.

> **「포트 없이 `http://localhost`만 등록해도 된다」는 말은 데스크톱 앱 이야기다.** 데스크톱 클라이언트 JSON에는 원래 `"redirect_uris": ["http://localhost"]`가 들어 있고, Google이 포트를 따지지 않는다(그래서 본문에서는 아무것도 등록하지 않는다). 웹 애플리케이션은 Google 문서상 `redirect_uri`가 등록한 URI와 **정확히 일치**해야 하므로(scheme·대소문자·끝 `/`까지), 포트 없이 `http://localhost`만 등록하면 `http://localhost:51065`와 맞지 않아 `redirect_uri_mismatch`가 난다.

### JSON 구조 차이(구조만 표시)

```json
{ "installed": { "client_id": "…", "client_secret": "GOCSPX-…", "redirect_uris": ["http://localhost"] } }
{ "web":       { "client_id": "…", "client_secret": "GOCSPX-…", "redirect_uris": ["http://localhost:51065"] } }
```

참고: <https://developers.google.com/identity/protocols/oauth2/web-server> · <https://www.datacamp.com/tutorial/google-workspace-cli>
