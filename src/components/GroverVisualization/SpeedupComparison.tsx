import { KR } from '../InfoPanel/KoreanText.js';

interface SpeedupComparisonProps {
  searchSpaceSize: number;
  optimalIterations: number;
  currentIteration: number;
}

export function SpeedupComparison({
  searchSpaceSize,
  optimalIterations,
  currentIteration,
}: SpeedupComparisonProps) {
  const speedup = searchSpaceSize > 0 ? Math.sqrt(searchSpaceSize) : 1;
  const classicalProgress =
    searchSpaceSize > 0 ? currentIteration / searchSpaceSize : 0;
  const quantumProgress =
    optimalIterations > 0 ? currentIteration / optimalIterations : 0;

  return (
    <div
      style={{
        backgroundColor: '#222',
        borderRadius: '8px',
        padding: '16px',
        color: '#ccc',
      }}
    >
      <h3
        style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#fff',
        }}
      >
        {KR.infoTitle}
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Classical Search */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
              fontSize: '14px',
            }}
          >
            <span>{KR.classicalSearch}</span>
            <span>
              {searchSpaceSize} {KR.evaluations}
            </span>
          </div>
          <div
            style={{
              height: '20px',
              backgroundColor: '#333',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: '#f44',
                width: `${Math.min(100, classicalProgress * 100)}%`,
                transition: 'width 0.3s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '0 0 3px rgba(0,0,0,0.8)',
              }}
            >
              {searchSpaceSize}
            </span>
          </div>
        </div>

        {/* Quantum Search */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
              fontSize: '14px',
            }}
          >
            <span>{KR.quantumSearch}</span>
            <span>
              {optimalIterations} {KR.iterations}
            </span>
          </div>
          <div
            style={{
              height: '20px',
              backgroundColor: '#333',
              borderRadius: '4px',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                height: '100%',
                backgroundColor: '#4af',
                width: `${Math.min(100, quantumProgress * 100)}%`,
                transition: 'width 0.3s ease',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: '#fff',
                fontWeight: 'bold',
                textShadow: '0 0 3px rgba(0,0,0,0.8)',
              }}
            >
              {optimalIterations}
            </span>
          </div>
        </div>

        {/* Speedup */}
        <div
          style={{
            marginTop: '8px',
            padding: '12px',
            backgroundColor: '#1a3a1a',
            borderRadius: '4px',
            border: '1px solid #2a5a2a',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#8f8',
              }}
            >
              {KR.speedup}
            </span>
            <span
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#8f8',
              }}
            >
              ~{Math.round(speedup)}배
            </span>
          </div>
          <div
            style={{
              marginTop: '4px',
              fontSize: '12px',
              color: '#aaa',
            }}
          >
            √{searchSpaceSize} ≈ {Math.round(speedup)}
          </div>
        </div>
      </div>
    </div>
  );
}
