# Portfolio

A minimal black-and-white portfolio with a dark mode, for a full stack developer working with
Angular on the frontend and Spring Boot or Next.js on the backend.

| Folder | What                                                                      | Dev URL               |
| ------ | ------------------------------------------------------------------------- | --------------------- |
| `web/` | **Angular 22** frontend: home page, project detail pages, theme toggle   | http://localhost:4300 |
| `api/` | **Next.js 16** content API: serves the profile and projects as JSON      | http://localhost:3300 |

In development the Angular dev server proxies `/api/*` to the Next.js server (`web/proxy.conf.json`),
so the browser only ever talks to `localhost:4300`. In production both run as one Next.js app
(see [Deploying](#deploying)).

## Getting started

Requires Node.js `^22.22.3`, `^24.15.0` or `>=26` (Angular 22's supported range).

```bash
npm install   # installs root, api/ and web/ dependencies
npm run dev   # starts both servers
```

Open http://localhost:4300.

## Scripts (run from the repo root)

| Script            | Does                                          |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | API + web dev servers together                |
| `npm run dev:api` | Only the Next.js API (port 3300)              |
| `npm run dev:web` | Only the Angular app (port 4300)              |
| `npm run build`   | Production build: Angular + Next.js as one app |
| `npm start`       | Serve that build on http://localhost:3300     |
| `npm test`        | Angular unit tests (Vitest)                   |
| `npm run lint`    | ESLint for the API                            |

## Adding a project

All content lives in [`api/src/lib/portfolio.ts`](api/src/lib/portfolio.ts).

The site ships with six placeholder slots (`status: "placeholder"`), rendered as dashed
"Coming soon" cards. Add your projects to the `featuredProjects` array in that file: each one
takes over a placeholder slot, and once all six are filled no more placeholders are shown
(change `SLOT_COUNT` to show more or fewer slots).

```ts
const featuredProjects: Project[] = [
  {
    slug: "my-project",            // used in the URL: /projects/my-project
    title: "My Project",
    summary: "One sentence for the card.",
    description: ["Paragraph one.", "Paragraph two."],
    year: 2026,
    role: "Full stack developer",
    frontend: "Angular",           // or null if there is no UI
    backend: "Spring Boot",        // or "Next.js", or null if frontend-only
    tags: ["Angular", "Spring Boot", "PostgreSQL"],
    links: [{ label: "Live site", url: "https://example.com" }],
    status: "live",                // "live" | "in-progress" | "placeholder"
  },
];
```

Profile text (name, role, intro, about, the Frontend/Backend skill columns, email, social links)
is in the same file. The frontend
mirrors these types in [`web/src/app/core/models.ts`](web/src/app/core/models.ts), so keep the
two in sync if you change the shape.

## API

| Endpoint                   | Returns                     |
| -------------------------- | --------------------------- |
| `GET /api/profile`         | `Profile`                   |
| `GET /api/projects`        | `Project[]`                 |
| `GET /api/projects/:slug`  | `Project`, or 404           |

## Theme

Colors are CSS custom properties in [`web/src/styles.scss`](web/src/styles.scss) (`--bg`, `--fg`,
`--muted`, `--border`, ...), with a light and a dark set. The theme follows the OS until the
visitor uses the toggle; that choice is saved in `localStorage`. A small inline script in
`web/src/index.html` applies the theme before Angular boots, so there is no flash.

## Deploying

The site runs as **one Next.js app on [Vercel](https://vercel.com)** (Hobby plan):

- `npm run build` builds the Angular app, copies it into `api/public/`
  ([`api/scripts/copy-web.mjs`](api/scripts/copy-web.mjs)) and then builds Next.js.
- Next.js serves the API under `/api` and the Angular files from `public/`. Every other path
  falls back to the Angular `index.html` (a rewrite in [`api/next.config.ts`](api/next.config.ts)),
  so deep links such as `/projects/cookie-clicker` work after a refresh.
- Frontend and API share one origin, so there is no CORS and `API_BASE_URL` stays `/api`.

Build settings live in [`api/vercel.json`](api/vercel.json). To set it up:

1. Vercel → *Add New → Project* → import this repository.
2. Set **Root Directory** to `api` and deploy. Every push to `main` deploys again.

The Hobby plan is free, needs no card and is for personal, non-commercial use. When a usage
limit is exceeded, Vercel pauses that feature until 30 days have passed instead of billing
([Vercel docs](https://vercel.com/docs/plans/hobby)).
