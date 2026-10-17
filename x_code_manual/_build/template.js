/* ============================================================================
 * zeroone-pitch-deck — 검증된 헬퍼 템플릿 (v1.5)
 *
 * 톤: 다크 잉크(#071A1D) 표지·마감 + 아이보리(#F7F5F0) 본문 + 라임(#B7F34A) 포인트.
 *     eyebrow(티일 소캡) → 큰 제목 → 굵은 잉크 룰선 → 부제 → 카드/다이어그램 →
 *     하단 punch(한 줄 결론) → 좌하단 워드마크 + 우하단 쪽번호.
 *
 * 사용법:
 *   const T = require("./template.js");
 *   T.setBrand({ eyebrow:"과정명 · 섹션", wordmark:"" });   // 워드마크·로고는 넣지 않는다
 *   const s = T.slide();  const cy = T.head(s,{title:"...", sub:"...", page:3});
 *   ... 헬퍼로 콘텐츠 ...
 *   T.save("out.pptx");
 * ========================================================================== */

const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.defineLayout({ name: "W", width: 13.333, height: 7.5 });
p.layout = "W";

// ---- 컬러 (절대 골격) -------------------------------------------------------
const C = {
  ink:    "071A1D",  // 표지·마감 배경, 다크 카드 (PRIMARY DARK)
  paper:  "F7F5F0",  // 본문 배경 (아이보리) — 순백 아님
  white:  "FFFFFF",  // 카드 면
  lime:   "B7F34A",  // 강조 카드·다크카드 제목·최종 결론 (PRIMARY ACCENT)
  teal:   "0B6B68",  // eyebrow·화살표·룰선·소제목 (SECONDARY)
  body:   "102027",  // 본문 텍스트·제목
  red:    "C00000",  // 슬라이드당 1회, 최강 punch 전용
  blue:   "4677F5",  // 보조 칩·보조 막대
  amber:  "F3A33C",  // 각주·주의(※) 전용
  muted:  "64757D",  // 캡션·부제·푸터
  hair:   "DDE3E2",  // 카드 테두리·구분선
  limeInk:"071A1D",  // 라임 카드 위 글자
};
const F = "Noto Sans CJK KR";

// ---- 레이아웃 상수 ----------------------------------------------------------
const SW = 13.333, SH = 7.5;
const M = 0.72;              // 좌우 여백
const CW = 11.79;            // 콘텐츠 폭 (우측 끝 12.51)
const Y_EYEBROW = 0.32, Y_TITLE = 0.70, Y_RULE = 1.42, Y_SUB = 1.60;
const CY_NOSUB = 1.90, CY_SUB = 2.28;   // 본문 시작 y
const Y_FOOT = 7.00;
const CB = 5.90;             // 콘텐츠 하한(punch 영역 시작) — 카드는 여기를 넘지 않는다

// ---- 폰트 크기 (하한 16pt · chrome 예외) ------------------------------------
const BODY_MIN = 16;   // 본문 콘텐츠 폰트 하한 — 자동 축소도 이 밑으로는 못 내려간다

// ---- 줄 간격 (§1.6) ---------------------------------------------------------
// 줄간격을 백분율(lineSpacingMultiple → OOXML lnSpc spcPct)로 주면 실제 피치는
// "글꼴 기준 행간 × 백분율"이 된다. 기준 행간은 글꼴 메트릭에서 나오는 값이라
// 코드에 안 보이고, 글꼴이나 뷰어가 바뀌면 같이 바뀐다. 그래서 높이를 계산해
// 쌓는 블록에서 계산값과 렌더값이 어긋나기 쉽다 — GH교육 13개 덱에서 피치를
// 글자크기의 1.42배로 가정했다가 실측치와 어긋나 337건이 겹쳤다.
//
// 해법은 피치를 절대값(spcPts)으로 박는 것이다. "쓴 숫자 = 그려지는 피치"가
// 되어 높이 계산이 정확해진다.
//
// BASE_LH는 Noto Sans CJK KR의 기준 행간 실측값이다.
// (LibreOffice 26.07: spcPct 100% → 16pt에서 19.15pt, 곧 글자크기의 1.197배.
//  122%는 23.35pt, 128%는 24.55pt로 백분율이 정확히 곱해진다.)
// 기존 장표의 겉모습을 그대로 두려고, 각 호출부는 예전에 쓰던 백분율을 mult로 넘긴다.
const BASE_LH = 1.197;
/** 절대 줄간격 옵션. txt(...,{fontSize:fs, ...lsp(fs,1.28)}) 처럼 편다. */
const lsp = (fs, mult) => ({ lineSpacing: Math.round(fs * BASE_LH * mult * 10) / 10 });
/** n줄이 차지하는 높이(in). 줄 수 추정(wUnits)이 ±3% 틀리므로 여유를 더한다. */
const linesH = (n, fs, mult) => n * (fs / 72) * BASE_LH * mult * 1.03;

const S = {
  eyebrow: 11,   // chrome 예외
  title:   30,
  titleSm: 26,   // 제목이 2줄로 넘칠 때
  sub:     16,
  cardT:   21,   // 카드 제목
  cardB:   17,   // 카드 본문·불릿
  cardCap: 14,   // 카드 상단 라벨 (chrome 예외)
  label:   13,   // 표/카드 행 라벨 (chrome 예외)
  value:   17,   // 표/카드 행 값
  big:     26,   // 큰 숫자·큰 단어
  huge:    40,   // 표지·마감 statement
  punch:   22,   // 하단 결론 한 줄
  punchBig:26,   // 하단 최강 결론
  note:    13,   // ※ 각주 (chrome 예외)
  foot:    10,   // 푸터·쪽번호 (chrome 예외)
};

// ---- 브랜드 -----------------------------------------------------------------
let BRAND = { eyebrow: "SECTION", wordmark: "", wordmarkSize: 20, logo: null };   // v1.7: 워드마크·로고 기본값 없음 — 사용자가 명시적으로 요청할 때만 setBrand로 채운다
function setBrand(o){ Object.assign(BRAND, o); }

