import { Injectable } from "@nestjs/common";
import { findProject, type Profile, profile, type Project, projects } from "../lib/portfolio.js";

/** The site's content, for the API controllers, the contact form and the prerendered pages. */
@Injectable()
export class PortfolioService {
  getProfile(): Profile {
    return profile;
  }

  getProjects(): Project[] {
    return projects;
  }

  findProject(slug: string): Project | undefined {
    return findProject(slug);
  }
}
