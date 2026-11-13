# Web

Everything the visitor sees - an [Angular 22](https://angular.dev) single-page app, zoneless and
built on signals. It renders the home page (hero, professional work, personal projects, about,
contact) and a detail page per project, and reads all of its content from the
[`api`](../api/README.md) over HTTP.

## ⚙️ How it's wired

- **Content comes from the API, never from this project.**
  [`PortfolioContent`](./src/app/core/portfolio-content.ts) loads the profile and the projects once
  and shares them between the header, the footer and the home page; the detail page fetches its
  own project by slug. While the content loads or fails, the home page shows a loading state or a
  _Try again_ button.
- **Every API URL starts from the [`API_BASE_URL`](./src/app/core/api-base-url.ts) token**,
  `/api`. It is the same origin in development (proxied) and in production (one app) - see
  [_Architecture_](../ARCHITECTURE.md).
- **[`models.ts`](./src/app/core/models.ts) is a hand-made copy of the API's types.** Change it
  together with `api/src/lib/`; nothing checks that they agree.
- **Routes** ([`app.routes.ts`](./src/app/app.routes.ts)): `/`, `/projects/:slug` and a
  not-found page, all lazy-loaded. The `:slug` param arrives as a component input. The header's
  section links (`/#work`, `/#about`, `/#contact`) rely on the router's anchor scrolling, offset by
  the sticky header's height.
- **The contact form** posts JSON to `POST /api/contact` and maps the API's error codes to
  messages. Its length limits repeat the API's validation in `api/src/lib/contact.ts`, and its
  hidden `website` field is a honeypot that people must never see or fill in.

## 🎨 Styling

- **Arctic Frost** - the theme of that name from the
  [Theme Factory skill](../.claude/skills/theme-factory/themes/arctic-frost.md): ice blue, steel
  blue, silver and crisp white, set in DejaVu Sans (self-hosted through `@fontsource/dejavu-sans`,
  registered in `angular.json`). Colours, fonts, spacing and radii are CSS custom properties in
  [`styles.scss`](./src/styles.scss) (`--bg`, `--fg`, `--muted`, `--accent`, `--accent-text`,
  `--ice`, `--danger`, …), with a light and a dark set. Components use only these, so both themes
  stay correct. Use `--accent-text`, not `--accent`, for text: `--accent` is a fill colour and
  lacks contrast as text in the dark theme.
- **The theme follows the OS** until the visitor uses the toggle; the choice is saved in
  `localStorage`. [`ThemeService`](./src/app/core/theme.ts) applies it, and an inline script in
  [`index.html`](./src/index.html) applies the same logic before Angular boots, so the page never
  flashes the wrong theme - change the two together.
- Component styles live in the component's `.scss` file, or inline for a small component.

## 💻 Development

```sh
npm run dev                            # from the root: this app on :4300, the API on :3300
npm --prefix web run build             # production build in web/dist/web/browser/
cd web && npx prettier --write <files> # format the files you changed
```

`npm run dev:web` alone starts only this app; every `/api` request then fails, because
[`proxy.conf.json`](./proxy.conf.json) forwards them to the API dev server on port 3300. See
[`CONTRIBUTING.md`](../CONTRIBUTING.md) for the other commands.

## 🧪 Testing

```sh
npm --prefix web test -- --watch=false   # every *.spec.ts once, in jsdom
```

- Answer HTTP requests through `HttpTestingController` (`provideHttpClient()` plus
  `provideHttpClientTesting()`), and call `http.verify()` after each test so that an unexpected
  request fails it.
- Set a component's inputs with `fixture.componentRef.setInput(…)`.

See the [testing strategy](../docs/testing-strategy.md) for what to test and how.
