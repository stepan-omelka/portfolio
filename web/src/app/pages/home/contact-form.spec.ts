import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactForm } from './contact-form';

describe('ContactForm', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function setup() {
    const fixture = TestBed.createComponent(ContactForm);
    fixture.componentRef.setInput('fallbackEmail', 'me@example.com');
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    const type = (selector: string, value: string) => {
      const field = el.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)!;
      field.value = value;
      field.dispatchEvent(new Event('input'));
    };
    const fillValid = () => {
      type('#contact-name', 'Jana');
      type('#contact-email', 'jana@example.com');
      type('#contact-message', 'Hello!');
    };
    const submit = async () => {
      el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
      TestBed.tick();
      await fixture.whenStable();
    };
    // The response is handled one microtask after `flush`, so wait a macrotask before checking.
    const settle = async () => {
      await new Promise((resolve) => setTimeout(resolve));
      await fixture.whenStable();
    };
    return { el, type, fillValid, submit, settle };
  }

  it('shows what to fix and sends nothing when the form is empty', async () => {
    const { el, submit } = await setup();

    await submit();

    http.expectNone('/api/contact');
    expect(el.querySelector('#contact-name-error')?.textContent?.trim()).toBe(
      'Please enter your name.',
    );
    expect(el.querySelector('#contact-email-error')).not.toBeNull();
    expect(el.querySelector('#contact-message-error')).not.toBeNull();
    expect(el.querySelector('#contact-name')?.getAttribute('aria-invalid')).toBe('true');
    expect(document.activeElement?.id).toBe('contact-name');
  });

  it('flags an invalid email address', async () => {
    const { el, type, fillValid, submit } = await setup();
    fillValid();
    type('#contact-email', 'not-an-email');

    await submit();

    http.expectNone('/api/contact');
    expect(el.querySelector('#contact-email-error')?.textContent?.trim()).toBe(
      'Please enter a valid email address.',
    );
  });

  it('posts the message and confirms where the reply goes', async () => {
    const { el, fillValid, submit, settle } = await setup();
    fillValid();

    await submit();
    const request = http.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      name: 'Jana',
      email: 'jana@example.com',
      message: 'Hello!',
      website: '',
    });
    request.flush({ ok: true });
    await settle();

    expect(el.querySelector('[role="status"]')?.textContent).toContain(
      "I'll reply to jana@example.com.",
    );
    expect(el.querySelector('form')).toBeNull();
  });

  it('offers the email address when sending fails', async () => {
    const { el, fillValid, submit, settle } = await setup();
    fillValid();

    await submit();
    http
      .expectOne('/api/contact')
      .flush({ error: 'send-failed' }, { status: 502, statusText: 'Bad Gateway' });
    await settle();

    const alert = el.querySelector('[role="alert"]');
    expect(alert?.textContent).toContain("Sorry, the message couldn't be sent.");
    expect(alert?.querySelector('a')?.getAttribute('href')).toBe('mailto:me@example.com');
  });

  it('asks to check the fields when the API rejects the message', async () => {
    const { el, fillValid, submit, settle } = await setup();
    fillValid();

    await submit();
    http
      .expectOne('/api/contact')
      .flush({ error: 'invalid' }, { status: 400, statusText: 'Bad Request' });
    await settle();

    expect(el.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'Please check the fields and try again.',
    );
  });
});
