import {CanActivateFn, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '@services/auth.service';

export const medicoGuard: CanActivateFn = (route, state) => {
  return checkMedicalProfile(state);
};

const checkMedicalProfile = (state: RouterStateSnapshot): Observable<boolean> => {
  const router = inject(Router);
  const authService: AuthService = inject(AuthService);
  const idPerfil = authService.usuarioSesion?.idPerfil as number;
  if ([1,2,3].includes(idPerfil)) {
    return of(true)
  }
  void router.navigate(['/privado/verificacion-documentos']);
  return of(false);
};
