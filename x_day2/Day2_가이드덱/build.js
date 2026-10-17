// Claude Code로 Day2 실습 폴더 만들기 — 단계별 프롬프트 가이드 (zeroone-pitch-deck v1.10)
// 원칙: 사람은 설치·폴더 열기·업무 준비만. 나머지는 단계마다 프롬프트 한 개 + 결과(어디에 무엇이) + 확인 한 줄.
// 결과 표기 규칙: 줄마다 "채팅창(Claude의 글 답변) / 생기는 파일(폴더에 새로 생김) / 열면 보이는 것(그래프·화면)"을 구분한다.
// 실행: node build.js  →  Claude_Code_시작가이드.pptx
const fs = require("fs");
const T = require("./template.js");
const { C, M, CW } = T;
T.setBrand({ eyebrow: "CLAUDE CODE 시작 가이드", wordmark: "" });   // 워드마크·로고 금지

const S = () => T.slide();
const ratio = p => { const b = fs.readFileSync(p); return b.readUInt32BE(16) / b.readUInt32BE(20); };
const TOTAL = 16;
const HUMAN = new Set([1, 2, 14]);   // 사람이 직접 하는 단계
let P = 1;

/** 붙여 넣을 프롬프트 — 흰 카드 + 왼쪽 티일 띠 */
function promptCard(s, o) {
  const x = o.x ?? M, w = o.w ?? CW, y = o.y, fsz = o.fs || 19;
  const lines = o.text.split("\n");
  const h = 0.46 + T.linesH(lines.length, fsz, 1.25) + 0.14;
  lines.forEach(L => { const wd = T.wUnits(L) * fsz / 72;
    if (wd > w - 0.70) console.warn(`[prompt] 줄이 넘칩니다(${wd.toFixed(2)}in): "${L.slice(0, 24)}…"`); });
  T.card(s, x, y, w, h, "white"); T.rect(s, x, y, 0.10, h, C.teal);
  T.txt(s, "Claude Code에 붙여 넣을 프롬프트", { x: x + 0.36, y: y + 0.12, w: w - 0.6, h: 0.30,
    fontSize: 14, bold: true, color: C.teal, valign: "middle" });
  T.txt(s, o.text, { x: x + 0.36, y: y + 0.46, w: w - 0.6, h: h - 0.52, fontSize: fsz,
    color: C.body, valign: "top", margin: 0, ...T.lsp(fsz, 1.25) });
  return y + h;
}

/** 실행 결과 — 줄마다 [어디에, 무엇이]. 라벨: 채팅창 / 생기는 파일 / 엑셀로 열면 / 화면 … */
function resultCard(s, o) {
  const x = M, w = CW, y = o.y, fsz = 17, LW = 2.35;
  const pitch = T.linesH(1, fsz, 1.25) + 0.06;
  const h = 0.46 + pitch * o.rows.length + 0.10;
  T.card(s, x, y, w, h, "ghost");
  T.txt(s, o.cap || "실행하면 이렇게 된다", { x: x + 0.36, y: y + 0.12, w: w - 0.6, h: 0.30,
    fontSize: 14, bold: true, color: C.muted, valign: "middle" });
  o.rows.forEach(([k, v], i) => {
    const ry = y + 0.46 + i * pitch;
    T.txt(s, k, { x: x + 0.36, y: ry, w: LW - 0.1, h: pitch, fontSize: 16, bold: true, color: C.teal, valign: "middle", margin: 0 });
    T.txt(s, v, { x: x + 0.36 + LW, y: ry, w: w - LW - 0.6, h: pitch, fontSize: fsz, color: C.body, valign: "middle", margin: 0 });
    const wd = T.wUnits(v) * fsz / 72;
    if (wd > w - LW - 0.66) console.warn(`[result] 줄이 넘칩니다(${wd.toFixed(2)}in): "${v.slice(0, 24)}…"`);
    if (i < o.rows.length - 1) T.hline(s, x + 0.36, ry + pitch - 0.02, w - 0.72, C.hair, 0.75);
  });
  return y + h;
}

