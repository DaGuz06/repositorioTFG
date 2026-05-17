import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('chefpro_token');
  const userStr = localStorage.getItem('chefpro_user');

  if (!token || !userStr) {
    router.navigate(['/loginAdmin']);
    return false;
  }

  try {
    const user = JSON.parse(userStr);
    if (user.role_id === 3) {
      return true;
    }
  } catch {
    // Invalid JSON in localStorage
  }

  router.navigate(['/']);
  return false;
};
