import type { ArsenalPillar } from '../types';

export const initialArsenal: ArsenalPillar[] = [
  {
    id: 'creative-web',
    pillarIndex: 'PILLAR // 01',
    code: 'GEAR.WEB // 01',
    title: 'creative web & spatial frontend.',
    tagline: 'precision canvas manipulation, kinetic choreography & tactile DOM.',
    description:
      'Arsitektur antarmuka web performa tinggi yang memadukan tipografi editorial Swiss, micro-interactions berbasis fisika, dan manipulasi spatial canvas 2D.',
    skills: [
      { name: 'React 19 & Next.js Architecture', spec: 'Modern concurrent state & SSR pipelines', highlight: true },
      { name: 'TypeScript Strict Typing', spec: 'Zero-runtime ambiguity & typed contract design', highlight: true },
      { name: 'GSAP & ScrollTrigger Choreography', spec: 'Frame-synchronized viewport orchestration', highlight: true },
      { name: 'HTML5 Canvas 2D & Shaders', spec: 'Generative paper grain & fluid particles' },
      { name: 'Modular CSS Architecture', spec: 'Semantic design tokens & responsive fluid typography' },
      { name: 'Web Performance & Core Web Vitals', spec: 'CLS < 0.05, sub-second LCP & bundle budget' },
    ],
    tools: ['React 19', 'TypeScript', 'Vite', 'Next.js', 'GSAP', 'Tailwind', 'Canvas 2D'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'mobile-craft',
    pillarIndex: 'PILLAR // 02',
    code: 'GEAR.MOBILE // 02',
    title: 'mobile architecture & native craft.',
    tagline: 'gesture-first, resilient state machines & offline-first systems.',
    description:
      'Pengembangan aplikasi mobile lintas platform dengan penekanan pada responsivitas sentuhan 60fps, Clean Architecture, sinkronisasi offline-first, dan backend microservices berlatensi rendah.',
    skills: [
      { name: 'Flutter & Dart Ecosystem', spec: 'Production cross-platform mobile engineering', highlight: true },
      { name: 'Clean Architecture & Modular BLoC', spec: 'Decoupled domain, data, and presentation layers', highlight: true },
      { name: 'High-Performance Microservices', spec: 'Elysia.js & Bun runtime for sub-ms REST dispatch', highlight: true },
      { name: 'Offline-First Local Storage', spec: 'SQLite, Drift, Hive & resilient offline queuing' },
      { name: 'Hardware & Sensor Telemetry', spec: 'Camera streaming, MediaPipe CV, & biometric inputs' },
      { name: 'Cross-Platform Build Pipelines', spec: 'Hermetic release builds & mobile optimization' },
    ],
    tools: ['Flutter', 'Dart', 'Elysia', 'Bun', 'Riverpod', 'SQLite', 'REST API'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'interface-systems',
    pillarIndex: 'PILLAR // 03',
    code: 'GEAR.DESIGN // 03',
    title: 'interface systems & visual direction.',
    tagline: 'quiet confidence, optical typography & intentional white space.',
    description:
      'Perancangan sistem visual holistik yang menolak template pasaran (*anti-slop*), berakar pada disiplin tipografi Swiss, token desain terukur, dan kepatuhan aksesibilitas tinggi.',
    skills: [
      { name: 'Design Token Architecture', spec: 'Semantic contrast scales, light/dark modes, and hairlines', highlight: true },
      { name: 'Editorial Micro-Typography', spec: 'Optical rhythm, kerning discipline, and editorial serif pairings', highlight: true },
      { name: 'Atomic Component Libraries', spec: 'Figma variants, interactive auto-layouts, & design kits', highlight: true },
      { name: 'WCAG 2.1 AA Accessibility', spec: 'Keyboard focus traversal, contrast ratios, & aria semantics' },
      { name: 'Tactile Editorial Aesthetics', spec: 'Field journal, blueprint frames, and dossier layouts' },
      { name: 'User Research & Civic Workflows', spec: 'Heuristic evaluation & empathy for non-digital natives' },
    ],
    tools: ['Figma', 'Design Tokens', 'Editorial Type', 'WCAG AA', 'UI/UX Audit', 'SVG Blueprint'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  },
];
