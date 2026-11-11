# 📑 Coding standards

Principles to keep in mind when writing code here. Mechanical rules are left to the tools — run
`npm run build` (TypeScript, both projects), `npm run lint` (ESLint, `api`) and Prettier on the
`web` files you change.

## 🅰️ Angular (`web`)

Angular 22 is newer than most training data — check [angular.dev](https://angular.dev) before
relying on an API you are unsure of.

- **Standalone components**, no NgModules. Files are named after the class without a
  `.component` suffix (`home.ts`, `home.html`, `home.scss`); a small component keeps its template
  and styles inline.
- **Signals are the state.** `signal`, `computed`, `input()` / `input.required()`, `viewChild`.
  Reach for RxJS only where an Angular API is observable-based (router events) and convert a
  one-off request with `firstValueFrom`.
- **Zoneless.** There is no `zone.js`; the UI updates when a signal it reads changes, so state
  that should re-render must live in a signal.
- `inject()` rather than constructor parameters. An app-wide service is a `@Service()` class.
- **Reads go through `httpResource`**, and every URL starts from the `API_BASE_URL` token —
  never a hardcoded `/api`.
- **Forms use Signal Forms** (`@angular/forms/signals`), with validation messages declared next to
  the validators.
- Built-in control flow (`@if`, `@for` with `track`), not structural directives.
- Folders: `core/` (models, services, tokens), `layout/` (header, footer, theme toggle),
  `pages/` (one folder per route, lazy-loaded), `shared/` (components used by several pages).

## ▲ Next.js (`api`)

Next.js 16 has breaking changes against most training data — read the guide in
`api/node_modules/next/dist/docs/` before using an API (see [`api/AGENTS.md`](../api/AGENTS.md)).

- **Route handlers only**, under `src/app/api/`. The root `layout.tsx` exists because Next.js
  requires one; the app renders no pages of its own.
- Content and logic live in `src/lib/`; a handler only parses the request, calls `lib` and
  shapes the response. Import through the `@/` alias.
- **Validate every request body at the boundary** with zod, and answer with an error code from a
  string-literal union (`ContactError`) — never a zod message or a stack trace.

## 🛡️ TypeScript

- The type system is the cheapest test suite. No `any`; take `unknown` and narrow it. Avoid
  `as` and non-null assertions — restructure until the compiler can follow.
- Make illegal states unrepresentable — a discriminated union (like the contact form's `Status`)
  beats a bag of optional fields.
- String-literal unions, not `enum`.
- JSON fields use `null` for an absent value, because JSON has no `undefined`; in-memory code
  uses `undefined`.
- Expected failures belong in the return type — `parseContactMessage` returns `undefined` for
  invalid input. Reserve `throw` for the genuinely exceptional.
- Derive, don't mutate: `const`, spread, `map`/`filter`/`find` over loops and `push`.
- A good name removes the need for a comment. Booleans read as predicates (`isLoading`,
  `hasError`). American English everywhere — watch the Czech false friends: _actual_ means
  "real", not "current"; _eventually_ means "in the end", not "possibly".

## ♿ Accessibility

- Semantic HTML first. Every section has a heading and is labelled by it (`aria-labelledby`).
- Keep the focus handling in [`app.ts`](../web/src/app/app.ts): after in-app navigation, focus
  moves to `<main>` so keyboard and screen-reader users start at the new content.
- Form fields have a visible label; an invalid one sets `aria-invalid` and points
  `aria-describedby` at its error. Status messages use `role="status"`, errors `role="alert"`.
- Colours come only from the CSS custom properties in
  [`styles.scss`](../web/src/styles.scss), so both themes keep their contrast.

## 💬 Comments

When a comment or a doc earns its place is defined in the
[_Comments and docs policy_](./comments-and-docs-policy.md).
