import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { inject } from '@angular/core';
export const userAccountRoutesGuard: CanActivateFn = (route, state) => {
  const isUserLoggedIn = inject(AuthService).isLoggedIn;
  const router = inject(Router);
  if (!isUserLoggedIn) {
    return router.navigate(['/signin']);
  }
  return true;
};
