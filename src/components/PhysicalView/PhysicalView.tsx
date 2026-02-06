import { useRef, useEffect } from 'react';
import type { HolePosition, SimulationPhase } from '../../types/index.js';
import { wavelengthToRGB, intensityToColor } from '../../utils/colors.js';
import { KR } from '../InfoPanel/KoreanText.js';

interface PhysicalViewProps {
  holeGrid: HolePosition[];
  wavelength: number;
  observedPattern: Float64Array | null;
  phase: SimulationPhase;
  foundBlockedIndices?: number[];
}

export function PhysicalView({
  holeGrid,
  wavelength,
  observedPattern,
  phase,
  foundBlockedIndices = [],
}: PhysicalViewProps) {
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
      drawPhysicalView(
        ctx,
        width,
        height,
        holeGrid,
        wavelength,
        observedPattern,
        phase,
        foundBlockedIndices
      );
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [holeGrid, wavelength, observedPattern, phase, foundBlockedIndices]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#000',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

function drawPhysicalView(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  holeGrid: HolePosition[],
  wavelength: number,
  observedPattern: Float64Array | null,
  phase: SimulationPhase,
  foundBlockedIndices: number[]
) {
  ctx.clearRect(0, 0, width, height);

  const leftWidth = width * 0.25;
  const centerWidth = width * 0.2;
  const rightWidth = width * 0.45;
  const margin = width * 0.05;

  const [r, g, b] = wavelengthToRGB(wavelength);
  const wavelengthColor = `rgb(${r}, ${g}, ${b})`;

  // LEFT: Light source
  drawLightSource(ctx, leftWidth / 2, height / 2, wavelengthColor, wavelength);
  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(KR.lightSource, leftWidth / 2, height - 10);

  // CENTER: Slit barrier
  const barrierX = leftWidth + margin;
  drawSlitBarrier(
    ctx,
    barrierX,
    0,
    centerWidth,
    height,
    holeGrid,
    phase,
    foundBlockedIndices
  );
  ctx.fillStyle = '#fff';
  ctx.fillText(KR.barrier, barrierX + centerWidth / 2, height - 10);

  // RIGHT: Detection screen
  const screenX = barrierX + centerWidth + margin;
  drawDetectionScreen(
    ctx,
    screenX,
    0,
    rightWidth - margin,
    height,
    observedPattern,
    wavelength
  );
  ctx.fillStyle = '#fff';
  ctx.fillText(KR.screen, screenX + rightWidth / 2, height - 10);
}

function drawLightSource(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  _wavelength: number
) {
  // Source circle
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fill();

  // Emanating wavefronts (concentric circles)
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.4;
  ctx.lineWidth = 1.5;

  for (let i = 1; i <= 5; i++) {
    ctx.beginPath();
    ctx.arc(x, y, 15 * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Ray lines
  ctx.globalAlpha = 0.6;
  const rayCount = 8;
  for (let i = 0; i < rayCount; i++) {
    const angle = (Math.PI * 2 * i) / rayCount;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * 50, y + Math.sin(angle) * 50);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

function drawSlitBarrier(
  ctx: CanvasRenderingContext2D,
  x: number,
  _y: number,
  width: number,
  height: number,
  holeGrid: HolePosition[],
  _phase: SimulationPhase,
  foundBlockedIndices: number[]
) {
  if (holeGrid.length === 0) return;

  const numSlits = Math.max(...holeGrid.map((h) => h.slitIndex)) + 1;
  const holesPerSlit = Math.max(...holeGrid.map((h) => h.holeIndex)) + 1;

  // Each slit is a thin vertical barrier, evenly spaced across the width
  const slitSpacing = width / (numSlits + 1);
  const barrierThickness = 4;
  const holeRadius = 5;
  const yPadding = height * 0.12;
  const usableHeight = height - 2 * yPadding;
  const holeSpacing = holesPerSlit > 1 ? usableHeight / (holesPerSlit - 1) : 0;

  for (let s = 0; s < numSlits; s++) {
    const slitX = x + slitSpacing * (s + 1);

    // Draw the vertical barrier line
    ctx.fillStyle = '#555';
    ctx.fillRect(slitX - barrierThickness / 2, 0, barrierThickness, height);

    // Draw holes on this slit
    for (let n = 0; n < holesPerSlit; n++) {
      const hole = holeGrid.find((h) => h.slitIndex === s && h.holeIndex === n);
      if (!hole) continue;

      const holeY = holesPerSlit > 1
        ? yPadding + n * holeSpacing
        : height / 2;

      const isFound = foundBlockedIndices.includes(hole.globalIndex);

      if (isFound) {
        ctx.strokeStyle = '#FFD700';
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(slitX, holeY, holeRadius + 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (hole.isBlocked) {
        // Blocked: filled red circle with X
        ctx.fillStyle = '#f44';
        ctx.beginPath();
        ctx.arc(slitX, holeY, holeRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        const off = holeRadius * 0.6;
        ctx.beginPath();
        ctx.moveTo(slitX - off, holeY - off);
        ctx.lineTo(slitX + off, holeY + off);
        ctx.moveTo(slitX + off, holeY - off);
        ctx.lineTo(slitX - off, holeY + off);
        ctx.stroke();
      } else {
        // Open: hollow white circle, cut a gap in the barrier
        ctx.fillStyle = '#000';
        ctx.fillRect(slitX - barrierThickness / 2 - 1, holeY - holeRadius, barrierThickness + 2, holeRadius * 2);

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(slitX, holeY, holeRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
}

function drawDetectionScreen(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  pattern: Float64Array | null,
  wavelength: number
) {
  // Screen background
  ctx.fillStyle = '#111';
  ctx.fillRect(x, y, width, height);

  if (!pattern || pattern.length === 0) return;

  // Normalize pattern
  let maxIntensity = 0;
  for (let i = 0; i < pattern.length; i++) {
    maxIntensity = Math.max(maxIntensity, pattern[i]);
  }
  if (maxIntensity === 0) maxIntensity = 1;

  // Draw pattern
  const pixelHeight = height / pattern.length;
  for (let i = 0; i < pattern.length; i++) {
    const intensity = pattern[i] / maxIntensity;
    ctx.fillStyle = intensityToColor(intensity, wavelength);
    ctx.fillRect(x, y + i * pixelHeight, width, Math.ceil(pixelHeight) + 1);
  }

  // Screen outline
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}
