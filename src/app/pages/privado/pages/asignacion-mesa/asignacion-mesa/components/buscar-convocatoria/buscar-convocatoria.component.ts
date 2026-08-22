import { ChangeDetectionStrategy, Component, effect, inject, model, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CardModule } from "primeng/card";
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import {
  AsignacionMesaService,
  Convocatoria,
  MesaConfiguracion,
  MesaConvocatoriaRequest,
  ResponseConfiguracionMesas,
  ResponseConvocatorias
} from '../../services/asignacion-mesa.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { Mensajes } from '@utils/mensajes';
import { AlertService } from '@services/alert.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {CargaCalificacionesService} from '@services/carga-calificaciones.service';
import { catchError, map, Observable, of, switchMap, take } from 'rxjs';
import { ConvocatoriaEstadoService } from '../../services/convocatoria-estado.service';

@Component({
  selector: 'app-buscar-convocatoria',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    TableModule,
    MenuModule,
    ButtonModule,
    CardModule,
    PaginatorModule,
    TagModule,
    PopoverModule,
    InputNumberModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './buscar-convocatoria.component.html',
  styleUrl: './buscar-convocatoria.component.scss'
})
export class BuscarConvocatoriaComponent implements OnInit {
  private readonly ESTATUS_PENDIENTE = 'PENDIENTE';

  cargaCalificacionService: CargaCalificacionesService = inject(CargaCalificacionesService);
  asignacionMesaService = inject(AsignacionMesaService);
  mensajes = inject(Mensajes);
  alertaService = inject(AlertService)

  formulario!: FormGroup;
  formularioEdicion!: FormGroup;

  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;

  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  convocatoriaSeleccionadaEdicion = model<MesaConfiguracion | undefined>(undefined);

  activeTab: WritableSignal<number> = signal(0);

  // Datos para los select
  convocatorias: Convocatoria[] = [];

  configuracionMesasTabla = model<MesaConfiguracion[]>([]);

  visible: boolean = false;
  actualizandoEdicion: boolean = false;

