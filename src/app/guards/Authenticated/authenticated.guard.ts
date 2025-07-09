import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services';
import { inject } from '@angular/core';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()) {
    const role = authService.getUser().role;

    if(role === 'ROLE_ADMIN')
      return router.navigate(['/admin']);
    else if(role === 'ROLE_CUSTOMER')
      return router.navigate(['/home']);
    else if(role === 'ROLE_EMPLOYEE')
      return router.navigate(['/employee']);
  }

  authService.logout()
  return true;
};
