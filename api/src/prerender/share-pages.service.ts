import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import {
  homeSharePage,
  projectSharePage,
  readShareImage,
  type SharePage,
  withShareTags,
} from "../lib/share-page.js";
import { PortfolioService } from "../portfolio/portfolio.service.js";

@Injectable()
export class SharePagesService {
  constructor(private readonly portfolio: PortfolioService) {}

  /** The pages a shared link can point at: the home page and one per project. */
  pages(): SharePage[] {
    const profile = this.portfolio.getProfile();
    return [
      homeSharePage(profile),
      ...this.portfolio.getProjects().map((project) => projectSharePage(project, profile)),
    ];
  }

  /**
   * Writes each page into `publicDir` as the Angular app's `shell` with that page's preview tags:
   * `/` as `index.html` and `/projects/tapwave` as `projects/tapwave.html`. Returns the files.
   */
  prerender(shell: string, publicDir: string): string[] {
    return this.pages().map((page) => {
      const file = path.join(publicDir, page.path === "/" ? "index.html" : `${page.path}.html`);
      mkdirSync(path.dirname(file), { recursive: true });
      writeFileSync(file, withShareTags(shell, page, readShareImage(publicDir, page.image)));
      return file;
    });
  }
}
