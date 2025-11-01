import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioComponent} from '@privado/inicio/inicio.component';
import {PrivadoComponent} from '@pages/privado/privado.component';
import {inicioResolver} from '../../core/resolvers/inicio.resolver';
import {VerificacionDocumentosComponent} from './pages/verificacion-documentos/verificacion-documentos.component';
import {DocumentacionComponent} from './pages/verificacion-documentos/components/documentacion/documentacion.component';
import {NAV} from '@utils/url-global';
import {medicoGuard} from '@guards/medico.guard';
import {validadorGuard} from '@guards/validador.guard';

const routes: Routes = [{
  path: '',
  component: PrivadoComponent,
  children: [
    {
      path: '',
      redirectTo: NAV.home,
      pathMatch: 'full',
    },
    {
      path: NAV.home,
      component: InicioComponent,
      resolve: {
        respuesta: inicioResolver
      },
      canActivate: [medicoGuard]
    },
    {
      path: NAV.verificacionDocumentos,
      component: VerificacionDocumentosComponent,
      canActivate: [validadorGuard]
    },
    {
      path: NAV.documentacionAspirante,
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
