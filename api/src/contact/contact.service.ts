import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";
import { type ContactError, type ContactMessage, formatContactEmail } from "../lib/contact.js";
import { PortfolioService } from "../portfolio/portfolio.service.js";

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly portfolio: PortfolioService,
  ) {}

  /** Emails the message to the site's owner. Returns why it couldn't, or `undefined` once sent. */
  async send(message: ContactMessage): Promise<ContactError | undefined> {
    const apiKey = this.config.get<string>("RESEND_API_KEY");
    if (!apiKey) {
      this.logger.error("The RESEND_API_KEY environment variable is not set.");
      return "unexpected";
    }

    const { error } = await new Resend(apiKey).emails.send({
      // Resend's shared sender needs no domain, but it only delivers to the email address the
      // Resend account was created with, so that account must use `profile.email`.
      from: "Portfolio <onboarding@resend.dev>",
      to: [this.portfolio.getProfile().email],
      replyTo: message.email,
      ...formatContactEmail(message),
    });

    if (error) {
      this.logger.error("Resend rejected the email.", error);
      return "send-failed";
    }
    return undefined;
  }
}
