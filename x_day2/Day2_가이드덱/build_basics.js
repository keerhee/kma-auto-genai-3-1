// Claude Code 작업 폴더 — 기초 지식 (사전 학습용) · zeroone-pitch-deck v1.10
// 원칙: 개념마다 Day2 폴더의 실제 파일·문장을 예로 든다. 사족 없이 "무엇 / 왜 / 예" 순서.
// 실행: node build_basics.js  →  Claude_Code_기초지식.pptx
const fs = require("fs");
const T = require("./template.js");
const { C, M, CW } = T;
T.setBrand({ eyebrow: "CLAUDE CODE 기초 지식", wordmark: "" });   // 워드마크·로고 금지

const S = () => T.slide();
const ratio = p => { const b = fs.readFileSync(p); return b.readUInt32BE(16) / b.readUInt32BE(20); };
let P = 1;
const EB = ["", "01 · Claude Code란", "02 · 파일과 폴더", "03 · CLAUDE.md와 스킬", "04 · 일하는 방식"];
const eb = k => `CLAUDE CODE 기초 지식 · ${EB[k]}`;

/** 2~3열 줄 표 — 첫 열 굵게. 셀은 한 줄. */
function rowsTable(s, o) {
  const y0 = o.y, ws = o.widths, fsz = o.fs || 18, rh = o.rowH || 0.60;
  const xs = []; let acc = M; ws.forEach(w => { xs.push(acc); acc += w; });
  o.head.forEach((h, j) => T.txt(s, h, { x: xs[j], y: y0, w: ws[j], h: 0.32, fontSize: 13, color: C.muted, valign: "middle", margin: 0 }));
  T.hline(s, M, y0 + 0.38, CW, C.body, 1);
  o.rows.forEach((r, i) => {
    const y = y0 + 0.44 + i * rh;
    r.forEach((cell, j) => {
      const f = j === 0 ? fsz + 1 : fsz;
      T.txt(s, cell, { x: xs[j], y, w: ws[j] - 0.15, h: rh - 0.06, fontSize: f, bold: j === 0,
        color: j === (o.accentCol ?? -1) ? C.teal : C.body, valign: "middle", margin: 0 });
      if (T.wUnits(cell) * f / 72 > ws[j] - 0.18) console.warn(`[rowsTable] 넘침: "${cell}"`);
    });
    T.hline(s, M, y + rh - 0.03, CW, C.hair, 1);
  });
  return y0 + 0.44 + o.rows.length * rh;
}

function wideFig(o) {
  const s = S();
  const cy = T.head(s, { eyebrow: o.eb, title: o.title, sub: o.sub, page: ++P });
  T.figImg(s, o.path, ratio(o.path), { y: cy + 0.04, bottom: 5.80 });
  T.punch(s, o.punch, { y: 6.02 });
}
function panelFig(o) {
  const s = S();
  T.figurePanelSlide(s, { eyebrow: o.eb, title: o.title, sub: o.sub, page: ++P, panelW: 3.9, bottom: 5.92,
    path: o.path, ratio: ratio(o.path), panel: o.panel });
  T.punch(s, o.punch, { y: 6.10 });
}

/* 표지 */
T.cover(S(), {
  title: "Claude Code 작업 폴더\n기초 지식",
  sub: "Day2 실습 전에 읽는 사전 학습 자료",
  org: "자동차특화 AI 융합 전문가 과정 · Day2",
  chain: ["폴더", "규칙", "스킬"],
});

/* 목차 */
{ const s = S(); T.head(s, { title: "목차", sub: "실습 가이드의 열여섯 단계가 왜 그렇게 짜였는지를 먼저 이해한다", page: ++P });
  T.agenda(s, [
    { num: "01", title: "Claude Code란", kicker: "폴더 안에서 일하는 Claude", desc: "채팅과의 차이 · 결과가 파일로 남는다" },
    { num: "02", title: "파일과 폴더", kicker: "경로 읽기와 폴더 네 칸", desc: "경로 · 확장자 · input · working · output" },
    { num: "03", title: "CLAUDE.md와 스킬", kicker: "규칙과 순서를 적어 두기", desc: "CLAUDE.md · SKILL.md · 스크립트" },
    { num: "04", title: "일하는 방식", kicker: "허락·확인·공유", desc: "허락 창 · 멈추는 지점 · GitHub · 결과 확인" },
  ], { y: 2.30, rowH: 0.90 });
  T.banner(s, "개념을 알고 따라 하면, 결과가 이상할 때 어디를 고칠지 보입니다", { y: 6.05 }); }

