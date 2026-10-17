"""보여 주는 화면 — 단계별 결과를 단일 HTML로 묶는다 → output/00_Day2_결과화면.html

- 있는 결과만 탭으로 만든다. 외부 리소스를 쓰지 않는다(CLAUDE.md §6).
- 제목·기준 문구는 데이터에서 만든다. 코드에 '등록'·'A사' 같은 말을 고정하지 않는다.
- Claude가 판단한 결과가 지금 input과 맞지 않으면 그 내용 대신 "다시 판단 필요" 경고를 띄운다.
"""
import sys
from pathlib import Path

import pandas as pd

sys.path.insert(0, str(Path(__file__).parent))
from d2lib import (ACCENT, MUTED, NEG, NEU, OUTPUT, ROOT, VOC_INPUTS, WORKING, clinic_config,  # noqa: E402
                   esc, img_data_uri, market_tables, read_csv, stale_reason, svg_bar, svg_line,
                   svg_stacked, table_html, top5_table, voc_mismatch, write_html)

tabs = []
VOC_SRC = list(VOC_INPUTS.values())


def card(title, body, note="", tag=""):
    t = f' <span class="tag">{esc(tag)}</span>' if tag else ""
    n = f'<p class="note">{note}</p>' if note else ""
    return f'<div class="card"><h2>{esc(title)}{t}</h2>{body}{n}</div>'


def stale_card(items: dict, skill: str) -> str:
    rows = "".join(f"<li><code>{esc(a)}</code> — {esc(w)}</li>" for a, w in items.items())
    return card("다시 판단 필요", f"<ul>{rows}</ul>",
                f"input이 바뀌어 예전 판단 결과를 보여 주지 않는다. <b>{esc(skill)}</b> 스킬로 다시 만든 뒤 화면을 갱신한다.",
                tag="갱신 대기")


def tag_for(path) -> str:
    return "가상 데이터(실습용)" if "가상" in str(path) else ""


# ① EV 시장 — 문구는 집계기준에서 만든다 (수정 3)
top, qty, basis, src = top5_table()
vals = top[qty].tolist()
period, url = top["기준기간"].iloc[0], top["출처URL"].iloc[0]
lead = top.iloc[0]
m = market_tables()
mk_names = m["makers"]["제조사"].tolist()
mk_share = [round(v / m["total"] * 100, 1) for v in m["makers"][m["qty"]]]
raw_basis = "/".join(dict.fromkeys(top["집계기준"].astype(str)))
body = card(f"{period} 국내 EV {basis} 1위 {lead['모델명']} {int(lead[qty]):,}대 — 2위의 {vals[0]/vals[1]:.1f}배",
            svg_bar(top["모델명"].tolist(), vals, unit="대"),
            f"기준: {esc(raw_basis)} · 기간: {esc(period)} · 출처: {esc(url)} · 입력: {esc(src.name)}")
body += '<div class="grid2">'
body += card(f"{m['label']} {m['basis']} 상위 {len(mk_names)}사 — 전체 대비 비중",
             svg_bar(mk_names, mk_share, unit="%", width=480, height=280),
             f"분모: {m['label']}년 전기차 {m['basis']} {m['total']:,}대({esc(m['org'])}). {esc(m['diff_note'])}")
body += card(m["trend"],
             svg_line(m["yearly"]["연도"].tolist(), {m["yqty"]: m["yearly"][m["yqty"]].tolist()}, width=480, height=280),
             f"기준: {esc(m['ybasis'])} · 출처: {esc(m['yorg'])} · 월별 시계열은 믿을 만한 출처가 없어 연간 값 사용")
body += "</div>"
tabs.append(("ev", "① EV 시장", body))

# ② 도구 기준표 (input과 무관)
f = WORKING / "AI도구_선택기준표.csv"
if f.exists():
    tabs.append(("tool", "② 도구 기준표", card("목적별 도구 선택 기준 — Claude Code 운영판", table_html(read_csv(str(f))),
                                            "좋은 기준표는 '주의점' 열이 살아 있다(본 강의 모범답안 ②).")))

