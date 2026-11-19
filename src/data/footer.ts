export interface FooterNavLink {
  index: string;
  label: string;
  href: string;
}

export interface FooterSocialLink {
  label: string;
  url: string;
  icon: string;
  note?: string;
}

export const FOOTER_NAV_LINKS: FooterNavLink[] = [
  { index: '00', label: 'Intro', href: '#hero' },
  { index: '01', label: 'Profile', href: '#about' },
  { index: '02', label: 'Works', href: '#expeditions' },
  { index: '03', label: 'Skills', href: '#arsenal' },
  { index: '04', label: 'Contact', href: '#footer' },
];

export const FOOTER_SOCIAL_LINKS: FooterSocialLink[] = [
  { label: 'GitHub', url: 'https://github.com/intxdv', icon: '/icons/github.svg', note: 'intxdv' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/syafiq-abiyyu-taqi/', icon: '/icons/linkedin.svg', note: 'Syafiq Abiyyu Taqi' },
  { label: 'X', url: 'https://x.com/intxdv', icon: '/icons/x.svg', note: '@intxdv' },
  { label: 'Instagram', url: 'https://instagram.com/intxdv', icon: '/icons/instagram.svg', note: '@intxdv' },
  { label: 'Gmail', url: 'mailto:selvagant@gmail.com', icon: '/icons/gmail.svg', note: 'selvagant@gmail.com' },
];

export const FOOTER_COLOPHON = {
  tagline: 'Personal digital log & software engineering journal by Taki.',
  typography: 'Lufga, Newsreader, JetBrains Mono.',
  stack: 'React 19 · TypeScript · Vite · Modular CSS.',
  edition: 'Adventure Log · Edition 2026.',
};

export const MARQUEE_ITEMS: string[] = [
  'EXPLORE THE UNKNOWN',
  'CRAFT WITH PRECISION',
  'SOFTWARE DEVELOPER',
  'BUILDER',
  'ADVENTURE LOG.',
  'SELVAGANT // THE WANDERING SELV',
  'QUIET ARCHITECTURE',
];
