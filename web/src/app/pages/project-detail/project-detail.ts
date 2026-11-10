import { httpResource, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, effect, inject, input, isDevMode } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../core/api-base-url';
import { Project, STATUS_LABELS } from '../../core/models';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail {
  /** Bound from the `:slug` route param (withComponentInputBinding). */
  readonly slug = input.required<string>();

  private readonly apiBase = inject(API_BASE_URL);
  private readonly title = inject(Title);
  protected readonly isDev = isDevMode();

  protected readonly resource = httpResource<Project>(
    () => `${this.apiBase}/projects/${encodeURIComponent(this.slug())}`,
  );

  protected readonly project = computed(() =>
    this.resource.hasValue() ? this.resource.value() : undefined,
  );
  protected readonly notFound = computed(() => {
    const error = this.resource.error();
    return error instanceof HttpErrorResponse && error.status === 404;
  });
  protected readonly statusLabel = computed(() => {
    const project = this.project();
    return project ? STATUS_LABELS[project.status] : '';
  });

  constructor() {
    effect(() => {
      const project = this.project();
      if (project) {
        this.title.setTitle(`${project.title} · Portfolio`);
      } else if (this.notFound()) {
        this.title.setTitle('Project not found · Portfolio');
      }
    });
  }
}
