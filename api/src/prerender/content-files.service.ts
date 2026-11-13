import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { Injectable } from "@nestjs/common";
import { PortfolioService } from "../portfolio/portfolio.service.js";

@Injectable()
export class ContentFilesService {
  constructor(private readonly portfolio: PortfolioService) {}

  /**
   * Writes the body of every content endpoint into `publicDir`: `GET /api/projects/tapwave` as
   * `api/projects/tapwave.json`. `vercel.json` rewrites each address to its file. Returns the files.
   */
  prerender(publicDir: string): string[] {
    const projects = this.portfolio.getProjects();
    const bodies: [endpoint: string, body: unknown][] = [
      ["profile", this.portfolio.getProfile()],
      ["projects", projects],
      ...projects.map((project): [string, unknown] => [`projects/${project.slug}`, project]),
    ];

    return bodies.map(([endpoint, body]) => {
      const file = path.join(publicDir, "api", `${endpoint}.json`);
      mkdirSync(path.dirname(file), { recursive: true });
      // The same serialization as Express's `response.json()`; a test compares the two.
      writeFileSync(file, JSON.stringify(body));
      return file;
    });
  }
}
