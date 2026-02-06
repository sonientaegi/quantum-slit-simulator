/**
 * Korean text constants for quantum slit diffraction simulator UI
 * All user-facing strings in Korean
 */

export const KR = {
  // Main titles
  title: '다중 슬릿 회절 + 그로버 양자 탐색 시뮬레이터',
  subtitle: '회절 패턴으로 차단된 구멍 찾기',

  // Control panel labels
  holesPerSlit: '슬릿당 구멍 수 (N)',
  numSlits: '슬릿 수 (L)',
  blockedCount: '차단할 구멍 수 (C)',
  wavelength: '파장 (nm)',

  // Action buttons
  randomize: '랜덤 차단',
  runGrover: '그로버 탐색 시작',
  step: '한 단계',
  play: '자동 재생',
  pause: '일시정지',
  reset: '초기화',

  // Status display
  totalHoles: '전체 구멍 수',
  searchSpace: '탐색 공간 크기',
  optimalIter: '최적 반복 횟수',
  currentIter: '현재 반복',
  markedProb: '정답 확률',

  // Comparison labels
  classicalSearch: '고전적 탐색',
  quantumSearch: '양자 탐색 (그로버)',
  speedup: '속도 향상',
  evaluations: '회 평가',
  iterations: '회 반복',

  // Visualization labels
  lightSource: '광원',
  barrier: '슬릿 장벽',
  screen: '검출 스크린',
  intensity: '세기',
  amplitude: '진폭',
  position: '위치',

  // Hole states
  blocked: '차단됨',
  open: '열림',
  found: '발견!',

  // Phase descriptions
  phase_setup: '파라미터를 설정하세요',
  phase_blocked: '구멍이 차단되었습니다. 그로버 탐색을 시작하세요.',
  phase_searching: '그로버 알고리즘이 차단된 구멍을 탐색 중입니다...',
  phase_found: '차단된 구멍 위치를 찾았습니다!',

  // Info panel content
  infoTitle: '작동 원리',
  infoOracle:
    '오라클은 각 후보 배치의 회절 패턴을 관측된 패턴과 비교합니다. 패턴이 일치하면 해당 상태의 진폭 부호를 반전시킵니다.',
  infoDiffuser:
    '확산 연산자(Diffuser)는 모든 진폭의 평균을 기준으로 각 진폭을 반전시킵니다. 이를 통해 오라클에 의해 부호가 반전된 정답 상태의 진폭이 증폭됩니다.',
  infoAmplification:
    '매 반복(오라클 + 확산)마다 정답 상태의 확률은 증가하고 오답 상태의 확률은 감소합니다. 약 √S회 반복 후 정답을 높은 확률로 찾을 수 있습니다.',
  infoClassical:
    '고전적 탐색은 최악의 경우 S개의 후보를 모두 확인해야 하지만, 그로버 알고리즘은 약 √S회 반복만으로 정답을 찾습니다. 이것이 양자 속도 향상(Quantum Speedup)입니다.',

  // Error messages
  tooManyStates: '탐색 공간이 너무 큽니다. 파라미터를 줄여주세요.',
} as const;
