import { useRef, useEffect } from 'react';
import { wavelengthToRGB } from '../../utils/colors.js';
import { KR } from '../InfoPanel/KoreanText.js';

interface DiffractionPatternProps {
  pattern: Float64Array | null;
  wavelength: number;
  screenHeight: number;
}

export function DiffractionPattern({
  pattern,
  wavelength,
  screenHeight,
}: DiffractionPatternProps) {
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
      drawPattern(ctx, width, height, pattern, wavelength, screenHeight);
    });

    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [pattern, wavelength, screenHeight]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#111',
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

function drawPattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  pattern: Float64Array | null,
  wavelength: number,
  screenHeight: number
) {
  ctx.clearRect(0, 0, width, height);

  const padding = { left: 60, right: 20, top: 20, bottom: 40 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  // Draw axes
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top);
  ctx.lineTo(padding.left, padding.top + plotHeight);
  ctx.lineTo(padding.left + plotWidth, padding.top + plotHeight);
  ctx.stroke();

  // Draw grid
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.setLineDash([2, 2]);

  // Horizontal grid lines
  const numYGridLines = 5;
  for (let i = 0; i <= numYGridLines; i++) {
    const y = padding.top + (plotHeight * i) / numYGridLines;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + plotWidth, y);
    ctx.stroke();
  }

  // Vertical grid lines
  const numXGridLines = 5;
  for (let i = 0; i <= numXGridLines; i++) {
    const x = padding.left + (plotWidth * i) / numXGridLines;
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + plotHeight);
    ctx.stroke();
  }

  ctx.setLineDash([]);

  if (!pattern || pattern.length === 0) {
    // No data message
    ctx.fillStyle = '#666';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('패턴 없음', width / 2, height / 2);
    return;
  }

  // Find max intensity
  let maxIntensity = 0;
  for (let i = 0; i < pattern.length; i++) {
    maxIntensity = Math.max(maxIntensity, pattern[i]);
  }
  if (maxIntensity === 0) maxIntensity = 1;

  // Draw filled area
  const [r, g, b] = wavelengthToRGB(wavelength);
  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
  ctx.beginPath();
  ctx.moveTo(padding.left, padding.top + plotHeight);

  for (let i = 0; i < pattern.length; i++) {
    const x = padding.left + (plotWidth * i) / (pattern.length - 1);
    const normalizedIntensity = pattern[i] / maxIntensity;
    const y = padding.top + plotHeight * (1 - normalizedIntensity);
    if (i === 0) {
      ctx.lineTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.lineTo(padding.left + plotWidth, padding.top + plotHeight);
  ctx.closePath();
  ctx.fill();

  // Draw line plot
  ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i < pattern.length; i++) {
    const x = padding.left + (plotWidth * i) / (pattern.length - 1);
    const normalizedIntensity = pattern[i] / maxIntensity;
    const y = padding.top + plotHeight * (1 - normalizedIntensity);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();

  // Draw axis labels
  ctx.fillStyle = '#ccc';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';

  // X-axis label
  ctx.fillText(KR.position, padding.left + plotWidth / 2, height - 5);

  // X-axis tick labels
  const xTickCount = 5;
  for (let i = 0; i <= xTickCount; i++) {
    const x = padding.left + (plotWidth * i) / xTickCount;
    const position = -screenHeight / 2 + (screenHeight * i) / xTickCount;
    ctx.fillText(position.toFixed(1), x, padding.top + plotHeight + 20);
  }

  // Y-axis label
  ctx.save();
  ctx.translate(15, padding.top + plotHeight / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText(KR.intensity, 0, 0);
  ctx.restore();

  // Y-axis tick labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= numYGridLines; i++) {
    const y = padding.top + (plotHeight * i) / numYGridLines;
    const value = maxIntensity * (1 - i / numYGridLines);
    ctx.fillText(value.toFixed(2), padding.left - 5, y + 4);
  }
}
