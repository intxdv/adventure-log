export interface FooterNavLink {
  index: string;
  label: string;
  href: string;
}

export interface FooterSocialLink {
  label: string;
  url: string;
  note?: string;
}

export const FOOTER_NAV_LINKS: FooterNavLink[] = [
  { index: '00', label: 'Expedition Hero', href: '#hero' },
  { index: '01', label: 'Field Brief / Bio', href: '#about' },
  { index: '02', label: 'Selected Expeditions', href: '#expeditions' },
  { index: '03', label: 'Field Arsenal', href: '#arsenal' },
  { index: '04', label: 'Basecamp Dispatch', href: '#footer' },
];

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/intxdv', note: 'intxdv' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/syafiq-abiyyu-taqi/', note: 'Syafiq Abiyyu Taqi' },
  { label: 'X / Twitter', url: 'https://x.com/intxdv', note: '@intxdv' },
  { label: 'Instagram', url: 'https://instagram.com/intxdv', note: '@intxdv' },
  { label: 'Direct Dispatch', url: 'mailto:selvagant@gmail.com', note: 'selvagant@gmail.com' },
];

export const FOOTER_COLOPHON = {
  tagline: 'Personal digital archive & software engineering field log by Selvagant.',
  typography: 'Lufga, Newsreader, JetBrains Mono.',
  stack: 'React 19 · TypeScript · Vite · Modular CSS.',
  edition: 'Adventure Log Field Archive · Edition 2026.',
};

export const MARQUEE_ITEMS: string[] = [
  'NATIVE CRAFT & MOBILE ARCHITECTURE',
  'EXPLORE THE UNKNOWN',
  'CRAFT WITH PRECISION',
  'THE DIGITAL CARTOGRAPHER',
  'FIELD DOSSIER // 2026',
  'SELVAGANT — THE WANDERING SELV',
  'QUIET ARCHITECTURE',
];
