"""index.html 생성: python3 _build/make_site.py (저장소 루트에서 실행)"""
import os, glob, html, urllib.parse
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
DAYS = [
    ('Day0', '0일차', '과정 안내', '강의소개 · 기초 프롬프트 · 미니 프로젝트 과제집', None),
    ('Day1', '1일차', '자동차 시장 및 트렌드 이해', '이론 5H + 실습 3H', '테슬라 2008'),
    ('Day2', '2일차', '자동차 데이터 크롤링 및 시각화', '이론 4H + 실습 4H', '머니볼'),
    ('Day3', '3일차', '경쟁사 재무와 전략 분석', '이론 4H + 실습 4H', 'GM 파산'),
    ('Day4', '4일차', '자동차 직무별 업무 분석 및 실습', '이론 4H + 실습 4H', '모델 3 생산 지옥'),
    ('Day5', '5일차', '자동차 예지보전 AI 활용', '이론 4H + 실습 4H', '포스코 등대공장'),
    ('Day6', '6일차', '최종 프로젝트 구현 및 발표', '구현 4H + 발표 4H', '픽사 브레인트러스트'),
    ('Robot_Special', '특강', '자동차산업의 미래 — 로봇과 스마트팩토리', '본 특강 6H', '아마존 키바'),
]
def label(fn, day):
    n = os.path.basename(fn)
    if day == 'Day0':
        return {'1': ('안내', '강의소개 및 개요'), '2': ('기초', '기초 프롬프트 작성법'), '3': ('과제집', '실전 미니 프로젝트 과제집')}[n.split('_')[1]]
    if '_1_Hook' in n: return ('Hook · 1H', '케이스 스토리')
    if '_2_Front' in n: return ('Front · 2H', '인트로 — 기본기')
    if '_3_Main' in n: return ('Main', '본 강의')
    if '_4_Back' in n: return ('Back · 2H', '보강 실습')
    return ('', n)
def url(p): return urllib.parse.quote(p)
cards = []
for d, tag, title, hours, hook in DAYS:
    rows = []
    for pdf in sorted(glob.glob(f'{d}/*.pdf')):
        k, desc = label(pdf, d)
        if '_1_Hook' in pdf and hook: desc = f'케이스 스토리 — {hook}'
        if '_3_Main' in pdf: desc = f'본 강의 — {hours}'
        main = ' is-main' if '_3_Main' in pdf else ''
        links = f'<a class="btn" href="{url(pdf)}" target="_blank" rel="noopener">PDF 보기</a>'
        rows.append(f'<li class="row{main}"><span class="k">{html.escape(k)}</span><span class="d">{html.escape(desc)}</span><span class="l">{links}</span></li>')
    cards.append(f'<section class="card" id="{d}"><header><span class="tag">{tag}</span><h2>{html.escape(title)}</h2></header><ol>{"".join(rows)}</ol></section>')

DATA_DAYS = [('Day1','1일차'),('Day2','2일차'),('Day3','3일차'),('Day4','4일차'),('Day5','5일차'),('Day6','6일차'),('Robot_Special','특강')]
def kind(n):
    if '_실데이터' in n or '_참고' in n: return ('실데이터','real')
    if '_가상' in n: return ('가상','synth')
    return ('템플릿','tmpl')
drows = []
for d, tag in DATA_DAYS:
    items = []
    for f in sorted(glob.glob(f'data/{d}/*')):
        n = os.path.basename(f); k, cls = kind(n)
        short = n.split('_', 1)[1] if n.startswith(d.split('_')[0]) or n.startswith('Robot_') else n
        items.append(f'<li><span class="badge {cls}">{k}</span><a href="{url(f)}" download>{html.escape(short)}</a></li>')
    drows.append(f'<div class="dday"><b>{tag}</b><ul>{"".join(items)}</ul></div>')
GH = 'https://github.com/keerhee/kma-auto-genai-3-1/blob/main/data/'
data_html = (f'<h3 id="data">실습 데이터</h3><p class="note">실데이터는 출처 링크가 붙은 백업 자료(기준일 2026-10-07), 가상 데이터는 실습용으로 만든 자료입니다. '
             f'파일별 설명은 <a href="{GH}README.md">데이터 안내</a>, 함정과 정답은 <a href="{GH}{url("_강사용_정답메모.md")}">강사용 정답 메모</a>를 보세요.</p>'
             f'<div class="data">{"".join(drows)}</div>')

