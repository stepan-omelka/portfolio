import { existsSync } from "node:fs";
import { type DynamicModule, Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";

/**
 * Serves the built site from `publicDir` the way Vercel's CDN does (`vercel.json`): a file as is,
 * `/projects/tapwave` from `projects/tapwave.html`, and any other page as `index.html`.
 */
@Module({})
export class StaticSiteModule {
  static forRoot(publicDir: string): DynamicModule {
    return {
      module: StaticSiteModule,
      // Without a build there is nothing to serve, e.g. under `npm run dev`.
      imports: existsSync(publicDir)
        ? [
            ServeStaticModule.forRoot({
              rootPath: publicDir,
              exclude: ["/api/{*path}"],
              serveStaticOptions: { extensions: ["html"], redirect: false },
            }),
          ]
        : [],
    };
  }
}
