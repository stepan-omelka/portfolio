import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { email, form, FormField, FormRoot, maxLength, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../core/api-base-url';
import { ContactError, ContactRequest } from '../../core/models';

type Status =
  { kind: 'idle' } | { kind: 'sent'; replyTo: string } | { kind: 'error'; error: ContactError };

const EMPTY: ContactRequest = { name: '', email: '', message: '', website: '' };

@Component({
  selector: 'app-contact-form',
  imports: [FormField, FormRoot],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  /** Offered as an alternative when sending fails. */
  readonly fallbackEmail = input.required<string>();

  private readonly http = inject(HttpClient);
  private readonly apiBase = inject(API_BASE_URL);
  private readonly injector = inject(Injector);
  private readonly sentMessage = viewChild<ElementRef<HTMLElement>>('sent');

  protected readonly status = signal<Status>({ kind: 'idle' });
  private readonly model = signal<ContactRequest>({ ...EMPTY });

  // Limits match the API's validation (api/src/lib/contact.ts).
  protected readonly contactForm = form(
    this.model,
    (path) => {
      required(path.name, { message: 'Please enter your name.' });
      maxLength(path.name, 200, { message: 'Please keep your name under 200 characters.' });
      required(path.email, { message: 'Please enter your email.' });
      email(path.email, { message: 'Please enter a valid email address.' });
      maxLength(path.email, 320, { message: 'Please keep the email under 320 characters.' });
      required(path.message, { message: 'Please write a message.' });
      maxLength(path.message, 5000, { message: 'Please keep the message under 5,000 characters.' });
    },
    {
      submission: {
        action: async () => {
          await this.send();
          return undefined;
        },
        // Move focus to the first field that needs fixing.
        onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      },
    },
  );

  private async send(): Promise<void> {
    const request = this.model();
    this.status.set({ kind: 'idle' });
    try {
      await firstValueFrom(this.http.post(`${this.apiBase}/contact`, request));
      this.status.set({ kind: 'sent', replyTo: request.email.trim() });
      this.model.set({ ...EMPTY });
      this.contactForm().reset();
      afterNextRender(() => this.sentMessage()?.nativeElement.focus(), { injector: this.injector });
    } catch (error) {
      const code = error instanceof HttpErrorResponse ? error.error?.error : undefined;
      this.status.set({ kind: 'error', error: code === 'invalid' ? 'invalid' : 'send-failed' });
    }
  }

  protected sendAnother(): void {
    this.status.set({ kind: 'idle' });
  }
}
