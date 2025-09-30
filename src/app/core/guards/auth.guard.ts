import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { Observable, map } from 'rxjs';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.existeUnaSesion$.
  pipe(map(existeUnaSesion =>  existeUnaSesion ? true : router.parseUrl('/inicio-sesion')));
};
