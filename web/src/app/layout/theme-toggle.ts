import { Component, computed, inject } from '@angular/core';
import { ThemeService } from '../core/theme';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      class="toggle"
      [attr.aria-label]="label()"
      [title]="label()"
      (click)="theme.toggle()"
    >
      @if (isDark()) {
        <!-- Sun -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      } @else {
        <!-- Moon -->
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      }
    </button>
  `,
  styles: `
    .toggle {
      display: grid;
      place-items: center;
      width: 2.5rem;
      height: 2.5rem;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: transparent;
      color: var(--fg);
      cursor: pointer;
      transition: border-color 0.15s ease;

      &:hover {
        border-color: var(--fg);
      }
    }

    svg {
      width: 1.125rem;
      height: 1.125rem;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
  protected readonly label = computed(() =>
    this.isDark() ? 'Switch to light theme' : 'Switch to dark theme',
  );
}
