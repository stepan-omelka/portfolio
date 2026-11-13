# 🤝 Contributing

## 🧰 Prerequisites

- [Node.js](https://nodejs.org) in Angular 22's range: `^22.22.3`, `^24.15.0` or `>=26` (see
  `engines` in [`package.json`](./package.json)). Vercel builds with Node 24.
- npm — each of the root, [`api`](./api/README.md) and [`web`](./web/README.md) has its own
  `package-lock.json`.

## ♻️ Setup

```sh
npm install   # the root, then api/ and web/ (a postinstall script)
```

No environment variables are needed to run the site. The contact form needs `RESEND_API_KEY` to
send email — see the [API README](./api/README.md#-development).

## 💻 Development

Run from the repo root:

```sh
# both dev servers: web on http://localhost:4300, api on http://localhost:3300
npm run dev

# only one of them
npm run dev:web
npm run dev:api

# API tests, then Angular tests (one run each)
npm test

# ESLint (api only)
npm run lint

# production build: Angular + NestJS, as on Vercel
npm run build

# serve that build on http://localhost:3300
npm start
```

Open <http://localhost:4300> while developing. The ports are 4300 and 3300 rather than the
defaults, so the portfolio can run next to other projects on 4200 and 3000.

### Verifying a change

```sh
npm test && npm run lint && npm run build
```

Nothing runs these for you — there is no CI — so run them before every push. For a visible
change, also check the page in a browser, in both themes and at a narrow width.

### Code style

Refer to the [_Coding standards_](./docs/coding-standards.md).

`web/` is formatted with Prettier ([`web/.prettierrc`](./web/.prettierrc): 100 columns, single
quotes). Format the files you change — `cd web && npx prettier --write <files>` — not whole
folders, since not every file matches yet. `api/` has no formatter; follow the surrounding code
(double quotes, lines up to 100 columns).

### Testing

Refer to the [_Testing strategy_](./docs/testing-strategy.md).

### Comments and documentation

When a comment or a doc earns its place, and where it goes, is defined in the
[_Comments and docs policy_](./docs/comments-and-docs-policy.md).

## 🔀 Git

### Commit messages

Commit messages follow the [conventional commits](https://www.conventionalcommits.org) format, as
in Štěpán's other repositories. No hook enforces it here, and the oldest commits predate it, so
don't copy their style.

Types follow _semantic versioning_ rules — `feat`, `fix` and `perf` are reserved for changes
visitors notice. Write in the imperative and summarize the _what_ and _why_; the _how_ is in the
diff.

- `feat: add Agedate to the featured projects`
- `fix: keep focus on the form after a failed send`
- `perf: lazy load the project detail page`
- `test: cover the contact form honeypot`
- `refactor: share the status labels between cards and detail pages`
- `build: upgrade Angular to 22.1`
- `docs: describe the contact form setup`
- `style: format the header with Prettier`
- `chore: remove the unused placeholder icons`

### Branches and deploys

- `main` is production — every push to it deploys
  [stepan-omelka-portfolio.vercel.app](https://stepan-omelka-portfolio.vercel.app). Other branches
  get Vercel preview deployments.
- Keep `main`'s history linear: rebase rather than merge, or squash a branch into one commit.
- The repository is **public**. Check the diff for secrets before every push; `.env*` files are
  git-ignored.
