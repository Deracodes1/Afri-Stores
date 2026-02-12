import { ApplicationConfig } from '@angular/core';
import { authInterceptor } from './interceptos/auth-interceptor';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withInterceptors([authInterceptor])), provideRouter(routes)],
};
