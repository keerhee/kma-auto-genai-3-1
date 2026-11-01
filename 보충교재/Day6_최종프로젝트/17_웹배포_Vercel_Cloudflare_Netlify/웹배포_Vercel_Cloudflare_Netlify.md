# Vercel · Cloudflare · Netlify 배포 — 사람이 할 최소한의 일

> 원칙: 사람은 **가입 3번 + 승인 버튼 3번**만. 빌드·배포·주소 확인은 Claude Code(클코)가 CLI로 한다.

## 1. 결론

- **비밀번호 새로 만들 필요 없음.** "GitHub로 가입"을 쓰면 GitHub 계정으로 로그인한다. (Cloudflare는 이메일 또는 Google)
- **키(토큰)를 받아 올 필요 없음.** 클코가 로그인 명령을 실행하면 브라우저가 열리고 **Authorize만 누르면** 된다. 로그인 정보는 이 맥에 자동 저장된다.
- 토큰은 **브라우저 승인 없이** 배포해야 할 때만 필요하다(선택, 5절).
- 무료 요금제는 세 곳 모두 결제 카드를 요구하지 않는다.

## 2. 사이트별 가입 (각 2~3분)

### Vercel — https://vercel.com/signup
1. 요금제 **Hobby**(무료) 선택
2. 이름 입력(아무거나)
3. **Continue with GitHub** → GitHub에서 Authorize
4. 대시보드가 뜨면 끝(저장소 Import 화면은 건너뛰어도 됨)

### Netlify — https://app.netlify.com/signup
1. **Sign up with GitHub** → Authorize
2. 설문(용도·팀 이름)은 대충 고르거나 Skip
3. "Deploy your first project" 화면은 닫기

### Cloudflare — https://dash.cloudflare.com/sign-up
1. 이메일+비밀번호 또는 **Google로 가입**
2. **받은 메일함에서 인증 메일 링크 꼭 누르기** (인증 안 하면 배포가 막힐 수 있음)
3. 도메인 추가 화면은 건너뛰기 (`*.pages.dev` 주소로 배포 가능)

## 3. 가입 후 클코에게 한마디

> 「세 곳 가입했어, 로그인 연결해줘」

클코가 진행하는 순서:

| 서비스 | 로그인(한 번) | 배포 명령 |
|---|---|---|
| Vercel | `npx vercel login` | `npx vercel deploy --prod --yes` |
| Cloudflare | `npx wrangler login` | `npx wrangler pages deploy ./dist --project-name=<이름>` |
| Netlify | `npx netlify login` | `npx netlify deploy --prod --dir=dist` (처음엔 `--create-site <이름>`) |

- 브라우저 창이 열리면 **승인**만 누른다.
- 터미널에서 질문하며 멈추면 직접 `! npx vercel login`처럼 `!`를 붙여 입력한다.
- CLI는 따로 설치하지 않는다(`npx`로 실행, 이 맥에 Node v25 있음).

## 4. 배포를 시킬 때 프롬프트 예

> 「`06_영상·미디어/xxx` 사이트를 Vercel에 배포해줘. 프로젝트 이름은 `kma-demo`. 빌드하고 배포한 뒤, 실제 주소를 열어 화면이 뜨는지 확인까지 해줘.」

세 곳 다 → "Vercel·Cloudflare·Netlify 셋 다".

## 5. (선택) 토큰 — 브라우저 승인 없이 맡길 때만

다른 컴퓨터·클라우드에서 배포하거나, 예약 작업처럼 승인 누를 사람이 없을 때만 필요하다.
각 사이트에서 발급해 `~/.config/secrets.env`에 붙여 넣는다. **토큰은 비밀번호와 같으니 채팅창에 붙여 넣지 않는다.**

```
VERCEL_TOKEN=...            # Account Settings → Tokens
CLOUDFLARE_API_TOKEN=...    # My Profile → API Tokens (Pages 편집 권한)
CLOUDFLARE_ACCOUNT_ID=...   # 대시보드 오른쪽 사이드바
NETLIFY_AUTH_TOKEN=...      # User settings → Applications → Personal access tokens
```

## 6. 알아 둘 점

- **Vercel Hobby는 비상업용.** 강의 데모는 괜찮고, 유료 고객용이면 Pro나 Cloudflare.
- 정적 사이트(HTML·`dist/`)는 세 곳 모두 명령 한 줄. 서버 코드(API 라우트·SSR)가 있으면 Cloudflare는 Workers 설정(`wrangler.toml`) 추가(클코가 작성).
- **git push만 하면 자동 배포**되게 하려면 대시보드에서 GitHub 저장소를 Import하는 클릭이 한 번 더 필요하다.
- 직접 산 도메인 연결 시에만 DNS 레코드 입력이 필요하다.
