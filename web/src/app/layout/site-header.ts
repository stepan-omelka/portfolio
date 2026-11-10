import { ViewportScroller } from '@angular/common';
import { Component, computed, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PortfolioContent } from '../core/portfolio-content';
import { ThemeToggle } from './theme-toggle';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, ThemeToggle],
  host: { role: 'banner' },
  template: `
    <div class="container bar">
      <a class="brand" routerLink="/">{{ name() }}</a>
      <nav aria-label="Primary">
        <ul>
          <li><a routerLink="/" fragment="work">Work</a></li>
          <li><a routerLink="/" fragment="about">About</a></li>
          <li><a routerLink="/" fragment="contact">Contact</a></li>
        </ul>
      </nav>
      <app-theme-toggle />
    </div>
  `,
  styles: `
    :host {
      position: sticky;
      top: 0;
      z-index: 10;
      display: block;
      background: color-mix(in srgb, var(--bg) 85%, transparent);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: var(--header-height);
    }

    .brand {
      margin-right: auto;
      font-weight: 600;
      letter-spacing: -0.01em;
      text-decoration: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    ul {
      display: flex;
      gap: clamp(0.75rem, 3vw, 1.75rem);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    nav a {
      font-size: 0.9375rem;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.15s ease;

      &:hover {
        color: var(--fg);
      }
    }
  `,
})
export class SiteHeader {
  private readonly content = inject(PortfolioContent);
  protected readonly name = computed(() => this.content.profile()?.name ?? 'Portfolio');

  constructor() {
    // The header is sticky: offset router anchor scrolling so sections don't land underneath it.
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    inject(ViewportScroller).setOffset(() => [0, host.offsetHeight]);
  }
}
