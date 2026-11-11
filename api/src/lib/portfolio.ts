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
  /** Shown under the email in the Contact section, e.g. "+420 123 456 789"; `null` hides it. */
  phone: string | null;
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
  email: "stepomelka@gmail.com",
  phone: "+420 601 326 874",
  links: [
    { label: "GitHub", url: "https://github.com/stepan-omelka" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/%C5%A1t%C4%9Bp%C3%A1n-omelka-238383370" },
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
const featuredProjects: Project[] = [
  {
    slug: "tapwave",
    title: "Tapwave",
    summary:
      "A browser rhythm game in the circle-clicking genre, with a leaderboard the server verifies.",
    description: [
      "Hit circles as their approach ring closes, follow sliders and spin spinners across eight maps generated from each song's rhythm. The music is either synthesised live in the browser or openly licensed.",
      "Frontend: Angular 22 (zoneless, signals) around a game engine in plain TypeScript: a game loop driven by the Web Audio clock, Canvas 2D rendering, procedurally synthesised tracks and an autoplay demo.",
      "Backend: Spring Boot 4.1 with PostgreSQL and Flyway. The client never sends a score, only what happened to each object; the server recomputes the result and rejects plays that are too fast, outside the timing windows or too consistent to be human. Maps are generated on startup from each song's measured beat grid and onsets.",
      "The scoring rules are implemented in both TypeScript and Java and kept in agreement by golden test cases that both test suites run (57 backend tests with Testcontainers, 17 frontend tests with Vitest). Built with Claude Code; the README lists where the AI went wrong and how each mistake was caught.",
      "One Docker image serves the game, its audio and the API on Render's free tier, with the database on Neon. The first visit after a quiet spell takes a minute or two while the server starts.",
    ],
    year: 2026,
    role: "Full stack developer",
    frontend: "Angular",
    backend: "Spring Boot",
    tags: ["Angular", "Spring Boot", "PostgreSQL", "Canvas 2D", "Web Audio"],
    links: [
      { label: "Play it", url: "https://tapwave.onrender.com" },
      { label: "Source code", url: "https://github.com/stepan-omelka/tapwave" },
    ],
    status: "live",
  },
  {
    slug: "cookie-clicker",
    title: "Cookie Clicker",
    summary:
      "A small full stack game: click the cookie, buy upgrades, and the Spring Boot server keeps score in PostgreSQL.",
    description: [
      "Click the cookie and buy upgrades that give more cookies per click or per second. Progress is stored in PostgreSQL, and the server validates every purchase.",
      "Frontend: Angular 22, zoneless and built on signals. Clicks show up immediately and are sent in batches once per second through a single request queue, so pending clicks always reach the server before a purchase. Clicks still unsent when the tab closes go out with sendBeacon.",
      "Backend: Spring Boot 4 with Spring Data JPA and Flyway. Passive income is computed from the time since the last update, so nothing runs in the background. Retried click batches are counted only once, clicks are rate limited, and writes lock the game row so parallel requests can't lose updates. Errors are returned as Problem Details (RFC 9457).",
      "Tested with JUnit 5, MockMvc, Testcontainers and Vitest. One Docker image serves both the game and the API, hosted on Render with the database on Neon.",
    ],
    year: 2026,
    role: "Full stack developer",
    frontend: "Angular",
    backend: "Spring Boot",
    tags: ["Angular", "Spring Boot", "Java", "PostgreSQL", "Docker"],
    links: [
      { label: "Play it", url: "https://cookie-clicker-he2s.onrender.com" },
      { label: "Source code", url: "https://github.com/stepan-omelka/cookie-clicker" },
    ],
    status: "live",
  },
  {
    slug: "modrusa",
    title: "CM Modruša",
    summary:
      "Website for a cimbalom band from South Moravia, with a booking inquiry form that emails the band.",
    description: [
      "The official website of Cimbálová muzika Modruša, a young cimbalom band from Moravský Žižkov that plays folk music at public events, parties, corporate events and weddings. It introduces the band and its members, shows their Instagram, and lets visitors send booking inquiries.",
      "Built with the Next.js App Router, React and Tailwind CSS. Pages are prerendered at build time; the only server-side code is a server action that validates the inquiry with Zod and emails it to the band through Resend.",
      "Folders form layers that may only import from the layers below them, enforced by ESLint. Server actions are injected into components, so the contact form can be tested with a fake action. Tested with Jest and Testing Library, hosted on Vercel.",
    ],
    year: 2026,
    role: "Developer",
    frontend: "React (Next.js)",
    backend: "Next.js server actions",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Resend"],
    links: [{ label: "Live site", url: "https://modrusa.cz" }],
    status: "live",
  },
  {
    slug: "pocmarano",
    title: "počmáráno",
    summary:
      "Bilingual portfolio website for an illustrator, with content managed in an embedded Sanity Studio.",
    description: [
      "Portfolio website of illustrator Tereza Cablíková (počmáráno): a gallery of illustrations, an about page, cooperation inquiries and contacts, in Czech and English.",
      "The artist manages artworks and page texts in a Sanity Studio embedded in the site at /admin. The site reads the content with GROQ queries and TypeScript types generated from the Sanity schema.",
      "Built with the Next.js App Router, React Server Components and Tailwind CSS. Pages under /cs and /en are prerendered and regenerated at most every 8 hours (ISR), so content edits show up without a redeploy. The contact form is a server action that emails submissions through Resend.",
      "Tested with Vitest and Playwright end-to-end tests, hosted on Vercel.",
    ],
    year: 2026,
    role: "Developer",
    frontend: "React (Next.js)",
    backend: "Next.js + Sanity CMS",
    tags: ["Next.js", "React", "Sanity", "Tailwind CSS", "Playwright"],
    links: [{ label: "Live site", url: "https://pocmarano.com" }],
    status: "live",
  },
  {
    slug: "agedate",
    title: "Agedate",
    summary:
      "A dating-range calculator (half your age plus seven) that turns your result into an image for your story.",
    description: [
      "Enter your age and Agedate shows your socially acceptable dating range by the half-your-age-plus-seven rule, then turns it into a 1080×1920 image to post on an Instagram or Facebook story.",
      "Frontend: Angular 22, zoneless and built on signals. The age field is validated with Signal Forms, and the result is a single computed signal. The story image is preloaded with httpResource as soon as a range is on screen, because browsers only open the share sheet straight from a click; where there is no share sheet, the image is downloaded instead.",
      "Backend: a Next.js 16 route handler draws the image with next/og (Satori) and the Inter font. Only 107 ages have a range, so generateStaticParams has the build draw them all and the CDN serves them as static files; an invalid age reaches the function and gets Problem Details (RFC 9457). The rule is one TypeScript module that both the Angular app and the API import, so the numbers on screen and in the image always agree.",
      "Tested with Vitest on both sides, with lint, tests and the build checked in GitHub Actions. One Next.js app on Vercel serves the Angular build and the API from the same origin. The repo has an AGENTS.md and a README per project, written so a coding agent can pick the work up. It began as a frontend-only Angular app on Firebase and was rebuilt as a full stack app.",
    ],
    year: 2026,
    role: "Full stack developer",
    frontend: "Angular",
    backend: "Next.js",
    tags: ["Angular", "Next.js", "TypeScript", "Signal Forms", "Vercel"],
    links: [
      { label: "Try it", url: "https://agedate.vercel.app" },
      { label: "Source code", url: "https://github.com/stepan-omelka/agedateinterval" },
    ],
    status: "live",
  },
];

/**
 * Minimum number of cards on the page; empty ones are filled with "Coming soon" placeholders.
 * 0 shows only the real projects.
 */
const SLOT_COUNT = 0;
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
