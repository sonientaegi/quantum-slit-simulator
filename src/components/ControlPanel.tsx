/**
 * Control panel with parameter sliders and action buttons
 * All text in Korean using KR constants
 */

import type {
  SimulationParams,
  SimulationPhase,
  GroverHistory,
} from '../types/index.js';
import { KR } from './InfoPanel/KoreanText.js';
import { wavelengthToRGB } from '../utils/colors.js';

export interface ControlPanelProps {
  params: SimulationParams;
  updateParams: (newParams: Partial<SimulationParams>) => void;
  phase: SimulationPhase;
  searchSpaceSize: number;
  randomizeBlocking: () => void;
  clearBlocking: () => void;
  startGrover: () => void;
  stepForward: () => void;
  stepBackward: () => void;
  resetSearch: () => void;
  groverHistory: GroverHistory | null;
  currentIteration: number;
  isPlaying: boolean;
  togglePlay: () => void;
  onCloseSidebar?: () => void;
}

export function ControlPanel({
  params,
  updateParams,
  phase,
  searchSpaceSize,
  randomizeBlocking,
  clearBlocking,
  startGrover,
  stepForward,
  stepBackward,
  resetSearch,
  groverHistory,
  currentIteration,
  isPlaying,
  togglePlay,
  onCloseSidebar,
}: ControlPanelProps) {
  const totalHoles = params.N * params.L;
  const maxC = totalHoles;
  const [r, g, b] = wavelengthToRGB(params.wavelength);

  const canRandomize = phase === 'setup' || phase === 'blocked';
  const canStartGrover = phase === 'blocked';
  const canControl = phase === 'searching' || phase === 'found';

  const currentState = groverHistory?.states[currentIteration];
  const markedProb = groverHistory?.markedProbability[currentIteration];

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Title */}
      <div>
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
          {KR.title}
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#999' }}>
          {KR.subtitle}
        </p>
      </div>

      {/* Parameters Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* N slider */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: '#ccc',
            }}
          >
            {KR.holesPerSlit}: {params.N}
          </label>
          <input
            type="range"
            min="1"
            max="6"
            value={params.N}
            onChange={(e) => updateParams({ N: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* L slider */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: '#ccc',
            }}
          >
            {KR.numSlits}: {params.L}
          </label>
          <input
            type="range"
            min="1"
            max="4"
            value={params.L}
            onChange={(e) => updateParams({ L: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* C slider */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: '#ccc',
            }}
          >
            {KR.blockedCount}: {params.C}
          </label>
          <input
            type="range"
            min="1"
            max={maxC}
            value={Math.min(params.C, maxC)}
            onChange={(e) => updateParams({ C: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* Wavelength slider */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              marginBottom: '6px',
              color: '#ccc',
            }}
          >
            {KR.wavelength}: {params.wavelength} nm
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="range"
              min="400"
              max="700"
              value={params.wavelength}
              onChange={(e) => updateParams({ wavelength: Number(e.target.value) })}
              style={{ flex: 1 }}
            />
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                backgroundColor: `rgb(${r}, ${g}, ${b})`,
                border: '1px solid #444',
              }}
            />
          </div>
        </div>
      </div>

      {/* Info Display */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#1a1a1a',
          borderRadius: '6px',
          fontSize: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#999' }}>{KR.totalHoles}:</span>
          <span style={{ fontWeight: 600 }}>{totalHoles}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#999' }}>{KR.searchSpace}:</span>
          <span style={{ fontWeight: 600 }}>{searchSpaceSize.toLocaleString()}</span>
        </div>
        {currentState && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#999' }}>{KR.optimalIter}:</span>
              <span style={{ fontWeight: 600 }}>
                {currentState.optimalIterations}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#999' }}>{KR.currentIter}:</span>
              <span style={{ fontWeight: 600 }}>{currentState.iteration}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#999' }}>{KR.markedProb}:</span>
              <span style={{ fontWeight: 600 }}>
                {((markedProb ?? 0) * 100).toFixed(1)}%
              </span>
            </div>
          </>
        )}
      </div>

      {/* Warning for large search space */}
      {searchSpaceSize > 50000 && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#3a2200',
            border: '1px solid #664400',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#ffaa00',
          }}
        >
          {KR.tooManyStates}
        </div>
      )}

      {/* Phase Status */}
      <div
        style={{
          padding: '12px',
          backgroundColor: '#1a1a2a',
          borderRadius: '6px',
          fontSize: '13px',
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        {phase === 'setup' && KR.phase_setup}
        {phase === 'blocked' && KR.phase_blocked}
        {phase === 'computing' && '계산 중...'}
        {phase === 'searching' && KR.phase_searching}
        {phase === 'found' && KR.phase_found}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button
          onClick={randomizeBlocking}
          disabled={!canRandomize}
          style={{
            padding: '10px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: canRandomize ? '#2a5caa' : '#1a1a1a',
            color: canRandomize ? '#fff' : '#555',
            cursor: canRandomize ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {KR.randomize}
        </button>

        <button
          onClick={clearBlocking}
          disabled={phase === 'setup'}
          style={{
            padding: '10px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: phase !== 'setup' ? '#2a2a2a' : '#1a1a1a',
            color: phase !== 'setup' ? '#ccc' : '#555',
            cursor: phase !== 'setup' ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          차단 초기화
        </button>

        <button
          onClick={startGrover}
          disabled={!canStartGrover || searchSpaceSize > 50000}
          style={{
            padding: '10px',
            fontSize: '14px',
            fontWeight: 600,
            borderRadius: '6px',
            border: 'none',
            backgroundColor: canStartGrover && searchSpaceSize <= 50000 ? '#2a8a5c' : '#1a1a1a',
            color: canStartGrover && searchSpaceSize <= 50000 ? '#fff' : '#555',
            cursor: canStartGrover && searchSpaceSize <= 50000 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {KR.runGrover}
        </button>

        {/* Grover Control Buttons */}
        {canControl && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={stepBackward}
              disabled={currentIteration === 0}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#1a1a1a',
                color: currentIteration > 0 ? '#ccc' : '#555',
                cursor: currentIteration > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              ◀ {KR.step}
            </button>

            <button
              onClick={() => {
                togglePlay();
                onCloseSidebar?.();
              }}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#5c2a8a',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? KR.pause : KR.play}
            </button>

            <button
              onClick={stepForward}
              disabled={
                !groverHistory || currentIteration >= groverHistory.states.length - 1
              }
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #333',
                backgroundColor: '#1a1a1a',
                color:
                  groverHistory && currentIteration < groverHistory.states.length - 1
                    ? '#ccc'
                    : '#555',
                cursor:
                  groverHistory && currentIteration < groverHistory.states.length - 1
                    ? 'pointer'
                    : 'not-allowed',
              }}
            >
              {KR.step} ▶
            </button>
          </div>
        )}

        {canControl && (
          <button
            onClick={resetSearch}
            style={{
              padding: '8px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #444',
              backgroundColor: '#2a2a2a',
              color: '#ccc',
              cursor: 'pointer',
            }}
          >
            {KR.reset}
          </button>
        )}
      </div>
    </div>
  );
}