/** 단계 슬라이드: 제목 + (프롬프트) + (결과) + (본문) + 확인 줄 */
function step(n, o) {
  const s = S();
  const who = HUMAN.has(n) ? "사람이 직접" : "Claude Code에 시키기";
  const cy = T.head(s, { eyebrow: `STEP ${String(n).padStart(2, "0")} / ${TOTAL} · ${who}`,
    title: o.title, sub: o.sub, page: ++P });
  let y = cy + 0.16;
  if (o.prompt) y = promptCard(s, { y, text: o.prompt, fs: o.promptFs });
  if (o.result) y = resultCard(s, { y: y + 0.14, rows: o.result, cap: o.resultCap });
  if (o.body) y = o.body(s, y);
  T.punch(s, o.check.map(c => ({ text: c, color: C.teal, size: 20 })), { y: y + 0.20, gap: 0.46 });
  if (y + 0.20 + 0.46 * o.check.length > 6.85) console.warn(`[step ${n}] 확인 줄이 푸터에 닿습니다`);
  return s;
}

/** 왼쪽 프롬프트 + 오른쪽 "실행하면 채팅창에 이렇게 나온다" 폴더 나무 그림 */
function treeSlide(n, o) {
  const s = S();
  const cy = T.head(s, { eyebrow: `STEP ${String(n).padStart(2, "0")} / ${TOTAL} · Claude Code에 시키기`,
    title: o.title, page: ++P });
  const lw = o.leftW, gap = 0.30, rx = M + lw + gap, rw = CW - lw - gap, top = cy + 0.16;
  const yL = promptCard(s, { x: M, w: lw, y: top, text: o.prompt, fs: 18 });
  T.txt(s, o.figCap, { x: rx, y: top, w: rw, h: 0.30, fontSize: 14, bold: true, color: C.muted, valign: "middle" });
  const yR = T.figImg(s, o.path, ratio(o.path), { y: top + 0.36, bottom: o.bottom, x: rx, w: rw });
  T.punch(s, o.check.map(c => ({ text: c, color: C.teal, size: 20 })), { y: Math.max(yL, yR) + 0.16, gap: 0.46 });
  return s;
}

/* 표지 */
T.cover(S(), {
  title: "Claude Code로\nDay2 실습 폴더 만들기",
  sub: "설치만 사람이 하고, 나머지는 프롬프트로 시킨다",
  org: "자동차특화 AI 융합 전문가 과정 · Day2",
  chain: ["설치", "프롬프트", "결과"],
});

/* Day2 목적과 할 일 */
{ const s = S(); const cy = T.head(s, { title: "Day2에서는 시장 데이터를 모아 기준을 확인하고 차트로 보여 줍니다",
    sub: "강의 덱 '자동차 데이터 크롤링 및 시각화'의 실습 다섯 가지를 이 폴더에서 한다", page: ++P });
  T.dataTable(s, ["할 일", "구체적으로", "남는 파일"], [
    ["국내 EV Top5", "2026년 8월 1위 Model Y 9,638대 등 5개 모델", "01 엑셀 막대 차트"],
    ["도구 기준표", "수집·생성·분석·시각화별 도구와 주의점", "02 기준표 엑셀"],
    ["VOC 감정분석", "아이오닉5 리뷰 30건을 주제·긍부정으로", "03 키워드 엑셀"],
    ["차트 클리닉", "y축이 2400에서 시작한 'A사 급등' 차트 고치기", "04 전후 비교"],
    ["주간 수집", "경쟁 EV 가격·프로모션을 매주 같은 방식으로", "05 누적 엑셀"],
  ], { y: cy - 0.08, rowH: 0.62, widths: [2.4, 6.6, 2.79] });
  T.punch(s, [{ text: "핵심 함정: 기사가 '판매'라고 써도 수치는 '등록'일 수 있다 — 기준을 섞지 않는다", color: C.red, size: 20 }], { y: 6.08 }); }

/* 전체 흐름 */
{ const s = S(); const cy = T.head(s, { title: "사람은 세 단계만 하고, 나머지 열세 단계는 Claude Code에 시킵니다",
    sub: "검은 칸은 사람이 직접, 흰 칸은 프롬프트 한 개로 시킨다", page: ++P });
  T.figImg(s, "fig/g0_steps.png", ratio("fig/g0_steps.png"), { y: cy + 0.04, bottom: 5.80 });
  T.punch(s, [{ text: "슬라이드마다 흰 카드의 프롬프트를 복사해 붙여 넣고, 아래 회색 카드의 결과가 나왔는지 봅니다", color: C.teal, size: 20 }], { y: 6.02 }); }

