import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type ThreeSceneMode = 'sacred_crystal' | 'celestial_gyroscope' | 'quantum_nebula';

export interface ThreeSceneProps {
  mode?: ThreeSceneMode;
  wireframe?: boolean;
  autoRotate?: boolean;
  onFpsUpdate?: (fps: number) => void;
  interactive?: boolean;
}

export const ThreeVgpuScene: React.FC<ThreeSceneProps> = ({
  mode = 'sacred_crystal',
  wireframe = false,
  autoRotate = true,
  onFpsUpdate,
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  });
  const clickWaveRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animId: number;
    let disposed = false;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020612, 0.045);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 7.5;

    // 2. WebGL Renderer with High Performance & Depth
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Dynamic cursor point light (emerald green)
    const cursorLight = new THREE.PointLight(0x10b981, 4, 18);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // Secondary warm gold rim light
    const goldRimLight = new THREE.PointLight(0xf59e0b, 5, 20);
    goldRimLight.position.set(5, -3, 3);
    scene.add(goldRimLight);

    // Cyan backlight
    const cyanBackLight = new THREE.PointLight(0x06b6d4, 3.5, 18);
    cyanBackLight.position.set(-5, 4, -2);
    scene.add(cyanBackLight);

    // 4. Main 3D Objects Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 4a. Sacred Crystal Object
    const crystalGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.85,
      transmission: 0.35,
      thickness: 1.2,
      wireframe: wireframe,
      transparent: true,
      opacity: 0.88
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    mainGroup.add(crystalMesh);

    // Outer wireframe cage for sacred look
    const wireGeo = new THREE.IcosahedronGeometry(2.1, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    // 4b. Celestial Gyroscope Rings (3 nested rings)
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: wireframe
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.04, 16, 100), ringMat1);
    ringGroup.add(ring1);

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: wireframe
    });
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.035, 16, 100), ringMat2);
    ring2.rotation.x = Math.PI / 3;
    ringGroup.add(ring2);

    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: wireframe
    });
    const ring3 = new THREE.Mesh(new THREE.TorusGeometry(3.6, 0.03, 16, 100), ringMat3);
    ring3.rotation.y = Math.PI / 4;
    ringGroup.add(ring3);

    // 4c. Floating 3D Star / Ember Particle Field (1,200 particles)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x10b981), // Emerald
      new THREE.Color(0xf59e0b), // 24K Gold
      new THREE.Color(0xfde68a), // Champagne Gold
      new THREE.Color(0x06b6d4)  // Cyan
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Adjust visibility & configuration according to mode
    if (mode === 'sacred_crystal') {
      crystalMesh.visible = true;
      wireMesh.visible = true;
      ringGroup.visible = true;
      particles.visible = true;
    } else if (mode === 'celestial_gyroscope') {
      crystalMesh.visible = false;
      wireMesh.visible = true;
      ringGroup.visible = true;
      ring1.scale.set(1.2, 1.2, 1.2);
      ring2.scale.set(1.2, 1.2, 1.2);
      ring3.scale.set(1.2, 1.2, 1.2);
      particles.visible = true;
    } else if (mode === 'quantum_nebula') {
      crystalMesh.visible = false;
      wireMesh.visible = false;
      ringGroup.visible = false;
      particles.visible = true;
      particleMat.size = 0.12;
    }

    // 5. Pointer Interaction Handlers
    const handlePointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      // Normalized coordinates (-1 to 1)
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleClick = () => {
      if (!interactive) return;
      clickWaveRef.current = 1.0;
    };

    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('click', handleClick);
    }

    // 6. Resize Handler
    const handleResize = () => {
      if (disposed) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Render Loop with Smooth Physics & Parallax
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (time: number) => {
      if (disposed) return;

      const delta = Math.min((time - lastTime) * 0.001, 0.1);
      lastTime = time;

      // Mouse smooth lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      // Update Cursor Light Position in 3D Space
      cursorLight.position.x = mouseRef.current.x * 5;
      cursorLight.position.y = mouseRef.current.y * 3.5;

      // Subtle Camera Parallax
      camera.position.x = mouseRef.current.x * 0.8;
      camera.position.y = mouseRef.current.y * 0.6;
      camera.lookAt(0, 0, 0);

      // Rotation & Physics
      if (autoRotate) {
        mainGroup.rotation.y += delta * 0.45;
        mainGroup.rotation.x += delta * 0.25;

        ring1.rotation.z += delta * 0.5;
        ring2.rotation.x += delta * 0.6;
        ring3.rotation.y += delta * 0.4;

        particles.rotation.y -= delta * 0.12;
        particles.rotation.x -= delta * 0.06;
      }

      // Responsive Click Shockwave decay
      if (clickWaveRef.current > 0.001) {
        const pulse = 1 + Math.sin(clickWaveRef.current * Math.PI) * 0.25;
        mainGroup.scale.set(pulse, pulse, pulse);
        clickWaveRef.current *= 0.92;
      } else {
        mainGroup.scale.set(1, 1, 1);
        clickWaveRef.current = 0;
      }

      renderer.render(scene, camera);

      // FPS tracking
      frameCount++;
      if (time - fpsTimer >= 1000) {
        onFpsUpdate?.(Math.round((frameCount * 1000) / (time - fpsTimer)));
        frameCount = 0;
        fpsTimer = time;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // 8. Cleanup
    return () => {
      disposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('click', handleClick);
      }

      // Dispose Three.js objects
      crystalGeo.dispose();
      crystalMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      ringMat3.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mode, wireframe, autoRotate, onFpsUpdate, interactive]);

  return (
    <div
      ref={containerRef}
      className="three-canvas-container"
      aria-hidden="true"
    />
  );
};
