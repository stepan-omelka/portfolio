# API

A [NestJS 12](https://nestjs.com) app that serves the portfolio's content and its contact form as
a JSON API under `/api`. Its build also produces the static site: the Angular build of
[`web`](../web/README.md), a prerendered page per project and the content endpoints' responses as
files. Vercel serves those next to the API - see [_Architecture_](../ARCHITECTURE.md).

## ⚙️ How it's wired

- **Modules** ([`app.module.ts`](./src/app.module.ts)): `PortfolioModule` serves the content,
  `ContactModule` the contact form. Each has a controller for HTTP and a service for the work.

  | Endpoint                  | Returns                                      | On Vercel answered by                 |
  | :------------------------ | :------------------------------------------- | :------------------------------------ |
  | `GET /api/profile`        | `Profile`                                    | a file written by the build           |
  | `GET /api/projects`       | `Project[]`                                  | a file written by the build           |
  | `GET /api/projects/:slug` | `Project`, or `404`                          | a file; the function for the `404`    |
  | `POST /api/contact`       | `{ ok: true }`, or `{ error: ContactError }` | the function - emails Štěpán (Resend) |

- **Every error is `{ error: string }`** with a status that says what went wrong. Code throws an
  [`ApiError`](./src/api-error.ts); [`ApiErrorFilter`](./src/api-error.filter.ts) gives the same
  shape to the errors Nest and Express raise themselves.
- **Content is static.** The `GET` endpoints answer from [`portfolio.ts`](./src/lib/portfolio.ts),
  so a content change needs a deploy. On Vercel the page never waits for the function to show
  its content: the build writes each response into `public/api/` as a `.json` file
  ([`content-files.service.ts`](./src/prerender/content-files.service.ts)), and rewrites in
  `vercel.json` answer the three addresses with those files. The controller still answers them
  under `npm run dev`, `npm start` and in tests, and a test keeps the files identical to it.
- **The rewrite for `/api/projects/:slug` lists every slug**, so that an unknown one goes to the
  function for its `404`. A test fails when the list and `portfolio.ts` disagree.
- **Three entry points share the modules:**

  | File                                 | Started by                 | Does                                                  |
  | :----------------------------------- | :------------------------- | :---------------------------------------------------- |
  | [`main.ts`](./src/main.ts)           | `npm run dev`, `npm start` | listens on :3300; also serves `public/` if it exists  |
  | [`vercel.ts`](./src/vercel.ts)       | the Vercel Function        | hands Vercel the Express app under Nest, with no port |
  | [`prerender.ts`](./src/prerender.ts) | `npm run build:site`       | writes pages and content files to `public/` and exits |

- **On Vercel** ([`vercel.json`](./vercel.json)) the project is a static site plus one function,
  not a framework preset: Vercel's NestJS preset serves no static files. `public/` is the output
  directory, served by the CDN, and a file there always wins over a rewrite.
  [`api/index.js`](./api/index.js) is the function: Vercel makes one of every file in an `api/`
  folder, and a rewrite sends every `/api/*` request that has no file to it - the contact form,
  an unknown slug or endpoint. Any other path that isn't a file gets `index.html`, so the Angular
  router handles deep links after a refresh.
- **The site build:** `npm run build:site` builds `web`, copies the result into `public/`
  ([`copy-web.mjs`](./scripts/copy-web.mjs)), compiles this app into `dist/` and runs
  `dist/prerender.js`. `public/` and `dist/` are git-ignored and ignored by ESLint.
- **Link previews:** LinkedIn, Messenger and WhatsApp read a page's HTML without running
  JavaScript, so the Angular app can't give them a title or a picture. The prerender step writes
  the Angular `index.html` once per page - `public/index.html` for `/` and
  `public/projects/<slug>.html` for each project - with that page's title, description and Open
  Graph tags filled in ([`share-page.ts`](./src/lib/share-page.ts)). `cleanUrls` in `vercel.json`
  serves `projects/tapwave.html` at `/projects/tapwave`. The images are in
  [`web/public/og/`](../web/public/og/): `home.jpg` and one `<slug>.jpg` per project, JPEGs of at
  least 1200×630, which a test requires. The home card is 2400×1260, because LinkedIn's
  _Featured_ card on a Retina screen blurs anything smaller. Each image URL carries a hash of the
  file (`?v=…`): LinkedIn never re-copies an image URL it has seen, so a changed image needs a
  new URL.
- **The contact form** ([`contact.controller.ts`](./src/contact/contact.controller.ts)) reads
  only JSON bodies of up to 20,000 bytes, validates the message with zod ([`contact.ts`](./src/lib/contact.ts)), drops it
  silently when the honeypot is filled in, and emails it from Resend's shared
  `onboarding@resend.dev` to `profile.email`, with the visitor as _Reply-To_
  ([`contact.service.ts`](./src/contact/contact.service.ts)). Nothing is stored. The shared sender
  only delivers to the Resend account's own address, so `profile.email` must stay that address.

## 📝 Content

The profile and every project are in [`src/lib/portfolio.ts`](./src/lib/portfolio.ts):

- `profile` - name, role, intro, the About paragraphs, the Frontend/Backend skill columns, email,
  phone (`null` hides it) and links.
- `featuredProjects` - the real projects, in the order they appear. A project's `slug` is its URL
  (`/projects/<slug>`). A project whose repository is private links only to its live site. A new
  project also needs its link-preview image, `web/public/og/<slug>.jpg` (1200×630), and its slug
  in the `/api/projects/:slug(…)` rewrite in [`vercel.json`](./vercel.json).
- `SLOT_COUNT` - the minimum number of cards. At `0` the page shows only real projects; a higher
  value pads the grid with dashed _Coming soon_ placeholder cards.

A change to the shape of `Profile` or `Project` must be copied into
[`web/src/app/core/models.ts`](../web/src/app/core/models.ts).

## 💻 Development

```sh
npm run dev           # this app on http://localhost:3300 (or `npm run dev` at the root for both)
npm run build:site    # Angular + NestJS, as on Vercel; `npm start` serves it on :3300
npm run lint          # ESLint
```

- **`RESEND_API_KEY`** is the only environment variable. Without it the contact form answers
  `500` (`unexpected`) and the page offers the email address instead - the safe default for
  development. With a key in `api/.env.local` (git-ignored), every submission emails Štěpán.
- **The app is ESM**, as NestJS 12 is: a relative import ends in `.js`, and there is no
  `__dirname` - use `import.meta.dirname`.
- `npm run build` on its own compiles only this app; `public/` stays empty or stale, so the API
  works and the site does not.
- `npm start` serves the site without Vercel, so it has no redirects and no rewrites:
  `/projects/tapwave/` and `/index.html` answer directly there and redirect on Vercel, and the
  content endpoints are answered by the controller, not by the files in `public/api/`.
- Build settings for Vercel are in [`vercel.json`](./vercel.json); the dashboard settings are in
  [_Hosting and operations_](../docs/operations.md).

See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for the other commands.

## 🧪 Testing

```sh
npm test   # every src/**/*.test.ts once, in Node
```

- Endpoint tests start the Nest app without a port and send it HTTP requests with `supertest`.
- The `resend` package is mocked in
  [`contact.controller.test.ts`](./src/contact/contact.controller.test.ts); a test must never
  reach the real Resend API.

See the [testing strategy](../docs/testing-strategy.md) for what to test and how.