/* STEP 01 앱 설치 */
step(1, { title: "데스크톱 앱을 설치하고 로그인합니다",
  body: (s, y) => T.pipeline(s, ["claude.ai/download\n에서 앱 받기", "내려받은 파일을\n실행해 설치", "Pro 이상 계정으로\n로그인"], { y, h: 1.30, gap: 0.55 }),
  check: ["확인: 앱이 열리고 내 계정으로 로그인되어 있다"] });

/* STEP 02 폴더 열기 */
step(2, { title: "Code 탭에서 작업 폴더를 열면 Claude Code가 켜집니다",
  body: (s, y) => T.pipeline(s, ["앱에서\nCode 선택", "폴더 선택 창에서\n새 폴더 만들기", "이름을 Day2_실습\n으로 짓고 선택"], { y, h: 1.30, gap: 0.55 }),
  check: ["확인: 글을 쓰는 입력창이 열린다 — 다음 단계부터 여기에 프롬프트를 붙여 넣는다"] });

/* STEP 03 Python */
step(3, { title: "Python 설치부터 Claude Code에 시킵니다",
  prompt: "이 PC에 Python이 설치되어 있는지 확인하고, 없으면 설치해줘.\n설치가 끝나면 pandas와 openpyxl도 설치하고 버전을 보여줘.",
  result: [
    ["채팅창 (글)", "Claude가 설치 결과를 글로 답한다"],
    ["답변 예", "\"Python 3.12.7 · pandas 2.2.3 · openpyxl 3.1.5 설치됨\""],
    ["생기는 파일", "없음 — PC에 프로그램만 설치된다"],
  ],
  check: ["중간에 허락 창이 뜨면 무엇을 하려는지 읽고 '허용'을 누른다"] });

/* STEP 04 폴더 구조 — 빈 폴더만 만든다 */
treeSlide(4, { title: "작업 폴더의 구조를 만들게 합니다", leftW: 5.0, bottom: 6.05,
  prompt: "이 폴더 안에 아래 구조로\n빈 폴더를 만들어줘.\n· input\n· working  (안에 scripts)\n· output  (안에 운영안내)\n· docs\n· .claude  (안에 skills)\ninput은 원본 전용이다.\n다 만들면 나무 모양으로 보여줘.",
  path: "fig/t1_skeleton.png",
  figCap: "실행하면 채팅창에 이 구조가 나온다 — 아직 모두 빈 폴더",
  check: ["확인: 파일 탐색기로 Day2_실습 폴더를 열어도 같은 폴더가 보인다"] });

/* STEP 05 원본 받기 */
step(5, { title: "원본 데이터를 저장소에서 받아 오게 합니다",
  prompt: "github.com/keerhee/kma-auto-genai-3-1 저장소의 data/Day2 파일을\n모두 input 폴더에 받아줘. 받은 파일 목록과 각 파일의 행 수를 보여줘.",
  result: [
    ["생기는 파일", "input 폴더에 8개 — 데이터 CSV 6개, 차트 그림 PNG 2개"],
    ["파일 예", "Day2_국내EV판매_Top5_실데이터.csv (5행)"],
    ["채팅창 (표)", "파일 이름 | 행 수 표 — 예: 아이오닉5 리뷰 30행"],
  ],
  check: ["확인: 탐색기에서 input 폴더에 파일 8개가 있는지 본다"] });

/* STEP 06 규칙 */
step(6, { title: "강의 자료를 읽혀 작업 규칙 CLAUDE.md를 쓰게 합니다",
  prompt: "같은 저장소 Day2 폴더의 강의 PDF를 읽고, 주의사항을 CLAUDE.md 규칙으로\n써줘. 원본 보존, 숫자마다 기준·기간·출처, 가상·추정 표기, 차트 원칙,\n멈춰서 나에게 확인받을 지점을 꼭 넣어줘.",
  result: [
    ["생기는 파일", "CLAUDE.md 1개 — 글로 된 규칙 문서 (1~2쪽)"],
    ["들어 있는 문장 예", "기사가 '판매'라고 써도 수치가 등록대수면 '등록'으로 적는다"],
    ["채팅창 (글)", "규칙 요약과 '멈춰서 확인받을 지점 3곳' 목록"],
  ],
  check: ["CLAUDE.md를 메모장으로 열어 읽고, 고칠 곳은 '3번 규칙을 이렇게 바꿔줘'처럼 시킨다"] });

