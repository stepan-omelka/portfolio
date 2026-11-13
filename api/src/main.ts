import { Module } from "@nestjs/common";
import { AppModule } from "./app.module.js";
import { createApp } from "./create-app.js";
import { PUBLIC_DIR } from "./paths.js";
import { StaticSiteModule } from "./static-site/static-site.module.js";

/** The API plus the built site: on Vercel the CDN serves the site, on this server Nest does. */
@Module({ imports: [AppModule, StaticSiteModule.forRoot(PUBLIC_DIR)] })
class LocalServerModule {}

const app = await createApp(LocalServerModule);
await app.listen(process.env.PORT ?? 3300);
