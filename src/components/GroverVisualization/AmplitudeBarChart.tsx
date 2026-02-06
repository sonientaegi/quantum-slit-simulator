import { useRef, useEffect } from 'react';
import type { GroverState } from '../../types/index.js';
import { KR } from '../InfoPanel/KoreanText.js';

interface AmplitudeBarChartProps {
  state: GroverState | null;
  markedProbability: number;
}

export function AmplitudeBarChart({
  state,
  markedProbability,
}: AmplitudeBarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      drawAmplitudes(ctx, width, height, state, markedProbability);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [state, markedProbability]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#111',
        borderRadius: '4px',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

function drawAmplitudes(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GroverState | null,
  markedProbability: number
) {
  ctx.clearRect(0, 0, width, height);

  const padding = { left: 60, right: 20, top: 60, bottom: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  if (!state || state.numStates === 0) {
    ctx.fillStyle = '#666';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('데이터 없음', width / 2, height / 2);
    return;
  }

  // Calculate amplitude range
  let maxAbs = 0;
  for (let i = 0; i < state.numStates; i++) {
    maxAbs = Math.max(maxAbs, Math.abs(state.amplitudes[i]));
  }
  if (maxAbs === 0) maxAbs = 1;

  // Calculate probabilities
  const probabilities = new Float64Array(state.numStates);
  for (let i = 0; i < state.numStates; i++) {
    probabilities[i] = state.amplitudes[i] * state.amplitudes[i];
  }

  // Calculate mean amplitude for reference line
  let sum = 0;
  for (let i = 0; i < state.numStates; i++) {
    sum += state.amplitudes[i];
  }
  const meanAmplitude = sum / state.numStates;

  // Zero line (middle of plot)
  const zeroY = padding.top + plotHeight / 2;

  // Draw axes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + plotHeight);
  ctx.lineTo(padding.left + plotWidth, padding.top + plotHeight);
  ctx.stroke();

  // Draw zero line
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding.left, zeroY);
  ctx.lineTo(padding.left + plotWidth, zeroY);
  ctx.stroke();

  // Draw mean amplitude line (dashed)
  const meanY = zeroY - (meanAmplitude / maxAbs) * (plotHeight / 2);
  ctx.strokeStyle = '#0af';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padding.left, meanY);
  ctx.lineTo(padding.left + plotWidth, meanY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Determine how many states to show
  const maxStatesToShow = 100;
  const showAllStates = state.numStates <= maxStatesToShow;
  const statesToShow = showAllStates ? state.numStates : maxStatesToShow;
  const stride = showAllStates ? 1 : Math.ceil(state.numStates / maxStatesToShow);

  // Draw bars
  const barWidth = plotWidth / statesToShow;
  const barSpacing = Math.min(2, barWidth * 0.1);
  const actualBarWidth = barWidth - barSpacing;

  for (let i = 0; i < statesToShow; i++) {
    const stateIndex = i * stride;
    if (stateIndex >= state.numStates) break;

    const amplitude = state.amplitudes[stateIndex];
    const isMarked = state.markedIndices.includes(stateIndex);

    const x = padding.left + i * barWidth;
    const barHeight = (Math.abs(amplitude) / maxAbs) * (plotHeight / 2);
    const barY = amplitude >= 0 ? zeroY - barHeight : zeroY;

    // Draw bar
    ctx.fillStyle = isMarked ? '#FFD700' : '#4488ff';
    ctx.fillRect(x + barSpacing / 2, barY, actualBarWidth, Math.abs(barHeight));

    // Draw outline for marked states
    if (isMarked) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        x + barSpacing / 2,
        barY,
        actualBarWidth,
        Math.abs(barHeight)
      );
    }
  }

  // Draw labels
  ctx.fillStyle = '#ccc';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';

  // Title
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(
    `반복 ${state.iteration} / ${state.optimalIterations}`,
    width / 2,
    20
  );
  ctx.fillText(
    `정답 확률: ${(markedProbability * 100).toFixed(1)}%`,
    width / 2,
    40
  );

  ctx.font = '12px sans-serif';

  // Y-axis label
  ctx.save();
  ctx.translate(15, padding.top + plotHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(KR.amplitude, 0, 0);
  ctx.restore();

  // Y-axis tick labels
  ctx.textAlign = 'right';
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const value = maxAbs * (1 - (2 * i) / yTicks);
    const y = padding.top + (plotHeight * i) / yTicks;
    ctx.fillText(value.toFixed(3), padding.left - 5, y + 4);
  }

  // X-axis label
  ctx.textAlign = 'center';
  ctx.fillText('상태 인덱스', padding.left + plotWidth / 2, height - 10);

  if (!showAllStates) {
    ctx.fillStyle = '#888';
    ctx.font = '11px sans-serif';
    ctx.fillText(
      `(${state.numStates}개 상태 중 샘플링)`,
      padding.left + plotWidth / 2,
      height - 25
    );
  }

  // Legend
  ctx.textAlign = 'left';
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(padding.left, padding.top - 35, 15, 10);
  ctx.fillStyle = '#ccc';
  ctx.fillText('정답 상태', padding.left + 20, padding.top - 27);

  ctx.fillStyle = '#4488ff';
  ctx.fillRect(padding.left + 100, padding.top - 35, 15, 10);
  ctx.fillStyle = '#ccc';
  ctx.fillText('일반 상태', padding.left + 120, padding.top - 27);
}
