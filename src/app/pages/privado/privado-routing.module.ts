import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '@privado/inicio/inicio.component';
import { PrivadoComponent } from '@pages/privado/privado.component';
import { inicioResolver } from '../../core/resolvers/inicio.resolver';
import { ofertaLaboralResolver } from '../../core/resolvers/oferta-laboral.resolver';
import { VerificacionDocumentosComponent } from './pages/verificacion-documentos/verificacion-documentos.component';
import { DocumentacionComponent } from './pages/verificacion-documentos/components/documentacion/documentacion.component';
import { NAV } from '@utils/url-global';
import { medicoGuard } from '@guards/medico.guard';
import { validadorGuard } from '@guards/validador.guard';
import { documentacionAspiranteResolver } from '../../core/resolvers/documentacion-aspirante.resolver';
import { verficacionDocsResolver } from '../../core/resolvers/verificacion-docs.resolver';
import { OfertaLaboralComponent } from './pages/oferta-laboral/oferta-laboral.component';
import { AsignacionPlazasComponent } from '@privado/asignacion-plazas/asignacion-plazas.component';
import {
  CargaCalificacionesComponent
} from '@privado/asignacion-plazas/components/carga-calificaciones/carga-calificaciones.component';
<<<<<<< HEAD
import {
  AsistenciaExtraordinariaComponent
} from './pages/asignacion-plazas/components/asistencia-extraordinaria/asistencia-extraordinaria.component';
=======
import {VisualizacionAsistenciaComponent} from '@privado/visualizacion-asistencia/visualizacion-asistencia.component';
import {
  TableroInformacionAsistenciaComponent
} from '@privado/tablero-informacion-asistencia/tablero-informacion-asistencia.component';
import {PropuestaSindicalComponent} from '@privado/propuesta-sindical/propuesta-sindical.component';
>>>>>>> dev-modulo-5

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
        respuesta: inicioResolver,
        respuesta_oferta: ofertaLaboralResolver,
      },
      canActivate: [medicoGuard]
    },
    {
      path: NAV.verificacionDocumentos,
      component: VerificacionDocumentosComponent,
      canActivate: [validadorGuard],
      resolve: {
        respuesta: verficacionDocsResolver
      }
    },
    {
      path: NAV.documentacionAspirante,
      component: DocumentacionComponent,
      resolve: {
        respuesta: documentacionAspiranteResolver,
      }
    },
    {
      path: NAV.ofertaLaboral,
      component: OfertaLaboralComponent,
      resolve: {
        respuesta_oferta: ofertaLaboralResolver
      }
    },
    {
      path: NAV.asignacion,
      component: AsignacionPlazasComponent,
    },
    {
      path: NAV.cargaCalificaciones,
      component: CargaCalificacionesComponent,
    },
    {
<<<<<<< HEAD
      path: NAV.asistenciaExtraordinaria,
      component: AsistenciaExtraordinariaComponent,
    }
=======
      path: NAV.visualizacionAsistencia,
      component: VisualizacionAsistenciaComponent,
    },
    {
      path: NAV.tableroInformacionAsistencia,
      component: TableroInformacionAsistenciaComponent,
    },
    {
      path: NAV.propuestaSindical,
      component: PropuestaSindicalComponent,
    },
>>>>>>> dev-modulo-5
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivadoRoutingModule {
}
