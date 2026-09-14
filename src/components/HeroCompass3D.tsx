import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
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

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    let aspect = width / height;

    const computeRestX = (asp: number) => Math.min(4.3, Math.max(0.0, (asp - 0.95) * 4.6));
    let xRest = computeRestX(aspect);

    // 3/4 Isometric Perspective Angle looking down at the open face
    // Dial face is +Y, Ring is at -Z (upper-right when rotated)
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    camera.position.set(0.0, 9.0, 9.8);
    camera.lookAt(0.0, 0.45, -0.1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;

    // Line-art Ink Outline Pass
    const effect = new OutlineEffect(renderer, {
      defaultThickness: 0.0036,
      defaultColor: [0.06, 0.06, 0.06],
      defaultAlpha: 1.0,
      defaultKeepAlive: true,
    });

    // 2. High-Contrast Crisp Studio Lighting (Technical Drawing Aesthetics)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(-5.0, 9.0, 6.0);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf7f5f0, 0.7);
    fillLight.position.set(6.0, 5.0, 4.0);
    scene.add(fillLight);

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

        // Tune materials for tactical paper-bone & pure ink contrast
        compassRoot.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            // Add mechanical feature edge lines for steps, rims, and grooves
            if (mesh.name.includes('Font_Card_E_1') || mesh.name.includes('Compass_Ring')) {
              const edges = new THREE.EdgesGeometry(mesh.geometry, 26);
              const line = new THREE.LineSegments(
                edges,
                new THREE.LineBasicMaterial({
                  color: 0x111111,
                  linewidth: 1.5,
                  transparent: true,
                  opacity: 0.85,
                })
              );
              mesh.add(line);
            }

            if (mesh.material) {
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((mat) => {
                const m = mat as THREE.MeshStandardMaterial;
                m.roughness = 0.95;
                m.metalness = 0.0;

                // High-contrast ink lines vs clean paper casing
                if (m.name.includes('Ink') || m.name.includes('Dark') || m.name.includes('North')) {
                  m.color.setHex(0x0a0a0a);
                } else if (m.name.includes('Casing') || m.name.includes('Bone') || m.name.includes('Dial') || m.name.includes('South')) {
                  m.color.setHex(0xFAF8F5);
                } else if (m.name.includes('Star') || m.name.includes('White')) {
                  m.color.setHex(0xFFFFFF);
                }
              });
            }
          }
        });

        needleMesh = compassRoot.getObjectByName('Compass_Needle') || null;
        ringMesh = compassRoot.getObjectByName('Compass_Ring') || null;

        // Orient compass so ring sits at ~1 o'clock (upper-right) and dial faces viewer at 3/4 angle
        compassRoot.rotation.x = THREE.MathUtils.degToRad(8);
        compassRoot.rotation.y = THREE.MathUtils.degToRad(-38);
        compassRoot.rotation.z = THREE.MathUtils.degToRad(4);
        compassRoot.position.set(xRest, 0.0, 0.0);
        compassRoot.scale.setScalar(1.0);

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

    // Warp Transition State (Hero -> Section 01 About)
    let targetWarp = 0;
    let currentWarp = 0;

    const handleWarp = (e: Event) => {
      const customEvent = e as CustomEvent<{ progress: number }>;
      if (typeof customEvent.detail?.progress === 'number') {
        targetWarp = customEvent.detail.progress;
      }
    };

    window.addEventListener('adventure:compass-warp', handleWarp);

    const handlePointerMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouseX = (e.clientX / w) * 2 - 1;
      mouseY = -(e.clientY / h) * 2 + 1;

      // Pointer deflection for needle relative to compass position
      const compassNdcX = xRest > 0 ? 0.55 : 0.0;
      const dx = mouseX - compassNdcX;
      const dy = mouseY - 0.05;
      // In glTF, needle rotates around Y-axis
      targetNeedleRot = -Math.atan2(dy, dx) - Math.PI / 2 + THREE.MathUtils.degToRad(38);

      // Mouse velocity for ring swing inertia
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      mouseVelocity = Math.sqrt(vx * vx + vy * vy);
      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 5. Render Loop with Inertia Physics & Warp Animation
    let animId: number;
    let isIntersecting = true;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isIntersecting) return;

      const elapsed = clock.getElapsedTime();

      // Smooth interpolation of warp progress
      currentWarp += (targetWarp - currentWarp) * 0.10;

      // Needle Dynamics: Magnetic Drift + Pointer Tracking + Rapid Warp Spin Surge
      const idleWobble = Math.sin(elapsed * 1.8) * 0.04 + Math.cos(elapsed * 3.2) * 0.02;
      currentNeedleRot += (targetNeedleRot + idleWobble - currentNeedleRot) * 0.075;

      if (needleMesh) {
        // Accelerating spin surge: 5 full rapid revolutions as it approaches screen center
        const spinSurge = Math.pow(currentWarp, 2.2) * Math.PI * 10;
        needleMesh.rotation.y = currentNeedleRot + spinSurge;
      }

      // Ring Dynamics: Pendulum Swing reacting to motion around local X-axis
      const idleSwing = Math.sin(elapsed * 1.4) * 0.05;
      targetRingRot = idleSwing + mouseVelocity * 3.8;
      currentRingRot += (targetRingRot - currentRingRot) * 0.065;

      if (ringMesh) {
        const clampedX = THREE.MathUtils.clamp(currentRingRot, -0.45, 0.60);
        // Settle ring flush during warp zoom
        ringMesh.rotation.x = THREE.MathUtils.lerp(clampedX, 0.0, currentWarp);
      }

      // Compass Root Dynamics (Glide to Center, Magnify Toward Screen, Face-On Tilt)
      if (compassRoot) {
        // 1. Glides smoothly from right column to center (X: xRest -> 0.0)
        const posX = THREE.MathUtils.lerp(xRest, 0.0, Math.min(1.0, currentWarp * 1.35));
        // 2. Vertical alignment with screen center
        const posY = THREE.MathUtils.lerp(0.0, 0.45, currentWarp);
        // 3. Zoom forward toward camera (Z: 0.0 -> 5.8)
        const posZ = THREE.MathUtils.lerp(0.0, 5.8, Math.pow(currentWarp, 1.2));
        compassRoot.position.set(posX, posY, posZ);

        // 4. Scale magnification (1.0 -> 3.4)
        const scale = THREE.MathUtils.lerp(1.0, 3.4, Math.pow(currentWarp, 1.4));
        compassRoot.scale.setScalar(scale);

        // 5. Tilt transition: 3/4 isometric angle -> face-on circular view facing camera
        const baseRotX = THREE.MathUtils.degToRad(8);
        const baseRotY = THREE.MathUtils.degToRad(-38);
        const baseRotZ = THREE.MathUtils.degToRad(4);

        const parallaxInfluence = 1.0 - currentWarp;
        const targetTiltX = THREE.MathUtils.lerp(baseRotX, THREE.MathUtils.degToRad(42), currentWarp) + (mouseY * 0.05 * parallaxInfluence);
        const targetTiltY = THREE.MathUtils.lerp(baseRotY, 0.0, currentWarp) + (mouseX * 0.05 * parallaxInfluence);
        const targetTiltZ = THREE.MathUtils.lerp(baseRotZ, 0.0, currentWarp);

        compassRoot.rotation.x += (targetTiltX - compassRoot.rotation.x) * 0.08;
        compassRoot.rotation.y += (targetTiltY - compassRoot.rotation.y) * 0.08;
        compassRoot.rotation.z += (targetTiltZ - compassRoot.rotation.z) * 0.08;
      }

      // Damping velocity
      mouseVelocity *= 0.94;

      // Smoothly dissolve canvas as Section 01 (#about) reaches full bloom
      if (canvas) {
        if (currentWarp > 0.72) {
          const dissolve = THREE.MathUtils.clamp((currentWarp - 0.72) / 0.26, 0.0, 1.0);
          canvas.style.opacity = String(Math.max(0.0, 1.0 - dissolve));
        } else {
          canvas.style.opacity = '1';
        }
      }

      // Render with Line-Art Outline Effect
      effect.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // 6. Resize Observer for Crisp Full-Bleed Rendering
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
          xRest = computeRestX(camera.aspect);
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
      window.removeEventListener('adventure:compass-warp', handleWarp);
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
    </div>
  );
};