# ③ VOC
voc_arts = ["working/VOC_분류.csv", "working/VOC_키워드사전.csv"]
if (ROOT / voc_arts[0]).exists():
    stale = {a: w for a in voc_arts if (w := stale_reason(a, expect=VOC_SRC))}
    if not stale and (w := voc_mismatch(read_csv(voc_arts[0]))):
        stale = {voc_arts[0]: w}
    if stale:
        body = stale_card(stale, "VOC-감정분석")
    else:
        cls = read_csv(voc_arts[0])
        topics = ["주행", "충전", "디자인", "가격", "서비스"]
        body = '<div class="grid2">'
        for car in cls["차종"].unique():
            sub = cls[cls["차종"] == car]
            ct = pd.crosstab(sub["주제"], sub["감정"]).reindex(index=topics, columns=["긍정", "부정", "중립"], fill_value=0)
            tops = ct.index[ct["부정"] == ct["부정"].max()].tolist()  # 동률이면 모두 적는다
            head = (f"'{'·'.join(tops)}' 동률 (각 {ct['부정'].max()}/{ct['부정'].sum()}건)" if len(tops) > 1
                    else f"'{tops[0]}' ({ct['부정'].max()}/{ct['부정'].sum()}건)")
            body += card(f"{car} — 부정 리뷰가 가장 많은 주제는 {head}",
                         svg_stacked(topics, {c: ct[c].tolist() for c in ["긍정", "부정", "중립"]},
                                     colors={"긍정": ACCENT, "부정": NEG, "중립": NEU}, width=480, height=300),
                         f"리뷰 {len(sub)}건 · 주제·감정은 Claude 분류", tag="가상 데이터(실습용)")
        body += "</div>"
        k5 = WORKING / "VOC_키워드Top5.csv"
        if k5.exists() and k5.stat().st_mtime >= (ROOT / voc_arts[0]).stat().st_mtime:
            kt = read_csv(str(k5))
            body += '<div class="grid2">'
            for car in kt["차종"].unique():
                for sent in ["부정", "긍정"]:
                    s = kt[(kt["차종"] == car) & (kt["감정"] == sent)]
                    if s.empty:
                        continue
                    body += card(f"{car} {sent} 키워드 Top5",
                                 svg_bar(s["키워드"].tolist(), s["빈도"].tolist(), unit="건", horizontal=True, width=480,
                                         highlight=s["키워드"].iloc[0] if s["빈도"].iloc[0] > 1 else None),
                                 "빈도 = 키워드가 붙은 리뷰 수. 동률은 가나다순이며 1건짜리 순위는 근거가 약하다.",
                                 tag="가상 데이터(실습용)")
            body += "</div>"
        else:
            body += card("키워드 Top5 없음", "", "s2_voc.py를 실행하면 생긴다.")
    tabs.append(("voc", "③ VOC 감정분석", body))

# ④ 차트 클리닉 — 대상은 설정 파일에서 읽는다 (수정 4)
cfg = clinic_config()
clinic_arts = ["working/차트클리닉_진단표.csv", "working/차트클리닉_메시지.txt"]
if (ROOT / clinic_arts[0]).exists():
    stale = {a: w for a in clinic_arts if (w := stale_reason(a, expect=[cfg["원본CSV"], cfg["원본이미지"]]))}
    if stale:
        body = stale_card(stale, "차트-클리닉")
    else:
        raw = read_csv(str(ROOT / cfg["원본CSV"]))
        a = raw[raw["브랜드"] == cfg["브랜드"]].reset_index(drop=True)
        months = [str(x) for x in a["월"]]
        bases = list(dict.fromkeys(a["집계기준"]))
        series = {b: [v if k == b else None for v, k in zip(a["점유율(%)"], a["집계기준"])] for b in bases}
        changes = {i: "집계기준 변경" for i in range(1, len(a)) if a["집계기준"].iloc[i] != a["집계기준"].iloc[i - 1]}
        ymax = max(50, int(a["점유율(%)"].max() // 10 + 1) * 10)
        msg = (ROOT / clinic_arts[1]).read_text(encoding="utf-8").strip().splitlines()[0]
        palette = [MUTED, ACCENT, NEG, NEU]
        t = tag_for(cfg["원본CSV"])
        body = '<div class="grid2">'
        body += card("원본 차트 (진단 대상)", f'<img class="full" alt="원본 차트" src="{img_data_uri(ROOT / cfg["원본이미지"])}">',
                     f"원본: {esc(cfg['원본이미지'])}", tag=t)
        body += card(msg, svg_line(months, series, unit="%", ymin=0, ymax=ymax,
                                   colors={b: palette[i % len(palette)] for i, b in enumerate(bases)},
                                   marks=changes, width=480, height=300),
                     f"{esc(cfg['브랜드'])} 점유율 = {esc(cfg['브랜드'])} 대수 ÷ EV 시장 전체 · 원본 데이터: {esc(cfg['원본CSV'])}"
                     + (" · 기준이 바뀐 지점에서 선을 끊었다" if changes else ""), tag=t)
        body += "</div>"
        body += card("진단표 — 원칙 4가지 + 통계 함정", table_html(read_csv(clinic_arts[0])))
    tabs.append(("clinic", "④ 차트 클리닉", body))

# ⑤ 주간 수집
files = sorted(WORKING.glob("주간수집_*.csv"))
if files:
    wk = pd.concat([pd.read_csv(p, encoding="utf-8-sig") for p in files], ignore_index=True)
    cnt = wk["확인상태"].value_counts()
    body = card("확인 상태별 건수", svg_bar(cnt.index.tolist(), cnt.tolist(), unit="건",
                                        highlight="확인 필요" if "확인 필요" in cnt.index else None, height=240),
                "'확인 필요'는 매체 간 내용이 다르거나 기준 가격 표기가 없는 행이다. 사람이 원문을 보고 정한다.")
    body += card("주간 수집 결과 (누적)", table_html(wk), "원천: " + ", ".join(esc(p.name) for p in files),
                 tag="예시 포함" if any("예시" in p.name for p in files) else "")
    if (OUTPUT / "05_주간수집레시피.md").exists():
        body += card("레시피 문서", "<p>output/05_주간수집레시피.md 참고</p>")
    tabs.append(("week", "⑤ 주간 수집", body))

out = write_html(OUTPUT / "00_Day2_결과화면.html", "Day2 · 자동차 데이터 수집과 시각화",
                 "Claude Code 운영판 결과 화면 — 숫자마다 기준·기간·출처를 함께 적었다", tabs)
print(f"[완료] {out} · 탭 {len(tabs)}개")
