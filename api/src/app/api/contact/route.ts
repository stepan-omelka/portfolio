import { Resend } from "resend";
import { type ContactError, formatContactEmail, parseContactMessage } from "@/lib/contact";
import { profile } from "@/lib/portfolio";

const MAX_BODY_LENGTH = 20_000;

function fail(error: ContactError, status: number): Response {
  return Response.json({ error }, { status });
}

export async function POST(request: Request): Promise<Response> {
  // Requiring JSON makes browsers send a CORS preflight for cross-site posts, which this API
  // doesn't answer, so other websites can't submit the form on a visitor's behalf.
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return fail("invalid", 415);
  }

  const body = await request.text();
  if (body.length > MAX_BODY_LENGTH) {
    return fail("invalid", 413);
  }

  let input: unknown;
  try {
    input = JSON.parse(body);
  } catch {
    return fail("invalid", 400);
  }

  const message = parseContactMessage(input);
  if (!message) {
    return fail("invalid", 400);
  }

  if (message.website) {
    // The honeypot was filled in: pretend success, so bots have no reason to retry.
    return Response.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: the RESEND_API_KEY environment variable is not set.");
    return fail("unexpected", 500);
  }

  const { error } = await new Resend(apiKey).emails.send({
    // Resend's shared sender needs no domain, but it only delivers to the email address the
    // Resend account was created with, so that account must use `profile.email`.
    from: "Portfolio <onboarding@resend.dev>",
    to: [profile.email],
    replyTo: message.email,
    ...formatContactEmail(message),
  });

  if (error) {
    console.error("Contact form: Resend rejected the email.", error);
    return fail("send-failed", 502);
  }

  return Response.json({ ok: true });
}
