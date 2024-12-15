import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserType } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const userType = authService.getTypeUserLogged();

  if (userType === UserType.ADMIN) {
    return true;
  } else {
    router.navigate(['/']); // Redirigir al usuario a una ruta segura
    return false;
  }
};