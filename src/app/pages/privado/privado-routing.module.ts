import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioComponent} from '@privado/inicio/inicio.component';
import {PrivadoComponent} from '@pages/privado/privado.component';
import {inicioResolver} from '../../core/resolvers/inicio.resolver';
import {VerificacionDocumentosComponent} from './pages/verificacion-documentos/verificacion-documentos.component';
import { DocumentacionComponent } from './pages/verificacion-documentos/components/documentacion/documentacion.component';

const routes: Routes = [{
  path: '',
  component: PrivadoComponent,
  children: [
    {
      path: '',
      redirectTo: 'inicio',
      pathMatch: 'full',
    },
    {
      path: 'inicio',
      component: InicioComponent,
      resolve: {
        respuesta: inicioResolver
      }
    },
    {
      path: 'verificacion-documentos',
      component: VerificacionDocumentosComponent,
    },
    {
      path: 'documentacion-aspirante',
      component: DocumentacionComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivadoRoutingModule {
}