SIMS = [('ev_parts.html', 'EV 부품 학습'), ('ev_factory.html', 'EV 스마트팩토리'), ('humanoid_parts.html', '휴머노이드 부품 학습'), ('humanoid_factory.html', '휴머노이드 조립 공정')]
sims = ''.join(f'<a class="sim" href="HTML/{f}" target="_blank" rel="noopener"><span>{html.escape(t)}</span><small>시뮬레이션 열기 →</small></a>' for f, t in SIMS)
page = f'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>자동차산업과 생성형 AI 3-1</title>
<meta name="description" content="능률협회 자동차산업과 생성형 AI 3-1 — 자동차특화 AI융합 전문가 육성 과정 강의자료">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">
<style>
:root{{--bg:#f6f7f9;--card:#fff;--ink:#14213d;--sub:#5b6475;--line:#e3e6ec;--accent:#1f3a8a;--main:#eef2fb;--btn:#1f3a8a;--btnink:#fff}}
@media (prefers-color-scheme:dark){{:root{{--bg:#0f141c;--card:#171e29;--ink:#e8ecf3;--sub:#9aa4b5;--line:#2a3343;--accent:#8fb0ff;--main:#1c2638;--btn:#8fb0ff;--btnink:#0f141c}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font-family:Pretendard,-apple-system,"Apple SD Gothic Neo",sans-serif;line-height:1.55}}
.wrap{{max-width:1040px;margin:0 auto;padding:40px 16px 64px}}
.hero p.eyebrow{{margin:0;color:var(--accent);font-weight:700;font-size:14px}}.hero h1{{margin:6px 0 8px;font-size:clamp(26px,4vw,36px)}}.hero p{{margin:0;color:var(--sub)}}
.flow{{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 28px}}.flow span{{background:var(--card);border:1px solid var(--line);border-radius:999px;padding:6px 12px;font-size:14px}}.flow b{{color:var(--accent)}}
.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,480px),1fr));gap:16px}}
.card{{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px}}
.card header{{display:flex;align-items:baseline;gap:10px;margin-bottom:10px}}.tag{{font-size:13px;font-weight:700;color:var(--accent);white-space:nowrap}}.card h2{{margin:0;font-size:18px}}
ol{{list-style:none;margin:0;padding:0}}.row{{display:grid;grid-template-columns:92px 1fr auto;gap:10px;align-items:center;padding:9px 8px;border-top:1px solid var(--line);border-radius:8px}}
.row.is-main{{background:var(--main)}}.k{{font-size:13px;font-weight:700;color:var(--accent)}}.d{{font-size:15px}}.l{{display:flex;gap:6px}}
.btn{{font-size:13px;text-decoration:none;padding:5px 10px;border-radius:8px;background:var(--btn);color:var(--btnink);white-space:nowrap}}.btn.ghost{{background:transparent;color:var(--accent);border:1px solid var(--line)}}
h3{{margin:36px 0 12px}}.sims{{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}}
.sim{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;text-decoration:none;color:var(--ink);display:flex;flex-direction:column;gap:4px}}.sim small{{color:var(--accent)}}
.note{{color:var(--sub);margin:0 0 12px}}.note a{{color:var(--accent)}}
.data{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:12px}}
.dday{{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px}}.dday b{{color:var(--accent);font-size:14px}}
.dday ul{{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:6px}}.dday li{{display:flex;gap:8px;align-items:baseline;font-size:14px;word-break:break-all}}
.dday a{{color:var(--ink);text-decoration:none}}.dday a:hover{{text-decoration:underline}}
.badge{{font-size:11px;font-weight:700;border-radius:6px;padding:1px 6px;white-space:nowrap}}.badge.real{{background:#dcfce7;color:#166534}}.badge.synth{{background:#fef3c7;color:#92400e}}.badge.tmpl{{background:#e0e7ff;color:#3730a3}}
.dash{{display:flex;flex-direction:column;gap:6px;text-decoration:none;color:var(--ink);background:linear-gradient(120deg,#0f1622,#1c2f52);color:#f3f6fb;border-radius:14px;padding:20px}}.dash-t{{font-size:18px;font-weight:700}}.dash-d{{font-size:14px;color:#b4bfcf}}.dash small{{color:#86b6ef}}
footer{{margin-top:40px;color:var(--sub);font-size:13px}}footer a{{color:var(--accent)}}
@media (max-width:520px){{.row{{grid-template-columns:1fr;gap:4px}}}}
</style></head><body><div class="wrap">
<div class="hero"><p class="eyebrow">능률협회 · 자동차특화 AI융합 전문가 육성 과정</p><h1>자동차산업과 생성형 AI 3-1</h1>
<p>6일 과정과 로봇·스마트팩토리 특강의 강의자료입니다. 날마다 케이스 스토리로 열고, 기본기를 다진 뒤 본 강의와 보강 실습으로 이어집니다.</p></div>
<div class="flow"><span><b>Hook</b> 케이스 1H</span><span><b>Front</b> 인트로 2H</span><span><b>Main</b> 본 강의 8H</span><span><b>Back</b> 보강 실습 2H</span></div>
<div class="grid">{"".join(cards)}</div>
<h3>대시보드</h3><a class="dash" href="HTML/auto_world_dashboard.html" target="_blank" rel="noopener"><span class="dash-t">세계 자동차 산업 3D 지도</span><span class="dash-d">국가별 자동차 생산량·전기차 판매와 비중, 주요 완성차 그룹을 3D 지구본에서 보고, 생산국 통화의 오늘 환율을 함께 확인합니다.</span><small>대시보드 열기 →</small></a>
{data_html}
<h3>교육용 시뮬레이션</h3><div class="sims">{sims}</div>
<footer>PDF는 브라우저에서 바로 열립니다. · <a href="https://github.com/keerhee/kma-auto-genai-3-1">GitHub 저장소</a></footer>
</div></body></html>'''
open('index.html', 'w', encoding='utf-8').write(page)
print('index.html', len(page))