/* ── 01 Claude Code란 ── */
wideFig({ eb: eb(1), title: "Claude Code는 내 PC의 폴더 안에서 직접 일하는 Claude입니다",
  sub: "채팅 Claude는 붙여 넣은 글만 보고, Claude Code는 폴더의 파일을 읽고 쓰고 실행한다",
  path: "fig/f1_chat_vs_code.png",
  punch: [{ text: "옮겨 적는 일은 Claude가, 판단과 확인은 사람이 맡습니다", color: C.red, size: 24 }] });

{ const s = S(); const cy = T.head(s, { eyebrow: eb(1), title: "같은 'EV Top5 정리'라도 남는 것이 다릅니다",
    sub: "예: 2026년 8월 국내 전기차 등록 상위 5개 모델을 표와 막대 차트로 정리하는 일", page: ++P });
  T.pairPanels(s,
    { kind: "white", cap: "채팅 Claude", title: "답이 글로 끝난다", titleSize: 22,
      bullets: ["표를 복사해 엑셀에 붙인다", "차트는 손으로 그린다", "다음 달엔 처음부터"], foot: "사람이 옮기고 그린다" },
    { kind: "dark", cap: "Claude Code", title: "파일이 남는다", titleSize: 22,
      bullets: ["01_EV시장_Top5.xlsx 생성", "막대 차트까지 들어 있다", "다음 달엔 한 줄로 다시"], foot: "폴더에 결과가 쌓인다" },
    { y: cy, h: 3.64, w: 5.2 });
  T.punch(s, [{ text: "그래서 Claude Code로 일할 때는 '폴더를 어떻게 나누나'가 먼저입니다", color: C.teal, size: 20 }], { y: 6.12 }); }

/* ── 02 파일과 폴더 ── */
{ const s = S(); const cy = T.head(s, { eyebrow: eb(2), title: "'working/scripts'는 working 폴더 안의 scripts 폴더라는 뜻입니다",
    sub: "경로의 / 는 '안에'로 읽는다", page: ++P });
  rowsTable(s, { y: cy, head: ["표기", "읽는 법", "종류"], widths: [4.7, 5.6, 1.49], rowH: 0.66, accentCol: 1, rows: [
    ["input/", "input 폴더", "폴더"],
    ["working/scripts/", "working 폴더 안의 scripts 폴더", "폴더"],
    ["output/01_EV시장_Top5.xlsx", "output 폴더 안의 엑셀 파일", "파일"],
    [".claude/skills/EV-시장수집/", ".claude 안 → skills 안 → EV-시장수집", "폴더"],
  ] });
  T.punch(s, [{ text: "끝이 / 이면 폴더, 끝에 .xlsx 같은 확장자가 붙으면 파일입니다", color: C.teal, size: 20 }], { y: 6.02 }); }

{ const s = S(); const cy = T.head(s, { eyebrow: eb(2), title: "파일 끝의 확장자를 보면 무엇으로 여는지 알 수 있습니다", page: ++P });
  rowsTable(s, { y: cy, head: ["확장자", "무엇", "여는 프로그램", "Day2 예"], widths: [1.2, 3.0, 2.2, 5.39], rowH: 0.56, fs: 17, accentCol: 3, rows: [
    [".csv", "쉼표로 나눈 표 데이터", "엑셀 · 메모장", "Day2_국내EV판매_Top5_실데이터.csv"],
    [".xlsx", "엑셀 파일 (차트 포함)", "엑셀", "01_EV시장_Top5.xlsx"],
    [".html", "웹 화면", "브라우저", "00_Day2_결과화면.html"],
    [".md", "글 문서 (마크다운)", "메모장", "CLAUDE.md · SKILL.md"],
    [".py", "Python 스크립트", "열 필요 없음", "run_all.py"],
    [".png", "그림", "사진 보기", "Day2_차트클리닉_…_가상.png"],
  ] });
  T.punch(s, [{ text: "확장자가 안 보이면 탐색기 '보기' 메뉴에서 '파일 확장명'을 켭니다", color: C.teal, size: 20 }], { y: 6.10 }); }

