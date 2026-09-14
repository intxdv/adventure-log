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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 3/4 Isometric Perspective Angle looking down at the open face
    // Dial face is +Y, Ring is at -Z (upper-right when rotated)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.05, 100);
    camera.position.set(0.0, 8.5, 9.5);
    camera.lookAt(0.0, 0.45, -0.1);

    const computeRestX = (aspect: number) => {
      if (aspect > 1.8) return 4.3;
      if (aspect > 1.5) return 3.9;
      if (aspect > 1.2) return 3.3;
      if (aspect > 0.9) return 2.1;
      return 0.0;
    };
    let xRest = computeRestX(camera.aspect);

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

    // Warp Transition State (Diving into Center Black Dot)
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

      // Pointer deflection for needle relative to projected compass center
      const compassNdcX = THREE.MathUtils.clamp(
        xRest / (12.8 * Math.tan(THREE.MathUtils.degToRad(18)) * camera.aspect),
        -0.8,
        0.8
      );
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

    // 5. Render Loop with Inertia Physics & True Screen Penetration Animation
    let animId: number;
    let isIntersecting = true;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isIntersecting) return;

      const elapsed = clock.getElapsedTime();

      // Smooth interpolation of warp progress
      currentWarp += (targetWarp - currentWarp) * 0.12;

      // Needle Dynamics: Magnetic Drift + Pointer Tracking + Accelerating Needle Spin Surge
      const idleWobble = Math.sin(elapsed * 1.8) * 0.04 + Math.cos(elapsed * 3.2) * 0.02;
      currentNeedleRot += (targetNeedleRot + idleWobble - currentNeedleRot) * 0.075;

      if (needleMesh) {
        // Accelerating spin surge: spins faster and faster into a warp blur as compass rushes in
        const spinSurge = Math.pow(currentWarp, 2.0) * Math.PI * 24;
        needleMesh.rotation.y = currentNeedleRot + spinSurge;
      }

      // Ring Dynamics: Pendulum Swing reacting to motion around local X-axis
      const idleSwing = Math.sin(elapsed * 1.4) * 0.05;
      targetRingRot = idleSwing + mouseVelocity * 3.8;
      currentRingRot += (targetRingRot - currentRingRot) * 0.065;

      if (ringMesh) {
        const clampedX = THREE.MathUtils.clamp(currentRingRot, -0.45, 0.60);
        // Settle ring flush during warp dive
        ringMesh.rotation.x = THREE.MathUtils.lerp(clampedX, 0.0, currentWarp);
      }

      // True Screen Penetration Dynamics ("menembus layar"):
      // Compass rushes forward towards and past the camera plane
      if (compassRoot) {
        const warpCurve = Math.pow(currentWarp, 1.35);
        // Moves from (xRest, 0, 0) rushing toward camera position (0.0, 8.5, 9.5) and through the screen
        const posX = THREE.MathUtils.lerp(xRest, 0.0, warpCurve);
        const posY = THREE.MathUtils.lerp(0.0, 7.8, warpCurve);
        const posZ = THREE.MathUtils.lerp(0.0, 10.2, warpCurve);
        compassRoot.position.set(posX, posY, posZ);

        // Dramatic scale expansion: the compass expands to engulf the entire 100vw x 100vh display
        const scale = 1.0 + Math.pow(currentWarp, 1.45) * 6.8;
        compassRoot.scale.setScalar(scale);

        // Tilt transition: 3/4 isometric angle -> face-on circular view rushing into the viewer
        const baseRotX = THREE.MathUtils.degToRad(8);
        const baseRotY = THREE.MathUtils.degToRad(-38);
        const baseRotZ = THREE.MathUtils.degToRad(4);

        const parallaxInfluence = Math.max(0.0, 1.0 - currentWarp * 2.0);
        const targetTiltX = THREE.MathUtils.lerp(baseRotX, THREE.MathUtils.degToRad(42), warpCurve) + (mouseY * 0.04 * parallaxInfluence);
        const targetTiltY = THREE.MathUtils.lerp(baseRotY, 0.0, warpCurve) + (mouseX * 0.04 * parallaxInfluence);
        const targetTiltZ = THREE.MathUtils.lerp(baseRotZ, 0.0, currentWarp);

        compassRoot.rotation.x += (targetTiltX - compassRoot.rotation.x) * 0.10;
        compassRoot.rotation.y += (targetTiltY - compassRoot.rotation.y) * 0.10;
        compassRoot.rotation.z += (targetTiltZ - compassRoot.rotation.z) * 0.10;
      }

      // Damping velocity
      mouseVelocity *= 0.94;

      // Dissolve canvas as the compass penetrates through the screen plane
      if (canvas) {
        if (currentWarp > 0.72) {
          const dissolve = THREE.MathUtils.clamp((currentWarp - 0.72) / 0.24, 0.0, 1.0);
          canvas.style.opacity = String(Math.max(0.0, 1.0 - dissolve));
        } else {
          canvas.style.opacity = '1';
        }
      }

      // Render with Line-Art Outline Effect
      effect.render(scene, camera);
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
