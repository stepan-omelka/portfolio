import { readFileSync } from "node:fs";
import path from "node:path";
import { NestFactory } from "@nestjs/core";
import { ANGULAR_SHELL, PUBLIC_DIR } from "./paths.js";
import { SharePagesModule } from "./share-pages/share-pages.module.js";
import { SharePagesService } from "./share-pages/share-pages.service.js";

// A build step (`npm run build:site`), not part of the server: it starts Nest without HTTP, writes
// the pages that link previews read into public/ and exits.
const app = await NestFactory.createApplicationContext(SharePagesModule, {
  logger: ["error", "warn"],
});
const files = app.get(SharePagesService).prerender(readFileSync(ANGULAR_SHELL, "utf8"), PUBLIC_DIR);
await app.close();

console.log(`Prerendered ${files.map((file) => path.relative(PUBLIC_DIR, file)).join(", ")}`);
