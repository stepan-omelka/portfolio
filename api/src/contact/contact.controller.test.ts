import { ConsoleLogger } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { gzipSync } from "node:zlib";
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

  it("rejects a form post without reading it, however large", async () => {
    const response = await post(`message=${"a".repeat(150_000)}`, "application/x-www-form-urlencoded");

    expect(response.status).toBe(415);
    expect(response.body).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a compressed body", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .set("Content-Encoding", "gzip")
      .send(gzipSync(JSON.stringify(valid)));

    expect(response.status).toBe(415);
    expect(response.body).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("accepts the longest valid message, in characters of several bytes", async () => {
    const response = await post({
      name: "ž".repeat(200),
      email: `${"a".repeat(64)}@${"b".repeat(63)}.example`,
      message: "€".repeat(5000),
      website: "",
    });

    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
  });

  it("reads a body of exactly 20,000 bytes and rejects one byte more", async () => {
    const json = JSON.stringify(valid);

    const atTheLimit = await post(json + " ".repeat(20_000 - json.length));
    const overTheLimit = await post(json + " ".repeat(20_001 - json.length));

    expect(atTheLimit.status).toBe(200);
    expect(overTheLimit.status).toBe(413);
    expect(overTheLimit.body).toEqual({ error: "invalid" });
    expect(send).toHaveBeenCalledOnce();
  });

  it("answers a CORS preflight with no permission, so another site can't post JSON", async () => {
    const response = await request(app.getHttpServer())
      .options("/api/contact")
      .set("Origin", "https://other.example")
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type");

    expect(response.status).toBe(404);
    expect(Object.keys(response.headers).filter((name) => name.startsWith("access-control-"))).toEqual(
      [],
    );
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

  it("never logs what a visitor wrote when it rejects it", async () => {
    await app.close();
    const written: string[] = [];
    const record = (chunk: string | Uint8Array): boolean => {
      written.push(chunk.toString());
      return true;
    };
    vi.spyOn(process.stdout, "write").mockImplementation(record);
    vi.spyOn(process.stderr, "write").mockImplementation(record);
    // The logger is on here, at the levels the Vercel Function uses. It takes an instance to
    // switch it back on: `logger: false` in an earlier test switched it off for the whole process.
    app = await createApp(AppModule, {
      logger: new ConsoleLogger({ logLevels: ["error", "warn"] }),
    });
    await app.init();

    await post({ ...valid, email: "nope", message: "my-private-words" });
    await post('{"message": "my-private-words"');
    await post({ ...valid, message: "my-private-words".repeat(2000) });
    await post("message=my-private-words", "application/x-www-form-urlencoded");
    vi.stubEnv("RESEND_API_KEY", "");
    await post(valid);
    vi.restoreAllMocks();

    // The last request shows that the log is being recorded at all.
    expect(written.join("")).toContain("RESEND_API_KEY environment variable is not set");
    expect(written.join("")).not.toContain("my-private-words");
  });

  it("reports an unexpected error when Resend can't be reached", async () => {
    send.mockRejectedValue(new Error("fetch failed"));

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "unexpected" });
  });
});
