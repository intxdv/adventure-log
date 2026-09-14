import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js';
import gsap from 'gsap';
import './HeroCompass3D.css';

interface HeroCompass3DProps {
  isVisible?: boolean;
}

export const HeroCompass3D: React.FC<HeroCompass3DProps> = ({ isVisible = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hitAreaRef = useRef<SVGCircleElement>(null);

  // SVG Callout Refs
  const calloutLensRef = useRef<SVGGElement>(null);
  const calloutNeedleRef = useRef<SVGGElement>(null);
  const calloutDialRef = useRef<SVGGElement>(null);
  const calloutCasingRef = useRef<SVGGElement>(null);
  const calloutRingRef = useRef<SVGGElement>(null);

  // Architectural Drafting Circle Refs
  const draftingGroupRef = useRef<SVGGElement>(null);
  const draftingCrossRef = useRef<SVGPathElement>(null);
  const draftingArmRef = useRef<SVGLineElement>(null);
  const draftingCircleRef = useRef<SVGCircleElement>(null);
  const draftingPenDotRef = useRef<SVGCircleElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);
  const triggerAssembleRef = useRef<(() => void) | null>(null);
  const toggleExplodedRef = useRef<(() => void) | null>(null);

  // Trigger assembly once app has loaded and model is ready
  useEffect(() => {
    if (isVisible && isLoaded && triggerAssembleRef.current) {
      triggerAssembleRef.current();
    }
  }, [isVisible, isLoaded]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 3/4 Isometric Perspective Angle looking down at open dial face
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.05, 100);
    const camPos = new THREE.Vector3(0.0, 8.5, 9.5);
    const camTarget = new THREE.Vector3(0.0, 0.55, 0.0);
    camera.position.copy(camPos);
    camera.lookAt(camTarget);

    const viewDir = new THREE.Vector3().subVectors(camTarget, camPos).normalize();
    const initialDistance = camPos.distanceTo(camTarget);

    const computeInitialScale = (aspect: number) => {
      if (aspect < 0.6) return 0.58;
      if (aspect < 0.9) return 0.56;
      return 0.58;
    };
    let initialScale = computeInitialScale(camera.aspect);

    const computeRestX = (aspect: number) => {
      if (aspect > 1.8) return 4.1;
      if (aspect > 1.5) return 3.65;
      if (aspect > 1.2) return 3.1;
      if (aspect > 0.9) return 1.8;
      if (aspect < 0.6) return 1.50;
      return 0.0;
    };

    const computeRestY = (aspect: number) => {
      if (aspect < 0.6) return -2.80;
      if (aspect <= 0.9) return -2.20;
      return 0.0;
    };

    let xRest = computeRestX(camera.aspect);
    let yRest = computeRestY(camera.aspect);

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

    // 3. Exploded Layer Groups & References
    let compassRoot: THREE.Group | null = null;
    let casingGroup: THREE.Group | null = null;
    let dialGroup: THREE.Group | null = null;
    let needleMesh: THREE.Object3D | null = null;
    let ringMesh: THREE.Object3D | null = null;
    let lensGroup: THREE.Group | null = null;
    let lensMat: THREE.MeshStandardMaterial | null = null;
    let rimLines: THREE.LineSegments | null = null;
    let reticleMesh: THREE.Mesh | null = null;
    let axisLine: THREE.Line | null = null;
    let axisMat: THREE.LineDashedMaterial | null = null;

    // Unified Choreography State (Entrance)
    const animState = {
      drawProgress: 0.0,     // 0 -> 1: Drafting Compass circle draw-in
      explodeProgress: 0.0,  // 0 -> 1: Lift to 3D & mekar membelah
      assembleProgress: 0.0, // 0 -> 1: Merapat kembali ke kompas utuh
      rootScale: 0.44,
      rootOpacity: 0.0,
      circleOpacity: 1.0,
    };

    let hasTriggeredAssemble = false;
    let assembleTimeline: gsap.core.Timeline | null = null;

    // Interactive Exploded State (Click-to-explode toggle)
    let isManualExploded = false;
    const manualExplodeState = { progress: 0.0 };
    let manualTween: gsap.core.Tween | null = null;

    const toggleExploded = () => {
      // If entrance timeline is still running, complete it immediately
      if (assembleTimeline && assembleTimeline.isActive()) {
        assembleTimeline.progress(1.0);
        animState.drawProgress = 1.0;
        animState.explodeProgress = 1.0;
        animState.assembleProgress = 1.0;
        animState.rootOpacity = 1.0;
        animState.rootScale = initialScale;
        animState.circleOpacity = 0.0;
      }

      isManualExploded = !isManualExploded;

      // Update dynamic action label text on cursor
      const cursorAction = isManualExploded ? 'CLICK // ASSEMBLE' : 'CLICK // EXPLODE';
      hitAreaRef.current?.setAttribute('data-cursor-text', cursorAction);

      manualTween?.kill();
      manualTween = gsap.to(manualExplodeState, {
        progress: isManualExploded ? 1.0 : 0.0,
        duration: isManualExploded ? 0.75 : 0.55,
        ease: isManualExploded ? 'back.out(1.2)' : 'power3.out',
      });
    };
    toggleExplodedRef.current = toggleExploded;

    const triggerAssembly = () => {
      if (hasTriggeredAssemble) return;
      hasTriggeredAssemble = true;

      assembleTimeline = gsap.timeline({
        delay: 0.18,
      });

      // 1. Drafting Compass 360 Circle Draw (~0.45s)
      assembleTimeline.to(animState, {
        drawProgress: 1.0,
        duration: 0.45,
        ease: 'power2.inOut',
      });

      // 1b. Hold Lingkaran Utuh Sejenak (Jeda tenang ~0.45s sebelum kompas mekar)
      assembleTimeline.to({}, { duration: 0.45 });

      // 2. Lift into 3D & Mekar Membelah (Lingkaran jangka langsung menghilang begitu kompas mulai mekar)
      assembleTimeline.to(animState, {
        circleOpacity: 0.0,
        duration: 0.32,
        ease: 'power2.out',
      });

      assembleTimeline.to(animState, {
        rootOpacity: 1.0,
        rootScale: initialScale,
        explodeProgress: 1.0,
        duration: 1.05,
        ease: 'power2.out',
      }, '<');

      // 3. Savor the Schematic Hold (~0.50s)
      assembleTimeline.to({}, { duration: 0.50 });

      // 4. Magnetic Snap Assembly (~0.75s)
      assembleTimeline.to(animState, {
        assembleProgress: 1.0,
        duration: 0.75,
        ease: 'power3.out',
      });
    };
    triggerAssembleRef.current = triggerAssembly;

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

        // Split Compass_Body into Layer_Casing and Layer_Dial
        const body = compassRoot.getObjectByName('Compass_Body');
        casingGroup = new THREE.Group();
        casingGroup.name = 'Layer_Casing';
        dialGroup = new THREE.Group();
        dialGroup.name = 'Layer_Dial';

        if (body) {
          const children = [...body.children];
          children.forEach((c) => {
            if (c.name === 'Font_Card_E_1' || c.name === 'Font_Card_E_3') {
              casingGroup!.add(c);
            } else {
              dialGroup!.add(c);
            }
          });
          compassRoot.add(casingGroup);
          compassRoot.add(dialGroup);
          compassRoot.remove(body);
        }

        needleMesh = compassRoot.getObjectByName('Compass_Needle') || null;
        ringMesh = compassRoot.getObjectByName('Compass_Ring') || null;

        // Create Procedural Sapphire Crystal Lens Group
        lensGroup = new THREE.Group();
        lensGroup.name = 'Layer_Lens';

        const lensGeo = new THREE.CylinderGeometry(3.42, 3.42, 0.04, 64);
        lensMat = new THREE.MeshStandardMaterial({
          color: 0xf2f5f8,
          transparent: true,
          opacity: 0.35,
          roughness: 0.1,
          metalness: 0.1,
        });
        const lensMesh = new THREE.Mesh(lensGeo, lensMat);
        lensGroup.add(lensMesh);

        // Crisp ink perimeter contour for the lens
        const rimEdges = new THREE.EdgesGeometry(lensGeo, 30);
        rimLines = new THREE.LineSegments(
          rimEdges,
          new THREE.LineBasicMaterial({
            color: 0x0a0a0a,
            transparent: true,
            opacity: 0.85,
            linewidth: 1.5,
          })
        );
        lensGroup.add(rimLines);

        // Subtle reticle tick ring on lens
        const ringGeo = new THREE.RingGeometry(3.28, 3.36, 64);
        const ringMarkMat = new THREE.MeshBasicMaterial({
          color: 0x0a0a0a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6,
        });
        reticleMesh = new THREE.Mesh(ringGeo, ringMarkMat);
        reticleMesh.rotation.x = -Math.PI / 2;
        reticleMesh.position.y = 0.025;
        lensGroup.add(reticleMesh);

        compassRoot.add(lensGroup);

        // Central Drafting Axis Line (Technical dashed center guide)
        const axisPoints = [
          new THREE.Vector3(0, -2.4, 0),
          new THREE.Vector3(0, 4.4, 0),
        ];
        const axisGeo = new THREE.BufferGeometry().setFromPoints(axisPoints);
        axisMat = new THREE.LineDashedMaterial({
          color: 0x181a18,
          dashSize: 0.18,
          gapSize: 0.12,
          transparent: true,
          opacity: 0.65,
        });
        axisLine = new THREE.Line(axisGeo, axisMat);
        axisLine.computeLineDistances();
        compassRoot.add(axisLine);

        // Initially hidden until drafting circle completes
        compassRoot.visible = false;

        // Orient compass so ring sits at ~1 o'clock (upper-right) and dial faces viewer at 3/4 angle
        compassRoot.rotation.x = THREE.MathUtils.degToRad(8);
        compassRoot.rotation.y = THREE.MathUtils.degToRad(-38);
        compassRoot.rotation.z = THREE.MathUtils.degToRad(4);

        // Position compassRoot so needle pivot dot sits at xRest in right column
        const initialPivot = camTarget.clone();
        initialPivot.x = xRest;
        const initLocalPivot = new THREE.Vector3(0.0, 0.87 * initialScale, 0.0);
        const initWorldOffset = initLocalPivot.applyEuler(compassRoot.rotation);
        compassRoot.position.copy(initialPivot).sub(initWorldOffset);
        compassRoot.scale.setScalar(initialScale);

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

        // Auto-close on scroll: if in exploded mode and user scrolls, immediately snap close
        if (isManualExploded && targetWarp > 0.005) {
          isManualExploded = false;
          manualTween?.kill();
          manualTween = gsap.to(manualExplodeState, {
            progress: 0.0,
            duration: 0.32,
            ease: 'power2.out',
          });

          // Reset cursor text
          hitAreaRef.current?.setAttribute('data-cursor-text', 'CLICK // EXPLODE');
        }
      }
    };

    window.addEventListener('adventure:compass-warp', handleWarp);

    // Close on scroll interaction (wheel/touch)
    const handleScrollClose = () => {
      if (isManualExploded) {
        isManualExploded = false;
        manualTween?.kill();
        manualTween = gsap.to(manualExplodeState, {
          progress: 0.0,
          duration: 0.32,
          ease: 'power2.out',
        });

        // Reset cursor text
        hitAreaRef.current?.setAttribute('data-cursor-text', 'CLICK // EXPLODE');
      }
    };
    window.addEventListener('wheel', handleScrollClose, { passive: true });
    window.addEventListener('touchmove', handleScrollClose, { passive: true });

    // Raycast hit detection for 3D compass clicks
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2();

    const checkCompassHit = (clientX: number, clientY: number): boolean => {
      if (!camera || !compassRoot) return false;
      mouseNDC.x = (clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseNDC, camera);
      const hits = raycaster.intersectObjects(compassRoot.children, true);
      return hits.length > 0;
    };

    const handleWindowCaptureClick = (e: MouseEvent) => {
      if (currentWarp > 0.02) return;
      if (checkCompassHit(e.clientX, e.clientY)) {
        e.stopPropagation();
        e.preventDefault();
        toggleExploded();
      }
    };
    window.addEventListener('click', handleWindowCaptureClick, { capture: true });

    // Gyroscope & Accelerometer (Device Orientation & Motion API for Mobile Tilt)
    let hasGyroData = false;
    let targetGyroX = 0;
    let targetGyroY = 0;
    let currentGyroX = 0;
    let currentGyroY = 0;
    let gyroMotionVelocity = 0;

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      // In portrait orientation:
      // gamma is left-to-right tilt in degrees [-90, 90]
      // beta is front-to-back tilt in degrees [-180, 180]
      // When user holds mobile phone naturally, beta is roughly ~45 deg
      if (e.gamma === null || e.beta === null) return;

      const rawGamma = e.gamma;
      const rawBeta = e.beta;

      // Normalize roll (gamma) [-35 deg, 35 deg] -> [-1, 1]
      targetGyroX = THREE.MathUtils.clamp(rawGamma / 35, -1, 1);
      // Normalize pitch (beta - 45 deg resting baseline) [-35 deg, 35 deg] -> [-1, 1]
      targetGyroY = THREE.MathUtils.clamp((rawBeta - 45) / 35, -1, 1);
      hasGyroData = true;
    };

    const handleDeviceMotion = (e: DeviceMotionEvent) => {
      const rotAlpha = e.rotationRate?.alpha || 0;
      const rotBeta = e.rotationRate?.beta || 0;
      const rotGamma = e.rotationRate?.gamma || 0;
      const rotMag = Math.sqrt(rotAlpha * rotAlpha + rotBeta * rotBeta + rotGamma * rotGamma) / 120;

      const accX = e.acceleration?.x || 0;
      const accY = e.acceleration?.y || 0;
      const accZ = e.acceleration?.z || 0;
      const accMag = Math.sqrt(accX * accX + accY * accY + accZ * accZ) * 0.12;

      const totalMotion = rotMag + accMag;
      if (totalMotion > 0.04) {
        gyroMotionVelocity = Math.min(2.5, totalMotion);
      }
    };

    // Auto-listen to device orientation & motion
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }
    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
    }

    // iOS 13+ requires explicit user gesture permission request
    const requestDevicePermission = () => {
      if (typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function') {
        (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission()
          .then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
              window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
            }
          })
          .catch(() => {});
      }
    };
    window.addEventListener('touchstart', requestDevicePermission, { once: true, passive: true });

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
      targetNeedleRot = -Math.atan2(dy, dx) - Math.PI / 2 + THREE.MathUtils.degToRad(38);

      // Mouse velocity for ring swing inertia
      const vx = mouseX - prevMouseX;
      const vy = mouseY - prevMouseY;
      mouseVelocity = Math.sqrt(vx * vx + vy * vy);
      prevMouseX = mouseX;
      prevMouseY = mouseY;

    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Helper to update SVG callout leader line & text
    const updateCallout = (
      groupEl: SVGGElement | null,
      worldPos: THREE.Vector3,
      direction: 'right' | 'left',
      armLength: number = 44
    ) => {
      if (!groupEl) return;
      const p = worldPos.clone().project(camera);
      if (p.z > 1.0) {
        groupEl.style.display = 'none';
        return;
      }
      groupEl.style.display = '';

      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = (p.x * 0.5 + 0.5) * w;
      const y = (-p.y * 0.5 + 0.5) * h;

      const path = groupEl.querySelector('path');
      const dot = groupEl.querySelector('circle');
      const text = groupEl.querySelector('text');

      if (dot) {
        dot.setAttribute('cx', String(x));
        dot.setAttribute('cy', String(y));
      }

      const isMobile = w <= 768;
      const sign = direction === 'right' ? 1 : -1;
      const elbowOffset = isMobile ? 7 : 22;
      const elbowLift = isMobile ? 6 : 12;
      const effectiveArmLength = isMobile ? 8 : armLength;
      const textGap = isMobile ? 3 : 6;

      let elbowX = x + sign * elbowOffset;
      const elbowY = y - elbowLift;
      let endX = elbowX + sign * effectiveArmLength;
      const endY = elbowY;
      let textX = endX + sign * textGap;

      if (isMobile) {
        if (direction === 'right') {
          textX = Math.min(textX, w - 152);
          endX = textX - sign * textGap;
          elbowX = endX - sign * effectiveArmLength;
        } else {
          textX = Math.max(textX, 180);
          endX = textX - sign * textGap;
          elbowX = endX - sign * effectiveArmLength;
        }
      }

      if (path) {
        path.setAttribute('d', `M ${x} ${y} L ${elbowX} ${elbowY} L ${endX} ${endY}`);
      }

      if (text) {
        const fullLabel = groupEl.getAttribute('data-label') || '';
        const mobileLabel = groupEl.getAttribute('data-label-mobile') || fullLabel;
        const targetLabel = isMobile ? mobileLabel : fullLabel;
        if (text.textContent !== targetLabel) {
          text.textContent = targetLabel;
        }
        text.setAttribute('x', String(textX));
        text.setAttribute('y', String(endY + (isMobile ? 2.5 : 3.5)));
        text.setAttribute('text-anchor', direction === 'right' ? 'start' : 'end');
      }
    };

    // 5. Render Loop with Drafting Circle, Exploded Assembly & Penetration Dynamics
    let animId: number;
    let isIntersecting = true;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isIntersecting) return;

      const elapsed = clock.getElapsedTime();

      // Smooth interpolation of warp progress
      currentWarp += (targetWarp - currentWarp) * 0.12;

      // If user scrolls during entrance, snap assembly immediately
      if (currentWarp > 0.02 && animState.assembleProgress < 1.0) {
        animState.drawProgress = 1.0;
        animState.explodeProgress = 1.0;
        animState.assembleProgress = 1.0;
        animState.rootOpacity = 1.0;
        animState.rootScale = initialScale;
        animState.circleOpacity = 0.0;
        assembleTimeline?.kill();
      }

      // If user scrolls during manual explode, rapidly collapse it
      if (currentWarp > 0.01 && manualExplodeState.progress > 0) {
        manualExplodeState.progress *= Math.max(0.0, 1.0 - currentWarp * 4.0);
      }

      // Combined Separation Ratio (Entrance bloom OR user manual toggle)
      const entranceSeparation = animState.explodeProgress * (1.0 - animState.assembleProgress);
      const separation = Math.max(entranceSeparation, manualExplodeState.progress);

      // Visibility of 3D Model
      if (compassRoot) {
        compassRoot.visible = animState.rootOpacity > 0.01 || manualExplodeState.progress > 0.01;
      }

      // Calculate 2D Screen Center and Radius for Hit Area & Drafting Circle
      const center3D = new THREE.Vector3(xRest, 0.55 + yRest, 0.0);
      const rim3D = new THREE.Vector3(xRest + 3.45 * initialScale, 0.55 + yRest, 0.0);

      const pCenter = center3D.clone().project(camera);
      const pRim = rim3D.clone().project(camera);

      const cx = (pCenter.x * 0.5 + 0.5) * width;
      const cy = (-pCenter.y * 0.5 + 0.5) * height;
      const rx = (pRim.x * 0.5 + 0.5) * width;
      const radius = Math.max(10, Math.abs(rx - cx));

      // Update Interactive Hit Area
      if (hitAreaRef.current) {
        hitAreaRef.current.setAttribute('cx', String(cx));
        hitAreaRef.current.setAttribute('cy', String(cy));
        hitAreaRef.current.setAttribute('r', String(radius * 1.15));
        hitAreaRef.current.style.pointerEvents = currentWarp > 0.02 ? 'none' : 'auto';
      }

      // Update Drafting Compass Circle & Arm in SVG
      if (draftingGroupRef.current && animState.circleOpacity > 0.01 && currentWarp < 0.01) {
        // 1. Center Cross (+)
        if (draftingCrossRef.current) {
          draftingCrossRef.current.setAttribute(
            'd',
            `M ${cx - 7} ${cy} L ${cx + 7} ${cy} M ${cx} ${cy - 7} L ${cx} ${cy + 7}`
          );
        }

        // 2. Circle Perimeter with stroke-dashoffset
        const perimeter = 2 * Math.PI * radius;
        if (draftingCircleRef.current) {
          draftingCircleRef.current.setAttribute('cx', String(cx));
          draftingCircleRef.current.setAttribute('cy', String(cy));
          draftingCircleRef.current.setAttribute('r', String(radius));
          draftingCircleRef.current.style.strokeDasharray = `${perimeter}`;
          draftingCircleRef.current.style.strokeDashoffset = `${perimeter * (1.0 - animState.drawProgress)}`;
        }

        // 3. Drafting Arm & Needle Pen Tip (Garis putus-putus radius)
        const angle = animState.drawProgress * Math.PI * 2 - Math.PI / 2;
        const px = animState.drawProgress >= 0.999 ? cx : cx + radius * Math.cos(angle);
        const py = animState.drawProgress >= 0.999 ? cy - radius : cy + radius * Math.sin(angle);

        if (draftingPenDotRef.current) {
          draftingPenDotRef.current.setAttribute('cx', String(px));
          draftingPenDotRef.current.setAttribute('cy', String(py));
          draftingPenDotRef.current.style.display = '';
        }

        if (draftingArmRef.current) {
          draftingArmRef.current.setAttribute('x1', String(cx));
          draftingArmRef.current.setAttribute('y1', String(cy));
          draftingArmRef.current.setAttribute('x2', String(px));
          draftingArmRef.current.setAttribute('y2', String(py));
          draftingArmRef.current.style.display = '';
        }

        draftingGroupRef.current.style.opacity = String(animState.circleOpacity);
      } else if (draftingGroupRef.current) {
        draftingGroupRef.current.style.opacity = '0';
      }

      // Animate Exploded Layers Convergence based on `separation`
      if (casingGroup) {
        casingGroup.position.y = THREE.MathUtils.lerp(0.0, -1.35, separation);
      }
      if (dialGroup) {
        dialGroup.position.y = THREE.MathUtils.lerp(0.0, 0.35, separation);
      }
      if (lensGroup) {
        lensGroup.position.y = THREE.MathUtils.lerp(1.05, 3.30, separation);
        if (lensMat) {
          lensMat.opacity = THREE.MathUtils.lerp(0.08, 0.35, separation);
        }
        if (rimLines) {
          (rimLines.material as THREE.LineBasicMaterial).opacity = THREE.MathUtils.lerp(0.0, 0.85, separation);
        }
        if (reticleMesh) {
          (reticleMesh.material as THREE.MeshBasicMaterial).opacity = THREE.MathUtils.lerp(0.0, 0.60, separation);
        }
      }
      if (axisLine && axisMat) {
        axisMat.opacity = THREE.MathUtils.lerp(0.0, 0.65, separation);
        axisLine.visible = separation > 0.05;
      }

      // Gyroscope / Accelerometer Smoothing & Inertia Damping
      currentGyroX += (targetGyroX - currentGyroX) * 0.08;
      currentGyroY += (targetGyroY - currentGyroY) * 0.08;

      if (gyroMotionVelocity > 0.01) {
        mouseVelocity = Math.max(mouseVelocity, gyroMotionVelocity);
        gyroMotionVelocity *= 0.90;
      }

      // Needle Dynamics: Exploded Spin Calibration -> Magnetic Drift & Tracking -> Warp Surge
      const idleWobble = Math.sin(elapsed * 1.8) * 0.04 + Math.cos(elapsed * 3.2) * 0.02;
      
      // On mobile with gyro, needle physically counter-rotates against phone tilt (magnetic compass feel)
      if (hasGyroData) {
        targetNeedleRot = -currentGyroX * 0.90 + (currentGyroY * 0.22);
      }
      currentNeedleRot += (targetNeedleRot + idleWobble - currentNeedleRot) * 0.075;

      if (needleMesh) {
        needleMesh.position.y = THREE.MathUtils.lerp(0.62, 0.62 + 1.65, separation);

        if (separation > 0.03) {
          // Rapid calibration spin settling as layers assemble
          const calibrationSpin = separation * Math.PI * 14;
          needleMesh.rotation.y = currentNeedleRot + calibrationSpin;
        } else {
          // Accelerating spin surge during warp dive
          const spinSurge = Math.pow(currentWarp, 2.0) * Math.PI * 24;
          needleMesh.rotation.y = currentNeedleRot + spinSurge;
        }
      }

      // Ring Dynamics: Assembly Pull-in & Click Bounce -> Pendulum Swing & Tilt Reaction
      if (ringMesh) {
        ringMesh.position.z = THREE.MathUtils.lerp(-4.22, -4.22 - 2.20, separation);

        const idleSwing = Math.sin(elapsed * 1.4) * 0.05;
        const gyroRingBias = hasGyroData ? currentGyroY * 0.30 : 0.0;
        targetRingRot = idleSwing + gyroRingBias + mouseVelocity * 3.8;
        currentRingRot += (targetRingRot - currentRingRot) * 0.065;

        // Subtle tactile click bounce as ring snaps into casing knuckle
        let clickBounce = 0;
        if (animState.assembleProgress > 0.80 && animState.assembleProgress < 1.0) {
          const localT = (animState.assembleProgress - 0.80) / 0.20;
          clickBounce = Math.sin(localT * Math.PI * 3) * (1 - localT) * 0.16;
        } else if (manualExplodeState.progress < 0.20 && manualExplodeState.progress > 0.01 && !isManualExploded) {
          const localT = manualExplodeState.progress / 0.20;
          clickBounce = Math.sin((1 - localT) * Math.PI * 3) * localT * 0.12;
        }

        const clampedX = THREE.MathUtils.clamp(currentRingRot + clickBounce, -0.45, 0.60);
        ringMesh.rotation.x = THREE.MathUtils.lerp(clampedX, 0.0, currentWarp);
      }

      // True Screen Penetration Dynamics ("menembus layar"):
      if (compassRoot) {
        const warpCurve = Math.pow(currentWarp, 1.25);
        const dist = THREE.MathUtils.lerp(initialDistance, 0.40, Math.pow(currentWarp, 1.4));
        const centerRayPoint = camPos.clone().addScaledVector(viewDir, dist);

        const shiftX = xRest * Math.pow(Math.max(0.0, 1.0 - currentWarp), 1.3);
        const shiftY = yRest * Math.pow(Math.max(0.0, 1.0 - currentWarp), 1.3);
        const targetPivot = centerRayPoint.clone();
        targetPivot.x += shiftX;
        targetPivot.y += shiftY;

        // Current scale combines initial entrance scale and warp scale
        const effectiveBaseScale = THREE.MathUtils.lerp(animState.rootScale, initialScale, animState.assembleProgress);
        const scale = THREE.MathUtils.lerp(effectiveBaseScale, 5.4, Math.pow(currentWarp, 1.35));

        const baseRotX = THREE.MathUtils.degToRad(8);
        const baseRotY = THREE.MathUtils.degToRad(-38);
        const baseRotZ = THREE.MathUtils.degToRad(4);
        const targetFaceOnX = THREE.MathUtils.degToRad(40);

        // Tactile Parallax: Enhanced amplitude when physical device orientation / gyro is active
        const isMobile = window.innerWidth <= 768;
        const effectiveParallaxX = (isMobile && hasGyroData) ? currentGyroX : mouseX;
        const effectiveParallaxY = (isMobile && hasGyroData) ? currentGyroY : mouseY;
        const parallaxAmpX = (isMobile && hasGyroData) ? 0.12 : 0.04;
        const parallaxAmpY = (isMobile && hasGyroData) ? 0.10 : 0.04;

        const parallaxInfluence = Math.max(0.0, 1.0 - currentWarp * 2.0);
        const targetTiltX = THREE.MathUtils.lerp(baseRotX, targetFaceOnX, warpCurve) + (effectiveParallaxY * parallaxAmpY * parallaxInfluence);
        const targetTiltY = THREE.MathUtils.lerp(baseRotY, 0.0, warpCurve) + (effectiveParallaxX * parallaxAmpX * parallaxInfluence);
        const targetTiltZ = THREE.MathUtils.lerp(baseRotZ, 0.0, warpCurve);

        compassRoot.rotation.set(targetTiltX, targetTiltY, targetTiltZ);

        const localPivot = new THREE.Vector3(0.0, 0.87 * scale, 0.0);
        const worldPivotOffset = localPivot.applyEuler(compassRoot.rotation);
        compassRoot.position.copy(targetPivot).sub(worldPivotOffset);
        compassRoot.scale.setScalar(scale);

        // Update Exploded Leader Lines & Telemetry Callouts
        if (svgRef.current && compassRoot && separation > 0.05 && currentWarp < 0.01) {
          compassRoot.updateMatrixWorld(true);
          const isMobile = window.innerWidth <= 768;

          if (lensGroup) {
            const lensX = isMobile ? -1.2 : 2.2;
            const ptLens = new THREE.Vector3(lensX, lensGroup.position.y + 0.3, 0.0).applyMatrix4(compassRoot.matrixWorld);
            updateCallout(calloutLensRef.current, ptLens, isMobile ? 'left' : 'right', isMobile ? 32 : 46);
          }
          if (needleMesh) {
            const needleX = isMobile ? -1.6 : -1.8;
            const ptNeedle = new THREE.Vector3(needleX, needleMesh.position.y, 0.3).applyMatrix4(compassRoot.matrixWorld);
            updateCallout(calloutNeedleRef.current, ptNeedle, 'left', isMobile ? 36 : 48);
          }
          if (dialGroup) {
            const dialX = isMobile ? -0.8 : 2.6;
            const ptDial = new THREE.Vector3(dialX, dialGroup.position.y + 0.6, 0.8).applyMatrix4(compassRoot.matrixWorld);
            updateCallout(calloutDialRef.current, ptDial, isMobile ? 'left' : 'right', isMobile ? 32 : 50);
          }
          if (casingGroup) {
            const casingLocalX = isMobile ? -2.2 : 2.8;
            const ptCasing = new THREE.Vector3(casingLocalX, casingGroup.position.y - 0.4, -0.2).applyMatrix4(compassRoot.matrixWorld);
            updateCallout(calloutCasingRef.current, ptCasing, isMobile ? 'left' : 'right', isMobile ? 38 : 44);
          }
          if (ringMesh) {
            const ringZ = isMobile ? ringMesh.position.z + 0.2 : ringMesh.position.z - 0.7;
            const ptRing = new THREE.Vector3(isMobile ? -0.8 : 0.0, 0.55, ringZ).applyMatrix4(compassRoot.matrixWorld);
            updateCallout(calloutRingRef.current, ptRing, 'left', isMobile ? 30 : 42);
          }

          const calloutsOpacity = Math.max(0, separation * (1.0 - animState.assembleProgress * 0.4));
          svgRef.current.style.opacity = '1';
          [calloutLensRef, calloutNeedleRef, calloutDialRef, calloutCasingRef, calloutRingRef].forEach((ref) => {
            if (ref.current) ref.current.style.opacity = String(calloutsOpacity);
          });
        } else {
          [calloutLensRef, calloutNeedleRef, calloutDialRef, calloutCasingRef, calloutRingRef].forEach((ref) => {
            if (ref.current) ref.current.style.opacity = '0';
          });
        }
      }

      // Damping mouse velocity
      mouseVelocity *= 0.94;

      // Dissolve canvas as compass penetrates through screen center
      if (canvas) {
        if (currentWarp > 0.74) {
          const dissolve = THREE.MathUtils.clamp((currentWarp - 0.74) / 0.22, 0.0, 1.0);
          canvas.style.opacity = String(Math.max(0.0, 1.0 - dissolve));
        } else {
          canvas.style.opacity = '1';
        }
      }

      // Render with Line-Art Outline Effect
      effect.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // 6. Resize Observer for Crisp High-DPI Rendering
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          width = newW;
          height = newH;
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
          initialScale = computeInitialScale(camera.aspect);
          xRest = computeRestX(camera.aspect);
          yRest = computeRestY(camera.aspect);
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
      assembleTimeline?.kill();
      manualTween?.kill();
      window.removeEventListener('adventure:compass-warp', handleWarp);
      window.removeEventListener('wheel', handleScrollClose);
      window.removeEventListener('touchmove', handleScrollClose);
      window.removeEventListener('click', handleWindowCaptureClick, { capture: true });
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('touchstart', requestDevicePermission);
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

  const handleHitAreaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleExplodedRef.current?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleExplodedRef.current?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`hero-compass-3d-wrapper ${isVisible ? 'is-visible' : ''} ${isLoaded ? 'is-model-ready' : ''}`}
    >
      <canvas ref={canvasRef} className="hero-compass-3d-canvas" aria-hidden="true" />

      {/* Blueprint Exploded Schematic & Drafting Compass Overlay */}
      <svg ref={svgRef} className="hero-compass-exploded-svg" aria-hidden="true">
        {/* Interactive Click Hit Area Circle */}
        <circle
          ref={hitAreaRef}
          className="compass-interactive-hit-area cursor-target"
          onClick={handleHitAreaClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          data-cursor-text="CLICK // EXPLODE"
          aria-label="Toggle Exploded 3D Compass View"
        />

        {/* 00 // Architectural Drafting Compass 360 Circle Draw */}
        <g ref={draftingGroupRef} className="drafting-compass-group">
          {/* Center pivot cross (+) */}
          <path ref={draftingCrossRef} className="drafting-center-cross" />
          {/* Radial drafting arm from center to perimeter */}
          <line ref={draftingArmRef} className="drafting-compass-arm" />
          {/* 360 circle perimeter stroke */}
          <circle ref={draftingCircleRef} className="drafting-compass-circle" />
          {/* Compass needle pen tip */}
          <circle ref={draftingPenDotRef} className="drafting-compass-dot" r="2.8" />
        </g>

        {/* 01 // Sapphire Crystal Lens */}
        <g
          ref={calloutLensRef}
          className="exploded-callout"
          data-label="[ 01 // SAPPHIRE CRYSTAL LENS ]"
          data-label-mobile="[ 01 // SAPPHIRE LENS ]"
        >
          <path className="exploded-callout-line" />
          <circle className="exploded-callout-dot" r="2.2" />
          <text className="exploded-callout-text">[ 01 // SAPPHIRE CRYSTAL LENS ]</text>
        </g>
        {/* 02 // Balanced Agate Needle */}
        <g
          ref={calloutNeedleRef}
          className="exploded-callout"
          data-label="[ 02 // BALANCED AGATE NEEDLE ]"
          data-label-mobile="[ 02 // AGATE NEEDLE ]"
        >
          <path className="exploded-callout-line" />
          <circle className="exploded-callout-dot" r="2.2" />
          <text className="exploded-callout-text">[ 02 // BALANCED AGATE NEEDLE ]</text>
        </g>
        {/* 03 // Engraved Dial Plate */}
        <g
          ref={calloutDialRef}
          className="exploded-callout"
          data-label="[ 03 // 360° ENGRAVED DIAL ]"
          data-label-mobile="[ 03 // 360° DIAL ]"
        >
          <path className="exploded-callout-line" />
          <circle className="exploded-callout-dot" r="2.2" />
          <text className="exploded-callout-text">[ 03 // 360° ENGRAVED DIAL ]</text>
        </g>
        {/* 04 // Solid Brass Casing */}
        <g
          ref={calloutCasingRef}
          className="exploded-callout"
          data-label="[ 04 // SOLID CASING & BEZEL ]"
          data-label-mobile="[ 04 // CASING & BEZEL ]"
        >
          <path className="exploded-callout-line" />
          <circle className="exploded-callout-dot" r="2.2" />
          <text className="exploded-callout-text">[ 04 // SOLID CASING & BEZEL ]</text>
        </g>
        {/* 05 // Suspension Bow */}
        <g
          ref={calloutRingRef}
          className="exploded-callout"
          data-label="[ 05 // SUSPENSION BOW ]"
          data-label-mobile="[ 05 // SUSPENSION BOW ]"
        >
          <path className="exploded-callout-line" />
          <circle className="exploded-callout-dot" r="2.2" />
          <text className="exploded-callout-text">[ 05 // SUSPENSION BOW ]</text>
        </g>
      </svg>
    </div>
  );
};
