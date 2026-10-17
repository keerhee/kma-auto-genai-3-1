#!/usr/bin/env python3
"""
zeroone-pitch-deck 검수 — pptx 안에서 '상자 밖으로 새는 텍스트' 후보를 색출한다.

사용:  python3 scripts/qa_overflow.py deck.pptx

점검 항목
  1) 슬라이드 경계(13.333 × 7.5in)를 벗어난 도형·텍스트
  2) 제목 룰선(y=1.42) 을 침범하는 제목 텍스트 상자
  3) 푸터(y=7.00) 를 침범하는 콘텐츠
  4) 텍스트 추정 폭이 상자 폭을 넘는데 상자 높이가 한 줄뿐인 경우
  5) 폰트 하한 위반(본문 16pt 미만인데 chrome 예외 크기가 아닌 것)
  6) 텍스트 상자끼리 겹침
  7) 텍스트로 풀어쓴 수식 후보 (v1.9) — 수식은 LaTeX PNG로만
  8) 시각화 공백·비중 (v1.9) — 본문 4장 연속 무그림, 그림 비중 30% 미만

의존: python-pptx  (pip install python-pptx --break-system-packages)
"""
import sys
from pptx import Presentation
from pptx.util import Emu

SW, SH = 13.333, 7.5
RULE_Y = 1.42
FOOT_Y = 7.00
CHROME_MIN, CHROME_MAX = 10, 15   # 라벨·캡션·각주로 허용된 범위 (§1.3)

# v1.9 — 시각화·수식 점검
import re
VIS_GAP = 3            # 본문 슬라이드가 그림 없이 4장 이상 이어지면 경고
VIS_MIN_SHARE = 0.30   # 본문 중 그림(SVG·차트·수식 PNG) 슬라이드 비중 하한
TEXT_EQ = re.compile(
    r"\\(?:frac|sum|sigma|mu|alpha|beta|sqrt|mathbb|hat|bar)\b"   # LaTeX 원문 누출
    r"|(?<![A-Za-z0-9_.])[A-Za-zα-ωΑ-Ω]\s*[_^]\s*[{A-Za-z0-9](?![A-Za-z0-9_]{2,})"  # x_t, r^2 (snake_case 파일명 제외)
    r"|[A-Za-zα-ωΑ-Ω)]\s*[×÷]\s*[A-Za-zα-ωΑ-Ω(]"                  # V = a × b
    r"|[√∑∏∫]"                                                       # 근호·합·적분 기호
    r"|[A-Za-zα-ω][²³]"                                              # σ², x³
    r"|\b[A-Za-z]{1,3}\s*=\s*[A-Za-zα-ω(][^가-힣]{0,12}[+\-*/]"    # E = mc ... 연산식
)

def units(t):
    u = 0.0
    for ch in t:
        if ch == "\n":
            continue
        c = ord(ch)
        wide = ((0x1100 <= c <= 0x11FF) or (0x2E80 <= c <= 0x9FFF)
                or (0xAC00 <= c <= 0xD7AF) or (0xFF00 <= c <= 0xFF60)
                or (0x2190 <= c <= 0x21FF) or (0x2200 <= c <= 0x22FF)
                or (0x2018 <= c <= 0x201D) or c in (0x00D7, 0x00B7, 0x2022, 0x2026))
        u += 1.0 if wide else (0.30 if ch == " " else 0.52)
    return u * 1.04

def inches(v):
    return 0.0 if v is None else Emu(v).inches

