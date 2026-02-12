import { AuthService } from './../../services/auth';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const Authservice = inject(AuthService);
  const isloggedIn = Authservice.isLoggedIn;
  if (isloggedIn) {
    return true;
  }
  return router.navigate(['/signin']);
};
