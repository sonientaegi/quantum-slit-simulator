# 양자 슬릿 시뮬레이터 - 개발 규칙

다중 슬릿 회절 + 그로버 양자 탐색 시뮬레이터. 제품 명세는 @PRD.md 참조.

## 개발 명령어

```bash
pnpm install          # 의존성 설치
pnpm dev              # 개발 서버 (Vite)
pnpm build            # 프로덕션 빌드
pnpm build:single     # 단일 HTML 파일 빌드 (dist/index.html)
pnpm electron:dev     # Electron 개발 모드 실행
pnpm electron:build   # macOS .app DMG 패키징
```

## 작업 방식

- 빌드(기능 구현, 버그 수정 등 코드 변경 작업)는 항상 autopilot 모드로 수행한다

## 설계 결정

- 그로버 알고리즘에서 실수 진폭만 사용 (복소수 불필요 - 균일 실수 초기 상태에서 O, D 연산 모두 실수 보존)
- 오라클은 사전 계산 방식 (모든 후보 회절 패턴을 미리 비교하여 정답 인덱스 결정)
- 최적 반복 횟수 + 3회까지 실행하여 과반복 확률 감소를 교육적으로 시각화
- 탐색 공간 50,000 초과 시 UI 경고 및 실행 차단
- Electron 앱 productName은 반드시 ASCII (macOS 26에서 한국어 경로 크래시)
- Vite base는 `./` (상대경로) — Electron file:// 프로토콜 호환

## Git 커밋 및 배포 규칙

**커밋, 푸시, 배포는 사용자가 명시적으로 요청할 때만 수행한다.**

- 코드 변경 후 자동으로 커밋/푸시하지 않는다
- "커밋해줘" → 로컬에만 커밋 (push 하지 않음)
- "푸시해줘" → 커밋되지 않은 변경이 있으면 커밋 여부를 먼저 확인한 뒤, 로컬 커밋들을 push
- "배포해줘" → `main` 커밋 + push + `pnpm build` + `gh-pages` 배포를 모두 수행

### 배포 절차

1. `main` 브랜치에서 변경사항 커밋 및 push
2. `pnpm build` 실행
3. `gh-pages` 브랜치로 전환
4. 기존 파일 제거 후 `dist/` 내용물(`index.html`, `assets/`)만 복사
5. 커밋 및 push
6. `main` 브랜치로 복귀

### GitHub Pages

- URL: https://sonientaegi.github.io/quantum-slit-simulator/
- 브랜치: `gh-pages` (root `/`)
- `gh-pages`에는 빌드 결과물(`index.html`, `assets/`)만 포함