// ============================================================================
// 기본 도형
// ============================================================================
function slide(dark){
  const s = p.addSlide();
  s.background = { color: dark ? C.ink : C.paper };
  return s;
}
function rect(s,x,y,w,h,fill,line){
  s.addShape(p.ShapeType.rect,{x,y,w,h,fill:{color:fill},line:line||{type:"none"}});
}
function card(s,x,y,w,h,kind){
  // kind: "white"(기본) | "dark" | "lime" | "ghost"
  if(kind==="dark")      rect(s,x,y,w,h,C.ink);
  else if(kind==="lime") rect(s,x,y,w,h,C.lime);
  else if(kind==="ghost")rect(s,x,y,w,h,C.paper,{color:C.hair,width:1});
  else                   rect(s,x,y,w,h,C.white,{color:C.hair,width:1});
}
function hline(s,x,y,w,color,wt){
  s.addShape(p.ShapeType.line,{x,y,w,h:0,line:{color:color||C.hair,width:wt||1}});
}
function arrowR(s,x,y,w,color,wt){
  s.addShape(p.ShapeType.line,{x,y,w,h:0,
    line:{color:color||C.teal,width:wt||2.5,endArrowType:"triangle"}});
}
function txt(s,t,o){ s.addText(t,Object.assign({fontFace:F,color:C.body},o)); }

// ---- 폭 계산 유틸 (오버플로 자동 방지) --------------------------------------
// 한글 1.0em · 라틴/숫자 0.52em · 공백 0.30em 로 근사한다.
function _cls(ch){
  const c=ch.codePointAt(0);
  if(ch===" ") return "sp";
  // 전각 폭으로 렌더되는 글자: 한글·한자·가나·전각기호 + 화살표·수학기호·전각따옴표·가운뎃점
  if((c>=0x1100&&c<=0x11FF)||(c>=0x2E80&&c<=0x9FFF)||(c>=0xAC00&&c<=0xD7AF)||(c>=0xFF00&&c<=0xFF60)
     ||(c>=0x2190&&c<=0x21FF)||(c>=0x2200&&c<=0x22FF)||(c>=0x2018&&c<=0x201D)
     ||c===0x00D7||c===0x00B7||c===0x2022||c===0x2026) return "w";
  return "n";
}
function wUnits(t){
  let u=0, prev=null;
  for(const ch of String(t)){
    if(ch==="\n"){ prev=null; continue; }
    const k=_cls(ch);
    // 라틴·숫자 0.55 — 0.52로 잡았더니 순수 라틴 문자열에서 모델이 실제보다
    // 좁게 나와(예: "Qwen3.8-Flash-Next" 실측 대비 −2%) 한 줄로 들어간다고
    // 착각하고 두 줄로 접히는 사고가 났다. 한글은 이미 10~30% 여유가 있다.
    u += k==="w" ? 1.0 : k==="sp" ? 0.30 : 0.55;
    // 한글↔라틴 경계는 렌더러가 자간을 벌린다 — 그만큼 폭을 더 잡아준다
    if(prev && prev!=="sp" && k!=="sp" && prev!==k) u += 0.20;
    prev = k;
  }
  return u*1.07;   // 안전계수 (PowerPoint/LibreOffice 렌더 차이 흡수)
}
/** 주어진 폭(in)·허용 줄수 안에 들어가는 최대 폰트(pt). maxFs 상한, minFs 하한. */
/**
 * 본문 클래스 전용 자동 축소 — 하한 16pt를 절대 깨지 않는다.
 * 16pt로도 안 들어가면 축소 대신 경고를 찍는다(= 문구를 줄이거나 상자를 키울 일).
 * chrome(라벨·캡션·각주·eyebrow·쪽번호)은 fitFs를 직접 쓴다.
 */
function fitBody(text,widthIn,maxFs,ctx,lines){
  const want = fitFs(text,widthIn,maxFs,1,lines);
  if(want < BODY_MIN){
    console.warn(`[${ctx||"body"}] 16pt에 안 들어갑니다 (필요 ${want}pt): "${String(text).slice(0,24)}" `
      + `— 문구를 줄이거나 상자를 ${(widthIn*BODY_MIN/Math.max(want,1)).toFixed(2)}in 이상으로 키우세요.`);
    return BODY_MIN;
  }
  return want;
}
function fitFs(text,widthIn,maxFs,minFs,lines){
  lines = lines||1;
  const parts=String(text).split("\n");
  const u = Math.max(...parts.map(wUnits))/(parts.length>1?1:lines);
  if(u<=0) return maxFs;
  const fs = widthIn*72/u;
  return Math.max(minFs||12, Math.min(maxFs, Math.floor(fs*2)/2));
}

// ============================================================================
// 헤더 / 푸터
// ============================================================================
function footer(s,page,dark){
  const col = dark ? C.white : C.body;
  if(BRAND.logo) s.addImage({path:BRAND.logo,x:M,y:Y_FOOT-0.02,h:0.34,w:1.5});
  else if(BRAND.wordmark) txt(s,BRAND.wordmark,{x:M,y:Y_FOOT,w:6,h:0.34,fontSize:BRAND.wordmarkSize||20,color:col,valign:"middle"});
  if(page!=null)
    txt(s,String(page).padStart(2,"0"),
      {x:M+CW-1,y:Y_FOOT+0.06,w:1,h:0.26,align:"right",fontSize:S.foot,color:C.muted});
}

/** 본문 슬라이드 헤더. 반환값 = 본문 시작 y */
function head(s,o){
  txt(s,o.eyebrow||BRAND.eyebrow,
    {x:M,y:Y_EYEBROW,w:CW,h:0.26,fontSize:S.eyebrow,bold:true,color:C.teal,charSpacing:0.6});
  // 제목은 폭에 맞춰 자동 축소한다 — 두 줄로 넘겨 룰선을 침범하는 사고를 원천 차단.
  let fs = fitFs(o.title, CW-0.10, o.titleSm?S.titleSm:S.title, 21);
  let ty=Y_TITLE, th=0.62;
  if(fs<=21){ // 한 줄로 못 담는 초장문 — 2줄 허용하고 제목 블록을 위로 올린다
    fs = fitFs(o.title, CW-0.10, S.titleSm, 19, 2);
    ty=0.48; th=0.90;
  }
  const tfs=o.fs||fs;
  txt(s,o.title,{x:M,y:ty,w:CW,h:th,fontSize:tfs,bold:true,color:C.body,
    valign:"middle",...lsp(tfs,1.12)});
  hline(s,M,Y_RULE,CW,C.body,1.75);
  let cy = CY_NOSUB;
  if(o.sub){
    txt(s,o.sub,{x:M+0.08,y:Y_SUB,w:CW-0.08,h:0.36,fontSize:S.sub,color:C.muted,valign:"middle"});
    cy = CY_SUB;
  }
  footer(s,o.page,false);
  return cy;
}

