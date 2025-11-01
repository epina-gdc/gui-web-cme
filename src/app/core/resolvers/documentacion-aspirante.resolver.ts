import {ResolveFn} from '@angular/router';
import {inject} from '@angular/core';
import {VerificacionDocsService} from '@services/verificacion-docs.service';

export const documentacionAspiranteResolver: ResolveFn<any> = (route, state) => {
  const idUsuario: number = route.paramMap.get('id') as unknown as number;
  const verificacionDocsService: VerificacionDocsService = inject(VerificacionDocsService)

  return verificacionDocsService.consultarPerfilDetalle(idUsuario);
};
