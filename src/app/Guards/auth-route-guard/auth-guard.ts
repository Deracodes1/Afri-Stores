import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = inject(AuthService).isLoggedIn;
  if (isLoggedIn()) {
    return true;
  }
  return router.navigate(['/signin']);
};
