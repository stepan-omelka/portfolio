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

/**
 * Your real projects, in the order they should appear. Example:
 *
 *   {
 *     slug: "my-project",
 *     title: "My Project",
 *     summary: "One sentence for the card.",
 *     description: ["Paragraph one.", "Paragraph two."],
 *     year: 2026,
 *     role: "Frontend developer",
 *     tags: ["Angular", "TypeScript"],
 *     links: [{ label: "Live site", url: "https://example.com" }],
 *     status: "live",
 *   },
 */
const featuredProjects: Project[] = [];

/** Minimum number of cards on the page; empty ones are filled with placeholders. */
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

const emptySlots = Math.max(0, SLOT_COUNT - featuredProjects.length);

export const projects: Project[] = [
  ...featuredProjects,
  ...Array.from({ length: emptySlots }, (_, i) => placeholderProject(featuredProjects.length + i)),
];

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
