import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('shows the profile name from the API in the header', async () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();

    http.expectOne('/api/profile').flush({
      name: 'Test Person',
      role: 'Developer',
      location: 'Brno',
      intro: '',
      about: [],
      email: 'test@example.com',
      links: [],
    });
    http.expectOne('/api/projects').flush([]);
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.brand')?.textContent?.trim()).toBe('Test Person');
    expect(el.querySelector('.skip-link')).not.toBeNull();
  });

  it('falls back to a generic name when the API fails', async () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    TestBed.tick();

    http.expectOne('/api/profile').flush(null, { status: 500, statusText: 'Server Error' });
    http.expectOne('/api/projects').flush(null, { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.brand')?.textContent?.trim()).toBe('Portfolio');
  });
});