// ============================================================================
// 표지 / 섹션 디바이더 / 마감
// ============================================================================
/** 표지: 좌측 큰 제목 + 부제, 우측 라임 세로 체인 패널(선택) */
function cover(s,o){
  s.background = { color: C.ink };
  const ctfs=o.titleSize||42;
  txt(s,o.title,{x:M+0.08,y:o.chain?2.00:2.40,w:7.6,h:1.60,fontSize:ctfs,
    bold:true,color:C.white,...lsp(ctfs,1.22),valign:"middle"});
  if(o.sub) txt(s,o.sub,{x:M+0.08,y:o.chain?3.85:4.25,w:7.6,h:0.42,fontSize:18,color:"9FB0B2"});
  if(o.org) txt(s,o.org,{x:M-0.06,y:6.60,w:6,h:0.40,fontSize:18,bold:true,color:C.white,valign:"middle"});
  if(BRAND.logo) s.addImage({path:BRAND.logo,x:9.55,y:6.45,h:0.60,w:2.95});
  else if(BRAND.wordmark) txt(s,BRAND.wordmark,{x:7.0,y:6.52,w:5.5,h:0.50,align:"right",
    fontSize:fitFs(BRAND.wordmark,5.3,34,12),color:C.white});

  // 우측 라임 체인 패널: ["GPU","LLM","TOKEN"] 형태
  if(o.chain){
    const bx=9.17,by=1.05,bw=2.71,bh=4.47;
    rect(s,bx,by,bw,bh,C.lime);
    const n=o.chain.length, step=bh/(n*2-1);
    o.chain.forEach((t,i)=>{
      const last = i===n-1;
      // 슬롯이 박스 높이를 정확히 n등분하도록 오프셋을 두지 않는다 (위아래 여백 균등)
      txt(s,t,{x:bx,y:by+step*(2*i),w:bw,h:step,align:"center",valign:"middle",
        fontSize:last?24:18,bold:true,color:last?C.red:C.limeInk});
      if(i<n-1) txt(s,"↓",{x:bx,y:by+step*(2*i+1),w:bw,h:step,
        align:"center",valign:"middle",fontSize:20,color:C.limeInk});
    });
  }
}

/** 섹션 디바이더: 다크 배경 + 큰 번호 + 라임 제목 */
function divider(s,o){
  s.background = { color: C.ink };
  txt(s,o.num,{x:M,y:2.30,w:3.2,h:1.5,fontSize:88,bold:true,color:C.lime,valign:"bottom"});
  txt(s,o.title,{x:M,y:3.78,w:CW,h:0.76,
    fontSize:fitFs(o.title,CW-0.10,38,22),bold:true,color:C.white,valign:"middle"});
  hline(s,M,4.66,4.2,C.teal,3);
  if(o.sub) txt(s,o.sub,{x:M,y:4.84,w:CW,h:0.42,
    fontSize:fitFs(o.sub,CW-0.10,18,13),color:"9FB0B2"});
  footer(s,o.page,true);
}

/** 마감: 다크 배경 + statement 3줄(마지막 라임) + 하단 메시지/로고 */
function closing(s,o){
  s.background = { color: C.ink };
  const lines = o.statements||[];
  lines.forEach((t,i)=>{
    const last = i===lines.length-1;
    txt(s,t,{x:M+0.10,y:1.35+i*0.88,w:CW,h:0.62,fontSize:26,bold:true,
      color:last?C.lime:C.white,valign:"middle"});
  });
  hline(s,M,4.28,11.45,C.teal,1);
  if(o.message) txt(s,o.message,{x:M+0.10,y:4.72,w:6.4,h:1.10,fontSize:24,bold:true,
    color:C.white,...lsp(24,1.22),valign:"middle"});
  if(BRAND.logo) s.addImage({path:BRAND.logo,x:7.60,y:4.55,h:0.75,w:3.60});
  else if(BRAND.wordmark) txt(s,BRAND.wordmark,{x:7.0,y:4.55,w:5.3,h:0.62,align:"center",
    fontSize:fitFs(BRAND.wordmark,5.2,40,14),color:C.white});
  (o.contacts||[]).forEach((t,i)=>
    txt(s,t,{x:7.0,y:5.40+i*0.40,w:5.3,h:0.36,align:"center",fontSize:18,bold:true,color:C.white}));
  if(o.note){ const nfs=fitFs(o.note,CW-0.30,S.note,10,2);
    txt(s,o.note,{x:M+0.10,y:6.38,w:CW-0.20,h:0.46,
      fontSize:nfs,color:"8A9A9C",...lsp(nfs,1.15)}); }
}

// ============================================================================
// 목차
// ============================================================================
/** rows: [{num,title,kicker,desc}] — 최대 5행 */
function agenda(s,rows,o){
  o=o||{};
  const y0 = o.y||2.18, rowH = o.rowH || Math.min(0.98,(CB-y0)/rows.length);
  rows.forEach((r,i)=>{
    const y = y0 + i*rowH;
    txt(s,r.num,{x:M,y,w:0.8,h:rowH-0.10,fontSize:20,bold:true,color:C.muted,valign:"middle"});
    hline(s,M+0.85,y+(rowH-0.10)/2,0.90, i===rows.length-1?C.lime:C.hair, 2.5);
    txt(s,r.title,{x:M+2.10,y,w:4.3,h:rowH-0.10,
      fontSize:fitBody(r.title,4.2,20,"agenda.title"),bold:true,color:C.body,valign:"middle"});
    txt(s,r.kicker,{x:M+6.30,y:y,w:5.2,h:(rowH-0.10)/2,fontSize:16,bold:true,color:C.teal,valign:"bottom"});
    txt(s,r.desc,{x:M+6.30,y:y+(rowH-0.10)/2,w:5.2,h:(rowH-0.10)/2,fontSize:15,color:C.muted,valign:"top"});
    if(i<rows.length-1) hline(s,M,y+rowH-0.05,CW,C.hair,1);
  });
}

// ============================================================================
// 카드 그리드
// ============================================================================
/** n등분 카드 좌표 계산 → [{x,w}] */
function grid(n,gap){
  gap = gap==null ? 0.41 : gap;
  const w = (CW - gap*(n-1))/n;
  return Array.from({length:n},(_,i)=>({x:M+i*(w+gap), w}));
}

/**
 * 카드 그리드.
 * items: [{kind,cap,title,value,rows:[[label,value]],bullets:[],note}]
 *   kind: "white"|"dark"|"lime"|"ghost"
 * o: {y,h,gap,connect:true(카드 사이 티일 커넥터)}
 */