  constructor(private fb: FormBuilder, private convocatoriaEstado: ConvocatoriaEstadoService) { 
    effect(() => {
      this.convocatoriaEstado.refreshTick();
      this.consultarConvocatorias();
    });
  }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      idConvocatoria: [undefined, Validators.required],
      numMesasDisponibles: [undefined, [Validators.required, Validators.min(1)]],
      numMedicosPorMesa: [undefined, [Validators.required, Validators.min(1)]]
    });

    this.formularioEdicion = this.fb.group({
      idConvocatoria: [undefined, Validators.required],
      numMesasDisponibles: [undefined, [Validators.required, Validators.min(1)]],
      numMedicosPorMesa: [undefined, [Validators.required, Validators.min(1)]]
    });

    this.loadConvocatorias();
    this.consultarConvocatorias();
  }

  loadConvocatorias(): void {
    this.asignacionMesaService.getLstConvocatorias().subscribe({
      next: (response: ResponseConvocatorias) => {
        if (response.exito) {
          this.convocatorias = response.respuesta;
          this.configuracionMesasTabla.update(configuraciones =>
            configuraciones.map(configuracion => this.agregarTipoConvocatoria(configuracion))
          );

          const seleccionActual = this.convocatoriaSeleccionada();
          if (seleccionActual) {
            this.convocatoriaSeleccionada.set(this.agregarTipoConvocatoria(seleccionActual));
          }

        }
      },
      error: (err) => {
        console.error('Error al cargar convocatorias:', err);
      }
    });
  }

  consultarConvocatorias() {
    this.asignacionMesaService.getLstConfiguracionMesas(this.numPaginaActual, this.rows).subscribe({
      next: (response: ResponseConfiguracionMesas) => {
        if (response.exito) {
          this.configuracionMesasTabla.update(v => response.respuesta.content.map(
            configuracion => this.agregarTipoConvocatoria(configuracion)
          ));
          this.totalElementos = response.respuesta.page.totalElements;

          const seleccionActual = this.convocatoriaSeleccionada();
          if (seleccionActual) {
            const nuevaReferencia = this.configuracionMesasTabla().find(
              x => x.idMesaConvocatoria === seleccionActual.idMesaConvocatoria
            );
            if (nuevaReferencia) {
              this.convocatoriaSeleccionada.set({
                ...nuevaReferencia,
                idTipoConvocatoria: nuevaReferencia.idTipoConvocatoria ?? seleccionActual.idTipoConvocatoria
              });
            }
          }
        }
      },
      error: (err) => {
        console.error('Error al consultar configuración de mesas:', err);
      }
    });
  }

  /*guardarConfiguracion(): void {
    if (this.formulario.valid) {
      const formData = this.formulario.value as MesaConvocatoriaRequest;

      if(!this.consultaEstatusCalificacion(formData.idConvocatoria)){
        this.alertaService.alerta("No se ha concluido el proceso de carga de calificaciones.");
        return
      }

      this.asignacionMesaService.guardarMesaConvocatoria(formData).subscribe({
        next: (response) => {

          if (response.exito) {

            console.log('Configuración guardada exitosamente:', response);
            this.consultarConvocatorias();
            this.formulario.reset();
            this.alertaService.exito(this.mensajes.MSG083);
          }
          if (!response.exito) {
            this.alertaService.error(response.mensaje);
          }
        },
        error: (err) => {
          console.error('Error al guardar configuración:', err);
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }*/

  guardarConfiguracion(): void {
    if (this.formulario.valid) {
      const formData = this.formulario.value as MesaConvocatoriaRequest;
      this.consultaEstatusCalificacion(formData.idConvocatoria).pipe(
        take(1),
        switchMap(esValido => {
          if (!esValido) {
            this.alertaService.alerta("No se ha concluido el proceso de carga de calificaciones.");
            return of(null);
          }
          return this.asignacionMesaService.guardarMesaConvocatoria(formData);
        })
      ).subscribe(response => {
        if(response !== null) {
          if (response.exito) {
            //console.log('Configuración guardada exitosamente:', response);
            this.consultarConvocatorias();
            this.formulario.reset();
            this.alertaService.exito(this.mensajes.MSG083);
          }
          if (!response.exito) {
            this.alertaService.error(response.mensaje);
          }
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }

  cambiarPagina(event: PaginatorState): void {
    if (event.page !== undefined) {
      this.numPaginaActual = event.page;
    }
    if (this.activeTab() === 0) {
      this.consultarConvocatorias();
    }
  }

  onSeleccion(convocatoria: MesaConfiguracion) {
    this.convocatoriaSeleccionada.set(this.agregarTipoConvocatoria(convocatoria));

  }


  puedeEditar(convocatoria: MesaConfiguracion): boolean {
    return convocatoria.estatus?.trim().toUpperCase() === this.ESTATUS_PENDIENTE;
  }

  onEditar(convocatoria: MesaConfiguracion) {
    if (!this.puedeEditar(convocatoria)) {
      this.alertaService.alerta('Solo se puede editar una configuración en estatus PENDIENTE.');
      return;
    }

    this.convocatoriaSeleccionadaEdicion.update(v => convocatoria);

    this.formularioEdicion = this.fb.group({
      idConvocatoria: convocatoria.idConvocatoria,
      numMesasDisponibles: convocatoria.numMesasDisponibles,
      numMedicosPorMesa: convocatoria.numMedicosPorMesa,
    });

    this.formularioEdicion.get('idConvocatoria')?.disable();

    this.visible = true;
  }

  guardarConfiguracionUpdate() {
    const configuracion = this.convocatoriaSeleccionadaEdicion();
    if (!configuracion || !this.puedeEditar(configuracion)) {
      this.alertaService.alerta('Solo se puede editar una configuración en estatus PENDIENTE.');
      return;
    }

    this.formularioEdicion.markAllAsTouched();
    this.formularioEdicion.updateValueAndValidity();
    if (this.formularioEdicion.invalid) {
      return;
    }

    const formData = this.formularioEdicion.getRawValue() as MesaConvocatoriaRequest;
    this.actualizandoEdicion = true;

    this.asignacionMesaService.actualizarMesaConvocatoria(configuracion.idMesaConvocatoria, formData).subscribe({
      next: (response) => {
        if (response.exito) {
          this.visible = false;
          this.consultarConvocatorias();
          this.alertaService.exito(response.mensaje || this.mensajes.MSG083);
          return;
        }

        this.alertaService.error(response.mensaje);
      },
      error: (error) => {
        const msg = error?.error?.mensaje || error?.message || 'Error al actualizar la configuración.';
        this.alertaService.error(msg);
        this.actualizandoEdicion = false;
      },
      complete: () => {
        this.actualizandoEdicion = false;
      }
    });
  }
  consultaEstatusCalificacion(idConvocatoria: number): Observable<boolean> {
    const tipoConvocatoria = this.convocatorias.find(x => x.idConvocatoria === idConvocatoria)?.tipo.idTipoConvocatoria;
    //console.log(tipoConvocatoria);
    if(tipoConvocatoria === 1) {
      return this.cargaCalificacionService
        .consultaCargaCalificaciones(idConvocatoria)
        .pipe(
          map(response => response.respuesta.idEstatusCarga === 2),
          catchError(() => of(false))
      );
    } else {
      return of(true);
    }
  }

  private agregarTipoConvocatoria(configuracion: MesaConfiguracion): MesaConfiguracion {
    const idTipoConvocatoria = this.convocatorias.find(
      convocatoria => convocatoria.idConvocatoria === configuracion.idConvocatoria
    )?.tipo.idTipoConvocatoria;

    return {
      ...configuracion,
      idTipoConvocatoria: idTipoConvocatoria ?? configuracion.idTipoConvocatoria
    };
  }



}
