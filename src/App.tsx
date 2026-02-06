import { useSimulation } from './hooks/useSimulation.js';
import { useGroverAnimation } from './hooks/useGroverAnimation.js';
import { Layout } from './components/Layout.js';
import { ControlPanel } from './components/ControlPanel.js';
import { PhysicalView } from './components/PhysicalView/PhysicalView.js';
import { DiffractionPattern } from './components/DiffractionPattern/DiffractionPattern.js';
import { GroverVisualization } from './components/GroverVisualization/GroverVisualization.js';

export default function App() {
  const sim = useSimulation();

  const maxSteps = sim.groverHistory
    ? sim.groverHistory.states.length - 1
    : 0;

  const { isPlaying, toggle } = useGroverAnimation(
    sim.stepForward,
    maxSteps,
    sim.currentIteration,
  );

  return (
    <Layout
      sidebar={
        <ControlPanel
          params={sim.params}
          updateParams={sim.updateParams}
          phase={sim.phase}
          searchSpaceSize={sim.searchSpaceSize}
          randomizeBlocking={sim.randomizeBlocking}
          clearBlocking={sim.clearBlocking}
          startGrover={sim.startGrover}
          stepForward={sim.stepForward}
          stepBackward={sim.stepBackward}
          resetSearch={sim.resetSearch}
          groverHistory={sim.groverHistory}
          currentIteration={sim.currentIteration}
          isPlaying={isPlaying}
          togglePlay={toggle}
        />
      }
      physicalView={
        <PhysicalView
          holeGrid={sim.holeGrid}
          wavelength={sim.params.wavelength}
          observedPattern={sim.observedPattern}
          phase={sim.phase}
        />
      }
      diffractionPattern={
        <DiffractionPattern
          pattern={sim.observedPattern}
          wavelength={sim.params.wavelength}
          screenHeight={sim.diffractionConfig.screenHeight}
        />
      }
      groverVisualization={
        <GroverVisualization
          groverHistory={sim.groverHistory}
          currentIteration={sim.currentIteration}
          searchSpaceSize={sim.searchSpaceSize}
        />
      }
    />
  );
}
