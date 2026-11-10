/**
 * Portfolio content — the single source of truth served by the API.
 *
 * To add a real project, replace one of the placeholder entries below
 * (or append a new one) and set `status` to "live" or "in-progress".
 * Keep the shape in sync with `web/src/app/core/models.ts`.
 */

export type ProjectStatus = "live" | "in-progress" | "placeholder";

export interface Link {
  label: string;
  url: string;
}

export interface Project {
  /** URL-safe identifier, used in /api/projects/[slug] and /projects/:slug. */
  slug: string;
  title: string;
  /** One sentence, shown on the project card. */
  summary: string;
  /** Paragraphs shown on the project detail page. */
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
  /** Short line shown in the hero section. */
  intro: string;
  /** Paragraphs shown in the About section. */
  about: string[];
  email: string;
  links: Link[];
}

export const profile: Profile = {
  name: "Štěpán Omelka",
  role: "Frontend Developer",
  location: "Brno, Czech Republic",
  intro:
    "Placeholder intro — one or two sentences about what you build and what you care about.",
  about: [
    "Placeholder about text. Describe your background, the kind of work you enjoy, and the tools you reach for most often.",
    "Second placeholder paragraph. Mention what you are currently learning, or what you do when you are not writing code.",
  ],
  email: "hello@example.com",
  links: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
};

const SLOT_COUNT = 6;
const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six"];

function placeholderProject(index: number): Project {
  const n = String(index + 1).padStart(2, "0");
  return {
    slug: `project-${n}`,
    title: `Project ${ORDINALS[index] ?? n}`,
    summary: "Placeholder summary — one sentence about what this project does.",
    description: [
      "Placeholder description. Explain the problem this project solves and who it is for.",
      "Describe your role, the interesting technical decisions, and what you would do differently next time.",
    ],
    year: null,
    role: "Your role",
    tags: ["Tag", "Tag", "Tag"],
    links: [],
    status: "placeholder",
  };
}

export const projects: Project[] = Array.from({ length: SLOT_COUNT }, (_, i) =>
  placeholderProject(i),
);

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
