# 🏛️ Architecture

Two projects share this repository: an Angular single-page app, [`web`](./web/README.md), and a
Next.js app, [`api`](./api/README.md). In development they run as two servers; in production they
are **one Next.js app on Vercel**, so the frontend and the API share an origin and there is no CORS.

This file is an index. Anything specific to a project lives in that project's `README.md`.

## 🗺️ How it fits together

### In production

```mermaid
graph LR
  B["Browser<br/>(Angular SPA)"]
  subgraph V["Vercel — one Next.js app (api/)"]
    P["public/<br/>Angular build"]
    R["Route handlers<br/>/api/*"]
  end
  RS[["Resend"]]
  M[("Štěpán's inbox")]

  B -->|"/, /projects/…"| P
  B -->|"GET/POST /api/…"| R
  R -->|"POST /api/contact"| RS --> M
```

- `npm run build` builds the Angular app, copies it into `api/public/`
  ([`copy-web.mjs`](./api/scripts/copy-web.mjs)) and runs `next build`. Vercel runs the same
  build, with the commands in [`api/vercel.json`](./api/vercel.json).
- Next.js serves `/api/*` from route handlers and every file in `public/` as is. Any other path
  falls back to `public/index.html` (a rewrite in [`next.config.ts`](./api/next.config.ts)), so
  the Angular router handles deep links such as `/projects/tapwave` after a refresh.
- `/` and `/projects/:slug` get that same `index.html` from prerendered route handlers, with the
  page's title, description and link-preview image filled in — LinkedIn and chat apps don't run
  the Angular app, so they only see what the HTML says ([details](./api/README.md#️-how-its-wired)).
- **Content is static.** The profile and projects come from
  [`portfolio.ts`](./api/src/lib/portfolio.ts) and are prerendered at build time; changing them
  takes a commit and a deploy. Nothing is stored at runtime.
- **The contact form is the only dynamic part.** It emails each message to Štěpán through
  [Resend](https://resend.com) and keeps no copy.

### In development

```mermaid
graph LR
  B["Browser"] -->|"localhost:4300"| NG["ng serve<br/>(web)"]
  NG -->|"proxies /api/*"| NX["next dev :3300<br/>(api)"]
```

[`web/proxy.conf.json`](./web/proxy.conf.json) forwards `/api` to the Next.js dev server, so the
browser talks to one origin, as in production, and the frontend's `API_BASE_URL` stays `/api` in
both.

## 📦 Projects

| Project                  | Runs on            | Built with                                         | Tests                       |
| :----------------------- | :----------------- | :------------------------------------------------- | :-------------------------- |
| [`web`](./web/README.md) | the browser        | Angular 22 (zoneless, signals, Signal Forms), SCSS | Vitest in jsdom (`ng test`) |
| [`api`](./api/README.md) | Node.js, on Vercel | Next.js 16 route handlers, zod, Resend             | Vitest in Node              |

The API contract — `Profile`, `Project`, the contact request and its error codes — is defined in
`api/src/lib/` and copied by hand into
[`web/src/app/core/models.ts`](./web/src/app/core/models.ts).

## ⚙️ Tech stack

### 🖥️ Frontend

- [Angular](https://angular.dev) — standalone components, signals, `httpResource`,
  [Signal Forms](https://angular.dev/guide/forms/signals/overview)
- [RxJS](https://rxjs.dev) — only where an Angular API is observable-based
- [Sass](https://sass-lang.com) — CSS custom properties for the light and dark theme

### 🗄️ Backend

- [Next.js](https://nextjs.org) — route handlers only
- [zod](https://zod.dev) — validates the contact form input
- [Resend](https://resend.com) — sends the contact form emails

### 🛠️ Development tools

- [TypeScript](https://www.typescriptlang.org), [npm](https://www.npmjs.com)
- [ESLint](https://eslint.org) (`api`), [Prettier](https://prettier.io) (`web`)
- [Vitest](https://vitest.dev)
- [concurrently](https://github.com/open-cli-tools/concurrently) — runs both dev servers

### ☁️ Services

- [Vercel](https://vercel.com) (Hobby plan) — hosting and deploys
- [Resend](https://resend.com) (Free plan) — email
- [GitHub](https://github.com/stepan-omelka/portfolio) — the public repository

Which account holds each one, and the settings that live in their dashboards, are in
[_Hosting and operations_](./docs/operations.md).
