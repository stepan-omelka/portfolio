# API

A [Next.js 16](https://nextjs.org) app with two jobs: it serves the portfolio's content and its
contact form as a JSON API under `/api`, and in production it also serves the Angular build of
[`web`](../web/README.md), so the whole site is one app on Vercel — see
[_Architecture_](../ARCHITECTURE.md).

## ⚙️ How it's wired

- **Route handlers only**, under [`src/app/api/`](./src/app/api/). The root `layout.tsx` exists
  because Next.js requires one; the app renders no pages of its own.

  | Endpoint                  | Returns                                      |                                        |
  | :------------------------ | :------------------------------------------- | :------------------------------------- |
  | `GET /api/profile`        | `Profile`                                    | prerendered                            |
  | `GET /api/projects`       | `Project[]`                                  | prerendered                            |
  | `GET /api/projects/:slug` | `Project`, or `404`                          | prerendered for every slug             |
  | `POST /api/contact`       | `{ ok: true }`, or `{ error: ContactError }` | dynamic — emails Štěpán through Resend |

- **The `GET` endpoints are static.** They are built from
  [`portfolio.ts`](./src/lib/portfolio.ts) at build time, so a content change needs a deploy.
- **Serving the Angular build:** `npm run build:site` builds `web`, copies the result into
  `public/` ([`copy-web.mjs`](./scripts/copy-web.mjs)) and runs `next build`. `public/` is
  git-ignored and ignored by ESLint. A fallback rewrite in [`next.config.ts`](./next.config.ts)
  answers every path that is neither `/api…` nor a file with `index.html`.
- **The contact form** ([`route.ts`](./src/app/api/contact/route.ts)) validates the message with
  zod ([`contact.ts`](./src/lib/contact.ts)), drops it silently when the honeypot is filled in,
  and emails it from Resend's shared `onboarding@resend.dev` to `profile.email`, with the visitor
  as _Reply-To_. Nothing is stored. The shared sender only delivers to the Resend account's own
  address, so `profile.email` must stay that address.

## 📝 Content

The profile and every project are in [`src/lib/portfolio.ts`](./src/lib/portfolio.ts):

- `profile` — name, role, intro, the About paragraphs, the Frontend/Backend skill columns, email,
  phone (`null` hides it) and links.
- `featuredProjects` — the real projects, in the order they appear. A project's `slug` is its URL
  (`/projects/<slug>`). A project whose repository is private links only to its live site.
- `SLOT_COUNT` — the minimum number of cards. At `0` the page shows only real projects; a higher
  value pads the grid with dashed _Coming soon_ placeholder cards.

A change to the shape of `Profile` or `Project` must be copied into
[`web/src/app/core/models.ts`](../web/src/app/core/models.ts).

## 💻 Development

```sh
npm run dev           # this app on http://localhost:3300 (or `npm run dev` at the root for both)
npm run build:site    # Angular + Next.js, as on Vercel; `npm start` serves it on :3300
npm run lint          # ESLint
```

- **`RESEND_API_KEY`** is the only environment variable. Without it the contact form answers
  `500` (`unexpected`) and the page offers the email address instead — the safe default for
  development. With a key in `api/.env.local` (git-ignored), every submission emails Štěpán.
- `next build` on its own leaves `public/` empty or stale: the API works, the site does not.
- Build settings for Vercel are in [`vercel.json`](./vercel.json); the dashboard settings are in
  [_Hosting and operations_](../docs/operations.md).

See [`CONTRIBUTING.md`](../CONTRIBUTING.md) for the other commands.

## 🧪 Testing

```sh
npm test   # every src/**/*.test.ts once, in Node
```

- Route tests call the exported handler with a `Request` and check the `Response`.
- The `resend` package is mocked in [`route.test.ts`](./src/app/api/contact/route.test.ts); a test
  must never reach the real Resend API.

See the [testing strategy](../docs/testing-strategy.md) for what to test and how.
