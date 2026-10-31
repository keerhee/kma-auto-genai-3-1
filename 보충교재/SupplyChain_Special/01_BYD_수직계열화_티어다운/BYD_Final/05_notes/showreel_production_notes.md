# 제작노트 — BYD 수직계열화 쇼릴 (60초)

## 구성
| 시간 | 구간 | 화면 |
|---|---|---|
| 0–6 | 청사진 | 씰 측면 선 그리기, 스캔 라인, "한 대를 뜯었다." |
| 6–14 | 분해 | 부품 8개가 튀어나와 정렬, 75% 직접 생산 카운트 |
| 14–24 | 피라미드 vs 파이프 | 협력사 단계마다 마진 블록 적층 vs BYD 한 줄 파이프 (설명용 개념도) |
| 24–32 | 8-in-1 | 8개 부품 상자가 충돌해 주물 하나로, 전선·커넥터·조립시간·마진 감소 |
| 32–42 | 원가 | UBS: 모델3 대비 −15%, 유럽 평균 −25%, ID.3 대비 −35% |
| 42–52 | JIC | 2021 반도체 대란, 공장 불이 꺼지는 지도, Just-in-Time → Just-in-Case |
| 52–60 | 결론 | 2025 BEV 2,254,714대 세계 1위, "수직계열화 = 원가 우위 + 공급망 회복력" |

## Claude가 정한 것
- 나레이션 없음, 화면 카피 + 합성 음악(120 BPM). 클라우드 환경이라 ElevenLabs·이미지 생성 불가.
- 실사 사진·로고 없이 선·도형·데이터 그래픽으로만 구성.
- "JIC"는 Just-in-Case(만일에 대비한 공급망)로 해석.

## 요청과 다르게 반영한 것
- 원 영상의 "일부 항목 30%", "영업이익률 8%"는 출처를 찾지 못해 넣지 않음. 대신 UBS 분해 수치(15/25/35%) 사용.
- 원 영상은 일본 팀의 씰 분해를 말하지만, 8-in-1 출처는 일본 중부경제산업국 세미나(아토3 분해, 2024)라 화면에 그렇게 표기.
- "유럽 완성차 평균"은 UBS의 "유럽 업체 대비 25%"를 줄인 표기.

## 공개 전 확인
- 칩 자립 효과(반도체 대란 때 덜 흔들림)는 정성적 서술이며 단일 출처.
- S3 블록 높이는 개념도(화면에 표기).
- 사운드는 수치로만 확인했다 — 직접 들어 볼 것.

## 재생성
```
S=<showreel>/scripts
python3 $S/synth_music.py music audio/music/spec.json audio/music/music.wav
python3 $S/timeline.py script.json --music-analysis audio/music/analysis.json
node $S/render.mjs --dir reel --out out/video.mp4 --sub 4 --format png
python3 $S/mix.py timeline.json
python3 $S/finish.py --video out/video.mp4 --audio audio/mix.wav --name BYD_Vertical_Integration_60s --outdir out --timeline timeline.json
```