function cards(s,items,o){
  o=o||{};
  const y=o.y||CY_NOSUB+0.10, h=o.h||3.60, g=grid(items.length,o.gap);
  items.forEach((it,i)=>{
    const {x,w}=g[i], dark=it.kind==="dark", lime=it.kind==="lime";
    card(s,x,y,w,h,it.kind||"white");
    const fg   = dark?C.white : C.body;
    const tcol = it.titleColor || (dark?C.lime : lime?C.limeInk : C.body);
    const mut  = dark?"9FB0B2" : C.muted;
    // cap/title/sub만 있는 카드는 블록을 세로 중앙에 놓아 위아래 여백을 같게 맞춘다.
    // (rows/bullets/value/note가 있으면 기존처럼 위에서부터 쌓는다)
    const _simple = !it.rows && !it.bullets && !it.value && !it.note;
    const _adv = {cap:0.42, title:0.56, sub:0.46}, _own = {cap:0.30, title:0.44, sub:0.34};
    const _keys = ["cap","title","sub"].filter(k=>it[k]);
    let _blockH = 0;
    _keys.forEach((k,j)=>{ _blockH += (j===_keys.length-1) ? _own[k] : _adv[k]; });
    // 카드가 블록보다 낮으면 중앙 정렬로도 넘친다 — 축소가 아니라 경고로 알린다
    if(_simple && _blockH + 0.14 > h)
      console.warn(`[card] 카드가 낮아 내용이 넘칩니다 (현재 ${h.toFixed(2)}in) `
        + `— ${_keys.join("+")} 를 넣으려면 h를 ${(_blockH+0.28).toFixed(2)} 이상으로 키우세요.`);
    let cy = _simple ? y + Math.max(0.14,(h-_blockH)/2) : y+0.28;
    if(it.cap){ txt(s,it.cap,{x:x+0.36,y:cy,w:w-0.72,h:0.30,fontSize:S.cardCap,bold:true,color:dark?C.lime:mut,valign:"middle"}); cy+=0.42; }
    if(it.title){ txt(s,it.title,{x:x+0.36,y:cy,w:w-0.72,h:0.44,
      fontSize:fitBody(it.title,w-0.76,it.titleSize||S.cardT,"card.title"),bold:true,color:tcol,valign:"middle"}); cy+=0.56; }
    if(it.sub){ txt(s,it.sub,{x:x+0.36,y:cy,w:w-0.72,h:0.34,
      fontSize:fitBody(it.sub,w-0.76,16,"card.sub"),color:mut,valign:"middle"}); cy+=0.46; }
    if(it.rows){
      const rh=Math.min(0.70,(y+h-0.35-cy)/it.rows.length);
      it.rows.forEach((r,j)=>{
        const ry=cy+j*rh;
        const vw=w-1.54;
        txt(s,r[0],{x:x+0.28,y:ry,w:0.92,h:rh-0.06,fontSize:S.label,color:mut,valign:"middle"});
        txt(s,r[1],{x:x+1.26,y:ry,w:vw,h:rh-0.06,
          fontSize:fitBody(r[1],vw-0.08,S.value,"card.row"),bold:!!r[2],color:fg,valign:"middle"});
      });
      cy += rh*it.rows.length;
    }
    if(it.bullets){
      // 하단 value/note 영역을 먼저 예약한 뒤 남는 높이에 맞춰 16pt까지만 줄인다
      const resv = (it.value?1.00:0) + (it.note?0.50:0);
      const availH = (y+h-0.24) - cy - resv;
      const bw = w-0.76, wrapW = bw-0.52;
      let fs = it.bulletFs || S.cardB;
      const nlines = f => it.bullets.reduce((a,b)=>a+Math.max(1,Math.ceil(wUnits(b)*f/72/wrapW)),0);
      while(fs>BODY_MIN && linesH(nlines(fs),fs,1.28) > availH) fs -= 0.5;
      if(linesH(nlines(fs),fs,1.28) > availH)
        console.warn(`[card.bullets] 16pt로 ${nlines(fs)}줄이 안 들어갑니다 `
          + `(가용 ${availH.toFixed(2)}in) — 문구를 줄이거나 카드 높이를 `
          + `${(h + nlines(fs)*0.33 - availH).toFixed(2)}in 이상으로 키우세요.`);
      txt(s,it.bullets.map(b=>({text:b,options:{bullet:{code:"2022"},breakLine:true}})),
        {x:x+0.40,y:cy,w:bw,h:Math.max(availH,0.34),fontSize:fs,color:fg,
         valign:"top",...lsp(fs,1.28)});
    }
    // 하단 블록은 note → value 순으로 아래에서부터 쌓아 서로 겹치지 않게 한다
    const noteH = it.note ? 0.44 : 0;
    const valH  = it.value ? 0.60 : 0;
    const noteY = y+h-0.14-noteH;
    const valY  = noteY - valH;
    if(it.value && cy > valY + 0.04)
      console.warn(`[card] 카드가 낮아 본문과 하단 숫자가 겹칩니다 `
        + `("${String(it.title||it.value).slice(0,16)}") — 높이를 `
        + `${(h + (cy - valY) + 0.06).toFixed(2)}in 이상으로 키우거나 부제/불릿을 빼세요.`);
    if(it.value)
      txt(s,it.value,{x:x+0.36,y:valY,w:w-0.72,h:valH,
        fontSize:fitBody(it.value,w-0.76,it.valueSize||S.big,"card.value"),
        bold:true,color:it.valueColor||(dark?C.lime:C.teal),valign:"middle"});
    if(it.note)
      { const nfs=fitFs(it.note,w-0.78,S.note,10,2);
        txt(s,it.note,{x:x+0.36,y:noteY,w:w-0.72,h:noteH,
          fontSize:nfs,color:mut,valign:"middle",...lsp(nfs,1.12)}); }
    if(o.connect && i<items.length-1)
      hline(s,x+w,y+h/2,g[i+1].x-(x+w),C.teal,2.5);
  });
  return y+h;
}

/** 캡션 + 큰 값 한 줄짜리 통계 카드 (계산 근거 스트립용) */
function statCards(s,items,o){
  o=o||{};
  const y=o.y||CY_SUB+0.20, h=o.h||1.05, g=grid(items.length,o.gap==null?0.28:o.gap);
  items.forEach((it,i)=>{
    const {x,w}=g[i];
    card(s,x,y,w,h,"white");
    const _t = Math.max(0.10,(h-0.78)/2);   // 위아래 여백 균등
    txt(s,it.cap,{x,y:y+_t,w,h:0.30,align:"center",
      fontSize:fitFs(it.cap,w-0.20,S.label+2,11),color:C.muted,valign:"middle"});
    txt(s,it.value,{x,y:y+_t+0.34,w,h:0.44,align:"center",
      fontSize:fitBody(it.value,w-0.24,22,"statCard.value"),bold:true,color:C.teal,valign:"middle"});
  });
  return y+h;
}

