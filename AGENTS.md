# ✨ Instructions for AI agents

- Refer to [README.md](./README.md) for what the project is and an index of every doc.
- Refer to [ARCHITECTURE.md](./ARCHITECTURE.md) for how the two projects fit together, in development and in production.
- Refer to [CONTRIBUTING.md](./CONTRIBUTING.md) for setup, commands and Git conventions.
- Refer to [docs/coding-standards.md](./docs/coding-standards.md) and [docs/testing-strategy.md](./docs/testing-strategy.md) before writing code or tests, and to [docs/comments-and-docs-policy.md](./docs/comments-and-docs-policy.md) before writing comments or docs.
- Refer to [docs/operations.md](./docs/operations.md) before touching anything outside the repo — Vercel, Resend or GitHub settings.
- Read the `README.md` of [`web`](./web/README.md) or [`api`](./api/README.md) before changing that project.

## What belongs in this file

**Gotchas and hard-to-explore findings** — the things an agent would otherwise only learn by being burnt.

- **Never** restate what another doc already says; link to it instead.
- **Never** restate what a single file's own comments state plainly — an agent reading that file already has it, and a second copy here is one that will go stale.
- A non-obvious conclusion that only emerges from several files, or from a dashboard outside the repo, **does** belong here.

## Gotchas

- **The repository is public** on GitHub. Never commit a secret — keys belong in a git-ignored `.env*` file or in Vercel.
- **Every push to `main` goes live** on [stepan-omelka-portfolio.vercel.app](https://stepan-omelka-portfolio.vercel.app) within a few minutes. There is no staging and no CI, so nothing checks a change before visitors see it. Push only when Štěpán says so, and only after the checks in [Changing the code](#changing-the-code) pass.
- **Never send a real message through the contact form** — not on the live site, not on a preview deployment. It emails Štěpán. Locally the form cannot send unless `api/.env.local` holds a Resend key, and the tests mock Resend.
- **Don't change the infrastructure** — Vercel or Resend settings, environment variables, domains, the GitHub repository — without Štěpán's go-ahead. What lives where is in [docs/operations.md](./docs/operations.md).
- **The API contract exists twice.** [`api/src/lib/portfolio.ts`](./api/src/lib/portfolio.ts) and [`api/src/lib/contact.ts`](./api/src/lib/contact.ts) define it; [`web/src/app/core/models.ts`](./web/src/app/core/models.ts) copies it by hand. Nothing checks that they agree, so a mismatch only shows up at runtime — change both in the same commit.
- **`profile.email` must stay the Resend account's own address** (`stepomelka@gmail.com`). The contact form sends from Resend's shared `onboarding@resend.dev`, which only delivers to that address; a different `profile.email` makes every message fail with `send-failed`.
- **`api/public/` is generated** — `npm run build` copies the Angular build into it. It is git-ignored; edit [`web/`](./web/README.md) instead.
- **`api/api/index.js` must stay where it is.** Vercel's Root Directory is `api` (a dashboard setting), and Vercel only turns the files in that root's own `api/` folder into functions — hence the doubled path. Moving or renaming it takes `/api/*` offline, while the build still passes.
- **Don't run Prettier over a whole folder.** Only `web/` has a Prettier config, and not every file in it matches yet, so a folder-wide run rewrites files you never touched. Format only the files you change.

## Changing the code

Verify a change the way a deploy would build it, from the repo root:

```sh
npm test && npm run lint && npm run build
```

For a visible change, also run `npm run dev` and check the page at <http://localhost:4300> — in both themes and at a narrow width.

Comments describe the code as it stands, never how it used to look: no "was X, now Y", no "moved from Z". **The git history is the record** ([policy](./docs/comments-and-docs-policy.md)).

**Never commit** unless explicitly asked to. When you are, follow the Git conventions in [CONTRIBUTING.md](./CONTRIBUTING.md#-git).
