export type ExpeditionCategory = 'all' | 'mobile' | 'ai-tools' | 'systems' | 'editorial';

export interface ExpeditionDossier {
  englishSummary: string;
  nature:
    | 'Self-initiated'
    | 'Class Assignment'
    | 'Course Capstone Project'
    | 'Work / Organizational Assignment'
    | 'Work'
    | 'Internship'
    | 'Community Initiative';
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

export interface ArsenalSkill {
  name: string;
  spec?: string;
  highlight?: boolean;
}

export interface ArsenalPillar {
  id: string;
  pillarIndex: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  skills: ArsenalSkill[];
  tools: string[];
  image?: string;
}
