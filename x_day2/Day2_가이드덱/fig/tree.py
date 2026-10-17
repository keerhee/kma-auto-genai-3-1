# 폴더 나무 구조 그림 (SVG) — 들여쓰기·연결선을 직접 그려 글꼴과 무관하게 정렬된다
INK,PAPER,WHITE,LIME,TEAL,BODY,MUTED,HAIR="#071A1D","#F7F5F0","#FFFFFF","#B7F34A","#0B6B68","#102027","#64757D","#C9D2D1"
FONT='font-family="Noto Sans KR"'
def esc(s): return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
def tree(rows, W, rowh, fs, note_x, out, tag_w=0):
    H = len(rows)*rowh + 16
    b=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}"><rect width="{W}" height="{H}" fill="{WHITE}" stroke="{HAIR}" stroke-width="2"/>']
    IND=38; X0=20
    last_y={}
    for i,(lv,name,kind,note,tag) in enumerate(rows):
        cy=8+i*rowh+rowh/2; x=X0+lv*IND
        if lv>0:
            px=X0+(lv-1)*IND+9
            py=last_y.get(lv-1,cy)
            b.append(f'<path d="M{px},{py+12} L{px},{cy} L{x-4},{cy}" fill="none" stroke="{HAIR}" stroke-width="2.5"/>')
        last_y[lv]=cy
        if kind=="dir": b.append(f'<rect x="{x}" y="{cy-9}" width="20" height="16" rx="2" fill="{TEAL}"/>')
        else: b.append(f'<rect x="{x+3}" y="{cy-11}" width="14" height="20" rx="2" fill="{WHITE}" stroke="{MUTED}" stroke-width="2"/>')
        b.append(f'<text x="{x+30}" y="{cy}" {FONT} font-size="{fs}" font-weight="{700 if kind=="dir" else 400}" fill="{BODY}" dominant-baseline="middle">{esc(name)}</text>')
        if note: b.append(f'<text x="{note_x}" y="{cy}" {FONT} font-size="{fs}" fill="{MUTED}" dominant-baseline="middle">{esc(note)}</text>')
        if tag:
            tx=W-tag_w-14
            b.append(f'<rect x="{tx}" y="{cy-rowh*0.36}" width="{tag_w}" height="{rowh*0.72}" rx="6" fill="{LIME}"/>')
            b.append(f'<text x="{tx+tag_w/2}" y="{cy}" {FONT} font-size="{fs-4}" font-weight="700" fill="{INK}" text-anchor="middle" dominant-baseline="middle">{esc(tag)}</text>')
    b.append("</svg>"); open(out,"w",encoding="utf-8").write("".join(b))

# STEP 04 — 빈 폴더만
tree([
 (0,"Day2_실습/","dir","",""),
 (1,"input/","dir","원본 — 받은 뒤 고치지 않음",""),
 (1,"working/","dir","중간 작업물",""),
 (2,"scripts/","dir","스크립트",""),
 (1,"output/","dir","결과물",""),
 (2,"운영안내/","dir","수업 안내 문서",""),
 (1,"docs/","dir","참고 문서",""),
 (1,".claude/","dir","",""),
 (2,"skills/","dir","스킬",""),
], W=830, rowh=56, fs=30, note_x=330, out="t1_skeleton.svg")

# STEP 10 — 완성 구조 (파일을 만든 STEP 표시)
tree([
 (0,"Day2_실습/","dir","",""),
 (1,"CLAUDE.md","file","규칙 문서","STEP 06"),
 (1,"input/","dir","CSV 6개 · PNG 2개","STEP 05"),
 (1,"working/","dir","",""),
 (2,"scripts/","dir","스크립트 (.py 파일)","STEP 07"),
 (2,"VOC_분류.csv 등","file","Claude가 판단한 표","STEP 09"),
 (1,"output/","dir","",""),
 (2,"00_Day2_결과화면.html","file","결과 화면","STEP 09"),
 (2,"01~05 엑셀 5개","file","결과 파일","STEP 09"),
 (2,"운영안내/","dir","수업 안내 문서",""),
 (1,"docs/","dir","참고 문서",""),
 (1,".claude/skills/","dir","스킬 폴더 4개","STEP 08"),
], W=1010, rowh=46, fs=30, note_x=520, out="t2_full.svg", tag_w=120)

# 기초 지식 덱 요약 — 각 칸의 뜻만 (STEP 표시 없음)
tree([
 (0,"Day2_실습/","dir","",""),
 (1,"CLAUDE.md","file","규칙 — Claude가 매번 먼저 읽는다",""),
 (1,"input/","dir","원본 — 받은 뒤 고치지 않는다",""),
 (1,"working/","dir","중간 작업물",""),
 (2,"scripts/","dir","계산·차트를 만드는 스크립트",""),
 (2,"VOC_분류.csv 등","file","Claude가 판단한 중간 표",""),
 (1,"output/","dir","결과 — 보고·배포는 여기서만",""),
 (2,"01_EV시장_Top5.xlsx 등","file","결과 엑셀·화면",""),
 (1,".claude/skills/","dir","스킬 — 일하는 순서 설명서",""),
], W=1000, rowh=52, fs=30, note_x=470, out="t3_meaning.svg")
