import { Component, effect, inject, model, signal } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ButtonModule } from 'primeng/button';
import { AsignacionMesaService, EspecialidaDetalle, MesaConfiguracion, MesaDetalle } from '@pages/privado/pages/asignacion-mesa/asignacion-mesa/services/asignacion-mesa.service';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Mensajes } from '@utils/mensajes';
import {TituloCase} from '@pipes/titulo-case.pipe';
import { ConvocatoriaEstadoService } from '@pages/privado/pages/asignacion-mesa/asignacion-mesa/services/convocatoria-estado.service';

@Component({
  selector: 'app-detalle-mesas',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DatePickerModule,
    ChipModule,
    ButtonModule,
    ConfirmDialogModule,
    TituloCase
  ],
  templateUrl: './detalle-mesas.component.html',
  styleUrl: './detalle-mesas.component.scss',

})
export class DetalleMesasComponent {


  constructor() {
    effect(() => {
      const convocatoria = this.convocatoriaSeleccionada();
      queueMicrotask(() => this.actualizarRangoFechasConvocatoria(convocatoria));
    });

    effect(() => {
      this.onSeleccionarFecha(this.fechaSeleccionada());
    });

    effect(() => {
      if (this.accionActualiza()) {
        this.onSeleccionarFecha(this.fechaSeleccionada());
      }
    });

  }

  confirmationService = inject(ConfirmationService);
  asignacionMesaService = inject(AsignacionMesaService);
  convocatoriaEstado = inject(ConvocatoriaEstadoService);
  mensajes = inject(Mensajes);

  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  accionActualiza = model<boolean | undefined>(undefined);
  fechaSeleccionada = signal<Date | undefined>(undefined);


  mesas: MesaDetalle[] = [];

  minDate: Date = new Date();
  maxDate: Date = new Date();
  ngOnInit(): void {
    this.actualizarRangoFechasConvocatoria(this.convocatoriaSeleccionada());
  }
  onSeleccionarFecha(fecha: Date | undefined) {
    const idMesaConvocatoria = this.convocatoriaSeleccionada()?.idMesaConvocatoria;

    if (!fecha || idMesaConvocatoria === undefined || idMesaConvocatoria === null) {
      this.mesas = [];
      return;
    }

    const fechaConsulta = dayjs(fecha).format('YYYY-MM-DD');

    this.asignacionMesaService.getDetalleMesaFecha(idMesaConvocatoria, fechaConsulta).subscribe({
      next: (response: any) => {
        if (!this.esConsultaActual(idMesaConvocatoria, fechaConsulta)) {
          return;
        }

        //console.log('Respuesta:', response);
        this.mesas = response.respuesta;
        this.mesas = this.mesas.map(mesa => ({
          ...mesa,
          turnos: mesa.turnos.map(turno => ({
            ...turno,
            especialidades: [...turno.especialidades]
              .sort((a, b) => a.idMesaDetalle - b.idMesaDetalle)
          }))
        }));
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });

  }

  private actualizarRangoFechasConvocatoria(convocatoria: MesaConfiguracion | undefined): void {
    const fechaInicio = this.obtenerFechaValida(convocatoria?.fechaInicio);
    const fechaFin = this.obtenerFechaValida(convocatoria?.fechaFin);

    if (!convocatoria || !fechaInicio || !fechaFin) {
      const fechaActual = new Date();
      this.minDate = fechaActual;
      this.maxDate = fechaActual;
      this.fechaSeleccionada.set(undefined);
      this.mesas = [];
      return;
    }

    this.minDate = fechaInicio;
    this.maxDate = fechaFin;
    this.mesas = [];
    this.fechaSeleccionada.set(fechaInicio);
  }

  private obtenerFechaValida(fecha: string | undefined): Date | undefined {
    if (!fecha) {
      return undefined;
    }

    const fechaDayjs = dayjs(fecha);
    return fechaDayjs.isValid() ? fechaDayjs.toDate() : undefined;
  }

  private esConsultaActual(idMesaConvocatoria: number, fechaConsulta: string): boolean {
    const fechaActual = this.fechaSeleccionada();

    return this.convocatoriaSeleccionada()?.idMesaConvocatoria === idMesaConvocatoria
      && !!fechaActual
      && dayjs(fechaActual).format('YYYY-MM-DD') === fechaConsulta;
  }

  onEiminarEspecialidadMesa(esp: EspecialidaDetalle) {
    this.confirmationService.confirm({
      message: this.mensajes.MSG084,
      header: ' ',
      acceptLabel: 'Sí, confirmar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => {
        this.asignacionMesaService.eliminarEspecialidadMesa(esp.idMesaDetalle).subscribe({
          next: (response: any) => {
            //console.log('Respuesta:', response);
            this.convocatoriaEstado.notifyRefresh();
            this.accionActualiza.update((value) => true);
            setTimeout(() => {
              this.accionActualiza.update((value) => false);
            }, 500);

            this.onSeleccionarFecha(this.fechaSeleccionada());
          },
          error: (err) => {
            console.error('Error:', err);
          }
        });
      }
    });
  }

}