def main(path):
    prs = Presentation(path)
    issues = []
    body_slides = fig_slides = no_fig_run = 0
    for i, slide in enumerate(prs.slides, 1):
        # 본문 슬라이드 판정 — 제목 룰선(y≈1.42, 높이 0인 선)이 있는 슬라이드만
        # 룰선·푸터 침범 검사를 한다 (표지·디바이더·마감은 제외).
        has_rule = any(
            abs(inches(s2.top) - RULE_Y) < 0.06 and inches(s2.height) < 0.05
            for s2 in slide.shapes)
        for sh in slide.shapes:
            x, y = inches(sh.left), inches(sh.top)
            w, h = inches(sh.width), inches(sh.height)
            # 1) 슬라이드 밖
            if x < -0.02 or y < -0.02 or x + w > SW + 0.02 or y + h > SH + 0.02:
                issues.append((i, "슬라이드 경계 이탈",
                               f"x={x:.2f} y={y:.2f} w={w:.2f} h={h:.2f}"))
            if sh.shape_type == 13 and has_rule and y + h > FOOT_Y - 0.05:
                issues.append((i, "그림이 푸터 영역 침범", f"하단 y={y+h:.2f}"))
            if not sh.has_text_frame:
                continue
            text = sh.text_frame.text.strip()
            if not text:
                continue
            fs = None
            for p in sh.text_frame.paragraphs:
                for r in p.runs:
                    if r.font.size:
                        fs = r.font.size.pt
                        break
                if fs:
                    break
            head = text.split("\n")[0][:28]
            # 푸터 밴드에 원래 사는 chrome(워드마크·쪽번호)은 검사 대상이 아니다
            if y >= FOOT_Y - 0.05:
                continue
            # 2) 제목 룰선 침범
            if has_rule and y < RULE_Y < y + h and fs and fs >= 18:
                issues.append((i, "제목이 룰선을 침범", f"'{head}' y={y:.2f} h={h:.2f}"))
            # 3) 푸터 침범
            if has_rule and fs and fs >= 16 and y + h > FOOT_Y - 0.05:
                issues.append((i, "콘텐츠가 푸터 영역 침범", f"'{head}' 하단 y={y+h:.2f}"))
            # 4) 한 줄 상자인데 폭 초과
            if fs and w > 0:
                need = units(text.split("\n")[0]) * fs / 72.0
                # 상자가 실제로 몇 줄을 수용하는지 (줄간 1.28 기준, 경계 오차 보정)
                lines_fit = max(1, int(h / (fs / 72.0 * 1.28) + 0.12))
                if need > w * 1.02 and lines_fit <= 1:
                    issues.append((i, "텍스트가 상자 폭 초과(한 줄 상자)",
                                   f"'{head}' 필요 {need:.2f}in > 상자 {w:.2f}in @{fs}pt"))
            # 5) 폰트 하한
            # eyebrow(11pt)는 헤더 밴드에 사는 chrome이라 폰트 검사에서 제외한다
            in_header = y < 0.62
            # 13~15pt는 문서화된 chrome(라벨·캡션·각주) 범위라 통과시키고,
            # 그 아래로 내려간 것만 잡는다 — 본문 하한은 빌드 경고가 담당한다.
            if fs and fs < CHROME_MIN + 3 and len(text) > 14 and not in_header:
                issues.append((i, "폰트가 chrome 하한(13pt) 미만",
                               f"'{head}' {fs}pt — 문구를 줄이거나 상자를 키우세요"))

        # 6) 같은 슬라이드 안에서 텍스트 상자끼리 실질적으로 겹치는가
        boxes = []
        for sh in slide.shapes:
            if not sh.has_text_frame or not sh.text_frame.text.strip():
                continue
            bx, by = inches(sh.left), inches(sh.top)
            bw, bh = inches(sh.width), inches(sh.height)
            if bh <= 0 or bw <= 0:
                continue
            boxes.append((bx, by, bw, bh, sh.text_frame.text.strip().split("\n")[0][:20]))
        for sh in slide.shapes:      # 그림도 겹침 검사 대상 (수식·다이어그램 PNG)
            if sh.shape_type == 13:  # PICTURE
                boxes.append((inches(sh.left), inches(sh.top),
                              inches(sh.width), inches(sh.height), "[그림]"))
        # 7) 텍스트로 풀어쓴 수식 후보 (§7.5 — 수식은 LaTeX PNG로만)
        for sh in slide.shapes:
            if sh.has_text_frame:
                t = sh.text_frame.text
                m = TEXT_EQ.search(t)
                if m:
                    issues.append((i, "텍스트 수식 후보 — LaTeX PNG로 바꿀 것",
                                   f"'{t.strip()[:28]}' ← '{m.group(0)}'"))
        # 8) 시각화 공백 — 본문 슬라이드가 그림·수식 없이 연속되는가 (§7.0)
        if has_rule:
            body_slides += 1
            if any(sh.shape_type == 13 for sh in slide.shapes):
                fig_slides += 1
                no_fig_run = 0
            else:
                no_fig_run += 1
                if no_fig_run == VIS_GAP + 1:
                    issues.append((i, "시각화 공백",
                                   f"본문 {VIS_GAP + 1}장 연속 그림·수식 없음 — SVG 도해·matplotlib 차트 검토 (§7.0)"))

        for a in range(len(boxes)):
            for b in range(a + 1, len(boxes)):
                ax, ay, aw, ah, at = boxes[a]
                bx, by, bw, bh, bt = boxes[b]
                ox = min(ax + aw, bx + bw) - max(ax, bx)
                oy = min(ay + ah, by + bh) - max(ay, by)
                if ox > 0.25 and oy > 0.12:      # 실질적 겹침만
                    issues.append((i, "텍스트 상자끼리 겹침",
                                   f"'{at}' × '{bt}' (가로 {ox:.2f}in · 세로 {oy:.2f}in)"))

    share = fig_slides / body_slides if body_slides else 1.0
    print(f"[시각화] 본문 {body_slides}장 중 그림·수식 슬라이드 {fig_slides}장 ({share:.0%})")
    if body_slides >= 6 and share < VIS_MIN_SHARE:
        issues.append((0, "시각화 비중 부족",
                       f"{share:.0%} < {VIS_MIN_SHARE:.0%} — 개념·구조는 SVG, 수치는 matplotlib, 수식은 LaTeX로 (§7.0)"))
    if not issues:
        print("OK — 검출된 오버플로·침범 후보 없음")
        return 0
    print(f"검출 {len(issues)}건\n")
    for pg, kind, detail in issues:
        print(f"  p{pg:>2}  [{kind}] {detail}")
    print("\n※ 후보이므로 렌더 PNG를 눈으로 확인해 최종 판단하세요.")
    return 1

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(main(sys.argv[1]))
