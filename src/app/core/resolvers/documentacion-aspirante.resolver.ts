import { ResolveFn } from '@angular/router';

export const documentacionAspiranteResolver: ResolveFn<any> = (route, state) => {
  const idUsuario: number = route.paramMap.get('id') as unknown as number;

  return true;
};
