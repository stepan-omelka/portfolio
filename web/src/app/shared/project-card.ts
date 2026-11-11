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
        <span class="number">{{ number() }}</span>
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
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      background: var(--card);
      box-shadow: 0 1px 2px var(--shadow);
      transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), var(--ice), var(--silver));
        opacity: 0.35;
        transition: opacity 0.2s ease;
      }

      &:hover {
        border-color: var(--accent);
        box-shadow: 0 14px 32px -16px var(--shadow);
        transform: translateY(-3px);

        &::before {
          opacity: 1;
        }
      }

      &:has(a:focus-visible) {
        outline: 2px solid var(--accent-text);
        outline-offset: 3px;
      }
    }

    :host(.placeholder) .card {
      border-style: dashed;
      border-color: var(--border-strong);
      background: transparent;
      box-shadow: none;

      &::before {
        display: none;
      }

      &:hover {
        border-color: var(--accent);
      }
    }

    .meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--muted);
    }

    .number {
      font-weight: 700;
      color: var(--accent-text);
    }

    .status {
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    h3 {
      font-size: 1.1875rem;
    }

    // Make the whole card clickable while keeping a single link in the a11y tree.
    a {
      text-decoration: none;
      outline: none;
      transition: color 0.15s ease;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: inherit;
      }
    }

    .card:hover a {
      color: var(--accent-text);
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
