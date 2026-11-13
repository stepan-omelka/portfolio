import path from "node:path";

/** `scripts/copy-web.mjs` copies the Angular build here; `dist/` and `src/` are both one level down. */
export const PUBLIC_DIR = path.join(import.meta.dirname, "..", "public");

/** The Angular build's own `index.html`; the copy in `public/` gets the home page's preview tags. */
export const ANGULAR_SHELL = path.join(
  import.meta.dirname,
  "../../web/dist/web/browser/index.html",
);
