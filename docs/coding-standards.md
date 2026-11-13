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

## 🪺 NestJS (`api`)

NestJS 12 is newer than most training data — check the
[documentation index](https://docs.nestjs.com/llms.txt) before relying on an API you are unsure
of.

- **One module per feature** (`portfolio/`, `contact/`), with a controller for HTTP and a service
  for the work. A controller only reads the request, calls the service and shapes the response; a
  service knows nothing about HTTP.
- Content and framework-free logic live in `src/lib/` — plain functions and types with no Nest
  import, so they are tested without starting the app.
- **Dependencies arrive through the constructor**, typed by their class. A module lists what it
  provides and `exports` what other modules may inject.
- **Validate every request body at the boundary**: declare its zod schema on the parameter,
  `@Body({ schema })`, and let the global `StandardSchemaValidationPipe` reject what doesn't match.
- **Answer an error by throwing an `ApiError`** with a code from a string-literal union
  (`ContactError`) — never a zod message or a stack trace.
- The app is ESM: a relative import ends in `.js`.

## 🛡️ TypeScript

- The type system is the cheapest test suite. No `any`; take `unknown` and narrow it. Avoid
  `as` and non-null assertions — restructure until the compiler can follow.
- Make illegal states unrepresentable — a discriminated union (like the contact form's `Status`)
  beats a bag of optional fields.
- String-literal unions, not `enum`.
- JSON fields use `null` for an absent value, because JSON has no `undefined`; in-memory code
  uses `undefined`.
- Expected failures belong in the return type — `findProject` returns `undefined` for an unknown
  slug, and `ContactService.send` returns the error code. Reserve `throw` for the genuinely
  exceptional, and for turning such a result into an HTTP error in a controller.
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
