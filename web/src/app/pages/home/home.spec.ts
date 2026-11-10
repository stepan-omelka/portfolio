import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Profile } from '../../core/models';
import { Home } from './home';

const profile: Profile = {
  name: 'Test Person',
  role: 'Developer',
  location: 'Brno',
  intro: '',
  about: [],
  skills: [],
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
