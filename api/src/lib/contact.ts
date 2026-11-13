import { z } from "zod";

// Keeps user input from spilling into extra lines of the email subject.
const SINGLE_LINE = /^[^\r\n]*$/;

/** Error codes returned by POST /api/contact; the frontend maps them to messages. */
export type ContactError = "invalid" | "send-failed" | "unexpected";

const CONTACT_LIMITS = { name: 200, email: 320, message: 5000 } as const;

/** The body of POST /api/contact. */
export const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(CONTACT_LIMITS.name).regex(SINGLE_LINE),
  email: z.string().trim().max(CONTACT_LIMITS.email).pipe(z.email()),
  message: z.string().trim().min(1).max(CONTACT_LIMITS.message),
  // Honeypot: hidden from people, so only bots fill it in.
  website: z.string().max(500).optional(),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export function formatContactEmail({ name, email, message }: ContactMessage): {
  subject: string;
  text: string;
} {
  return {
    subject: `Portfolio: message from ${name}`,
    text: [`Name: ${name}`, `Email: ${email}`, "", message].join("\n"),
  };
}
