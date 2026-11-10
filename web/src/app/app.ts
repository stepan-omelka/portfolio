import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, skip } from 'rxjs';
import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');
  private readonly scroller = inject(ViewportScroller);

  constructor() {
    const router = inject(Router);

    // After in-app navigation, move focus to the new content so keyboard and screen-reader
    // users start there. Section links (/#work, ...) are left to the router's anchor scrolling.
    router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        skip(1), // initial page load
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        if (!router.parseUrl(event.urlAfterRedirects).fragment) {
          this.main().nativeElement.focus({ preventScroll: true });
        }
      });
  }

  protected skipToMain(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus({ preventScroll: true });
    // Scroll with the sticky header's offset (set in SiteHeader); a plain focus() would
    // put the start of the content underneath the header.
    this.scroller.scrollToAnchor('main');
  }
}