/* STEP 07 스크립트 */
step(7, { title: "결과를 만드는 공통 스크립트를 짜게 합니다",
  prompt: "결과를 xlsx(엑셀 차트 포함)와 단일 HTML로 만드는 공통 스크립트를\nworking/scripts에 만들어줘. 막대 y축은 0부터 시작하고, 차트 아래에는\n기준·출처를 적어줘. input의 국내 EV Top5 파일로 시험해서 보여줘.",
  result: [
    ["생기는 파일", "output/01_EV시장_Top5.xlsx (스크립트는 working/scripts에)"],
    ["엑셀로 열면 (그림)", "모델 5개 막대 그래프 — Model Y 막대(9,638대)가 가장 길다"],
    ["그래프 아래 (글)", "'기준: 신규등록 · 기간: 2026년 8월 · 출처: autotribune' 한 줄"],
  ],
  check: ["확인: 엑셀 파일을 직접 열어 막대 그래프와 그 아래 기준 문구를 본다"] });

/* STEP 08 스킬 */
step(8, { title: "실습 단계를 스킬로 만들게 합니다",
  prompt: "실습 단계마다 스킬을 만들어줘.\nEV-시장수집, VOC-감정분석, 차트-클리닉, 주간-수집레시피.\n규칙은 CLAUDE.md에만 두고, 스킬에는 절차와 결과 파일만 적어줘.",
  result: [
    ["생기는 파일", "스킬 설명서 4개 (글 문서) — 예: EV-시장수집/SKILL.md"],
    ["채팅창 (글)", "스킬 4개의 이름과 각각 하는 일을 한 줄씩 적어 준다"],
  ],
  check: ["스킬 = 다음에 'EV-시장수집 스킬로 ~'처럼 이름만 불러 다시 시킬 수 있게 적어 둔 절차"] });

/* STEP 09 시범 실행 */
step(9, { title: "전 과정을 한 번 돌려 결과를 확인합니다",
  prompt: "input 데이터로 스킬을 차례로 한 번씩 돌려 output에 결과를 만들어줘.\n마지막에 결과를 모은 HTML 화면을 만들어 열어줘.",
  result: [
    ["생기는 파일", "output에 엑셀 5개(01~05)와 결과 화면 00_Day2_결과화면.html"],
    ["화면 (그림)", "브라우저 창이 열리고 탭 5개짜리 웹 화면이 보인다"],
    ["첫 탭 제목 (글)", "'2026년 8월 국내 EV 등록 1위 Model Y 9,638대 — 2위의 3.0배'"],
  ],
  check: ["확인: 탭 5개를 하나씩 눌러 그래프와 표가 모두 나오는지 본다"] });

/* STEP 10 구조 확인 — 완성된 폴더 */
treeSlide(10, { title: "시범 실행을 마치면 폴더가 이렇게 채워집니다", leftW: 3.9, bottom: 6.00,
  prompt: "지금 폴더 구조를\n나무 모양으로 보여줘.\n폴더마다 무엇이\n들어 있는지\n한 줄씩 적어줘.",
  path: "fig/t2_full.png",
  figCap: "실행하면 채팅창에 이 구조가 나온다 — 초록 표시는 그 파일을 만든 STEP",
  check: ["운영안내·docs는 비어 있어도 된다 — 강사가 안내 문서를 넣는 자리다"] });

