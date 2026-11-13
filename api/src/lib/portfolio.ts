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
  /** Backend technology, e.g. "Spring Boot" or "NestJS". `null` if frontend-only. */
  backend: string | null;
  tags: string[];
  links: Link[];
  status: ProjectStatus;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

/**
 * A product I worked on at FlowUp. Client products and their code belong to the clients, so never
 * name the product or the client here — not in `title`, nor in the text.
 */
export interface ClientProject {
  /** What the product is, e.g. "Weather forecast editor". */
  title: string;
  /** When I worked on it, e.g. "2025" or "2025–2026". */
  period: string;
  /** My part of the stack, e.g. "Frontend" or "Full stack". */
  role: string;
  /** What the product is, in one or two sentences. */
  summary: string;
  /** What I built or did on it. */
  contribution: string;
  tags: string[];
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
  /** Shown in the Professional work section in this order; an empty list hides the section. */
  clientWork: ClientProject[];
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
    "I build web applications end to end — Angular on the frontend, Spring Boot or Node.js on the backend.",
  about: [
    "I am a web application developer. Since 2023 I have been working part-time (contractor agreement) at FlowUp, a software house in Brno, building client applications in TypeScript - Angular frontend before agentic development, full stack with agents. I am used to working in sprints - estimation, implementation, standups, PR reviews, retrospectives.",
    "Agentic development is my everyday workflow. My goal is to be someone you can rely on, who solves problems and can design, defend and stand behind his own solutions.",
    "I hold a Bachelor’s degree from FI MUNI.",
  ],
  skills: [
    {
      label: "Frontend",
      items: ["Angular", "TypeScript", "SvelteKit", "Signals & RxJS", "HTML & SCSS"],
    },
    {
      label: "Backend",
      items: ["Spring Boot", "Java", "Node.js & NestJS", "PostgreSQL", "Docker"],
    },
    {
      label: "Workflow",
      items: [
        "Claude Code",
        "MCP, skills & hooks",
        "Estimation & design",
        "PR review",
        "Vitest & Playwright",
      ],
    },
  ],
  clientWork: [
    {
      title: "Weather forecast editor",
      period: "2026",
      role: "Frontend, some backend",
      summary:
        "A web app where meteorologists review and fill in the forecasts a weather company publishes.",
      contribution:
        "Set up the SvelteKit frontend from scratch — GraphQL codegen with Apollo Client, Tailwind CSS with DaisyUI, Storybook, translations and CI — and built most of the app on it: the forecast overview, an editable metrics grid, a detail page with a map preview, CSV export and end-to-end tests. On the backend, smaller changes in the GraphQL API, the data ingest service and the login server.",
      tags: ["SvelteKit", "Svelte 5", "TypeScript", "GraphQL", "Tailwind CSS", "Node.js"],
    },
    {
      title: "Online learning platform",
      period: "2025–2026",
      role: "Full stack",
      summary:
        "An online learning platform with courses, course packs, memberships and live webinars, paid for through Stripe.",
      contribution:
        "Built features end to end, from the GraphQL API and the PostgreSQL queries to the Angular screens: the course marketplace with filters and category carousels, the webinar calendar and registration, membership pages, the order and payment steps, personalized recommendations, transactional emails and the user administration where admins invite users and grant memberships and course access.",
      tags: [
        "Angular",
        "TypeScript",
        "Node.js",
        "GraphQL",
        "PostgreSQL",
        "Stripe",
        "Firebase Auth",
      ],
    },
    {
      title: "Environmental impact assessment for buildings",
      period: "2025",
      role: "Frontend",
      summary:
        "A platform for assessing the environmental impact of construction projects over their whole life cycle.",
      contribution:
        "Built Angular screens across the app: the life-cycle global warming potential graph, the building summary on the final analysis page, the project archive, an XML import form, improvements to how users move through a project's parts, and the home page's new design.",
      tags: ["Angular", "TypeScript", "Nx"],
    },
    {
      title: "Construction price catalogue",
      period: "2024",
      role: "Frontend",
      summary:
        "An online catalogue of construction work and material prices that cost estimators search and browse.",
      contribution:
        "Added a price archive dialog, highlighting of the searched text in the results, filters kept in the URL so a search can be shared or bookmarked, and unit tests.",
      tags: ["Angular", "TypeScript", "Nx"],
    },
    {
      title: "Factory location tracking portal",
      period: "2023–2024",
      role: "Frontend",
      summary:
        "A portal that shows where vehicles move around a factory, both live and back in time.",
      contribution:
        "Set up the Angular app's routing and sign-in flow, built the filters, and built the factory map's live view and a date slider for replaying past movement, with a trail behind each vehicle.",
      tags: ["Angular", "TypeScript", "RxJS", "Ant Design"],
    },
    {
      title: "Project template",
      period: "2026",
      role: "Backend, docs",
      summary:
        "FlowUp's own starting point for new full-stack web apps: an Nx monorepo with Angular, GraphQL and PostgreSQL.",
      contribution:
        "Hardened the shared logger against hostile input and closed gaps in how it redacts sensitive data, and wrote the policy for when a code comment or a doc earns its place.",
      tags: ["Node.js", "TypeScript", "Nx"],
    },
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
      "Backend: a NestJS 12 API draws the image with Satori and resvg in the Inter font. Only 107 ages have a range, so the build draws them all and the CDN serves them as static files; an invalid age reaches the NestJS function and gets Problem Details (RFC 9457). The rule is one TypeScript module that both the Angular app and the API import, so the numbers on screen and in the image always agree.",
      "Tested with Vitest on both sides, with lint, tests and the build checked in GitHub Actions. On Vercel the Angular build and the prerendered images are static files and the NestJS app runs as one function, all on the same origin. The repo has an AGENTS.md and a README per project, written so a coding agent can pick the work up. It began as a frontend-only Angular app on Firebase and was rebuilt as a full stack app.",
    ],
    year: 2026,
    role: "Full stack developer",
    frontend: "Angular",
    backend: "NestJS",
    tags: ["Angular", "NestJS", "TypeScript", "Signal Forms", "Vercel"],
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
  { backend: "NestJS", tags: ["Angular", "NestJS", "TypeScript"] },
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
