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

  constructor(private fb: FormBuilder, private convocatoriaEstado: ConvocatoriaEstadoService) { 
    effect(() => {
      this.convocatoriaEstado.refreshTick();
      this.consultarConvocatorias();
      //this.convocatoriaSeleccionada.update(v => v ? { ...v } : v);
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
          this.configuracionMesasTabla.update(v => response.respuesta.content);
          this.totalElementos = response.respuesta.page.totalElements;
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
            console.log('Configuración guardada exitosamente:', response);
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
    this.convocatoriaSeleccionada.set(convocatoria);

  }


  onEditar(convocatoria: MesaConfiguracion) {

    this.convocatoriaSeleccionadaEdicion.update(v => convocatoria);

    this.formularioEdicion = this.fb.group({
      idConvocatoria: convocatoria.idConvocatoria,
      numMesasDisponibles: convocatoria.numMesasDisponibles,
      numMedicosPorMesa: convocatoria.numMedicosPorMesa,
    });

    this.formularioEdicion.get('idConvocatoria')?.disable();

    this.visible = true;
  }

  applyPartialUpdate<T>(obj: T, updates: Partial<T>): T {
    return { ...obj, ...updates };
  }

  guardarConfiguracionUpdate(convocatoria: any) {
    const updatedConfigMesa = this.applyPartialUpdate(this.convocatoriaSeleccionadaEdicion(), convocatoria);
    console.log('updatedConfigMesa:', updatedConfigMesa);
  }

  consultaEstatusCalificacion(idConvocatoria: number): Observable<boolean> {
    const tipoConvocatoria = this.convocatorias.find(x => x.idConvocatoria === idConvocatoria)?.tipo.idTipoConvocatoria;
    console.log(tipoConvocatoria);
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



}