// ============================================================================
// 다이어그램
// ============================================================================
/** 화살표로 이어진 파이프라인 박스 (마지막 박스 라임) */
function pipeline(s,items,o){
  o=o||{};
  const y=o.y||2.45, h=o.h||1.40, n=items.length, gap=o.gap||0.35;
  const w=(CW-gap*(n-1))/n;
  items.forEach((t,i)=>{
    const x=M+i*(w+gap), last=i===n-1 && o.limeLast!==false;
    card(s,x,y,w,h,last?"lime":"white");
    txt(s,t,{x:x+0.05,y,w:w-0.10,h,align:"center",valign:"middle",
      fontSize:fitBody(t,w-0.14,o.fs||16,"pipeline",t.includes("\n")?1:2),bold:true,color:C.body});
    if(i<n-1) arrowR(s,x+w+0.04,y+h/2,gap-0.08,C.teal,2.5);
  });
  return y+h;
}

/** 좌 white 카드 → 화살표 → 우 dark 카드 (라벨 선택) */
function pairPanels(s,L,R,o){
  o=o||{};
  const y=o.y||2.00, h=o.h||3.55, w=o.w||4.90, gap=(CW-2*w);
  const lx=M, rx=M+CW-w;
  card(s,lx,y,w,h,L.kind||"white");
  card(s,rx,y,w,h,R.kind||"dark");
  _panelBody(s,L,lx,y,w,h);
  _panelBody(s,R,rx,y,w,h);
  const my=y+h/2;
  if(o.centerLabel) txt(s,o.centerLabel,{x:lx+w,y:my-0.52,w:gap,h:0.34,align:"center",
    fontSize:16,color:C.muted,valign:"middle"});
  // 가운데 여백이 좁으면 화살표를 생략한다 (음수 폭 → 화살표가 뒤집히는 사고 방지)
  if(o.arrow!==false && gap>=1.40) arrowR(s,lx+w+0.42,my,gap-0.84,C.teal,2.5);
  return y+h;
}
function _panelBody(s,it,x,y,w,h){
  const isDark = it.kind==="dark";
  const fg=isDark?C.white:C.body, mut=isDark?"9FB0B2":C.muted;
  const PAD=0.36, iw=w-PAD*2;
  let cy=y+0.28;
  if(it.cap){
    txt(s,it.cap,{x:x+PAD,y:cy,w:iw,h:0.32,fontSize:fitFs(it.cap,iw,S.cardCap+2,12),bold:true,
      color:isDark?C.lime:mut,valign:"middle"});
    cy+=0.50;
  }
  if(it.title){
    const tfs=fitBody(it.title,iw,it.titleSize||24,"panel.title",it.title.includes("\n")?1:2);
    const th = it.title.includes("\n")||wUnits(it.title)*tfs/72>iw ? 0.95 : 0.52;
    txt(s,it.title,{x:x+PAD,y:cy,w:iw,h:th,fontSize:tfs,bold:true,
      color:it.titleColor||(isDark?C.white:C.body),valign:"top",...lsp(tfs,1.18)});
    cy+=th+0.14;
  }
  // 하단 예약 영역 (footCap + foot) 을 먼저 확보한 뒤 남는 공간에 불릿을 넣는다
  const footH = (it.foot?0.86:0) + (it.footCap?0.30:0);
  const availH = (y+h-0.26) - cy - footH;
  if(it.bullets){
    if(availH < 0.45) console.warn("[panel] 불릿 넣을 공간이 부족합니다 — 카드 높이를 키우거나 항목을 줄이세요.");
    const bw=iw-0.10;
    let fs = it.bulletFs || S.cardB;
    const wrapW = bw-0.62;   // 불릿 기호 들여쓰기 + 렌더 여유
    const lines = f => it.bullets.reduce((a,b)=>a+Math.max(1,Math.ceil(wUnits(b)*f/72/wrapW)),0);
    while(fs>BODY_MIN && linesH(lines(fs),fs,1.28) > availH) fs -= 0.5;   // 16pt 하한
    if(linesH(lines(fs),fs,1.28) > availH)
      console.warn(`[panel.bullets] 16pt로 ${lines(fs)}줄이 안 들어갑니다 `
        + `(가용 ${availH.toFixed(2)}in) — 불릿을 12자 이내·3개 이하로 줄이거나 카드 높이를 키우세요.`);
    txt(s,it.bullets.map(b=>({text:b,options:{bullet:{code:"2022"},breakLine:true}})),
      {x:x+PAD+0.04,y:cy,w:bw,h:Math.max(availH,0.4),fontSize:fs,color:fg,
       valign:"top",...lsp(fs,1.28)});
  }
  let fy = y+h-0.26-footH;
  if(it.footCap){
    txt(s,it.footCap,{x:x+PAD,y:fy,w:iw,h:0.28,fontSize:S.label,color:mut,valign:"middle"});
    fy+=0.30;
  }
  if(it.foot)
    { const ffs=fitBody(it.foot,iw,it.footSize||18,"panel.foot",2);
      txt(s,it.foot,{x:x+PAD,y:fy,w:iw,h:0.86,fontSize:ffs,
        bold:true,color:isDark?C.lime:C.teal,valign:"middle",...lsp(ffs,1.15)}); }
}

/** 3단 흐름: 카드 → 카드 → 카드 (화살표 연결). items[i].kind로 색 지정 */
function flow3(s,items,o){
  o=o||{};
  const y=o.y||2.00, h=o.h||3.50, gap=o.gap||0.90;
  const w=(CW-gap*(items.length-1))/items.length;
  items.forEach((it,i)=>{
    const x=M+i*(w+gap);
    card(s,x,y,w,h,it.kind||"white");
    const isDark=it.kind==="dark";
    const fg=isDark?C.white:C.body;
    const lines=it.lines||[];
    // 상단 여백(cap 0.24)과 같은 크기의 하단 여백을 확보한 뒤 남는 높이를 n등분한다
    const _top = it.cap ? 0.62 : 0.24, _bot = 0.24;
    const lh=(h-_top-_bot)/Math.max(lines.length,1);
    if(it.cap) txt(s,it.cap,{x,y:y+0.24,w,h:0.34,align:"center",fontSize:16,bold:true,
      color:isDark?C.lime:(it.kind==="lime"?C.limeInk:C.muted),valign:"middle"});
    lines.forEach((L,j)=>{
      const t=typeof L==="string"?{text:L}:L;
      txt(s,t.text,{x:x+0.12,y:y+_top+j*lh,w:w-0.24,h:lh,align:"center",valign:"middle",
        fontSize:fitBody(t.text,w-0.30,t.fs||18,"flow3"),bold:t.bold!==false,color:t.color||fg});
    });
    if(i<items.length-1) arrowR(s,x+w+0.14,y+h/2,gap-0.28,C.teal,2.5);
  });
  return y+h;
}