/* STEP 11 실습 */
step(11, { title: "실습은 스킬 이름을 넣어 한 줄로 시킵니다",
  body: (s, y) => T.dataTable(s, ["실습", "프롬프트", "결과 파일 · 들어 있는 핵심 내용"], [
    ["데이터 수집", "EV-시장수집 스킬로 국내 EV Top5를 모아줘", "01 엑셀 · 1위 Model Y 9,638대"],
    ["VOC 분석", "VOC-감정분석 스킬로 아이오닉5 리뷰 분석해줘", "03 엑셀 · 부정 13건 중 충전 7건"],
    ["차트 클리닉", "차트-클리닉 스킬로 나쁜 차트 예시 진단해줘", "04 엑셀 · '7월에 기준 바뀜' 진단"],
    ["주간 수집", "주간-수집레시피로 경쟁 EV 가격 레시피 만들어줘", "05 엑셀 · '확인 필요' 2건 표시"],
  ], { y: y - 0.10, rowH: 0.66, widths: [1.9, 5.7, 4.19] }),
  check: ["Claude가 채팅창에 '판매인가요, 등록인가요?'처럼 물으면 답한 뒤 계속 진행한다"] });

/* STEP 12 갱신 */
step(12, { title: "input이 바뀔 때를 대비해 갱신 스킬을 만듭니다",
  prompt: "input 파일이 바뀌면 결과를 다시 만드는 Day2-전체갱신 스킬을 만들어줘.\nClaude가 판단해 만든 결과는 다시 판단하게 하고,\n예전 결과는 output/_이전판으로 옮겨줘.",
  result: [
    ["생기는 파일", "스킬 설명서 1개 — .claude/skills/Day2-전체갱신/SKILL.md"],
    ["나중에 리뷰를 바꾸면", "01 엑셀은 바로 다시 만들고, 03 VOC는 다시 분류하기 전에 묻는다"],
    ["예전 결과", "output/_이전판 폴더로 옮겨진다 (지워지지 않는다)"],
  ],
  check: ["이후에는 'Day2-전체갱신 해줘' 한 줄이면 된다"] });

/* STEP 13 GitHub 업데이트 */
step(13, { title: "강사가 고친 규칙과 스킬은 GitHub에서 받아 옵니다",
  promptFs: 18,
  prompt: "github.com/keerhee/kma-auto-genai-3-1 저장소의\nDay2/ClaudeCode 폴더에서 CLAUDE.md, .claude/skills, working/scripts를\n받아 내 폴더의 것과 비교해줘. 바뀐 점을 먼저 보여 주고,\n내가 허락하면 바꿔줘. input과 output은 건드리지 마.",
  result: [
    ["채팅창 (글)", "바뀐 파일과 바뀐 줄을 보여 주고 '바꿀까요?'라고 묻는다"],
    ["답변 예 (가상)", "VOC-감정분석/SKILL.md — 주제 5개 → 6개('안전' 추가)"],
    ["허락하면", "내 폴더의 그 파일만 바뀐다 — input·output은 그대로"],
  ],
  check: ["바꾼 뒤 'Day2-전체갱신 해줘'로 결과 파일을 다시 만든다"] });

