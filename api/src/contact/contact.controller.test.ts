import type { NestExpressApplication } from "@nestjs/platform-express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { AppModule } = await import("../app.module.js");
const { createApp } = await import("../create-app.js");
const { profile } = await import("../lib/portfolio.js");

const valid = { name: "Jana", email: "jana@example.com", message: "Hello!" };

describe("POST /api/contact", () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    app = await createApp(AppModule, { logger: false });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    vi.unstubAllEnvs();
    send.mockReset();
  });

  function post(body: string | object, contentType = "application/json") {
    return request(app.getHttpServer())
      .post("/api/contact")
      .set("Content-Type", contentType)
      .send(typeof body === "string" ? body : JSON.stringify(body));
  }

  it("emails the message to the profile address, with reply-to set to the sender", async () => {
    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(send).toHaveBeenCalledExactlyOnceWith({
      from: "Portfolio <onboarding@resend.dev>",
      to: [profile.email],
      replyTo: "jana@example.com",
      subject: "Portfolio: message from Jana",
      text: "Name: Jana\nEmail: jana@example.com\n\nHello!",
    });
  });

  it("trims the message before sending it", async () => {
    await post({ name: "  Jana ", email: " jana@example.com ", message: " Hello! " });

    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: "jana@example.com", subject: "Portfolio: message from Jana" }),
    );
  });

  it.each([
    ["an invalid email", { ...valid, email: "nope" }],
    ["a missing message", { name: "Jana", email: "jana@example.com" }],
    ["a name with a line break", { ...valid, name: "Jana\nBcc: spam@example.com" }],
    ["a body that isn't an object", ["Jana"]],
  ])("rejects %s", async (_, body) => {
    const response = await post(body);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const response = await post("{not json");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a request that isn't JSON, which a cross-site form could send", async () => {
    const response = await post(JSON.stringify(valid), "text/plain");

    expect(response.status).toBe(415);
    expect(response.body).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a body over 20,000 bytes", async () => {
    const response = await post({ ...valid, message: "a".repeat(20_000) });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("pretends success without sending when the honeypot is filled in", async () => {
    const response = await post({ ...valid, website: "https://spam.example" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a send failure when Resend returns an error", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "nope" } });

    const response = await post(valid);

    expect(response.status).toBe(502);
    expect(response.body).toEqual({ error: "send-failed" });
  });

  it("fails without sending when the API key is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "unexpected" });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports an unexpected error when Resend can't be reached", async () => {
    send.mockRejectedValue(new Error("fetch failed"));

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "unexpected" });
  });
});
