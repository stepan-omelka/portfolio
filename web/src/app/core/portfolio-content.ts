import { httpResource } from '@angular/common/http';
import { computed, inject, Service } from '@angular/core';
import { API_BASE_URL } from './api-base-url';
import { Profile, Project } from './models';

/**
 * App-wide content loaded once from the API and shared between the header,
 * footer and home page.
 */
@Service()
export class PortfolioContent {
  private readonly apiBase = inject(API_BASE_URL);

  private readonly profileResource = httpResource<Profile>(() => `${this.apiBase}/profile`);
  private readonly projectsResource = httpResource<Project[]>(() => `${this.apiBase}/projects`);

  // `value()` throws while a resource is in the error state, so always go through `hasValue()`.
  readonly profile = computed(() =>
    this.profileResource.hasValue() ? this.profileResource.value() : undefined,
  );
  readonly projects = computed(() =>
    this.projectsResource.hasValue() ? this.projectsResource.value() : undefined,
  );

  readonly isLoading = computed(
    () => this.profileResource.isLoading() || this.projectsResource.isLoading(),
  );
  readonly hasError = computed(
    () => !!this.profileResource.error() || !!this.projectsResource.error(),
  );

  reload(): void {
    this.profileResource.reload();
    this.projectsResource.reload();
  }
}
