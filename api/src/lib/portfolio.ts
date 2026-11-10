/**
 * Portfolio content — the single source of truth served by the API.
 *
 * To add a project, put it in `featuredProjects` below. Every real project
 * takes over one "Coming soon" placeholder slot until all slots are filled.
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
  /** Frontend technology, e.g. "Angular". `null` if the project has no UI. */
  frontend: string | null;
  /** Backend technology, e.g. "Spring Boot" or "Next.js". `null` if frontend-only. */
  backend: string | null;
  tags: string[];
  links: Link[];
  status: ProjectStatus;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Profile {
  name: string;
  role: string;
  location: string;
  /** Short line shown in the hero section. */
  intro: string;
  /** Paragraphs shown in the About section. */
  about: string[];
  /** Shown as columns under the About text. */
  skills: SkillGroup[];
  email: string;
  links: Link[];
}

export const profile: Profile = {
  name: "Štěpán Omelka",
  role: "Full Stack Developer",
  location: "Brno, Czech Republic",
  intro:
    "I build web applications end to end — Angular on the frontend, Spring Boot or Next.js on the backend.",
  about: [
    "Placeholder — how you got into full stack development and the kind of products you like to build.",
    "Placeholder — what you enjoy on each side of the stack: component architecture and UX in Angular, API design and data modelling in Spring Boot or Next.js.",
  ],
  skills: [
    { label: "Frontend", items: ["Angular", "TypeScript", "RxJS & Signals", "HTML & SCSS"] },
    { label: "Backend", items: ["Spring Boot", "Java", "Next.js", "Node.js", "REST APIs"] },
  ],
  email: "hello@example.com",
  links: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/" },
  ],
};

/**
 * Your real projects, in the order they should appear. Example:
 *
 *   {
 *     slug: "my-project",
 *     title: "My Project",
 *     summary: "One sentence for the card.",
 *     description: ["Paragraph one.", "Paragraph two."],
 *     year: 2026,
 *     role: "Full stack developer",
 *     frontend: "Angular",
 *     backend: "Spring Boot",
 *     tags: ["Angular", "Spring Boot", "PostgreSQL"],
 *     links: [{ label: "Live site", url: "https://example.com" }],
 *     status: "live",
 *   },
 */
const featuredProjects: Project[] = [];

/** Minimum number of cards on the page; empty ones are filled with placeholders. */
const SLOT_COUNT = 6;
const ORDINALS = ["One", "Two", "Three", "Four", "Five", "Six"];

/** Placeholder slots alternate between the two backends you work with. */
const PLACEHOLDER_STACKS = [
  { backend: "Spring Boot", tags: ["Angular", "Spring Boot", "Java"] },
  { backend: "Next.js", tags: ["Angular", "Next.js", "TypeScript"] },
];

function placeholderProject(index: number): Project {
  const n = String(index + 1).padStart(2, "0");
  const { backend, tags } = PLACEHOLDER_STACKS[index % PLACEHOLDER_STACKS.length];
  return {
    slug: `project-${n}`,
    title: `Project ${ORDINALS[index] ?? n}`,
    summary: `Placeholder — a full stack app with an Angular frontend and a ${backend} backend.`,
    description: [
      "Placeholder — what problem does this project solve, and for whom?",
      "Frontend: how the Angular app is structured — state, routing, the most interesting UI work.",
      `Backend: what the ${backend} API does — endpoints, data model, authentication, integrations.`,
      "What you learned, and what you would do differently next time.",
    ],
    year: null,
    role: "Full stack developer",
    frontend: "Angular",
    backend,
    tags,
    links: [],
    status: "placeholder",
  };
}

const emptySlots = Math.max(0, SLOT_COUNT - featuredProjects.length);

export const projects: Project[] = [
  ...featuredProjects,
  ...Array.from({ length: emptySlots }, (_, i) => placeholderProject(featuredProjects.length + i)),
];

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
