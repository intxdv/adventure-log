import type { Expedition } from '../types';

export const initialExpeditions: Expedition[] = [
  {
    id: 'exp-01',
    indexNumber: 'EXP. 01 / 04',
    title: 'the silence that heals.',
    category: 'Mobile Application · Creative Direction',
    year: '2026',
    stack: ['Flutter', 'Riverpod', 'Dart', 'Clean Arch'],
    summary: 'A mindful field exploration companion built for tranquility and offline sensory mapping in remote landscapes.',
    link: '#',
  },
  {
    id: 'exp-02',
    indexNumber: 'EXP. 02 / 04',
    title: 'contours of the void.',
    category: 'Creative Web · Spatial Interface',
    year: '2025',
    stack: ['React', 'TypeScript', 'Three.js', 'GLSL'],
    summary: 'An interactive topographical contour experiment translating altitude elevation data into dynamic shader waves.',
    link: '#',
  },
  {
    id: 'exp-03',
    indexNumber: 'EXP. 03 / 04',
    title: 'tactile telemetry units.',
    category: 'Design Systems · Mobile Framework',
    year: '2025',
    stack: ['Design Tokens', 'Figma', 'Flutter', 'UI Architecture'],
    summary: 'A unified instrument design system bringing physical industrial aesthetics to modern digital tactile interfaces.',
    link: '#',
  },
  {
    id: 'exp-04',
    indexNumber: 'EXP. 04 / 04',
    title: 'whispers from basecamp.',
    category: 'Native Mobile · Offline Sync',
    year: '2024',
    stack: ['Kotlin', 'Swift', 'SQLite', 'P2P Sync'],
    summary: 'Decentralized field communication log for expedition teams operating beyond cellular grid coverage.',
    link: '#',
  }
];
