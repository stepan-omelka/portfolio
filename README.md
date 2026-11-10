# Portfolio

A minimal black-and-white portfolio with a dark mode.

| Folder | What                                                                      | Dev URL               |
| ------ | ------------------------------------------------------------------------- | --------------------- |
| `web/` | **Angular 22** frontend: home page, project detail pages, theme toggle   | http://localhost:4300 |
| `api/` | **Next.js 16** content API: serves the profile and projects as JSON      | http://localhost:3300 |

In development the Angular dev server proxies `/api/*` to the Next.js server (`web/proxy.conf.json`),
so the browser only ever talks to `localhost:4300`.

## Getting started

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
| `npm run build`   | Production build of both                      |
| `npm test`        | Angular unit tests (Vitest)                   |
| `npm run lint`    | ESLint for the API                            |

## Adding a project

All content lives in [`api/src/lib/portfolio.ts`](api/src/lib/portfolio.ts).

The site ships with six placeholder slots (`status: "placeholder"`), rendered as dashed
"Coming soon" cards. To fill a slot, replace one of the generated placeholders with a real
entry:

```ts
{
  slug: "my-project",            // used in the URL: /projects/my-project
  title: "My Project",
  summary: "One sentence for the card.",
  description: ["Paragraph one.", "Paragraph two."],
  year: 2026,
  role: "Frontend developer",
  tags: ["Angular", "TypeScript"],
  links: [{ label: "Live site", url: "https://example.com" }],
  status: "live",                // "live" | "in-progress" | "placeholder"
}
```

Profile text (name, intro, about, email, social links) is in the same file. The frontend
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

The frontend calls the API at `/api` (the `API_BASE_URL` token in
`web/src/app/core/api-base-url.ts`). Either serve both behind one domain with `/api` routed to
Next.js, or provide a full URL for `API_BASE_URL` in `web/src/app/app.config.ts` and enable
CORS on the API.
