/**
 * OmniPulse AI Studio - VGPU WebGPU Service
 * Powered by Vercel Labs vgpu library (https://vgpu.sh).
 *
 * Provides high-performance GPU shaders, adaptive resolution,
 * interactive pointer reactivity, and seamless Canvas2D fallback.
 */

import { init, effect, surface, clock, frameLoop } from 'vgpu';
import type { Gpu } from 'vgpu';

export type ShaderPresetId = 'emerald_aurora' | 'celestial_nebula' | 'quantum_lattice';

export interface ShaderPreset {
  id: ShaderPresetId;
  name: string;
  description: string;
  accentColor: string;
}

export const SHADER_PRESETS: ShaderPreset[] = [
  {
    id: 'emerald_aurora',
    name: 'Royal Emerald Aurora',
    description: 'Fluide boréal émeraude islamique & reflets or 24K',
    accentColor: '#10B981'
  },
  {
    id: 'celestial_nebula',
    name: 'Celestial Gold Nebula',
    description: 'Nébuleuse stellaire dorée réactive aux mouvements',
    accentColor: '#F59E0B'
  },
  {
    id: 'quantum_lattice',
    name: 'Sacred Quantum Lattice',
    description: 'Structure géométrique sacrée et pulsations quantiques',
    accentColor: '#06B6D4'
  }
];

// WGSL Shaders written for vgpu effect()
// effect() automatically feeds @location(0) uv: vec2f into fs_main
const SHADERS: Record<ShaderPresetId, string> = {
  emerald_aurora: `
    struct Uniforms {
      time: f32,
      intensity: f32,
      mouse: vec2f,
      resolution: vec2f,
    }
    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    @fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
      let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);
      let m = vec2f((uniforms.mouse.x - 0.5) * aspect, uniforms.mouse.y - 0.5);
      
      let t = uniforms.time * 0.35;
      let distMouse = length(p - m);
      let mouseInfluence = smoothstep(0.65, 0.0, distMouse) * 0.45;

      // Complex fluid wave synthesis
      var wave1 = sin(p.x * 2.8 + t + sin(p.y * 3.2 + t * 0.7));
      var wave2 = cos(p.y * 3.5 - t * 0.8 + cos(p.x * 2.1 + t));
      var wave3 = sin((p.x + p.y) * 2.2 + t * 1.2);
      let fluid = (wave1 + wave2 + wave3) / 3.0;

      // Islamic Royal Obsidian Base: #030712
      let baseDark = vec3f(0.012, 0.027, 0.071);

      // Royal Emerald: #10B981 & Emerald Glow: #34D399
      let emerald = vec3f(0.063, 0.725, 0.506);
      let emeraldLight = vec3f(0.204, 0.827, 0.6);

      // Imperial Gold Accents: #F59E0B
      let gold = vec3f(0.961, 0.62, 0.043);

      // Calculate organic aurora ribbons
      let ribbon1 = smoothstep(0.18, 0.75, fluid + 0.3 + mouseInfluence);
      let ribbon2 = smoothstep(0.45, 0.85, -fluid + 0.1);

      var col = mix(baseDark, emerald * 0.65, ribbon1 * 0.4);
      col = mix(col, emeraldLight * 0.8, ribbon1 * ribbon1 * 0.35);
      col = mix(col, gold * 0.7, ribbon2 * 0.3 + mouseInfluence * 0.35);

      // Vignette to keep content readable
      let vignette = smoothstep(1.3, 0.2, length(p));
      col = col * (0.4 + 0.6 * vignette) * uniforms.intensity;

      return vec4f(col, 1.0);
    }
  `,

  celestial_nebula: `
    struct Uniforms {
      time: f32,
      intensity: f32,
      mouse: vec2f,
      resolution: vec2f,
    }
    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    @fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
      let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);
      let m = vec2f((uniforms.mouse.x - 0.5) * aspect, uniforms.mouse.y - 0.5);
      
      let t = uniforms.time * 0.22;
      let r = length(p);
      let angle = atan2(p.y, p.x);

      // Swirling golden cosmic vortex
      let spiral = sin(angle * 3.0 + r * 5.0 - t * 1.5);
      let spiral2 = cos(angle * 5.0 - r * 8.0 + t);
      let dust = smoothstep(0.2, 0.85, (spiral + spiral2) * 0.5 + 0.5);

      // Mouse stellar attraction
      let mouseDist = length(p - m);
      let mouseGlow = exp(-mouseDist * 3.2) * 0.5;

      let deepSpace = vec3f(0.015, 0.02, 0.05);
      let goldCore = vec3f(0.98, 0.72, 0.15);
      let amberGlow = vec3f(0.85, 0.45, 0.08);
      let celestialCyan = vec3f(0.08, 0.75, 0.85);

      var color = mix(deepSpace, amberGlow * 0.45, dust * 0.35);
      color = mix(color, goldCore * 0.7, pow(dust, 2.5) * 0.5);
      color += celestialCyan * mouseGlow * 0.4;
      color += goldCore * exp(-r * 2.2) * 0.25;

      let vignette = smoothstep(1.2, 0.3, r);
      color = color * vignette * uniforms.intensity;

      return vec4f(color, 1.0);
    }
  `,

  quantum_lattice: `
    struct Uniforms {
      time: f32,
      intensity: f32,
      mouse: vec2f,
      resolution: vec2f,
    }
    @group(0) @binding(0) var<uniform> uniforms: Uniforms;

    @fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      let aspect = uniforms.resolution.x / max(uniforms.resolution.y, 1.0);
      let p = vec2f((uv.x - 0.5) * aspect, uv.y - 0.5);
      let m = vec2f((uniforms.mouse.x - 0.5) * aspect, uniforms.mouse.y - 0.5);

      let t = uniforms.time * 0.4;
      let gridScale = 22.0;
      let gridCoord = fract(p * gridScale) - 0.5;
      let lineDist = min(abs(gridCoord.x), abs(gridCoord.y));

      let mouseDist = length(p - m);
      let ripple = sin(mouseDist * 16.0 - t * 2.5) * 0.5 + 0.5;
      let rippleGlow = smoothstep(0.8, 0.0, mouseDist) * ripple;

      // Hexagonal / sacred diagonal flow
      let diag = sin((p.x + p.y) * 14.0 + t);
      let lattice = smoothstep(0.06, 0.01, lineDist);

      let baseObsidian = vec3f(0.01, 0.02, 0.06);
      let neonEmerald = vec3f(0.06, 0.85, 0.55);
      let cyberCyan = vec3f(0.05, 0.75, 0.95);

      var col = baseObsidian;
      col = mix(col, cyberCyan * 0.35, lattice * 0.25);
      col = mix(col, neonEmerald * 0.6, lattice * rippleGlow * 0.6);
      col += neonEmerald * (diag * 0.05 + 0.05) * smoothstep(1.0, 0.0, length(p));

      let vignette = smoothstep(1.25, 0.25, length(p));
      col = col * vignette * uniforms.intensity;

      return vec4f(col, 1.0);
    }
  `
};

