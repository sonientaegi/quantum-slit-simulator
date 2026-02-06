/**
 * Canvas setup and utility hook with automatic resize handling
 */

import { useEffect, useState, type RefObject } from 'react';

export interface UseCanvasRendererResult {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D | null;
}

export function useCanvasRenderer(
  canvasRef: RefObject<HTMLCanvasElement | null>
): UseCanvasRendererResult {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get 2D context
    const context = canvas.getContext('2d');
    setCtx(context);

    // Handle resize with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;

        // Set canvas dimensions with device pixel ratio for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        canvas.width = w * dpr;
        canvas.height = h * dpr;

        // Scale context to match device pixel ratio
        if (context) {
          context.scale(dpr, dpr);
        }

        // Update state with CSS dimensions
        setWidth(w);
        setHeight(h);
      }
    });

    // Observe the canvas element
    resizeObserver.observe(canvas);

    // Initial size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    if (context) {
      context.scale(dpr, dpr);
    }
    setWidth(rect.width);
    setHeight(rect.height);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef]);

  return { width, height, ctx };
}
