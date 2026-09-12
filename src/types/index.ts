export type ExpeditionCategory = 'all' | 'mobile' | 'ai-tools' | 'systems' | 'editorial';

export interface Expedition {
  id: string;
  indexNumber: string;
  title: string;
  tagline: string;
  category: 'mobile' | 'ai-tools' | 'systems' | 'editorial';
  categoryLabel: string;
  year: string;
  period?: string;
  role: string;
  status: 'Deployed' | 'Active' | 'Concluded';
  stack: string[];
  summary: string;
  featured?: boolean;
  link?: string;
  repoUrl?: string;
  image?: string;
}

export interface ArsenalPillar {
  id: string;
  title: string;
  tagline: string;
  skills: string[];
}
