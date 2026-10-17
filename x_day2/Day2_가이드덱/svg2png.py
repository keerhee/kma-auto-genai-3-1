"""SVG → PNG (cairosvg 대신 로컬 Edge로 렌더). 사용: python svg2png.py fig/a.svg [...]"""
import re, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    b = p.chromium.launch(channel="msedge")
    for f in sys.argv[1:]:
        svg = Path(f).read_text(encoding="utf-8")
        w, h = map(int, re.search(r'viewBox="0 0 (\d+) (\d+)"', svg).groups())
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        pg.set_content(f'<html><body style="margin:0">{svg}</body></html>')
        pg.wait_for_timeout(150)
        out = Path(f).with_suffix(".png")
        pg.screenshot(path=str(out), clip={"x": 0, "y": 0, "width": w, "height": h})
        print(f"{out}  ratio:{w}/{h}")
    b.close()
