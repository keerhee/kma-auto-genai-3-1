"""세계 자동차 산업 3D 대시보드 생성: python3 _build/build_dashboard.py (저장소 루트에서 실행)

data/dashboard/auto_world.json을 템플릿에 넣어 HTML/auto_world_dashboard.html을 만든다.
데이터를 HTML 안에 넣어 두므로, 통계를 갱신하면 이 스크립트만 다시 돌리면 된다.
환율은 페이지가 열릴 때 브라우저가 직접 불러온다.
"""
import json, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = json.load(open(os.path.join(ROOT, 'data/dashboard/auto_world.json'), encoding='utf-8'))
payload = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
tpl = open(os.path.join(ROOT, '_build/auto_world_dashboard.template.html'), encoding='utf-8').read()
out = os.path.join(ROOT, 'HTML/auto_world_dashboard.html')
open(out, 'w', encoding='utf-8').write(tpl.replace('/*__DATA__*/', payload))
print(out, len(data['countries']), 'countries', len(data['oems']), 'oems')
