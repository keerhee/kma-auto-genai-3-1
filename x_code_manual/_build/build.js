// Claude 설치 가이드 (간단판) — 데스크톱 앱 기본 + VS Code 확장 보완. zeroone-pitch-deck v1.10
// 근거: support.claude.com Install Claude Desktop · Use Cowork(2026-10), code.claude.com desktop · vs-code · setup (2026-10-17 확인)
const fs = require("fs");
const T = require("./template.js");
const { C, M, CW } = T;
T.setBrand({ eyebrow: "CLAUDE 설치 가이드", wordmark: "" });

const MONO = "Menlo";
const S = () => T.slide();
const ratio = p => { const b = fs.readFileSync(p); return b.readUInt32BE(16) / b.readUInt32BE(20); };
const fig = (s, n, y, bottom) => T.figImg(s, `fig/${n}.png`, ratio(`fig/${n}.png`), { y, bottom });
const monoW = (t, fz) => [...t].reduce((a, ch) => a + (/[ㄱ-힣]/.test(ch) ? 1.0 : 0.61), 0) * fz / 72;
let P = 1;

/** 주소·명령 띠: rows [[라벨, 값(Menlo), 비고]] */
function cmdTable(s, rows, o) {
  const [lw, cw, nw] = o.widths || [2.3, 6.4, 3.09];
  const fz = 18, rowH = o.rowH || 0.62;
  let y = o.y;
  rows.forEach(r => {
    T.txt(s, r[0], { x: M, y, w: lw - 0.12, h: rowH, fontSize: 18, bold: true, color: C.body, valign: "middle", margin: 0 });
    T.rect(s, M + lw, y + 0.05, cw - 0.10, rowH - 0.10, C.white, { color: C.hair, width: 1 });
    T.rect(s, M + lw, y + 0.05, 0.07, rowH - 0.10, C.teal);
    T.txt(s, r[1], { x: M + lw + 0.24, y: y + 0.05, w: cw - 0.38, h: rowH - 0.10, fontFace: MONO, fontSize: fz, bold: true,
      color: C.teal, valign: "middle", margin: 0 });
    if (monoW(r[1], fz) > cw - 0.42) console.warn(`[cmd] 넘침: ${r[1]}`);
    if (r[2]) T.txt(s, r[2], { x: M + lw + cw + 0.06, y, w: nw - 0.06, h: rowH, fontSize: T.fitBody(r[2], nw - 0.14, 17, "cmd.note"),
      color: C.muted, valign: "middle", margin: 0 });
    y += rowH + 0.08;
  });
  return y - 0.08;
}

/** 프롬프트 카드 2×2 */
function promptGrid(s, items, o) {
  const gap = 0.30, w = (CW - gap) / 2, h = o.h || 1.40;
  items.forEach((it, i) => {
    const x = M + (i % 2) * (w + gap), y = o.y + Math.floor(i / 2) * (h + 0.22);
    T.card(s, x, y, w, h, "white"); T.rect(s, x, y, 0.10, h, C.teal);
    T.txt(s, it.tag, { x: x + 0.34, y: y + 0.12, w: w - 0.5, h: 0.30, fontSize: 15, bold: true, color: C.teal, valign: "middle", margin: 0 });
    const fz = 19, lines = Math.ceil(T.wUnits(it.text) * fz / 72 / (w - 0.60));
    if (0.50 + T.linesH(lines, fz, 1.2) > h - 0.06) console.warn(`[prompt] 낮음(${lines}줄): ${it.text.slice(0, 18)}`);
    T.txt(s, it.text, { x: x + 0.34, y: y + 0.48, w: w - 0.54, h: h - 0.54, fontSize: fz, bold: true, color: C.body,
      valign: "top", margin: 0, ...T.lsp(fz, 1.2) });
  });
}

/* 표지 */
T.cover(S(), {
  title: "Claude 설치 가이드\n데스크톱 앱 + VS Code",
  sub: "데스크톱 앱이 기본, Claude Code는 VS Code에서 보완",
  org: "2026년 10월 기준 · 처음 쓰는 분용",
  chain: ["데스크톱 앱", "VS Code", "Claude Code 확장"],
});

/* 무엇을 설치하나 */
{ const s = S(); const cy = T.head(s, { title: "데스크톱 앱 하나가 기본이고, VS Code는 보완입니다",
    sub: "Node.js는 따로 설치하지 않는다 — 데스크톱 앱과 VS Code 확장에 이미 들어 있다", page: ++P });
  fig(s, "g1_overview", cy + 0.04, 5.86);
  T.punch(s, [{ text: "대부분의 일은 데스크톱 앱 하나로 끝납니다", color: C.red, size: 22 }], { y: 6.06 }); }

