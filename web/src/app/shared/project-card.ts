import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project, STATUS_LABELS } from '../core/models';

@Component({
  selector: 'app-project-card',
  imports: [RouterLink],
  host: { '[class.placeholder]': 'isPlaceholder()' },
  template: `
    <article class="card">
      <div class="meta">
        <span>{{ number() }}</span>
        <span class="status">{{ statusLabel() }}</span>
      </div>
      <h3>
        <a [routerLink]="['/projects', project().slug]">{{ project().title }}</a>
      </h3>
      <p class="summary">{{ project().summary }}</p>
      @if (project().tags.length) {
        <ul class="tags" aria-label="Tags">
          @for (tag of project().tags; track $index) {
            <li>{{ tag }}</li>
          }
        </ul>
      }
    </article>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      height: 100%;
      padding: 1.5rem;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--bg);
      transition:
        border-color 0.15s ease,
        transform 0.15s ease;

      &:hover {
        border-color: var(--fg);
        transform: translateY(-2px);
      }

      &:has(a:focus-visible) {
        outline: 2px solid var(--fg);
        outline-offset: 3px;
      }
    }

    :host(.placeholder) .card {
      border-style: dashed;
      border-color: var(--border-strong);
      background: transparent;

      &:hover {
        border-color: var(--fg);
      }
    }

    .meta {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--muted);
    }

    .status {
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    h3 {
      font-size: 1.25rem;
    }

    // Make the whole card clickable while keeping a single link in the a11y tree.
    a {
      text-decoration: none;
      outline: none;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
      }
    }

    .summary {
      flex: 1;
      color: var(--muted);
    }
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();
  /** Zero-based position in the list, shown as 01, 02, ... */
  readonly index = input.required<number>();

  protected readonly number = computed(() => String(this.index() + 1).padStart(2, '0'));
  protected readonly statusLabel = computed(() => STATUS_LABELS[this.project().status]);
  protected readonly isPlaceholder = computed(() => this.project().status === 'placeholder');
}
