import { DOCUMENT } from '@angular/common';
import { computed, DestroyRef, effect, inject, Service, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

/**
 * Light/dark theme. Follows the OS preference until the user picks a theme
 * explicitly; that choice is then persisted in localStorage.
 *
 * The inline script in `index.html` applies the same logic before Angular
 * boots, so the page never flashes the wrong theme.
 */
@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;
  private readonly media = this.window?.matchMedia?.(DARK_QUERY);

  private readonly stored = signal<Theme | null>(this.readStored());
  private readonly system = signal<Theme>(this.media?.matches ? 'dark' : 'light');

  /** The theme currently applied to the page. */
  readonly theme = computed<Theme>(() => this.stored() ?? this.system());

  constructor() {
    const onSystemChange = (event: MediaQueryListEvent) =>
      this.system.set(event.matches ? 'dark' : 'light');
    this.media?.addEventListener('change', onSystemChange);
    inject(DestroyRef).onDestroy(() => this.media?.removeEventListener('change', onSystemChange));

    effect(() => {
      const theme = this.theme();
      const root = this.document.documentElement;
      root.dataset['theme'] = theme;
      root.style.colorScheme = theme;
    });
  }

  toggle(): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark');
  }

  set(theme: Theme): void {
    this.stored.set(theme);
    try {
      this.window?.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be unavailable (private mode, disabled cookies) — the theme still applies.
    }
  }

  private readStored(): Theme | null {
    try {
      const value = this.window?.localStorage.getItem(THEME_STORAGE_KEY);
      return isTheme(value) ? value : null;
    } catch {
      return null;
    }
  }
}
