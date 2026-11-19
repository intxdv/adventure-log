import type { ArsenalPillar } from '../types';

export const initialArsenal: ArsenalPillar[] = [
  {
    id: 'mobile-dev',
    pillarIndex: '01',
    code: 'MOBILE',
    title: 'mobile development.',
    tagline: 'production apps with flutter, clean architecture, and offline storage.',
    description:
      'Building dependable cross-platform mobile apps using Flutter and Dart. Focused on offline-first local storage, decoupled Clean Architecture, and responsive UI for real user workflows like farm feed calculators and campus reporting.',
    skills: [
      { name: 'Flutter & Dart', spec: 'Building responsive apps across Android and iOS', highlight: true },
      { name: 'State Management', spec: 'Managing app state using BLoC and Riverpod', highlight: true },
      { name: 'Offline Storage', spec: 'Local database persistence using SQLite, Drift, and Hive', highlight: true },
      { name: 'REST API Integration', spec: 'Connecting client apps with backend services and error handling', highlight: true },
      { name: 'Clean Architecture', spec: 'Separating presentation, domain business logic, and data layers' },
      { name: 'Mobile UI Layouts', spec: 'Custom widgets, forms, and responsive mobile interfaces' },
    ],
    tools: ['Flutter', 'Dart', 'BLoC', 'Riverpod', 'SQLite', 'Drift', 'REST API', 'Git'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'tooling-extensions',
    pillarIndex: '02',
    code: 'TOOLING',
    title: 'developer tooling & extensions.',
    tagline: 'editor extensions, browser tools, and practical workflows.',
    description:
      'Creating practical tools that solve specific workflow headaches. Focused on code editor extensions, browser tools with third-party AI APIs, and straightforward automation.',
    skills: [
      { name: 'VS Code Extensions', spec: 'Building custom webviews, commands, and editor integrations', highlight: true },
      { name: 'Browser Extensions', spec: 'Developing extensions using WXT, Manifest V3, and content scripts', highlight: true },
      { name: 'AI API Integration', spec: 'Integrating Gemini and Whisper APIs with Bring-Your-Own-Key models', highlight: true },
      { name: 'EPUB & XHTML Parsing', spec: 'Reading and parsing .epub archives, OPF packages, and XML via JSZip', highlight: true },
      { name: 'Computer Vision', spec: 'Eye and mouth aspect ratio calculation (EAR/MAR) using MediaPipe for fatigue detection' },
      { name: 'TypeScript', spec: 'Writing type-safe code across extensions and web applications' },
    ],
    tools: ['TypeScript', 'VS Code API', 'Webview API', 'WXT', 'Gemini API', 'Whisper API', 'Python', 'MediaPipe'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'web-editorial',
    pillarIndex: '03',
    code: 'WEB & DESIGN',
    title: 'web development & design.',
    tagline: 'clean frontend code, purposeful animations, and digital layout.',
    description:
      'Building web interfaces and publishing digital formats with clean markup and good readability. Focused on semantic code, natural scroll animations with GSAP, and book typesetting.',
    skills: [
      { name: 'React & Frontend', spec: 'Component-based web apps with modern hooks and state handling', highlight: true },
      { name: 'Web Animation with GSAP', spec: 'Scroll-triggered animations, page transitions, and timeline sequencing', highlight: true },
      { name: 'HTML5 & CSS3', spec: 'Semantic markup, modern layout with Flexbox/Grid, and responsive design', highlight: true },
      { name: 'EPUB3 & Book Typesetting', spec: 'Formatting long-form digital books, chapter structure, and clean typography', highlight: true },
      { name: 'UI/UX Prototyping', spec: 'Designing wireframes, layouts, and components in Figma' },
      { name: 'Backend Basics (Bun & Elysia)', spec: 'Setting up lightweight REST APIs and server routes' },
    ],
    tools: ['React', 'TypeScript', 'Vite', 'GSAP', 'HTML5/CSS3', 'Figma', 'EPUB3', 'Elysia'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  },
];
