import { ViewportScroller } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  effect,
  inject,
  Injector,
  isDevMode,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PortfolioContent } from '../../core/portfolio-content';
import { ProjectCard } from '../../shared/project-card';
import { ContactForm } from './contact-form';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProjectCard, ContactForm],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  protected readonly content = inject(PortfolioContent);
  protected readonly profile = this.content.profile;
  protected readonly projects = this.content.projects;
  protected readonly isDev = isDevMode();
  /** `tel:` links take the number without spaces. */
  protected readonly phoneHref = computed(() => {
    const phone = this.profile()?.phone;
    return phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : null;
  });

  constructor() {
    // On a fresh load of e.g. /#about the router scrolls before the content has arrived,
    // and the section moves down once it renders. Re-apply the anchor when content settles.
    const fragment = inject(ActivatedRoute).snapshot.fragment;
    if (!fragment) return;

    const scroller = inject(ViewportScroller);
    const injector = inject(Injector);
    const ref = effect(() => {
      if (this.content.isLoading()) return;
      ref.destroy();
      afterNextRender(() => scroller.scrollToAnchor(fragment), { injector });
    });
  }
}
