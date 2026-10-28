# EV 전체 조립 모션그래픽 — Claude Code × Blender

전기차 스케이트보드 플랫폼과 크로스오버 차체의 조립 공정을 Blender 3D 모션그래픽으로 만드는 실습 세트다.
수강생은 프롬프트를 붙여 넣고 결과를 확인하며, 설치 · 코드 · 렌더 · 오류 해결은 Claude Code가 한다.

| 폴더 | 파일 | 내용 |
|---|---|---|
| `1_가이드/` | `EV_Blender_Motion_Graphics_Guide_II.pptx` | 실습 가이드 II (44장) — 먼저 볼 판 |
| | `EV_Blender_Motion_Graphics_Guide.pptx` | 실습 가이드 1판 (29장) — GLB 모델 한 개에서 30초 1080p MP4까지 |
| `2_영상/` | `EV_Full_Assembly.mp4` | 전체 조립 영상 53.5초 · 1080p |
| | `EV_Skateboard_Assembly.mp4` | 스케이트보드 조립 공정 영상 50초 |
| | `EV_Skateboard_Assembly_Flow.mp4` | 스케이트보드 조립 흐름 영상 30초 |
| | `Claude_Blender_Title_10s.mp4` | 짧은 예제 — «Claude + Blender» 3D 타이틀 인트로 10초(네온 액자 셋 + 글자 등장에 맞춘 효과음) |
| `3_3D모델/` | `EV_Skateboard_Education.glb` | 교육용 스케이트보드 플랫폼 모델 (메시 408개) |
| | `EV_Crossover_Education.glb` | 교육용 크로스오버 차체 모델 (메시 1,015개) |
| `4_소스/` | `EV_Blender_Scripts.zip` | 영상을 만든 Blender 스크립트 — scene.py(장면) · comp.py(합성) · sound.py(사운드) |
| | `EV_Factory_Flow.html` | 브라우저로 여는 공장 흐름 화면 |
| | `타이틀_인트로/` | 타이틀 인트로 예제의 소스 — `scene.py`(Blender 4.2 Eevee, 240프레임, 150프레임에 글자 등장 · `timing.json` 생성) · `make_final.sh`(PNG 프레임 + `sfx/hit.wav` → mp4, 효과음을 글자 등장 시각에 맞춘다) · `sfx/hit.wav` |

순서: 가이드 II를 보며 `3_3D모델/`의 GLB로 실습하고, `2_영상/`의 완성본과 비교한다. 막히면 `4_소스/`의 스크립트를 Claude Code에게 읽힌다.

※ 가이드 1판 · II, 영상 50초 · 30초, 스크립트 zip, HTML은 Day5 `04_EV_조립라인_흐름/`에 있는 파일과 같다. 이 폴더는 전체 조립 영상과 GLB 모델까지 한데 모은 완성 세트다.
