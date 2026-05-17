import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const chefGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('chefpro_token');
  const userStr = localStorage.getItem('chefpro_user');

  if (!token || !userStr) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role_id === 1) {
      return true;
    }
  } catch {
    // Invalid JSON in localStorage
  }

  router.navigate(['/']);
  return false;
};
