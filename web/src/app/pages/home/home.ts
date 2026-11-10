import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioContent } from '../../core/portfolio-content';
import { ProjectCard } from '../../shared/project-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly content = inject(PortfolioContent);
  protected readonly profile = this.content.profile;
  protected readonly projects = this.content.projects;
}
