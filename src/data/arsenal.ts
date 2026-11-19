import type { ArsenalPillar } from '../types';

export const initialArsenal: ArsenalPillar[] = [
  {
    id: 'fullstack-mobile',
    pillarIndex: '01',
    code: 'FULLSTACK',
    title: 'fullstack & mobile engineering.',
    tagline: 'end-to-end web apps, clean mobile architectures, and reliable apis.',
    description:
      'Building dependable client-server systems and cross-platform mobile apps. Focused on clean state management, type-safe REST APIs with Bun/Elysia, offline persistence with SQLite, and performant user interfaces.',
    skills: [
      { name: 'React & TypeScript', spec: 'Component architectures, hooks, and responsive frontend', highlight: true },
      { name: 'Flutter & Dart', spec: 'Building cross-platform mobile apps across Android and iOS', highlight: true },
      { name: 'REST API & Backend', spec: 'Setting up lightweight server endpoints with Elysia, Bun, and Node.js', highlight: true },
      { name: 'Offline Storage & DB', spec: 'Relational data persistence using SQLite, Drift, and local caching', highlight: true },
      { name: 'Clean Architecture', spec: 'Separating presentation, domain business logic, and data layers' },
      { name: 'State Management', spec: 'Managing application state with BLoC, Riverpod, and React state' },
    ],
    tools: ['React', 'TypeScript', 'Flutter', 'Dart', 'Elysia', 'Bun', 'SQLite', 'REST API'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'applied-ai',
    pillarIndex: '02',
    code: 'APPLIED AI',
    title: 'applied ai & computer vision.',
    tagline: 'real-time edge vision, voice ai workflows, and model integration.',
    description:
      'Integrating machine learning models and multimodal APIs directly into client applications. Focused on edge computer vision inference in browser runtimes, speech-to-text pipelines, and privacy-conscious BYOK architectures.',
    skills: [
      { name: 'Real-Time Computer Vision', spec: 'Facial landmark tracking and EAR/MAR calculation via MediaPipe', highlight: true },
      { name: 'Multimodal AI Integration', spec: 'Voice synthesis, Gemini Live, and OpenAI Whisper APIs', highlight: true },
      { name: 'Client-Side Inference', spec: 'Running lightweight vision and audio pipelines on edge devices', highlight: true },
      { name: 'BYOK Architecture', spec: 'Bring-Your-Own-Key client storage with zero secret leaks', highlight: true },
      { name: 'Python & ML Tooling', spec: 'Data preprocessing, OpenCV pipelines, and model evaluation' },
      { name: 'Sensor & Camera Workflows', spec: 'Low-latency webcam streaming and browser audio capture' },
    ],
    tools: ['Python', 'MediaPipe', 'OpenCV', 'Gemini API', 'Whisper API', 'WXT', 'TypeScript'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'tooling-extensions',
    pillarIndex: '03',
    code: 'DEV TOOLS',
    title: 'developer tooling & extensions.',
    tagline: 'code editor plugins, browser extensions, and digital publishing.',
    description:
      'Creating practical tools that eliminate repetitive development friction. Focused on VS Code extensions with webview runtimes, Chromium browser extensions, and standards-compliant EPUB3 publishing systems.',
    skills: [
      { name: 'VS Code Extensions', spec: 'Building custom webviews, editor commands, and language tools', highlight: true },
      { name: 'Browser Extensions', spec: 'Developing extensions using WXT, Manifest V3, and content scripts', highlight: true },
      { name: 'EPUB3 & Publication Standards', spec: 'In-memory ZIP parsing with JSZip, OPF packages, and XML manifests', highlight: true },
      { name: 'Editorial Typography', spec: 'Micro-typography, kerning, leading, and digital book layout', highlight: true },
      { name: 'Web Animation with GSAP', spec: 'Scroll-triggered animations, page transitions, and timeline sequencing' },
      { name: 'Git & Open Source', spec: 'Clean commit hygiene, open-source documentation, and package releases' },
    ],
    tools: ['VS Code API', 'WXT', 'Webview API', 'JSZip', 'EPUB3', 'GSAP', 'HTML5/CSS3', 'Git'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  },
];
