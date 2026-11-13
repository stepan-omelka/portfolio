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
      <a class="brand" routerLink="/"
        ><span class="brand-name">{{ name() }}</span></a
      >
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
      background: color-mix(in srgb, var(--bg) 78%, transparent);
      backdrop-filter: blur(12px) saturate(1.4);
      border-bottom: 1px solid var(--border);
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      height: var(--header-height);
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.625rem;
      min-width: 0;
      min-height: 2.5rem;
      margin-right: auto;
      font-weight: 700;
      letter-spacing: -0.01em;
      text-decoration: none;

      // Same mark as public/favicon.svg - change the two together.
      &::before {
        content: '';
        flex: none;
        width: 0.875rem;
        height: 0.875rem;
        border-radius: 0.25rem;
        background: linear-gradient(135deg, var(--accent), var(--ice));
        box-shadow: inset 0 0 0 1px var(--silver);
        transform: rotate(45deg);
      }
    }

    .brand-name {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    // DejaVu Sans is too wide for the name and the nav to share a phone screen: show the mark only.
    @media (max-width: 30rem) {
      .brand {
        min-width: 2.5rem;
        justify-content: center;

        &::before {
          width: 1.125rem;
          height: 1.125rem;
        }
      }

      .brand-name {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        clip-path: inset(50%);
      }
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
        color: var(--accent-text);
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
