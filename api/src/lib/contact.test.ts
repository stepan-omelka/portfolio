import { describe, expect, it } from "vitest";
import { formatContactEmail, parseContactMessage } from "./contact";

const valid = { name: "Jana Nováková", email: "jana@example.com", message: "Hello!" };

describe("parseContactMessage", () => {
  it("accepts a valid message and trims it", () => {
    expect(parseContactMessage({ name: "  Jana ", email: " jana@example.com ", message: " Hi " })).toEqual({
      name: "Jana",
      email: "jana@example.com",
      message: "Hi",
    });
  });

  it.each([
    ["a missing name", { ...valid, name: "  " }],
    ["a name with a line break", { ...valid, name: "Jana\nBcc: spam@example.com" }],
    ["an invalid email", { ...valid, email: "not-an-email" }],
    ["an empty message", { ...valid, message: "" }],
    ["a message over 5000 characters", { ...valid, message: "a".repeat(5001) }],
    ["a non-object", "hello"],
  ])("rejects %s", (_, input) => {
    expect(parseContactMessage(input)).toBeUndefined();
  });

  it("keeps the honeypot value so the route can spot bots", () => {
    expect(parseContactMessage({ ...valid, website: "https://spam.example" })?.website).toBe(
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
