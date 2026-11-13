import type { NestApplicationOptions, Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { configureApp } from "./configure-app.js";

/** Creates the Nest app the same way for the local server, the Vercel Function and the tests. */
export async function createApp(
  rootModule: Type<unknown>,
  options: NestApplicationOptions = {},
): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(rootModule, {
    ...options,
    // Nest's default parsers would read a form post of up to 100 kB before the guard rejects it.
    bodyParser: false,
  });
  configureApp(app);
  return app;
}
