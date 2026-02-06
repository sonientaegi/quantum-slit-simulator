# 다중 슬릿 회절 + 그로버 양자 탐색 시뮬레이터

## 프로젝트 개요

단일 광원에서 방사된 빛이 다중 슬릿을 통과하며 만드는 회절 패턴을 시뮬레이션하고, 무작위로 차단된 구멍의 위치를 **그로버(Grover) 양자 탐색 알고리즘**으로 찾아내는 과정을 시각화하는 인터랙티브 웹 앱.

### 문제 정의

1. L개의 슬릿이 일정 간격으로 배치되고, 각 슬릿에 N개의 구멍이 있다
2. 무작위로 C개의 구멍을 차단한다
3. 단일 광원에서 빛을 쏘면 반대편 스크린에 회절/간섭 패턴이 나타난다
4. **역문제**: 스크린의 밝기 패턴만으로 차단된 C개 구멍의 위치를 추정한다
5. 이 추정에 그로버 양자 탐색을 사용하여, 고전적 전수 조사 대비 √S 속도 향상을 시연한다

---

## 기술 스택

- **React 18** + **TypeScript** + **Vite**
- **HTML Canvas** (시각화 렌더링)
- 외부 차트/물리 라이브러리 없음 (자체 구현)
- 패키지 매니저: pnpm
- UI 텍스트: 한국어

---

## 물리 모델: 프라운호퍼 회절

### 좌표계

- 슬릿 장벽은 y축을 따라 배치 (1D)
- 구멍 (l, n)의 y 좌표: `y(l, n) = (l - (L-1)/2) × d_slit + (n - (N-1)/2) × d_hole`
- 스크린은 장벽으로부터 거리 D에 위치

### 회절 계산 (Huygens-Fresnel, 원거리장 근사)

각 열린 구멍을 이차 파원으로 취급한다.

**복소 진폭:**
```
E(y_s) = Σ_j exp(i × k × y_j × y_s / D)
```
- `k = 2π / λ` (파수)
- `y_j` = j번째 열린 구멍의 y좌표
- `y_s` = 스크린 위치
- `D` = 장벽-스크린 거리

**강도:**
```
I(y_s) = |E(y_s)|² = (Σ cos(φ_j))² + (Σ sin(φ_j))²
```
여기서 `φ_j = k × y_j × y_s / D`

### 패턴 비교 (오라클용)

정규화 평균제곱오차(NMSE)로 두 패턴 비교:
```
distance = Σ(I_a[i] - I_b[i])² / Σ I_a[i]²
match = distance < 1e-10
```

---

## 그로버 알고리즘

### 적용 방식

- **탐색 공간 S**: C(N×L, C) 가지 구멍 차단 조합
- **정답 M**: 관측 패턴과 일치하는 조합 (보통 1개)
- 각 기저 상태 |i⟩는 하나의 차단 조합에 대응

### 알고리즘 단계

1. **초기화**: 균일 중첩 `|ψ⟩ = (1/√S) Σ |i⟩` → 모든 진폭 `1/√S`
2. **오라클 O**: 정답 상태의 진폭 부호 반전 `a_marked → -a_marked`
3. **확산 연산자 D**: 평균 반사 `a_i → 2×mean - a_i`
4. **반복**: O → D를 `⌊π/4 × √(S/M)⌋` 회 반복
5. **측정**: 최대 확률 상태가 정답

### 핵심 단순화

- **실수 진폭만 사용**: 균일 실수 초기 상태에서 O, D 연산 모두 실수를 보존
- **사전 계산 오라클**: 모든 후보의 회절 패턴을 미리 계산하여 정답 인덱스 결정. 진폭 진화는 충실히 시뮬레이션

---

## 프로젝트 구조

