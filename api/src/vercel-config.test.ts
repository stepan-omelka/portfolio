import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { projects } from "./lib/portfolio.js";

const { rewrites } = z
  .object({ rewrites: z.array(z.object({ source: z.string(), destination: z.string() })) })
  .parse(JSON.parse(readFileSync(path.join(import.meta.dirname, "../vercel.json"), "utf8")));

const sources = rewrites.map(({ source }) => source);

describe("vercel.json", () => {
  it("lists exactly the project slugs in the rewrite that serves a project's prerendered file", () => {
    const listed = sources
      .map((source) => /^\/api\/projects\/:slug\((.+)\)$/.exec(source)?.[1])
      .find((slugs) => slugs !== undefined)
      ?.split("|");

    expect(
      listed,
      "A project was added, removed or renamed in src/lib/portfolio.ts: put the same slugs into " +
        'the "/api/projects/:slug(...)" rewrite in api/vercel.json. A slug missing there is ' +
        "answered by the function instead of its file; one that is no longer a project has no file.",
    ).toEqual(projects.map(({ slug }) => slug));
  });

  it("serves a project's file at the address of its endpoint", () => {
    expect(rewrites).toContainEqual({
      source: expect.stringMatching(/^\/api\/projects\/:slug\(/),
      destination: "/api/projects/:slug.json",
    });
    expect(rewrites).toContainEqual({ source: "/api/profile", destination: "/api/profile.json" });
    expect(rewrites).toContainEqual({ source: "/api/projects", destination: "/api/projects.json" });
  });

  it("tries the prerendered files before the function, and the function before the page", () => {
    const toFunction = sources.indexOf("/api/(.*)");
    const toPage = sources.indexOf("/(.*)");

    expect(sources.slice(0, toFunction)).toEqual([
      "/api/profile",
      "/api/projects",
      expect.stringMatching(/^\/api\/projects\/:slug\(/),
    ]);
    expect(toPage).toBe(toFunction + 1);
    expect(toPage).toBe(sources.length - 1);
  });
});
