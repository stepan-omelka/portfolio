import { readFileSync } from "node:fs";
import path from "node:path";
import { NestFactory } from "@nestjs/core";
import { ANGULAR_SHELL, PUBLIC_DIR } from "./paths.js";
import { ContentFilesService } from "./prerender/content-files.service.js";
import { PrerenderModule } from "./prerender/prerender.module.js";
import { SharePagesService } from "./prerender/share-pages.service.js";

// A build step (`npm run build:site`), not part of the server: it starts Nest without HTTP, writes
// the link-preview pages and the content endpoints' responses into public/ and exits.
const app = await NestFactory.createApplicationContext(PrerenderModule, {
  logger: ["error", "warn"],
});
const files = [
  ...app.get(SharePagesService).prerender(readFileSync(ANGULAR_SHELL, "utf8"), PUBLIC_DIR),
  ...app.get(ContentFilesService).prerender(PUBLIC_DIR),
];
await app.close();

console.log(`Prerendered ${files.map((file) => path.relative(PUBLIC_DIR, file)).join(", ")}`);
