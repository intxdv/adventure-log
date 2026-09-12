export type ExpeditionCategory = 'all' | 'mobile' | 'ai-tools' | 'systems' | 'editorial';

export interface ExpeditionDossier {
  englishSummary: string;
  nature: 'Self-initiated' | 'Class Assignment' | 'Work / Organizational Assignment' | 'Community Initiative';
  isGroupProject: boolean;
  groupRole?: string;
  impact: string[];
  learnings: string[];
  mediaLinks?: { label: string; url: string }[];
}

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
  dossier: ExpeditionDossier;
}

export interface ArsenalPillar {
  id: string;
  title: string;
  tagline: string;
  skills: string[];
}