panelFig({ eb: eb(2), title: "작업 폴더는 원본·작업·결과·규칙의 네 칸으로 나눕니다",
  sub: "어느 파일이 어디에 있어야 하는지 Claude와 사람이 같은 지도를 본다",
  path: "fig/f3_folder.png",
  panel: { cap: "칸마다 규칙", bullets: ["input은 고치지 않기", "결과는 output에만", "규칙은 CLAUDE.md에"], foot: "섞이면 실수가 난다" },
  punch: [{ text: "원본과 결과를 섞지 않는 것이 첫 번째 규칙입니다", color: C.red, size: 23 }] });

{ const s = S(); const cy = T.head(s, { eyebrow: eb(2), title: "원본을 고치면 처음으로 돌아갈 수 없습니다",
    sub: "예: 아이오닉5 리뷰 30건에서 중복 의심 5건을 빼야 할 때", page: ++P });
  T.pairPanels(s,
    { kind: "white", cap: "원본을 고친 경우", title: "input 파일에 덮어쓴다", titleSize: 22,
      bullets: ["30건 중 5건 삭제", "같은 파일로 저장", "원래 30건은 사라짐"], foot: "다시 만들 수 없다" },
    { kind: "dark", cap: "원본을 둔 경우", title: "새 파일로 남긴다", titleSize: 22,
      bullets: ["input 30건은 그대로", "25건은 working에 저장", "언제든 처음부터 다시"], foot: "몇 번이든 다시 만든다" },
    { y: cy, h: 3.64, w: 5.2 });
  T.punch(s, [{ text: "그래서 input은 받은 뒤 고치지 않습니다", color: C.red, size: 24 }], { y: 6.12 }); }

{ const s = S(); const cy = T.head(s, { eyebrow: eb(2), title: "working에는 중간 표를, output에는 보고할 결과를 둡니다",
    sub: "예: 아이오닉5 리뷰 30건이 보고용 엑셀이 되기까지", page: ++P });
  T.flow3(s, [
    { kind: "white", cap: "input/", lines: [{ text: "아이오닉5 리뷰", fs: 20 }, { text: "30건 (원본)", fs: 20 }] },
    { kind: "dark", cap: "working/", lines: [{ text: "리뷰마다 주제·감정을", fs: 19 }, { text: "붙인 표 VOC_분류.csv", fs: 19 }] },
    { kind: "lime", cap: "output/", lines: [{ text: "03_VOC키워드.xlsx", fs: 19 }, { text: "차트 6장 (보고용)", fs: 19 }] },
  ], { y: cy + 0.10, h: 2.60, gap: 0.80 });
  T.punch(s, [
    { text: "working은 다시 만들 수 있는 중간 단계, output은 사람이 보는 결과입니다", color: C.teal, size: 20 },
    { text: "밖으로 보내는 파일은 output에서만 고릅니다", color: C.red, size: 22 },
  ], { y: 5.40 }); }

/* ── 03 CLAUDE.md와 스킬 ── */
panelFig({ eb: eb(3), title: "CLAUDE.md는 Claude가 폴더를 열 때마다 먼저 읽는 규칙 문서입니다",
  sub: "폴더 맨 위에 두는 글 문서(.md) 한 개",
  path: "fig/f4_claudemd.png",
  panel: { cap: "적는 것", bullets: ["지킬 규칙", "멈춰서 물을 지점", "폴더 안내"], foot: "매번 말하지 않아도 된다" },
  punch: [{ text: "같은 당부를 프롬프트마다 반복하지 않아도 됩니다", color: C.teal, size: 20 }] });

{ const s = S(); const cy = T.head(s, { eyebrow: eb(3), title: "CLAUDE.md의 문장 한 줄이 Claude의 행동을 바꿉니다",
    sub: "Day2 폴더의 CLAUDE.md에 실제로 들어 있는 문장과 그 결과", page: ++P });
  rowsTable(s, { y: cy, head: ["CLAUDE.md에 적은 문장", "그래서 일어나는 일"], widths: [5.3, 6.49], rowH: 0.68, fs: 17, accentCol: 1, rows: [
    ["수치가 등록대수면 '등록'으로 적는다", "엑셀 열 이름이 '등록대수(대)'로 적힌다"],
    ["막대 차트의 y축은 0에서 시작한다", "엑셀 막대 차트의 세로축이 0부터 그려진다"],
    ["가상 데이터는 '실습용'으로 표기한다", "VOC 그래프마다 '가상 데이터(실습용)'가 붙는다"],
    ["집계기준을 정할 때는 멈춘다", "Claude가 '판매인가요, 등록인가요?' 묻고 기다린다"],
  ] });
  T.punch(s, [{ text: "규칙은 '정확히 써라'가 아니라 지켰는지 확인할 수 있는 문장으로 씁니다", color: C.red, size: 21 }], { y: 6.02 }); }