/** 허브: 상단 좌우 white 카드 2장 + 중앙 하단 dark 허브 카드 */
function hub(s,L,R,H,o){
  o=o||{};
  const ty=o.y||2.20, th=1.40, cw=4.20;
  card(s,M+0.30,ty,cw,th,"white");
  card(s,M+CW-cw-0.30,ty,cw,th,"white");
  [[M+0.30,L],[M+CW-cw-0.30,R]].forEach(([x,it])=>{
    txt(s,it.title,{x,y:ty+0.22,w:cw,h:0.48,align:"center",fontSize:22,bold:true,color:C.body,valign:"middle"});
    txt(s,it.sub,{x,y:ty+0.78,w:cw,h:0.36,align:"center",fontSize:16,color:C.muted,valign:"middle"});
  });
  const hy=ty+2.10, hw=3.60, hx=M+(CW-hw)/2;
  hline(s,M+2.40,ty+1.75,CW-4.80,C.hair,1);
  card(s,hx,hy,hw,1.55,"dark");
  txt(s,H.title,{x:hx,y:hy+0.22,w:hw,h:0.42,align:"center",fontSize:20,bold:true,color:C.lime,valign:"middle"});
  txt(s,H.sub,{x:hx+0.25,y:hy+0.70,w:hw-0.50,h:1.55-0.70-0.24,align:"center",fontSize:16,color:C.white,
    valign:"middle",...lsp(16,1.15)});
  return hy+1.55;
}

/** A × B = [라임 배지] 등식 슬라이드 */
function equation(s,o){
  const y=o.y||2.30;
  txt(s,o.a,{x:M,y,w:CW/2-0.6,h:0.70,align:"center",fontSize:28,bold:true,color:C.body,valign:"middle"});
  txt(s,o.op||"×",{x:M+CW/2-0.6,y,w:1.2,h:0.70,align:"center",fontSize:30,bold:true,color:C.teal,valign:"middle"});
  txt(s,o.b,{x:M+CW/2+0.6,y,w:CW/2-0.6,h:0.70,align:"center",fontSize:28,bold:true,color:C.body,valign:"middle"});
  txt(s,"=",{x:M+CW/2-2.6,y:y+1.20,w:1.2,h:0.70,align:"center",fontSize:30,bold:true,color:C.teal,valign:"middle"});
  const bw=o.badgeW||3.45, bx=M+(CW-bw)/2+0.75;
  rect(s,bx,y+1.05,bw,1.30,C.lime);
  txt(s,o.result,{x:bx,y:y+1.05,w:bw,h:1.30,align:"center",valign:"middle",
    fontSize:o.resultSize||22,bold:true,color:C.limeInk});
  return y+2.35;
}

/** 좌측 큰 statement + 우측 다크 바 스택 */
function statementStack(s,o){
  const y=o.y||2.10;
  txt(s,o.lead,{x:M+0.30,y,w:6.4,h:0.70,fontSize:30,bold:true,color:C.muted,valign:"middle"});
  txt(s,o.punch,{x:M+0.30,y:y+0.95,w:6.6,h:0.90,fontSize:38,bold:true,color:o.punchColor||C.red,valign:"middle"});
  const items=o.stack||[], bx=M+CW-4.0, bh=0.62, gp=0.16;
  items.forEach((t,i)=>{
    const it = typeof t==="string"?{text:t}:t;
    rect(s,bx,y-0.20+i*(bh+gp),4.0,bh,it.color||C.ink);
    txt(s,it.text,{x:bx,y:y-0.20+i*(bh+gp),w:4.0,h:bh,align:"center",valign:"middle",
      fontSize:15,bold:true,color:C.white});
  });
}

// ============================================================================
// 데이터
// ============================================================================
/**
 * 가로 막대 차트. items:[{label,value,shown,color}]  o:{y,h,max,barX,barW,note}
 */
function barsH(s,items,o){
  o=o||{};
  const y=o.y||CY_SUB+0.20, rowH=o.rowH||0.68;
  const bx=o.barX||(M+1.86), bw=o.barW||(o.right? o.right-bx : 6.55);
  const max=o.max||Math.max(...items.map(i=>i.value));
  items.forEach((it,i)=>{
    const ry=y+i*rowH, w=bw*it.value/max;
    const lw=bx-M-0.14;
    const lfs=fitBody(it.label,lw,o.labelFs||16,"bar.label",2);
    txt(s,it.label,{x:M,y:ry,w:lw,h:rowH-0.10,
      fontSize:lfs,bold:it.bold!==false,
      color:C.body,valign:"middle",...lsp(lfs,1.05)});
    rect(s,bx,ry+0.10,w,rowH-0.30,it.color||C.hair);
    const vtxt = it.shown!=null?it.shown:String(it.value);
    txt(s,vtxt,{x:bx+w+0.10,y:ry,w:o.valueW||1.15,h:rowH-0.10,
      fontSize:fitFs(vtxt,(o.valueW||1.15)-0.06,17,12),bold:true,color:C.body,valign:"middle"});
  });
  return y+items.length*rowH;
}

