import type { SimulationPhase } from '../../types/index.js';
import { KR } from './KoreanText.js';

interface InfoPanelProps {
  phase: SimulationPhase;
}

export function InfoPanel({ phase }: InfoPanelProps) {
  return (
    <div
      style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '20px',
        color: '#ccc',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <h2
        style={{
          margin: '0 0 16px 0',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#fff',
        }}
      >
        {KR.infoTitle}
      </h2>

      {phase === 'setup' && (
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#8af',
              marginBottom: '12px',
            }}
          >
            {KR.title}
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}
          >
            {KR.subtitle}
          </p>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#aaa',
            }}
          >
            {KR.phase_setup}
          </p>
        </div>
      )}

      {phase === 'blocked' && (
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#f84',
              marginBottom: '12px',
            }}
          >
            오라클 (Oracle)
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}
          >
            {KR.infoOracle}
          </p>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#aaa',
            }}
          >
            {KR.phase_blocked}
          </p>
        </div>
      )}

      {phase === 'computing' && (
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#fa4',
              marginBottom: '12px',
            }}
          >
            회절 패턴 계산 중...
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            오라클이 후보 배치의 회절 패턴을 계산하고 있습니다.
          </p>
        </div>
      )}

      {phase === 'searching' && (
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#4af',
              marginBottom: '12px',
            }}
          >
            확산 연산자 (Diffuser)
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}
          >
            {KR.infoDiffuser}
          </p>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#8f8',
              marginTop: '16px',
              marginBottom: '12px',
            }}
          >
            진폭 증폭
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '12px',
            }}
          >
            {KR.infoAmplification}
          </p>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#aaa',
            }}
          >
            {KR.phase_searching}
          </p>
        </div>
      )}

      {phase === 'found' && (
        <div>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFD700',
              marginBottom: '12px',
            }}
          >
            탐색 완료!
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
              marginBottom: '12px',
              color: '#fff',
            }}
          >
            {KR.phase_found}
          </p>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#8f8',
              marginTop: '16px',
              marginBottom: '12px',
            }}
          >
            양자 속도 향상 (Quantum Speedup)
          </h3>
          <p
            style={{
              fontSize: '14px',
              lineHeight: '1.6',
            }}
          >
            {KR.infoClassical}
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#2a2a2a',
          borderRadius: '4px',
          borderLeft: '4px solid #4af',
        }}
      >
        <h4
          style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#4af',
          }}
        >
          알고리즘 단계
        </h4>
        <ol
          style={{
            margin: 0,
            paddingLeft: '20px',
            fontSize: '13px',
            lineHeight: '1.6',
          }}
        >
          <li>균일한 중첩 상태 초기화</li>
          <li>오라클: 정답 상태 부호 반전</li>
          <li>확산: 평균 기준 진폭 반전</li>
          <li>2-3 단계를 √S회 반복</li>
          <li>측정하여 정답 획득</li>
        </ol>
      </div>
    </div>
  );
}
