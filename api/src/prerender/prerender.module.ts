import { Module } from "@nestjs/common";
import { PortfolioModule } from "../portfolio/portfolio.module.js";
import { ContentFilesService } from "./content-files.service.js";
import { SharePagesService } from "./share-pages.service.js";

/** What the build writes into `public/`, so that Vercel serves it without running the API. */
@Module({
  imports: [PortfolioModule],
  providers: [ContentFilesService, SharePagesService],
})
export class PrerenderModule {}