export interface VgpuDiagnostics {
  isWebGPUSupported: boolean;
  adapterInfo?: string;
  error?: string;
  activePreset: ShaderPresetId;
}

export class VgpuService {
  private static instance: VgpuService | null = null;
  private currentPreset: ShaderPresetId = 'emerald_aurora';
  private mousePos: [number, number] = [0.5, 0.5];
  private targetMousePos: [number, number] = [0.5, 0.5];
  private intensity = 0.85;

  public static getInstance(): VgpuService {
    if (!VgpuService.instance) {
      VgpuService.instance = new VgpuService();
    }
    return VgpuService.instance;
  }

  /**
   * Checks whether the current environment has WebGPU capability
   */
  public isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'gpu' in navigator && !!navigator.gpu;
  }

  public getActivePreset(): ShaderPresetId {
    return this.currentPreset;
  }

  public setPreset(preset: ShaderPresetId) {
    this.currentPreset = preset;
  }

  public setMousePosition(xNorm: number, yNorm: number) {
    this.targetMousePos = [
      Math.max(0, Math.min(1, xNorm)),
      Math.max(0, Math.min(1, yNorm))
    ];
  }

  public setIntensity(val: number) {
    this.intensity = Math.max(0.1, Math.min(1.5, val));
  }

  /**
   * Initializes vgpu and mounts the shader pipeline to an HTMLCanvasElement.
   * Returns a cleanup function that must be called on unmount.
   */
  public startRenderer(
    canvas: HTMLCanvasElement,
    presetId: ShaderPresetId = this.currentPreset,
    onFpsUpdate?: (fps: number) => void
  ): () => void {
    this.currentPreset = presetId;
    let disposed = false;
    let loopHandle: { stop: () => void } | undefined;
    let gpuInstance: Gpu | undefined;

    // Check WebGPU support first; fallback to Canvas2D if unavailable
    if (!this.isSupported()) {
      return this.startCanvas2DFallback(canvas, onFpsUpdate);
    }

    void (async () => {
      try {
        const gpu = await init();
        if (disposed) {
          gpu.dispose();
          return;
        }
        gpuInstance = gpu;

        const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] });
        const shaderCode = SHADERS[this.currentPreset] || SHADERS.emerald_aurora;

        const initialParams = {
          time: 0,
          intensity: this.intensity,
          mouse: this.mousePos,
          resolution: [canvasSurface.size[0], canvasSurface.size[1]]
        };

        const activeEffect = effect(gpu, shaderCode, {
          label: `vgpu-${this.currentPreset}`,
          set: {
            uniforms: initialParams
          }
        });

        // Resize handler
        const unsubResize = canvasSurface.onResize(({ width, height }) => {
          activeEffect.set({
            uniforms: {
              resolution: [width, height]
            }
          });
        });

        const timeClock = clock(gpu);
        let lastFrameTime = performance.now();
        let frameCounter = 0;
        let fpsTimer = performance.now();

        // High performance GPU frameLoop
        loopHandle = frameLoop(gpu, (frame) => {
          if (disposed) return;

          // Smooth mouse lerping
          this.mousePos[0] += (this.targetMousePos[0] - this.mousePos[0]) * 0.08;
          this.mousePos[1] += (this.targetMousePos[1] - this.mousePos[1]) * 0.08;

          activeEffect.set({
            uniforms: {
              time: timeClock.time,
              intensity: this.intensity,
              mouse: this.mousePos
            }
          });

          frame.pass(canvasSurface, activeEffect);

          // FPS monitoring
          frameCounter++;
          const now = performance.now();
          if (now - fpsTimer >= 1000) {
            onFpsUpdate?.(Math.round((frameCounter * 1000) / (now - fpsTimer)));
            frameCounter = 0;
            fpsTimer = now;
          }
        });

        // Store unsubscription for cleanup
        return () => {
          unsubResize();
        };
      } catch (err) {
        console.warn('[VGPU] WebGPU failed to initialize, running Canvas2D fallback:', err);
        if (!disposed) {
          this.startCanvas2DFallback(canvas, onFpsUpdate);
        }
      }
    })();

    return () => {
      disposed = true;
      try {
        loopHandle?.stop();
        gpuInstance?.dispose();
      } catch {
        // Safe disposal
      }
    };
  }

  /**
   * Graceful, lightweight Canvas2D fallback for browsers/GPUs without WebGPU.
   */
  private startCanvas2DFallback(
    canvas: HTMLCanvasElement,
    onFpsUpdate?: (fps: number) => void
  ): () => void {
    let animId: number;
    let disposed = false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Floating celestial particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#10B981' : '#F59E0B'
    }));

    let startTime = performance.now();
    let frameCount = 0;
    let lastFpsCheck = startTime;

    const render = (time: number) => {
      if (disposed) return;
      const elapsed = (time - startTime) * 0.001;

      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial emerald glow
      const grad1 = ctx.createRadialGradient(
        canvas.width * 0.75 + Math.sin(elapsed * 0.5) * 50,
        canvas.height * 0.25 + Math.cos(elapsed * 0.4) * 40,
        0,
        canvas.width * 0.75,
        canvas.height * 0.25,
        canvas.width * 0.55
      );
      grad1.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      grad1.addColorStop(0.5, 'rgba(5, 150, 105, 0.04)');
      grad1.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Radial gold glow
      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.25 + Math.cos(elapsed * 0.3) * 60,
        canvas.height * 0.75 + Math.sin(elapsed * 0.5) * 50,
        0,
        canvas.width * 0.25,
        canvas.height * 0.75,
        canvas.width * 0.6
      );
      grad2.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      grad2.addColorStop(0.6, 'rgba(217, 119, 6, 0.03)');
      grad2.addColorStop(1, 'rgba(3, 7, 18, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render ambient particles
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(elapsed * 2 + p.x));
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      }

      // FPS tracking
      frameCount++;
      if (time - lastFpsCheck >= 1000) {
        onFpsUpdate?.(Math.round((frameCount * 1000) / (time - lastFpsCheck)));
        frameCount = 0;
        lastFpsCheck = time;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }
}
