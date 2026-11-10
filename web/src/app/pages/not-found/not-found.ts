import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <p class="eyebrow">404</p>
    <h1>Page not found</h1>
    <p class="muted">The page you're looking for doesn't exist.</p>
    <a class="button" routerLink="/">Back home</a>
  `,
  styles: `
    :host {
      display: block;
      padding-top: 6rem;
    }

    h1 {
      margin-top: 0.75rem;
      font-size: clamp(2.25rem, 6vw, 3.5rem);
    }

    p.muted {
      margin-block: 1rem 2rem;
    }
  `,
})
export class NotFound {}
