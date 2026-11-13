import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { Module } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.js";
import { createApp } from "../create-app.js";
import { StaticSiteModule } from "./static-site.module.js";

describe("the built site, served next to the API", () => {
  let app: NestExpressApplication;
  let publicDir: string;

  beforeEach(async () => {
    publicDir = mkdtempSync(path.join(tmpdir(), "portfolio-public-"));
    mkdirSync(path.join(publicDir, "projects"));
    writeFileSync(path.join(publicDir, "index.html"), "<title>Home</title>");
    writeFileSync(path.join(publicDir, "projects/tapwave.html"), "<title>Tapwave</title>");
    writeFileSync(path.join(publicDir, "main.js"), "console.log('app');");

    @Module({ imports: [AppModule, StaticSiteModule.forRoot(publicDir)] })
    class SiteModule {}

    app = await createApp(SiteModule, { logger: false });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    rmSync(publicDir, { recursive: true, force: true });
  });

  it("serves a file of the build as is", async () => {
    const response = await request(app.getHttpServer()).get("/main.js");

    expect(response.status).toBe(200);
    expect(response.text).toBe("console.log('app');");
  });

  it("serves the home page", async () => {
    const response = await request(app.getHttpServer()).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("<title>Home</title>");
  });

  it("serves a project's prerendered page at its address", async () => {
    const response = await request(app.getHttpServer()).get("/projects/tapwave");

    expect(response.status).toBe(200);
    expect(response.text).toBe("<title>Tapwave</title>");
  });

  it.each(["/projects/no-such-project", "/no/such/page"])(
    "serves the home page for %s, so the Angular router can take over",
    async (address) => {
      const response = await request(app.getHttpServer()).get(address);

      expect(response.status).toBe(200);
      expect(response.text).toBe("<title>Home</title>");
    },
  );

  it("keeps answering API requests itself", async () => {
    const found = await request(app.getHttpServer()).get("/api/projects/tapwave");
    const missing = await request(app.getHttpServer()).get("/api/no-such-endpoint");

    expect(found.body).toMatchObject({ slug: "tapwave" });
    expect(missing.status).toBe(404);
    expect(missing.body).toEqual({ error: "Not found" });
  });
});
