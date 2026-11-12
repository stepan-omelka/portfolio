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
  frontend: string | null;
  backend: string | null;
  tags: string[];
  links: Link[];
  status: ProjectStatus;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

/** Kept unnamed: never the product's or the client's name. */
export interface ClientProject {
  title: string;
  period: string;
  role: string;
  summary: string;
  contribution: string;
  tags: string[];
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  intro: string;
  about: string[];
  skills: SkillGroup[];
  clientWork: ClientProject[];
  email: string;
  phone: string | null;
  links: Link[];
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: 'Live',
  'in-progress': 'In progress',
  placeholder: 'Coming soon',
};

/** Body of POST /api/contact. `website` is a honeypot that people leave empty. */
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  website: string;
}

/** Error codes returned by POST /api/contact. */
export type ContactError = 'invalid' | 'send-failed' | 'unexpected';
