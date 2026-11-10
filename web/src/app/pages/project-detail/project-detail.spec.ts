import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Project } from '../../core/models';
import { ProjectDetail } from './project-detail';

const project: Project = {
  slug: 'project-01',
  title: 'Project One',
  summary: 'A summary.',
  description: ['First paragraph.'],
  year: 2026,
  role: 'Developer',
  tags: [],
  links: [{ label: 'Live site', url: 'https://example.com' }],
  status: 'live',
};

describe('ProjectDetail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  function setup(slug: string) {
    const fixture = TestBed.createComponent(ProjectDetail);
    fixture.componentRef.setInput('slug', slug);
    TestBed.tick();
    const request = TestBed.inject(HttpTestingController).expectOne(`/api/projects/${slug}`);
    return { fixture, request, el: fixture.nativeElement as HTMLElement };
  }

  it('renders the project', async () => {
    const { fixture, request, el } = setup('project-01');
    request.flush(project);
    await fixture.whenStable();

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Project One');
    expect(el.querySelector('a[target="_blank"]')?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('shows "not found" for an unknown slug', async () => {
    const { fixture, request, el } = setup('nope');
    request.flush({ error: 'Project not found' }, { status: 404, statusText: 'Not Found' });
    await fixture.whenStable();

    expect(el.querySelector('h1')?.textContent?.trim()).toBe('Project not found');
  });

  it('shows a retryable error when the API fails', async () => {
    const { fixture, request, el } = setup('project-01');
    request.flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    expect(el.querySelector('[role="alert"] h1')?.textContent?.trim()).toBe(
      "Couldn't load this project",
    );
    expect(el.querySelector('[role="alert"] button')?.textContent?.trim()).toBe('Try again');
  });
});