/* 설치 전 확인 */
{ const s = S(); const cy = T.head(s, { title: "설치 전에 요금제와 컴퓨터, 회사망을 확인합니다",
    sub: "셋 중 하나라도 안 맞으면 설치는 돼도 로그인이나 Code에서 막힌다", page: ++P });
  T.cards(s, [
    { cap: "요금제", title: "Code는 유료 요금제", bullets: ["Pro · Max · Team", "Enterprise", "무료는 대화만 가능"] },
    { cap: "컴퓨터", title: "최소 사양", bullets: ["macOS 13 이상", "Windows 10 이상", "메모리 4GB 이상"] },
    { kind: "dark", cap: "회사망", title: "열려 있어야 할 주소", bullets: ["claude.ai · claude.com", "api.anthropic.com", "downloads.claude.ai"] },
  ], { y: cy + 0.06, h: 3.46 });
  T.punch(s, [{ text: "회사망에서 로그인이 멈추면 위 주소를 정보화 부서에 허용 요청합니다", color: C.teal, size: 21 }], { y: 6.04 }); }

/* ① 데스크톱 앱 설치 */
{ const s = S(); const cy = T.head(s, { eyebrow: "① 데스크톱 앱 (기본)", title: "앱을 내려받아 로그인하고 작업 폴더를 고릅니다",
    sub: "Claude Code가 앱 안에 들어 있어 Node.js도 터미널도 필요 없다", page: ++P });
  fig(s, "g2_desktop", cy, 4.74);
  cmdTable(s, [
    ["맥", "https://claude.com/download", ".dmg → 응용 프로그램"],
    ["윈도우", "https://claude.com/download", "x64 · ARM64 중 선택"],
  ], { y: 4.88 });
  T.punch(s, [{ text: "Surface 같은 ARM 노트북은 ARM64 설치 파일을 받습니다", color: C.teal, size: 20 }], { y: 6.30 }); }

/* 데스크톱 앱 화면 */
{ const s = S(); const cy = T.head(s, { eyebrow: "① 데스크톱 앱 (기본)", title: "앱 왼쪽이 Code, 오른쪽이 Claude 대화입니다",
    sub: "2026년 9월 16일 Chat과 Cowork가 하나의 대화로 합쳐졌다", page: ++P });
  T.dataTable(s, ["화면", "하는 일", "이럴 때"], [
    ["Code (왼쪽)", "내 폴더의 파일을 직접 읽고 고친다", "실습 · 업무 자동화"],
    ["대화 (오른쪽)", "질문하거나 일을 맡기면 알아서 처리", "질문 · 문서 · 정리"],
  ], { y: cy - 0.04, rowH: 0.92, widths: [2.4, 6.0, 3.39], emph: 0 });
  T.punch(s, [
    { text: "Code → Local → Select folder 순서로 작업 폴더를 엽니다", color: C.teal, size: 21 },
    { text: "처음에는 권한 모드를 Manual로 바꿔, 바뀔 내용을 보고 승인합니다", color: C.red, size: 21 },
  ], { y: 4.92, gap: 0.50 });
  T.note(s, "※ 2026년 10월 6일부터 내 컴퓨터 폴더에서 하는 작업은 Code에서 한다", { y: 6.10, color: C.teal }); }

/* ② VS Code */
{ const s = S(); const cy = T.head(s, { eyebrow: "② VS Code (보완)", title: "VS Code는 무료 편집기로, 내려받아 설치합니다",
    sub: "Claude Code를 편집기 안에서 쓰고 싶을 때만 설치한다", page: ++P });
  fig(s, "g3_vscode", cy, 4.74);
  cmdTable(s, [
    ["내려받는 곳", "https://code.visualstudio.com", "맥·윈도우 공통"],
  ], { y: 4.92 });
  T.punch(s, [{ text: "윈도우는 User Installer를 고릅니다 — 관리자 권한 없이 설치됩니다", color: C.teal, size: 20 }], { y: 5.80 }); }