panelFig({ eb: eb(3), title: "스킬은 자주 하는 일의 순서를 적어 둔 설명서입니다",
  sub: ".claude/skills 안에 스킬 하나당 폴더 하나, 그 안에 SKILL.md",
  path: "fig/f5_skill.png",
  panel: { cap: "SKILL.md 구성", bullets: ["언제 쓰나", "어떤 순서로", "무엇을 남기나"], foot: "이름만 불러 다시 실행" },
  punch: [{ text: "잘 된 작업은 대화로 끝내지 말고 스킬로 남깁니다", color: C.red, size: 23 }] });

{ const s = S(); const cy = T.head(s, { eyebrow: eb(3), title: "하고 싶은 일을 말하면 맞는 스킬이 꺼내집니다",
    sub: "스킬의 '언제 쓰나'(description)에 적힌 말과 요청을 맞춰 본다", page: ++P });
  rowsTable(s, { y: cy, head: ["내가 쓴 말", "꺼내지는 스킬", "하는 일 → 남는 파일"], widths: [3.4, 3.3, 5.09], rowH: 0.66, accentCol: 1, rows: [
    ["리뷰 분석해줘", "VOC-감정분석", "주제·감정 분류 → 03 엑셀"],
    ["이 차트 좀 봐줘", "차트-클리닉", "6개 항목 진단 → 04 엑셀"],
    ["이번 주 가격 모아줘", "주간-수집레시피", "가격 변동 표 → 05 엑셀"],
    ["input 바꿨어", "Day2-전체갱신", "바뀐 파일을 찾아 결과 다시 만들기"],
  ] });
  T.punch(s, [{ text: "스킬 이름을 몰라도 되지만, 이름을 넣으면 더 정확히 꺼냅니다", color: C.teal, size: 20 }], { y: 6.02 }); }

{ const s = S(); const cy = T.head(s, { eyebrow: eb(3), title: "규칙은 CLAUDE.md에, 순서는 스킬에 나눠 적습니다", page: ++P });
  rowsTable(s, { y: cy, head: ["", "CLAUDE.md", "스킬 (SKILL.md)"], widths: [2.2, 4.4, 5.19], rowH: 0.70, accentCol: -1, rows: [
    ["언제 읽나", "폴더를 열 때마다", "그 일을 할 때만"],
    ["담는 것", "지킬 규칙", "일하는 순서"],
    ["개수", "폴더에 1개", "일마다 1개"],
    ["예", "막대 y축은 0부터", "Top5: ① 검색 ② 출처 확인 ③ 저장"],
  ] });
  T.punch(s, [{ text: "같은 규칙을 두 곳에 쓰면, 한쪽만 고쳤을 때 어느 쪽이 맞는지 모릅니다", color: C.red, size: 21 }], { y: 6.02 }); }

wideFig({ eb: eb(3), title: "판단은 Claude가, 반복 계산과 차트는 스크립트가 맡습니다",
  sub: "스크립트(.py) = 같은 입력이면 매번 같은 결과를 내는 프로그램",
  path: "fig/f6_judge_script.png",
  punch: [{ text: "스크립트는 직접 짜지 않고 '이 작업을 스크립트로 만들어 둬'라고 시킵니다", color: C.teal, size: 20 }] });

/* ── 04 일하는 방식 ── */
{ const s = S(); const cy = T.head(s, { eyebrow: eb(4), title: "Claude는 파일을 바꾸거나 명령을 실행하기 전에 허락을 묻습니다",
    sub: "허락 창 = Claude가 무엇을 하려는지 보여 주고 사람이 고르는 창", page: ++P });
  rowsTable(s, { y: cy, head: ["Claude가 하려는 일", "허락 창", "이렇게 한다"], widths: [4.0, 2.0, 5.79], rowH: 0.66, accentCol: 2, rows: [
    ["파일 읽기 · 목록 보기", "안 뜬다", "—"],
    ["폴더 만들기 · 파일 저장", "뜬다", "무엇을 만드는지 보고 허용"],
    ["Python · 패키지 설치", "뜬다", "무엇을 설치하는지 보고 허용"],
    ["input 파일 수정 · 삭제", "뜬다", "거부 — 원본은 고치지 않는다"],
  ] });
  T.punch(s, [{ text: "모르는 명령이면 '이게 무슨 일을 하는 거야?'라고 먼저 묻습니다", color: C.red, size: 21 }], { y: 6.02 }); }

