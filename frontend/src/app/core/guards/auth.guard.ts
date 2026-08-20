import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (user?.mustChangePassword && state.url !== '/change-password') {
      return router.createUrlTree(['/change-password']);
    }
    return true;
  }

  return router.createUrlTree(['/login']);
};
