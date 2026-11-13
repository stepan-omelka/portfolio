import { Component, computed, inject } from '@angular/core';
import { PortfolioContent } from '../core/portfolio-content';

@Component({
  selector: 'app-site-footer',
  host: { role: 'contentinfo' },
  template: `
    <div class="container bar">
      <p>© {{ year }} {{ name() }}</p>
      <p>Built with Angular &amp; NestJS</p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      margin-top: 6rem;
      border-top: 1px solid var(--border);
      background: linear-gradient(to bottom, transparent, var(--surface));
    }

    .bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 0.5rem 2rem;
      padding-block: 2rem;
      font-size: 0.875rem;
      color: var(--muted);
    }
  `,
})
export class SiteFooter {
  private readonly content = inject(PortfolioContent);
  protected readonly year = new Date().getFullYear();
  protected readonly name = computed(() => this.content.profile()?.name ?? 'Portfolio');
}
