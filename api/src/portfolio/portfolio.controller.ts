import { Controller, Get, Header, HttpStatus, Param } from "@nestjs/common";
import { ApiError } from "../api-error.js";
import type { Profile, Project } from "../lib/portfolio.js";
import { PortfolioService } from "./portfolio.service.js";

// The content only changes with a deploy, and a deploy empties Vercel's CDN cache, so the CDN may
// keep a response for as long as it allows (a year). Browsers still ask the CDN every time.
const CACHED_UNTIL_NEXT_DEPLOY = "public, max-age=0, s-maxage=31536000";

@Controller()
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Get("profile")
  @Header("Cache-Control", CACHED_UNTIL_NEXT_DEPLOY)
  getProfile(): Profile {
    return this.portfolio.getProfile();
  }

  @Get("projects")
  @Header("Cache-Control", CACHED_UNTIL_NEXT_DEPLOY)
  getProjects(): Project[] {
    return this.portfolio.getProjects();
  }

  @Get("projects/:slug")
  @Header("Cache-Control", CACHED_UNTIL_NEXT_DEPLOY)
  getProject(@Param("slug") slug: string): Project {
    const project = this.portfolio.findProject(slug);
    if (!project) {
      throw new ApiError("Project not found", HttpStatus.NOT_FOUND);
    }
    return project;
  }
}