```
src/
├── types/index.ts                # 공유 TypeScript 인터페이스
├── physics/
│   ├── holeGrid.ts               # 구멍 격자: 위치 계산, 열림/차단 상태
│   ├── diffraction.ts            # 프라운호퍼 회절 패턴 계산
│   └── patternComparison.ts      # 패턴 거리 메트릭 (NMSE)
├── quantum/
│   ├── combinatorics.ts          # C(n,k) 조합 열거 및 카운트
│   ├── oracle.ts                 # 오라클 빌더: 물리 패턴 매칭 → 정답 인덱스
│   └── grover.ts                 # 상태벡터 시뮬레이션: 초기화, O, D, 반복, 히스토리
├── hooks/
│   ├── useSimulation.ts          # 메인 훅: 물리+양자 엔진 오케스트레이션
│   ├── useGroverAnimation.ts     # 그로버 반복 애니메이션 타이머 제어
│   └── useCanvasRenderer.ts      # Canvas 셋업, 리사이즈, 드로잉 유틸
├── components/
│   ├── Layout.tsx                # 3패널 레이아웃 (사이드바 + 메인 3행)
│   ├── ControlPanel.tsx          # 파라미터 슬라이더, 실행 버튼
│   ├── PhysicalView/
│   │   ├── PhysicalView.tsx      # 물리 배치 Canvas 컨테이너
│   │   ├── LightSourceRenderer.ts
│   │   ├── SlitBarrierRenderer.ts
│   │   └── ScreenRenderer.ts
│   ├── DiffractionPattern/
│   │   ├── DiffractionPattern.tsx
│   │   └── PatternRenderer.ts
│   ├── GroverVisualization/
│   │   ├── GroverVisualization.tsx
│   │   ├── AmplitudeBarChart.tsx  # Canvas 기반 진폭 바 차트
│   │   ├── IterationControls.tsx  # 재생/일시정지/단계/초기화
│   │   └── SpeedupComparison.tsx  # 고전 vs 양자 비교 표시
│   └── InfoPanel/
│       ├── InfoPanel.tsx          # 교육용 설명 텍스트
│       └── KoreanText.ts         # 모든 한국어 UI 문자열 상수
└── utils/
    ├── math.ts                   # 조합 계산, 수학 헬퍼
    └── colors.ts                 # 파장→RGB, 강도 색상 매핑
```

---

## 핵심 인터페이스 (types/index.ts)

```typescript
interface HolePosition {
  slitIndex: number;      // 0..L-1
  holeIndex: number;      // 0..N-1
  globalIndex: number;    // 0..N*L-1
  y: number;              // 물리적 y좌표
  isBlocked: boolean;
}

interface HoleGridConfig {
  N: number;              // 슬릿당 구멍 수
  L: number;              // 슬릿 수
  slitSpacing: number;    // 슬릿 간 간격
  holeSpacing: number;    // 구멍 간 간격
}

interface DiffractionConfig {
  wavelength: number;     // 파장 λ
  screenDistance: number;  // 장벽-스크린 거리 D
  screenPoints: number;   // 스크린 샘플 포인트 수
  screenHeight: number;   // 스크린 전체 높이
}

interface GroverState {
  amplitudes: Float64Array;   // 실수 진폭 배열 (길이 S)
  numStates: number;          // S = C(N*L, C)
  markedIndices: number[];    // 정답 인덱스
  iteration: number;          // 현재 반복 횟수
  optimalIterations: number;  // ⌊π/4 × √(S/M)⌋
}

interface GroverHistory {
  states: GroverState[];       // 매 반복 후 상태
  markedProbability: number[]; // 매 반복 후 정답 확률
}

type SimulationPhase = 'setup' | 'blocked' | 'computing' | 'searching' | 'found';
```

---

## 파라미터 제약

| 파라미터 | 범위 | 기본값 | 이유 |
|---------|------|--------|------|
| N (슬릿당 구멍) | 1–6 | 4 | |
| L (슬릿 수) | 1–4 | 3 | |
| C (차단 구멍 수) | 1–min(3, N×L-1) | 2 | |
| 파장 λ | 400–700 nm | 550 nm | 가시광선 범위 |
| **탐색 공간 상한** | ≤ C(24,3) = 2,024 | | Canvas 바 차트 렌더링 한계 |

C(N×L, C) > 5,000이면 UI에서 경고 표시, 실행 차단.

---

## 구현 순서

1. Vite 프로젝트 초기화 (`pnpm create vite . --template react-ts`)
2. 타입 정의 (`types/index.ts`)
3. 물리 엔진 (`physics/` — holeGrid → diffraction → patternComparison)
4. 양자 엔진 (`quantum/` — combinatorics → oracle → grover)
5. React 기반 구조 (utils, hooks, Layout, ControlPanel)
6. PhysicalView Canvas (광원, 슬릿, 스크린)
7. DiffractionPattern Canvas (강도 그래프)
8. GroverVisualization (진폭 바 차트 + 제어 + 속도 비교)
9. InfoPanel + App 통합 + 폴리시

---

## 검증 기준

### 물리
- 단일 구멍 → 균일 강도 (간섭 없음)
- 이중 슬릿 → 코사인 간섭 무늬 (간격 = λD/d)
- N-슬릿 → 회절격자 패턴 (날카로운 피크)

### 양자
- S=4, M=1 → 1회 반복 후 정답 확률 ≈ 1.0
- 최적 반복수 = ⌊π/4 × √(S)⌋ 공식 일치
- 과반복 시 정답 확률 감소 (진동)

### 통합
- 랜덤 차단 → 그로버 실행 → 올바른 차단 배치로 수렴
- 파장 변경 → 간섭 무늬 간격 변화

---

## 개발 명령어

```bash
pnpm install        # 의존성 설치
pnpm dev            # 개발 서버 (Vite)
pnpm build          # 프로덕션 빌드
pnpm preview        # 빌드 결과 미리보기
```
