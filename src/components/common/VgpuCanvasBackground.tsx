import React, { useEffect, useRef } from 'react';
import { VgpuService, type ShaderPresetId } from '../../services/vgpuService';

interface VgpuCanvasBackgroundProps {
  preset?: ShaderPresetId;
  onFpsUpdate?: (fps: number) => void;
  interactive?: boolean;
}

export const VgpuCanvasBackground: React.FC<VgpuCanvasBackgroundProps> = ({
  preset = 'emerald_aurora',
  onFpsUpdate,
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const vgpu = VgpuService.getInstance();
    const cleanup = vgpu.startRenderer(canvas, preset, onFpsUpdate);

    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const xNorm = e.clientX / window.innerWidth;
      const yNorm = e.clientY / window.innerHeight;
      vgpu.setMousePosition(xNorm, yNorm);
    };

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    return () => {
      cleanup();
      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
    };
  }, [preset, onFpsUpdate, interactive]);

  return (
    <div className="vgpu-canvas-container" aria-hidden="true">
      <canvas ref={canvasRef} className="vgpu-canvas" />
      {/* Specular vignette overlay to guarantee text contrast */}
      <div className="vgpu-contrast-scrim" />
    </div>
  );
};
