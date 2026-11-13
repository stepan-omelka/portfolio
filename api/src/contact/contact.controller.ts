import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiError } from "../api-error.js";
import { type ContactMessage, contactMessageSchema } from "../lib/contact.js";
import { ContactService } from "./contact.service.js";
import { JsonBodyGuard } from "./json-body.guard.js";

@Controller("contact")
@UseGuards(JsonBodyGuard)
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Body({ schema: contactMessageSchema }) message: ContactMessage): Promise<{ ok: true }> {
    if (message.website) {
      // The honeypot was filled in: pretend success, so bots have no reason to retry.
      return { ok: true };
    }

    const error = await this.contact.send(message);
    if (error) {
      const status = error === "send-failed" ? HttpStatus.BAD_GATEWAY : HttpStatus.INTERNAL_SERVER_ERROR;
      throw new ApiError(error, status);
    }
    return { ok: true };
  }
}
