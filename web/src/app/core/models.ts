/**
 * Mirrors the API contract in `api/src/lib/portfolio.ts`. Keep the two in sync.
 */

export type ProjectStatus = 'live' | 'in-progress' | 'placeholder';

export interface Link {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string[];
  year: number | null;
  role: string;
  tags: string[];
  links: Link[];
  status: ProjectStatus;
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  intro: string;
  about: string[];
  email: string;
  links: Link[];
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  placeholder: 'Coming soon',
};
