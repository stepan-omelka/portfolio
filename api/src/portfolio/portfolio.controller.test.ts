import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "../app.module.js";
import { createApp } from "../create-app.js";
import { profile, projects } from "../lib/portfolio.js";

describe("the content API", () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    app = await createApp(AppModule, { logger: false });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns the profile", async () => {
    const response = await request(app.getHttpServer()).get("/api/profile");

    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    expect(response.body).toEqual(profile);
  });

  it("returns every project, in the order of the page", async () => {
    const response = await request(app.getHttpServer()).get("/api/projects");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(projects);
  });

  it("returns one project by its slug", async () => {
    const response = await request(app.getHttpServer()).get("/api/projects/tapwave");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ slug: "tapwave", title: "Tapwave" });
  });

  it("answers 404 for a slug that isn't a project", async () => {
    const response = await request(app.getHttpServer()).get("/api/projects/no-such-project");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Project not found" });
  });

  it.each(["/api/profile", "/api/projects", "/api/projects/tapwave"])(
    "lets the CDN keep %s but not the browser",
    async (path) => {
      const response = await request(app.getHttpServer()).get(path);

      expect(response.headers["cache-control"]).toBe("public, max-age=0, s-maxage=31536000");
    },
  );

  it("doesn't let the CDN keep a 404", async () => {
    const response = await request(app.getHttpServer()).get("/api/projects/no-such-project");

    expect(response.headers["cache-control"]).toBeUndefined();
  });

  it("answers 404 with an error body for a path the API doesn't have", async () => {
    const response = await request(app.getHttpServer()).get("/api/no-such-endpoint");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Not found" });
  });
});
