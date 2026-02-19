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
    this.minDate = dayjs(this.convocatoriaSeleccionada()?.fechaInicio).toDate();
    this.maxDate = dayjs(this.convocatoriaSeleccionada()?.fechaFin).toDate();
    this.fechaSeleccionada.set(this.minDate);
  }

  onSeleccionarFecha(fecha: Date | undefined) {

    if (fecha) {
      this.asignacionMesaService.getDetalleMesaFecha(this.convocatoriaSeleccionada()?.idMesaConvocatoria as number, dayjs(fecha).format('YYYY-MM-DD')).subscribe({
        next: (response: any) => {
          console.log('Respuesta:', response);
          this.mesas = response.respuesta;
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });
    }

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
            console.log('Respuesta:', response);
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