/* STEP 14 내 업무 준비 — 가상 예: 영업기획팀 주간 경쟁 EV 가격 보고 */
{ const s = S();
  const cy = T.head(s, { eyebrow: `STEP 14 / ${TOTAL} · 사람이 직접`,
    title: "내 업무는 목적·원본·견본 세 가지를 준비합니다",
    sub: "가상 예: 영업기획팀의 '주간 경쟁 EV 가격 보고'", page: ++P });
  const cols = [{ w: 2.1, h: "준비물" }, { w: 2.9, h: "무엇" }, { w: 4.9, h: "예" }, { w: 1.89, h: "넣을 곳" }];
  const xs = []; let acc = M; cols.forEach(c => { xs.push(acc); acc += c.w; });
  cols.forEach((c, j) => T.txt(s, c.h, { x: xs[j], y: cy - 0.10, w: c.w, h: 0.32, fontSize: 13, color: C.muted, valign: "middle" }));
  const rows = [
    ["① 업무 목적", "누가·언제 받아\n어떤 결정을 하나", "팀장이 매주 월요일 경쟁 EV 가격\n변동을 보고 판촉 대응을 정한다", "CLAUDE.md\n맨 위"],
    ["② 원본 자료", "매번 들어오는 자료", "경쟁사_가격표_2026-W41.xlsx\n프로모션_기사목록.csv (8건)", "input/"],
    ["③ 결과물 견본", "사람이 만든\n지난 결과 1~2건", "주간가격보고_2026-W40.xlsx\n(표 1개 · 차트 1장 · 요약 3줄)", "input/견본/"],
  ];
  const rh = 0.92;
  rows.forEach((r, i) => {
    const y = cy + 0.30 + i * rh;
    r.forEach((cell, j) => {
      const fsz = j === 0 ? 19 : 17;
      T.txt(s, cell, { x: xs[j], y, w: cols[j].w - 0.12, h: rh - 0.12, fontSize: fsz, bold: j === 0,
        color: j === 0 ? C.body : (j === 2 ? C.teal : C.body), valign: "middle", margin: 0, ...T.lsp(fsz, 1.15) });
      cell.split("\n").forEach(L => { if (T.wUnits(L) * fsz / 72 > cols[j].w - 0.14) console.warn(`[step13] 넘침: ${L}`); });
    });
    T.hline(s, M, y + rh - 0.06, CW, C.hair, 1);
  });
  T.punch(s, [
    { text: "견본이 있어야 Claude가 결과 모양을 추측하지 않는다", color: C.teal, size: 20 },
    { text: "새 폴더를 만들어 Code 탭에서 열고(STEP 02와 같다), ②와 ③을 넣는다", color: C.teal, size: 20 },
  ], { y: cy + 0.30 + 3 * rh + 0.12, gap: 0.46 });
  T.note(s, "※ 고객 정보·내부 단가 같은 민감한 자료는 가리거나 예시 값으로 바꾼다", { y: 6.50 }); }

/* STEP 15 내 업무 */
step(15, { title: "견본과 같은 결과를 다시 만들도록 시킵니다",
  promptFs: 18,
  prompt: "내 업무 목적: 영업기획팀장이 매주 월요일 경쟁 EV 가격 변동을 보고 판촉 대응을 정한다.\ninput에 이번 주 가격표와 기사 목록, input/견본에 지난주 보고서를 넣었다.\n견본과 같은 보고서를 원본에서 다시 만들도록 CLAUDE.md 초안과 '주간가격보고' 스킬을\n만들어줘. 시작하기 전에 자료를 읽고, 모르는 것부터 나에게 질문해줘.",
  resultCap: "실행하면 이렇게 된다 (가상 예)",
  result: [
    ["채팅창 (먼저 질문)", "\"보조금 전 가격과 후 가격 중 어느 쪽을 비교할까요?\""],
    ["답한 뒤 생기는 파일", "CLAUDE.md, .claude/skills/주간가격보고/SKILL.md"],
    ["시험 결과 파일", "output/주간가격보고_2026-W41.xlsx (견본과 같은 모양)"],
  ],
  check: ["확인: 새 엑셀과 견본 엑셀을 나란히 열어 모양과 숫자를 비교한다"] });

/* STEP 16 매주 실행 */
step(16, { title: "다음 주부터는 새 원본만 넣고 한 줄로 돌립니다",
  prompt: "input에 이번 주 가격표 경쟁사_가격표_2026-W42.xlsx를 넣었어.\n주간가격보고 스킬로 이번 주 보고서를 만들고,\n지난주 대비 바뀐 모델부터 보여줘.",
  resultCap: "실행하면 이렇게 된다 (가상 예)",
  result: [
    ["생기는 파일", "output/주간가격보고_2026-W42.xlsx — 견본과 같은 표·차트·요약"],
    ["채팅창 (글)", "가격이 바뀐 모델 2개와 '확인 필요' 1건(매체마다 금액이 다름)"],
  ],
  check: ["'확인 필요' 줄만 사람이 기사 원문을 보고 정한 뒤 팀장에게 보고한다"] });

/* 마감 */
T.closing(S(), {
  statements: ["설치는 사람이 합니다.", "나머지는 프롬프트로 시킵니다.", "결과는 사람이 확인합니다."],
  message: "한 번 만든 폴더는\n매주 같은 품질로 다시 돌아갑니다.",
  contacts: [],
});

T.save("Claude_Code_시작가이드.pptx").then(() => console.log("saved Claude_Code_시작가이드.pptx"));
