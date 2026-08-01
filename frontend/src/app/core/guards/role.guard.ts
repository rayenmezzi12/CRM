import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRoles = route.data['expectedRoles'] as string[];
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  if (expectedRoles && expectedRoles.includes(currentUser.role)) {
    return true;
  }

  // Si l'utilisateur n'a pas le bon rôle, rediriger vers une page non autorisée ou la racine
  return router.createUrlTree(['/']);
};
