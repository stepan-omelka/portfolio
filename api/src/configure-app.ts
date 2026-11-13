import type { NestExpressApplication } from "@nestjs/platform-express";

/** The longest valid contact message stays well under this, so a larger body is never one. */
const MAX_BODY_BYTES = 20_000;

export function configureApp(app: NestExpressApplication): void {
  app.setGlobalPrefix("api");
  app.useBodyParser("json", { limit: MAX_BODY_BYTES });
  app.disable("x-powered-by");
}
