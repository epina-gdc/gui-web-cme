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
  AsistenciaExtraordinariaComponent
} from './pages/asignacion-plazas/components/asistencia-extraordinaria/asistencia-extraordinaria.component';
import { VisualizacionAsistenciaComponent } from '@privado/visualizacion-asistencia/visualizacion-asistencia.component';
import {
  TableroInformacionAsistenciaComponent
} from '@privado/tablero-informacion-asistencia/tablero-informacion-asistencia.component';
import { AsignacionMesaComponent } from './pages/asignacion-mesa/asignacion-mesa/asignacion-mesa.component';
import { PropuestaSindicalComponent } from '@privado/propuesta-sindical/propuesta-sindical.component';
import { CargaCalificacionesComponent } from '@privado/carga-calificaciones/carga-calificaciones.component';
import { GestionConvocatoriasComponent } from '@privado/gestion-convocatorias/gestion-convocatorias.component';
import { NotFoundComponent } from '@privado/not-found/not-found.component';
import { ErrorConfiguracionComponent } from '@privado/error-configuracion/error-configuracion.component';
import { InicioModulosComponent } from '@privado/inicio-modulos/inicio-modulos.component';
import { CargaCalificacionesResolver } from '../../core/resolvers/carga-calificaciones.resolver';
import { tableroInformacionResolver } from '../../core/resolvers/tablero-informacion.resolver';
import { MonitoreoAsignacionesComponent } from './pages/monitoreo-asignaciones/monitoreo-asignaciones.component';
import { GestionPlazaComponent } from './pages/gestion-plazas/components/gestion-plaza/gestion-plaza.component';
import { NuevaPlazaComponent } from './pages/gestion-plazas/components/nueva-plaza/nueva-plaza.component';
import { CargaPlazaComponent } from './pages/gestion-plazas/components/carga-plaza/carga-plaza.component';
import { nuevaPlazaResolver } from '../../core/resolvers/nueva-plaza.resolver';
import { ReportePlazasComponent } from './pages/gestion-plazas/components/reporte-plazas/reporte-plazas.component';

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
      resolve: {
        respuesta: CargaCalificacionesResolver
      }
    },
    {
      path: NAV.cargaPlaza,
      component: CargaPlazaComponent,
    },
    {
      path: NAV.asistenciaExtraordinaria,
      component: AsistenciaExtraordinariaComponent,
    },
    {
      path: NAV.visualizacionAsistencia,
      component: VisualizacionAsistenciaComponent,
    },
    {
      path: NAV.tableroInformacionAsistencia,
      component: TableroInformacionAsistenciaComponent,
      resolve: {
        catalogos: tableroInformacionResolver
      }
    },
    {
      path: NAV.asignacionMesa,
      component: AsignacionMesaComponent,
    },
    {
      path: NAV.propuestaSindical,
      component: PropuestaSindicalComponent,
    },
    {
      path: NAV.gestionConvocatoria,
      component: GestionConvocatoriasComponent,
    },
    //Se agrega nueva ruta
    {
      path: NAV.gestionPlazas,
      component: GestionPlazaComponent,
    },
    {
      path: NAV.nuevaPlaza,
      component: GestionPlazaComponent,
    },
    {
      path: NAV.generarNuevaPlaza,
      component: NuevaPlazaComponent,
      resolve: {
        catalogos: nuevaPlazaResolver,
      }
    },
    {
      path: NAV.reportePlaza,
      component: ReportePlazasComponent,
    },
    {
      path: NAV.monitoreoAsignaciones,
      component: MonitoreoAsignacionesComponent
    },
    {
      path: NAV.errorConfig,
      component: ErrorConfiguracionComponent,
    },
    {
      path: NAV.homeModulos,
      component: InicioModulosComponent,
    },
    { path: '**', component: NotFoundComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivadoRoutingModule {
}
