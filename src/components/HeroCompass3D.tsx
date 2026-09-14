import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './HeroCompass3D.css';

interface HeroCompass3DProps {
  isVisible?: boolean;
}

export const HeroCompass3D: React.FC<HeroCompass3DProps> = ({ isVisible = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    // 3/4 Isometric Perspective Angle framing the stepped basin & suspension ring
    camera.position.set(0.0, -8.6, 9.4);
    camera.lookAt(0.0, 0.9, 0.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    // 2. Studio Lighting (Warm Editorial Tone matching #F7F6F2 paper canvas)
    const ambientLight = new THREE.AmbientLight(0xf5f3ee, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdfa, 2.7);
    keyLight.position.set(6.0, -7.0, 11.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8edf5, 1.2);
    fillLight.position.set(-7.0, 5.0, 7.0);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.85);
    rimLight.position.set(0.0, 8.0, 3.5);
    scene.add(rimLight);

    // 3. Compass Model References
    let compassRoot: THREE.Group | null = null;
    let needleMesh: THREE.Object3D | null = null;
    let ringMesh: THREE.Object3D | null = null;

    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      '/models/vintage_compass_web.glb',
      (gltf) => {
        compassRoot = gltf.scene;

        // Tune materials for tactile paper-like matte finish
        compassRoot.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.max(mat.roughness, 0.80);
            }
          }
        });

        needleMesh = compassRoot.getObjectByName('Compass_Needle') || null;
        ringMesh = compassRoot.getObjectByName('Compass_Ring') || null;

        // Default initial tilt of the compass
        compassRoot.rotation.x = THREE.MathUtils.degToRad(-5);
        compassRoot.rotation.z = THREE.MathUtils.degToRad(-7);

        scene.add(compassRoot);
        setIsLoaded(true);
      },
      undefined,
      (error) => {
        console.error('Failed to load compass 3D model:', error);
      }
    );

    // 4. Mouse Tracking & Smooth Interactive Motion
    let mouseX = 0;
    let mouseY = 0;
    let targetNeedleRot = 0;
    let currentNeedleRot = 0;
    let targetRingRot = 0;
    let currentRingRot = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseVelocity = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX = (e.clientX / w) * 2 - 1;
      mouseY = -(e.clientY / h) * 2 + 1;

      // Calculate pointer deflection for needle
      // Compass position in hero is roughly at (0.60, 0.45) in NDC
      const dx = mouseX - 0.55;
      const dy = mouseY - 0.05;
      targetNeedleRot = -Math.atan2(dy, dx) + Math.PI / 2;

      // Calculate mouse velocity for ring swing inertia
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      mouseVelocity = Math.sqrt(vx * vx + vy * vy);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 5. Render Loop with Inertia Physics & Wobble
    let animId: number;
    let isIntersecting = true;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isIntersecting) return;

      const elapsed = clock.getElapsedTime();

      // Needle Dynamics: Magnetic Drift + Smooth Tracking
      const idleWobble = Math.sin(elapsed * 1.8) * 0.045 + Math.cos(elapsed * 3.2) * 0.02;
      currentNeedleRot += (targetNeedleRot + idleWobble - currentNeedleRot) * 0.075;

      if (needleMesh) {
        needleMesh.rotation.z = currentNeedleRot;
      }

      // Ring Dynamics: Pendulum Swing reacting to motion
      const idleSwing = Math.sin(elapsed * 1.4) * 0.06;
      targetRingRot = idleSwing + mouseVelocity * 4.5;
      currentRingRot += (targetRingRot - currentRingRot) * 0.065;

      if (ringMesh) {
        // Hinge rotates on X-axis (clamped between -35 deg and +45 deg)
        const clampedX = THREE.MathUtils.clamp(currentRingRot, -0.6, 0.75);
        ringMesh.rotation.x = clampedX;
      }

      // Compass Body Parallax Tilt (Subtle 3D Depth)
      if (compassRoot) {
        const targetTiltX = THREE.MathUtils.degToRad(-5) + mouseY * 0.07;
        const targetTiltY = THREE.MathUtils.degToRad(-7) + mouseX * 0.07;
        compassRoot.rotation.x += (targetTiltX - compassRoot.rotation.x) * 0.05;
        compassRoot.rotation.y += (targetTiltY - compassRoot.rotation.y) * 0.05;
      }

      // Damping velocity
      mouseVelocity *= 0.94;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // 6. Resize Observer for Crisp Rendering
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Intersection Observer to pause off-screen
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
    }, { threshold: 0.05 });
    intersectionObserver.observe(container);

    // Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      // Deep clean Three.js resources
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) {
            m.material.forEach((mat) => mat.dispose());
          } else if (m.material) {
            m.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`hero-compass-3d-wrapper ${isVisible ? 'is-visible' : ''} ${isLoaded ? 'is-model-ready' : ''}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="hero-compass-3d-canvas" />
      {/* Tactical Coordinate Readout Overlay */}
      <div className="hero-compass-3d-telemetry font-mono">
        <span className="hero-compass-3d-tag">[ COMPASS // 3D SENSOR ]</span>
        <span className="hero-compass-3d-fix">7.05°S // 110.44°E</span>
      </div>
    </div>
  );
};
