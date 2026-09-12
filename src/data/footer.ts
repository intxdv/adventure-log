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
  { label: 'LinkedIn', url: 'https://linkedin.com/in/syafiq-abiyyu-taqi', note: 'Syafiq Abiyyu Taqi' },
  { label: 'X / Twitter', url: 'https://x.com/intxdv', note: '@intxdv' },
  { label: 'Direct Dispatch', url: 'mailto:syafiqabiyyutaqi123@gmail.com', note: 'Email' },
];

export const FOOTER_TELEMETRY = {
  station: 'EXPEDITION HQ // CENTRAL JAVA',
  region: 'INDONESIA · WIB (UTC+7)',
  coordinates: '7.05° S, 110.44° E [SEMARANG SECTOR]',
  elevation: '348M [HIGHLAND FOOTHILLS]',
  status: 'AVAILABLE FOR SELECT COMMISSIONS',
};

export const FOOTER_COLOPHON = {
  craft: 'Designed & architected by Selvagant (Taki) — Creative Developer & Mobile Architect.',
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