/* ③ Claude Code 확장 */
{ const s = S(); const cy = T.head(s, { eyebrow: "③ Claude Code 확장 (보완)", title: "VS Code에 Claude Code 확장을 설치하고 로그인합니다",
    sub: "VS Code 1.94.0 이상 · 데스크톱 앱과 같은 Claude 계정으로 로그인한다", page: ++P });
  fig(s, "g4_extension", cy, 4.74);
  cmdTable(s, [
    ["확장 이름", "anthropic.claude-code", "제작자 Anthropic"],
  ], { y: 4.92 });
  T.punch(s, [{ text: "확장 안에 Claude Code가 들어 있어 Node.js도 터미널 설치도 필요 없습니다", color: C.red, size: 20 }], { y: 5.80 }); }

/* Node.js · Git */
{ const s = S(); const cy = T.head(s, { title: "Node.js는 필요 없고, Git은 윈도우에서만 깔아 둡니다",
    sub: "공식 문서 기준 — 데스크톱 앱과 VS Code 확장은 실행 파일을 직접 품고 있다", page: ++P });
  T.cards(s, [
    { cap: "Node.js", title: "필요 없음", bullets: ["데스크톱 앱에 포함", "VS Code 확장에 포함", "npm 설치 때만 필요"] },
    { kind: "dark", cap: "Git", title: "선택 — 윈도우는 권장", bullets: ["없으면 PowerShell로 대신", "맥은 대부분 기본 설치", "작업 분리 기능에 필요"] },
  ], { y: cy + 0.04, h: 2.80, gap: 0.41 });
  cmdTable(s, [
    ["윈도우 Git", "https://git-scm.com/downloads/win", "기본값으로 설치"],
  ], { y: cy + 3.04, widths: [2.3, 6.4, 3.09] });
  T.punch(s, [{ text: "'Git is required'가 뜰 때만 Git을 설치하거나 앱을 업데이트합니다", color: C.teal, size: 20 }], { y: 6.14 }); }

/* 첫 프롬프트 */
{ const s = S(); const cy = T.head(s, { title: "첫 프롬프트는 읽고 설명하게 하는 것으로 시작합니다",
    sub: "데스크톱 앱 Code와 VS Code 확장 어디서나 그대로 붙여 넣는다", page: ++P });
  promptGrid(s, [
    { tag: "폴더 파악", text: "이 폴더가 어떤 작업을 하는 곳인지 처음 보는 사람도 알게 설명해줘" },
    { tag: "자료 훑기", text: "input 폴더의 파일을 열어 보고, 무엇이 들어 있는지 표로 정리해줘" },
    { tag: "계획 먼저", text: "바로 고치지 말고 계획만 먼저 보여줘. 내가 승인하면 그때 진행해줘" },
    { tag: "원본 보존", text: "원본은 그대로 두고, 결과는 output 폴더에 새 파일로 저장해줘" },
  ], { y: cy, h: 1.40 });
  T.punch(s, [{ text: "필요한 파일은 Claude가 스스로 찾아 읽습니다 — 미리 붙여 넣지 않아도 됩니다", color: C.teal, size: 20 }], { y: 5.86 }); }

/* 막힐 때 */
{ const s = S(); const cy = T.head(s, { title: "막히는 곳은 대개 요금제·회사망·버전입니다",
    sub: "증상을 보고 오른쪽 해결부터 해 본다", page: ++P });
  T.dataTable(s, ["증상", "원인", "해결"], [
    ["Code에서 업그레이드 안내", "무료 요금제", "Pro 이상 요금제"],
    ["로그인 창이 멈춤", "회사 방화벽", "주소 허용 요청"],
    ["확장 아이콘이 안 보임", "VS Code 1.94 미만", "업데이트 후 재시작"],
    ["확장이 계속 로그인 요구", "창 새로고침 필요", "Reload Window"],
  ], { y: cy - 0.06, rowH: 0.76, widths: [4.3, 3.6, 3.89] });
  T.punch(s, [{ text: "그래도 안 되면 오류 화면을 캡처해 Claude 대화에 붙여 넣고 묻습니다", color: C.red, size: 20 }], { y: 6.06 }); }

/* 마감 */
T.closing(S(), {
  statements: ["데스크톱 앱이 기본입니다.", "VS Code는 필요할 때 보완합니다.", "Node.js는 설치하지 않습니다."],
  message: "막히면 오류 화면을\nClaude에게 보여 주고 묻습니다.",
  contacts: [],
  note: "근거: support.claude.com (Install Claude Desktop · Cowork 통합 안내), code.claude.com (Desktop · VS Code · Setup), 2026-10-17 확인",
});

T.save("../Claude_설치가이드_간단판.pptx").then(() => console.log("saved"));
