import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ApiError } from "../api-error.js";
import type { Profile, Project } from "../lib/portfolio.js";
import { PortfolioService } from "./portfolio.service.js";

/**
 * On Vercel the build's copies of these responses answer instead (`ContentFilesService`), and
 * only an unknown slug gets here. Locally and in tests every request does.
 */
@Controller()
export class PortfolioController {
  constructor(private readonly portfolio: PortfolioService) {}

  @Get("profile")
  getProfile(): Profile {
    return this.portfolio.getProfile();
  }

  @Get("projects")
  getProjects(): Project[] {
    return this.portfolio.getProjects();
  }

  @Get("projects/:slug")
  getProject(@Param("slug") slug: string): Project {
    const project = this.portfolio.findProject(slug);
    if (!project) {
      throw new ApiError("Project not found", HttpStatus.NOT_FOUND);
    }
    return project;
  }
}
