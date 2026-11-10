import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Project } from '../core/models';
import { ProjectCard } from './project-card';

const project: Project = {
  slug: 'project-01',
  title: 'Project One',
  summary: 'A summary.',
  description: [],
  year: null,
  role: 'Developer',
  tags: ['Angular', 'Angular'],
  links: [],
  status: 'placeholder',
};

describe('ProjectCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  function render(overrides: Partial<Project> = {}) {
    const fixture = TestBed.createComponent(ProjectCard);
    fixture.componentRef.setInput('project', { ...project, ...overrides });
    fixture.componentRef.setInput('index', 0);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a placeholder slot', () => {
    const el = render();

    expect(el.classList).toContain('placeholder');
    expect(el.textContent).toContain('01');
    expect(el.textContent).toContain('Coming soon');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('/projects/project-01');
    expect(el.querySelectorAll('.tags li').length).toBe(2);
  });

  it('renders a live project without the placeholder style', () => {
    const el = render({ status: 'live' });

    expect(el.classList).not.toContain('placeholder');
    expect(el.textContent).toContain('Live');
  });
});
