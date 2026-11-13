import request from "supertest";
import { describe, expect, it } from "vitest";

// What api/index.js hands to Vercel as the function, once compiled into dist/.
const { default: handler } = await import("./vercel.js");

describe("the Vercel Function", () => {
  it("answers an API request without listening on a port", async () => {
    const response = await request(handler).get("/api/projects/tapwave");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ slug: "tapwave" });
  });

  it("answers 404 for a slug that has no prerendered file to be served instead", async () => {
    const response = await request(handler).get("/api/projects/no-such-project");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Project not found" });
  });
});
