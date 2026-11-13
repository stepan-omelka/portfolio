import { describe, expect, it } from "vitest";
import { contactMessageSchema, formatContactEmail } from "./contact.js";

const valid = { name: "Jana Nováková", email: "jana@example.com", message: "Hello!" };

describe("contactMessageSchema", () => {
  it("accepts a valid message and trims it", () => {
    expect(
      contactMessageSchema.parse({ name: "  Jana ", email: " jana@example.com ", message: " Hi " }),
    ).toEqual({ name: "Jana", email: "jana@example.com", message: "Hi" });
  });

  it.each([
    ["a missing name", { ...valid, name: "  " }],
    ["a name with a line break", { ...valid, name: "Jana\nBcc: spam@example.com" }],
    ["an invalid email", { ...valid, email: "not-an-email" }],
    ["an empty message", { ...valid, message: "" }],
    ["a message over 5000 characters", { ...valid, message: "a".repeat(5001) }],
    ["a non-object", "hello"],
  ])("rejects %s", (_, input) => {
    expect(contactMessageSchema.safeParse(input).success).toBe(false);
  });

  it("keeps the honeypot value so the controller can spot bots", () => {
    expect(contactMessageSchema.parse({ ...valid, website: "https://spam.example" }).website).toBe(
      "https://spam.example",
    );
  });
});

describe("formatContactEmail", () => {
  it("puts the name in the subject and the details in the body", () => {
    const { subject, text } = formatContactEmail(valid);
    expect(subject).toBe("Portfolio: message from Jana Nováková");
    expect(text).toBe("Name: Jana Nováková\nEmail: jana@example.com\n\nHello!");
  });
});
