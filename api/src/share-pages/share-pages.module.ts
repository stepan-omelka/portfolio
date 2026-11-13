import { Module } from "@nestjs/common";
import { PortfolioModule } from "../portfolio/portfolio.module.js";
import { SharePagesService } from "./share-pages.service.js";

@Module({
  imports: [PortfolioModule],
  providers: [SharePagesService],
})
export class SharePagesModule {}
