import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.js";
import { createApp } from "../create-app.js";
import { projects } from "../lib/portfolio.js";
import { ContentFilesService } from "./content-files.service.js";
import { PrerenderModule } from "./prerender.module.js";

describe("ContentFilesService", () => {
  let contentFiles: ContentFilesService;
  let app: NestExpressApplication;
  let publicDir: string;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [PrerenderModule] }).compile();
    contentFiles = moduleRef.get(ContentFilesService);
    app = await createApp(AppModule, { logger: false });
    await app.init();
    publicDir = mkdtempSync(path.join(tmpdir(), "portfolio-public-"));
  });

  afterEach(async () => {
    await app.close();
    rmSync(publicDir, { recursive: true, force: true });
  });

  it("writes a file for the profile, the project list and each project", () => {
    const files = contentFiles.prerender(publicDir);

    expect(files.map((file) => path.relative(publicDir, file))).toEqual([
      path.join("api", "profile.json"),
      path.join("api", "projects.json"),
      ...projects.map(({ slug }) => path.join("api", "projects", `${slug}.json`)),
    ]);
  });

  it.each(["profile", "projects", ...projects.map(({ slug }) => `projects/${slug}`)])(
    "writes for %s exactly what GET /api/%s answers",
    async (endpoint) => {
      contentFiles.prerender(publicDir);

      const response = await request(app.getHttpServer()).get(`/api/${endpoint}`);

      expect(response.status).toBe(200);
      expect(readFileSync(path.join(publicDir, "api", `${endpoint}.json`), "utf8")).toBe(
        response.text,
      );
    },
  );
});
