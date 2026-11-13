import { Module } from "@nestjs/common";
import { PortfolioModule } from "../portfolio/portfolio.module.js";
import { ContactController } from "./contact.controller.js";
import { ContactService } from "./contact.service.js";

@Module({
  imports: [PortfolioModule],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
