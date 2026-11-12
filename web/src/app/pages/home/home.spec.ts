import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ClientProject, Profile } from '../../core/models';
import { Home } from './home';

const profile: Profile = {
  name: 'Test Person',
  role: 'Developer',
  location: 'Brno',
  intro: '',
  about: [],
  skills: [],
  clientWork: [],
  email: 'test@example.com',
  phone: '+420 123 456 789',
  links: [],
};

describe('Home contact section', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  async function render(p: Profile) {
    const fixture = TestBed.createComponent(Home);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();
    http.expectOne('/api/profile').flush(p);
    http.expectOne('/api/projects').flush([]);
    await fixture.whenStable();
    return fixture.nativeElement.querySelector('#contact') as HTMLElement;
  }

  it('links the email and the phone number', async () => {
    const contact = await render(profile);

    expect(contact.querySelector('a.email')?.getAttribute('href')).toBe('mailto:test@example.com');
    const phone = contact.querySelector('a.phone');
    expect(phone?.textContent?.trim()).toBe('+420 123 456 789');
    expect(phone?.getAttribute('href')).toBe('tel:+420123456789');
  });

  it('hides the phone when there is none', async () => {
    const contact = await render({ ...profile, phone: null });

    expect(contact.querySelector('a.phone')).toBeNull();
  });
});

describe('Home professional work section', () => {
  const forecastEditor: ClientProject = {
    title: 'Weather forecast editor',
    period: '2026',
    role: 'Frontend, some backend',
    summary: 'A web app where meteorologists fill in forecasts.',
    contribution: 'Set up the SvelteKit frontend.',
    tags: ['SvelteKit', 'GraphQL'],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  async function render(p: Profile) {
    const fixture = TestBed.createComponent(Home);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();
    http.expectOne('/api/profile').flush(p);
    http.expectOne('/api/projects').flush([]);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('lists each client project with its title, period, role and tags', async () => {
    const page = await render({ ...profile, clientWork: [forecastEditor] });

    const section = page.querySelector('[aria-labelledby="professional-title"]');
    expect(section?.querySelector('h2')?.textContent).toBe('Professional work');
    const item = section?.querySelector('li.client-project');
    expect(item?.querySelector('h3')?.textContent).toBe('Weather forecast editor');
    expect(item?.textContent).toContain('2026');
    expect(item?.textContent).toContain('Frontend, some backend');
    expect([...(item?.querySelectorAll('.tags li') ?? [])].map((li) => li.textContent)).toEqual([
      'SvelteKit',
      'GraphQL',
    ]);
  });

  it('hides the section when there is no client work', async () => {
    const page = await render(profile);

    expect(page.querySelector('[aria-labelledby="professional-title"]')).toBeNull();
    expect(page.querySelector('#work #projects')).not.toBeNull();
  });
});