/** 다크 인사이트 박스 (막대차트 우측 등) */
function insightBox(s,o){
  const x=o.x||(M+CW-3.30), y=o.y||CY_SUB+0.20, w=o.w||3.30, h=o.h||3.55;
  card(s,x,y,w,h,"dark");
  txt(s,o.cap,{x:x+0.30,y:y+0.24,w:w-0.60,h:0.32,fontSize:15,bold:true,color:C.lime,valign:"middle"});
  const blocks=o.blocks||[];
  // 상단 0.70(cap 포함) · 하단 0.24 를 뺀 나머지를 균등 분할한다
  const bh=(h-0.70-0.24)/blocks.length;
  blocks.forEach((b,i)=>{
    const by=y+0.70+i*bh;
    // 제목 블록은 아래 desc가 고정 위치라, 배정 높이를 넘으면 그대로 덮는다.
    // 추정 줄 수가 배정 높이에 들어갈 때까지 줄인 뒤, 그래도 넘치면 알린다.
    const tw=w-0.60, tcap=bh*0.58;
    let tfs=fitBody(b.title,tw,b.fs||20,"insight.title",2);
    const tln=f=>String(b.title).split("\n")
      .reduce((a,q)=>a+Math.max(1,Math.ceil(wUnits(q)*f/72/tw)),0);
    while(tfs>BODY_MIN && linesH(tln(tfs),tfs,1.12)>tcap) tfs-=0.5;
    if(linesH(tln(tfs),tfs,1.12)>tcap)
      console.warn(`[insight.title] 제목 ${tln(tfs)}줄이 배정 높이 `
        + `${tcap.toFixed(2)}in에 안 들어갑니다 — 제목을 줄이거나 h를 키우세요: `
        + `"${String(b.title).replace(/\n/g," ").slice(0,26)}"`);
    txt(s,b.title,{x:x+0.30,y:by,w:tw,h:tcap,fontSize:tfs,bold:true,color:C.white,
      valign:"middle",...lsp(tfs,1.12)});
    txt(s,b.desc,{x:x+0.34,y:by+bh*0.60,w:w-0.68,h:bh*0.30,
      fontSize:fitFs(b.desc,w-0.72,15,13),color:"9FB0B2",valign:"middle"});
    if(i<blocks.length-1) hline(s,x+0.34,by+bh-0.04,w-0.68,"33474A",1);
  });
}

/**
 * 헤더 없는 라인 표 (시나리오 표). head:[..], rows:[[..]], o:{y,widths,emph}
 * emph: 강조할 행 index (라임/티일 볼드)
 */
function dataTable(s,head,rows,o){
  o=o||{};
  const y=o.y||CY_SUB+0.10, rowH=o.rowH||1.10;
  const n=head.length;
  const ws=o.widths||Array.from({length:n},()=>CW/n);
  const xs=[]; let acc=M; ws.forEach(w=>{xs.push(acc);acc+=w;});
  head.forEach((h,j)=>txt(s,h,{x:xs[j],y,w:ws[j],h:0.36,fontSize:S.label,color:C.muted,valign:"middle"}));
  rows.forEach((r,i)=>{
    const ry=y+0.50+i*rowH, on=o.emph===i;
    r.forEach((cell,j)=>txt(s,cell,{x:xs[j],y:ry,w:ws[j],h:rowH-0.20,
      fontSize:fitBody(cell,ws[j]-0.20,j===0?19:(on?21:20),"table.cell"),bold:true,
      color:on?C.teal:(j===0?C.body:C.muted),valign:"middle"}));
    if(i<rows.length-1) hline(s,M,ry+rowH-0.16,CW,C.hair,1);
  });
  hline(s,M,y+0.50+rows.length*rowH-0.16,CW,C.hair,1);
  return y+0.50+rows.length*rowH;
}

/** 다크 결과 바 (계산 결론) */
function resultBar(s,o){
  const y=o.y||4.28, h=o.h||1.50;
  card(s,M,y,CW,h,"dark");
  txt(s,o.cap,{x:M+0.42,y:y+0.22,w:5,h:0.30,fontSize:S.label+2,color:"9FB0B2",valign:"middle"});
  txt(s,o.value,{x:M+0.42,y:y+0.60,w:3.4,h:0.62,fontSize:30,bold:true,color:C.white,valign:"middle"});
  (o.mid||[]).forEach((t,i)=>txt(s,t.text,{x:t.x,y:y+0.60,w:t.w||2.2,h:0.62,align:"center",
    fontSize:t.fs||22,bold:true,color:t.color||C.white,valign:"middle"}));
  if(o.result) txt(s,o.result,{x:M+CW-4.4,y:y+0.60,w:4.0,h:0.62,align:"center",
    fontSize:26,bold:true,color:C.lime,valign:"middle"});
}

// ============================================================================
// 그림 (SVG→PNG 다이어그램 · matplotlib 차트 · 수식 PNG)
// ============================================================================
/**
 * 그림을 가용 영역에 꽉 차게(비율 유지·중앙정렬) 얹는다.
 * ratio = 그림의 가로/세로 비. 실제 파일 비율과 다르면 찌그러진다.
 * o: {y, bottom, x, w, frame:true(hairline 테두리)}
 */
function figImg(s,path,ratio,o){
  o=o||{};
  ratio = ratio || 2.5;
  const top   = o.y!=null ? o.y : CY_NOSUB;
  const bot   = o.bottom!=null ? o.bottom : 6.20;
  const availW= o.w || CW, availH = bot - top;
  if(availH<=0.4) console.warn("[figImg] 그림 영역이 없습니다 — y/bottom을 확인하세요.");
  let w = availW, h = w/ratio;
  if(h > availH){ h = availH; w = h*ratio; }
  const x = o.x!=null ? o.x : (o.left!=null?o.left:M) + (availW-w)/2;
  const y = top + (availH-h)/2;
  if(w < availW*0.62 && !o.quiet)
    console.warn(`[figImg] 그림이 폭의 ${Math.round(w/availW*100)}%만 채웁니다 `
      + `(ratio=${ratio}) — 그림 안 글씨가 작아집니다. SVG를 ${(availW/availH).toFixed(2)} 비율로 다시 그리세요.`);
  if(o.frame) rect(s,x,y,w,h,C.white,{color:C.hair,width:1});
  s.addImage({path,x,y,w,h});
  return y+h;
}

/** 전체폭 그림 슬라이드: 헤더 + 와이드 다이어그램 (+ 캡션) */
function figureSlide(s,o){
  const cy = head(s,o);
  const bot = o.caption ? 6.02 : 6.34;
  const yEnd = figImg(s,o.path,o.ratio||2.6,{y:cy+0.06,bottom:bot,frame:o.frame});
  if(o.caption) note(s,o.caption,{y:6.16,color:o.captionColor||C.muted});
  return yEnd;
}

/**
 * 수식 카드: 배경 카드 + 그 안에 LaTeX PNG를 가운데 배치.
 * 수식 PNG는 카드 배경색(paper 또는 ink)을 구워서 만든다 — §7.5.
 * o: {y, h, kind:"ghost"|"white"|"dark", path, ratio, cap, pad}
 */
