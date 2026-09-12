export interface Expedition {
  id: string;
  indexNumber: string;
  title: string;
  category: string;
  year: string;
  stack: string[];
  summary: string;
  link?: string;
  image?: string;
}

export interface ArsenalPillar {
  id: string;
  title: string;
  tagline: string;
  skills: string[];
}
