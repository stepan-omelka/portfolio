import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const { POST } = await import("./route");
const { profile } = await import("@/lib/portfolio");

const valid = { name: "Jana", email: "jana@example.com", message: "Hello!" };

function post(body: unknown, contentType = "application/json"): Promise<Response> {
  return POST(
    new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "content-type": contentType },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.spyOn(console, "error").mockImplementation(() => {});
    send.mockResolvedValue({ data: { id: "1" }, error: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    send.mockReset();
  });

  it("emails the message to the profile address, with reply-to set to the sender", async () => {
    const response = await post(valid);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        to: [profile.email],
        replyTo: "jana@example.com",
        subject: "Portfolio: message from Jana",
      }),
    );
  });

  it("rejects an invalid message", async () => {
    const response = await post({ ...valid, email: "nope" });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "invalid" });
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON and non-JSON requests", async () => {
    expect((await post("{not json")).status).toBe(400);
    expect((await post(JSON.stringify(valid), "text/plain")).status).toBe(415);
    expect(send).not.toHaveBeenCalled();
  });

  it("pretends success without sending when the honeypot is filled in", async () => {
    const response = await post({ ...valid, website: "https://spam.example" });

    expect(response.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a send failure when Resend returns an error", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "nope" } });

    const response = await post(valid);

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "send-failed" });
  });

  it("fails without sending when the API key is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const response = await post(valid);

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "unexpected" });
    expect(send).not.toHaveBeenCalled();
  });
});