function eqInCard(s,o){
  const y   = o.y!=null?o.y:CY_NOSUB;
  const pad = o.pad||0.34;
  const w   = o.w||CW;
  const capH= o.cap?0.38:0;
  // 기본 높이는 1.85in. 폭을 꽉 채우려 높이를 역산하면 한 줄짜리 식이
  // 슬라이드를 잡아먹으므로, 큰 hero 수식만 h를 키워서 쓴다.
  const h   = o.h || 1.85;
  const x   = o.x!=null?o.x:M;
  // v1.10: 수식 카드는 항상 흰 카드 + 잉크색 수식. 다크 카드에 라임 수식은 읽기 어려워 쓰지 않는다.
  //        kind:"dark"를 넘기면 흰 카드 + 왼쪽 티일 강조 띠로 바꾼다.
  let kind = o.kind||"white", accent = !!o.accent;
  if(kind==="dark"||kind==="lime"){
    console.warn(`[eqInCard] 수식 카드에 kind:"${kind}"는 쓰지 않습니다 — 흰 카드 + accent 띠로 바꿉니다 (v1.10).`);
    kind="white"; accent=true;
  }
  card(s,x,y,w,h,kind);
  if(accent) rect(s,x,y,0.10,h,C.teal);
  let top=y+pad;
  if(o.cap){
    txt(s,o.cap,{x:x+pad,y:top,w:w-pad*2,h:0.30,fontSize:S.label+1,bold:true,
      color:C.teal,valign:"middle"});
    top+=capH;
  }
  const availH = (y+h-pad*0.7) - top, eqW = Math.min(w-pad*2, availH*(o.ratio||4));
  if(eqW < (w-pad*2)*0.45)
    console.warn(`[eqInCard] 수식이 카드 폭의 ${Math.round(eqW/(w-pad*2)*100)}%만 채웁니다 `
      + `— 카드 높이를 ${((w-pad*2)/(o.ratio||4)+pad*1.7+capH).toFixed(2)}in로 키우거나 `
      + `카드 폭(w)을 ${(eqW+pad*2).toFixed(2)}in 정도로 좁히세요.`);
  figImg(s,o.path,o.ratio,{y:top,bottom:y+h-pad*0.7,w:w-pad*2,left:x+pad,quiet:true});
  return y+h;
}

/** 좌측 해설 패널 + 우측 그림 */
function figurePanelSlide(s,o){
  const cy = head(s,o);
  const pw = o.panelW||3.45, gap = 0.38;
  const iw = CW - pw - gap;
  const top = cy+0.04, bot = o.bottom!=null?o.bottom:6.10, availH = bot-top;
  const ratio = o.ratio||1.55;
  let w = iw, h = w/ratio;
  if(h > availH){ h = availH; w = h*ratio; }
  // 해설 패널은 가용 높이를 전부 쓰고, 그림만 그 안에서 세로 중앙정렬한다
  // (그림이 납작할수록 패널을 따라 낮아지면 불릿이 안 들어간다)
  const P = Object.assign({kind:"white"}, o.panel||{});
  card(s,M,top,pw,availH,P.kind);
  _panelBody(s,P,M,top,pw,availH);
  const ix = M+pw+gap+(iw-w)/2, iy = top+(availH-h)/2;
  if(o.frame!==false) rect(s,ix,iy,w,h,C.white,{color:C.hair,width:1});
  s.addImage({path:o.path,x:ix,y:iy,w,h});
  return top+availH;
}

// ============================================================================
// 하단 요소
// ============================================================================
/** 색 칩 행 — [{text,color}] */
function chips(s,items,o){
  o=o||{};
  const y=o.y||5.95, h=o.h||0.56, gap=o.gap||0.28;
  const x0=o.x||(M+2.20), tot=o.w||(M+CW-(o.x||(M+2.20)));
  const w=(tot-gap*(items.length-1))/items.length;
  items.forEach((it,i)=>{
    const x=x0+i*(w+gap);
    rect(s,x,y,w,h,it.color||C.teal);
    txt(s,it.text,{x,y,w,h,align:"center",valign:"middle",
      fontSize:fitBody(it.text,w-0.18,o.fs||16,"chip"),bold:true,
      color:it.color===C.lime?C.limeInk:C.white});
  });
  if(o.label) txt(s,o.label,{x:M,y,w:x0-M-0.20,h,fontSize:20,bold:true,color:C.body,valign:"middle"});
}

/** 하단 결론 줄. lines: [{text,color,size,bold,align}] 또는 문자열 */
function punch(s,lines,o){
  o=o||{};
  let y=o.y||6.00;
  const gap=o.gap||0.46;
  lines.forEach((L,i)=>{
    const t=typeof L==="string"?{text:L}:L;
    const pw=o.w||CW;
    txt(s,t.text,{x:o.x!=null?o.x:M+0.10,y:y+i*gap,w:pw,h:gap,
      align:t.align||o.align||"left",valign:"middle",
      fontSize:fitBody(t.text,pw-0.20,t.size||S.punch,"punch"),
      bold:t.bold!==false,color:t.color||C.teal});
  });
}

/** 티일 굵은 룰선 + 가운데 정렬 배너 문장 */
function banner(s,text,o){
  o=o||{};
  const y=o.y||6.10, w=o.w||(CW*0.78), x=o.x!=null?o.x:M+(CW-w)/2;
  hline(s,x,y,w,C.teal,3.5);
  txt(s,text,{x:M,y:y+0.16,w:CW,h:0.50,align:"center",valign:"middle",
    fontSize:fitBody(text,CW-0.30,o.fs||22,"banner"),bold:true,color:o.color||C.teal});
  return y+0.66;
}

/** ※ 각주 (앰버=주의/가정, 티일=다음 단계) */
function note(s,text,o){
  o=o||{};
  txt(s,text,{x:M+0.10,y:o.y||6.40,w:CW,h:0.32,
    fontSize:fitFs(text,CW-0.20,o.fs||S.note,11),bold:true,
    color:o.color||C.amber,valign:"middle"});
}

// ============================================================================
// 저장
// ============================================================================
function save(file){ return p.writeFile({ fileName:file }); }

module.exports = {
  p, C, F, S, M, CW, SW, SH, CY_SUB, CY_NOSUB, CB,
  setBrand, slide, rect, card, hline, arrowR, txt, grid, wUnits, fitFs, fitBody, BODY_MIN,
  lsp, linesH, BASE_LH,
  head, footer, cover, divider, closing, agenda,
  cards, statCards, pipeline, pairPanels, flow3, hub, equation, statementStack,
  barsH, insightBox, dataTable, resultBar,
  figImg, figureSlide, figurePanelSlide, eqInCard,
  chips, punch, banner, note, save,
};