{ const s = S(); const cy = T.head(s, { eyebrow: eb(4), title: "Claude가 멈추고 묻는 것은 사람이 판단할 차례이기 때문입니다",
    sub: "Day2에서는 CLAUDE.md에 멈출 지점 세 곳을 적어 둔다", page: ++P });
  T.cards(s, [
    { cap: "① 데이터 수집 뒤", title: "집계기준 확정", sub: "판매인가, 등록인가" },
    { cap: "② VOC 분류 중", title: "키워드 묶기 확정", sub: "충전소 부족 = 충전 대기?" },
    { kind: "dark", cap: "③ 제출 전", title: "역검토 확인", sub: "가상을 사실처럼 썼나" },
  ], { y: cy, h: 2.00 });
  T.punch(s, [
    { text: "Claude는 자료를 읽고 정리하지만, 무엇을 기준으로 삼을지는 업무 담당자가 정합니다", color: C.teal, size: 20 },
    { text: "멈춤은 고장이 아니라 확인 요청입니다", color: C.red, size: 23 },
  ], { y: cy + 2.40 }); }

{ const s = S(); const cy = T.head(s, { eyebrow: eb(4), title: "GitHub 저장소는 인터넷에 올려 둔 공유 폴더입니다",
    sub: "과정 저장소: github.com/keerhee/kma-auto-genai-3-1", page: ++P });
  T.flow3(s, [
    { kind: "white", cap: "강사", lines: [{ text: "자료와 스킬을", fs: 20 }, { text: "저장소에 올린다", fs: 20 }] },
    { kind: "dark", cap: "저장소", lines: [{ text: "원본: data/Day2", fs: 18 }, { text: "스킬: Day2/ClaudeCode", fs: 18 }] },
    { kind: "lime", cap: "내 폴더", lines: [{ text: "Claude Code가", fs: 20 }, { text: "받아서 넣는다", fs: 20 }] },
  ], { y: cy + 0.10, h: 2.60, gap: 0.80 });
  T.punch(s, [
    { text: "수강생은 받기만 합니다 — 저장소에 올리거나 계정을 만들 필요는 없습니다", color: C.teal, size: 20 },
    { text: "강사가 스킬을 고치면 '저장소에서 받아 비교해줘' 한 줄로 내 폴더를 맞춥니다", color: C.teal, size: 20 },
  ], { y: 5.40 }); }

{ const s = S(); const cy = T.head(s, { eyebrow: eb(4), title: "결과를 받으면 세 가지만 확인합니다",
    sub: "예: output/01_EV시장_Top5.xlsx를 받았을 때", page: ++P });
  T.cards(s, [
    { cap: "① 파일", title: "생겼나", sub: "탐색기에서 output 확인" },
    { cap: "② 숫자", title: "원본과 맞나", sub: "엑셀 9,638 ↔ CSV 9638" },
    { kind: "dark", cap: "③ 기준", title: "적혀 있나", sub: "기준·기간·출처 한 줄" },
  ], { y: cy, h: 2.00 });
  T.punch(s, [{ text: "Claude가 만든 숫자도 사람이 한 번은 원본과 맞춰 봅니다", color: C.red, size: 23 }], { y: cy + 2.40 }); }

/* 한 장 요약 */
panelFig({ eb: "CLAUDE CODE 기초 지식 · 요약", title: "이 덱의 내용을 한 장으로 보면 이 폴더 구조입니다",
  sub: "실습 가이드 STEP 04에서 이 구조를 만들고, STEP 10에서 채워진 모습을 확인한다",
  path: "fig/t3_meaning.png",
  panel: { cap: "세 가지 문서", bullets: ["CLAUDE.md = 규칙", "SKILL.md = 순서", "스크립트 = 계산"], foot: "input은 고치지 않는다" },
  punch: [{ text: "다음은 실습 가이드에서 이 폴더를 직접 만듭니다", color: C.teal, size: 20 }] });

/* 마감 */
T.closing(S(), {
  statements: ["폴더를 네 칸으로 나눕니다.", "규칙은 CLAUDE.md에 적습니다.", "반복하는 일은 스킬로 남깁니다."],
  message: "다음 덱에서 이 폴더를\n직접 만들어 봅니다.",
  contacts: [],
});

T.save("Claude_Code_기초지식.pptx").then(() => console.log("saved Claude_Code_기초지식.pptx"));
