import { InjectionToken } from '@angular/core';

/**
 * Base URL of the NestJS content API. In development `/api` is proxied to the
 * NestJS dev server (see `proxy.conf.json`). Override it in `app.config.ts`
 * if the API is deployed on a different origin.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  factory: () => '/api',
});
