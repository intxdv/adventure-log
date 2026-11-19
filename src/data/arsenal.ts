import type { ArsenalPillar } from '../types';

export const initialArsenal: ArsenalPillar[] = [
  {
    id: 'mobile-dev',
    pillarIndex: 'PILLAR // 01',
    code: 'FOCUS.MOBILE // 01',
    title: 'mobile development & architecture.',
    tagline: 'offline-first apps, clean architecture, and responsive touch interfaces.',
    description:
      'Building dependable mobile applications with Flutter. Focusing on decoupled Clean Architecture, offline-first local persistence, and intuitive touch interfaces for real-world field conditions, ranging from cattle feed formulation to campus incident management.',
    skills: [
      { name: 'Flutter & Dart Ecosystem', spec: 'Production mobile applications across Android and iOS', highlight: true },
      { name: 'Clean Architecture & BLoC', spec: 'Decoupled domain, data, and presentation state machines', highlight: true },
      { name: 'Offline-First Local Storage', spec: 'SQLite, Drift, and resilient local data caching', highlight: true },
      { name: 'High-Performance APIs', spec: 'Sub-millisecond REST endpoints with Elysia.js & Bun', highlight: true },
      { name: 'Mobile Ergonomics & UX', spec: 'Field-tested forms, high contrast, and tactile feedback' },
      { name: 'Device Hardware & Telemetry', spec: 'Camera feeds, MediaPipe computer vision, and biometric input' },
    ],
    tools: ['Flutter', 'Dart', 'BLoC', 'SQLite', 'Drift', 'REST API', 'Elysia', 'Bun'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'tooling-extensions',
    pillarIndex: 'PILLAR // 02',
    code: 'FOCUS.TOOLING // 02',
    title: 'developer tooling & browser extensions.',
    tagline: 'editor extensions, voice AI interfaces, and pragmatic developer workflows.',
    description:
      'Developing tools that eliminate everyday digital friction. From building an in-editor XHTML and EPUB previewer with live TOC inspection to creating voice AI browser extensions powered by Gemini and Whisper with a private Bring-Your-Own-Key model.',
    skills: [
      { name: 'VS Code & Editor Extension APIs', spec: 'Webview IPC, custom editors, and workspace commands', highlight: true },
      { name: 'WebExtension Architecture', spec: 'Cross-browser content scripts, background workers, and WXT', highlight: true },
      { name: 'Voice AI & Speech-to-Text', spec: 'Google Gemini & Whisper API integration with BYOK privacy', highlight: true },
      { name: 'EPUB3 & Package Parsing', spec: 'Binary .epub archive stream parsing via JSZip and XML DOM', highlight: true },
      { name: 'Computer Vision Screening', spec: 'MediaPipe facial landmark telemetry for fatigue detection' },
      { name: 'TypeScript Strict Typing', spec: 'End-to-end typed contracts and reliable client pipelines' },
    ],
    tools: ['TypeScript', 'VS Code API', 'Webview API', 'WXT', 'Gemini API', 'Whisper', 'Python', 'MediaPipe'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'web-editorial',
    pillarIndex: 'PILLAR // 03',
    code: 'FOCUS.SYSTEMS // 03',
    title: 'web engineering & editorial systems.',
    tagline: 'calm editorial typography, smooth motion, and accessible web standards.',
    description:
      'Engineering responsive web applications and digital publishing layouts. Grounded in editorial typography, purposeful motion choreography, and accessible component systems that avoid generic templates.',
    skills: [
      { name: 'React 19 & Modern Frontend', spec: 'Modular component architecture, hooks, and clean state', highlight: true },
      { name: 'Motion & Scroll Choreography', spec: 'Frame-synchronized GSAP scroll transitions and micro-motion', highlight: true },
      { name: 'Editorial Micro-Typography', spec: 'Typographic hierarchy, optical contrast, and EPUB3 standards', highlight: true },
      { name: 'Semantic CSS Architecture', spec: 'Fluid typography scales, CSS variables, and dark/light modes', highlight: true },
      { name: 'Web Accessibility (WCAG 2.1)', spec: 'Keyboard traversal, ARIA semantics, and screen reader testing' },
      { name: 'Interface Design & Prototyping', spec: 'Figma component systems, wireframing, and design tokens' },
    ],
    tools: ['React', 'TypeScript', 'GSAP', 'Vite', 'Figma', 'HTML5/CSS3', 'EPUB3'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  },
];
