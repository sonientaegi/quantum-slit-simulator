import type { GroverHistory } from '../../types/index.js';
import { AmplitudeBarChart } from './AmplitudeBarChart.js';
import { SpeedupComparison } from './SpeedupComparison.js';

interface GroverVisualizationProps {
  groverHistory: GroverHistory | null;
  currentIteration: number;
  searchSpaceSize: number;
}

export function GroverVisualization({
  groverHistory,
  currentIteration,
  searchSpaceSize,
}: GroverVisualizationProps) {
  const currentState =
    groverHistory && currentIteration < groverHistory.states.length
      ? groverHistory.states[currentIteration]
      : null;

  const markedProbability =
    groverHistory && currentIteration < groverHistory.markedProbability.length
      ? groverHistory.markedProbability[currentIteration]
      : 0;

  const optimalIterations = currentState?.optimalIterations ?? 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        height: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
        }}
      >
        <AmplitudeBarChart
          state={currentState}
          markedProbability={markedProbability}
        />
      </div>
      <div
        style={{
          flexShrink: 0,
        }}
      >
        <SpeedupComparison
          searchSpaceSize={searchSpaceSize}
          optimalIterations={optimalIterations}
          currentIteration={currentIteration}
        />
      </div>
    </div>
  );
}
