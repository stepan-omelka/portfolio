import { cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Test } from "@nestjs/testing";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { projects } from "../lib/portfolio.js";
import { SharePagesModule } from "./share-pages.module.js";
import { SharePagesService } from "./share-pages.service.js";

const shell = `<html><head>
<title>Štěpán Omelka · Full Stack Developer</title>
<meta name="description" content="Full stack developer portfolio.">
</head><body><app-root></app-root></body></html>`;

describe("SharePagesService", () => {
  let sharePages: SharePagesService;
  let publicDir: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [SharePagesModule] }).compile();
    sharePages = moduleRef.get(SharePagesService);

    publicDir = mkdtempSync(path.join(tmpdir(), "portfolio-public-"));
    // The share images come with the Angular build, which the pages are prerendered into.
    cpSync(path.join(import.meta.dirname, "../../../web/public/og"), path.join(publicDir, "og"), {
      recursive: true,
    });
  });

  afterEach(() => {
    rmSync(publicDir, { recursive: true, force: true });
  });

  it("prerenders the home page and a page per project", () => {
    const files = sharePages.prerender(shell, publicDir);

    expect(files.map((file) => path.relative(publicDir, file))).toEqual([
      "index.html",
      ...projects.map(({ slug }) => path.join("projects", `${slug}.html`)),
    ]);
  });

  it("fills a project's own title, address and image into its page", () => {
    sharePages.prerender(shell, publicDir);

    const html = readFileSync(path.join(publicDir, "projects/tapwave.html"), "utf8");
    expect(html).toContain("<title>Tapwave · Štěpán Omelka</title>");
    expect(html).toContain(
      '<meta property="og:url" content="https://stepan-omelka-portfolio.vercel.app/projects/tapwave">',
    );
    expect(html).toMatch(
      /<meta property="og:image" content="https:\/\/stepan-omelka-portfolio\.vercel\.app\/og\/tapwave\.jpg\?v=[0-9a-f]{10}">/,
    );
    expect(html).toContain("<app-root></app-root>");
  });

  it("gives the same result when it runs again over its own output", () => {
    sharePages.prerender(shell, publicDir);
    const first = readFileSync(path.join(publicDir, "index.html"), "utf8");

    sharePages.prerender(shell, publicDir);

    expect(readFileSync(path.join(publicDir, "index.html"), "utf8")).toBe(first);
  });
});
