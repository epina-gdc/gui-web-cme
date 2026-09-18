import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
import { Avatar } from "primeng/avatar";
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { Button } from "primeng/button";
import { EnvioCitasService, SolicitudEnvioCitas, TotalCitas, TypeMedico } from '../../services/envio-citas.service';

import { Mensajes } from '@utils/mensajes';
import { AlertService } from '@services/alert.service';
import { AsignacionMesaService, ResponseValidaConvocatoria } from '../../../asignacion-mesa/services/asignacion-mesa.service';

@Component({
  selector: 'app-detalle-convocatoria',
  imports: [CommonModule, CardModule, Avatar, ProgressBarModule, Button],
  templateUrl: './detalle-convocatoria.component.html',
  styleUrl: './detalle-convocatoria.component.scss',

})
export class DetalleConvocatoriaComponent {

  constructor() {
    effect(() => {

      const convSelect = this.convocatoriaSelect();
      const tipoMedico = this.tipoMedicoSelect();
      if (convSelect && tipoMedico) {
        this.validaConvocatoria();

      }
    });

  }

  envioCitasService = inject(EnvioCitasService);
  asignacionMesaService = inject(AsignacionMesaService);
  alertaService = inject(AlertService)
  mensajes = inject(Mensajes);


  totalCitas = model<TotalCitas | undefined>(undefined);
  convocatoriaSelect = model<number | undefined>(undefined);
  tipoMedicoSelect = model<TypeMedico | undefined>(undefined);
  solicitudEnvioCitas = model<SolicitudEnvioCitas | undefined>(undefined);
  convocatoriaInactivaSeleccionada = model<boolean>(false);

  isFinalizado = signal<boolean>(false);
  private idSolicitudEnvio = 0;


  validaConvocatoria() {
    this.asignacionMesaService.getValidaConvocatoria(this.convocatoriaSelect() as number).subscribe({
      next: (response: ResponseValidaConvocatoria) => {
        if (response.exito) {
          this.isFinalizado.set(response.respuesta);
        } else {
          this.isFinalizado.set(false);
        }
      },
    }
    );
  }


  onEnviarCitas() {
    const idConvocatoria = this.convocatoriaSelect();
    const idTipoMedico = this.tipoMedicoSelect();

    if (!idConvocatoria || !idTipoMedico || this.convocatoriaInactivaSeleccionada()) {
      return;
    }

    this.envioCitasService.guardarAsignacionCitas(idConvocatoria, idTipoMedico).subscribe({
      next: (response) => {
        if (response.exito) {
          this.alertaService.informacion(this.mensajes.MSG_INICIO_CORREOS);
          this.solicitudEnvioCitas.set({
            idConvocatoria,
            idTipoMedico,
            idSolicitud: ++this.idSolicitudEnvio,
          });
        } else {
          this.alertaService.error(response.mensaje);
        }
      },
      error: (error) => {
        this.alertaService.error(error.error.mensaje);
      }

    }
    );
  }

  // VERIFICA SI EL PROCESO HA FINALIZADO (tiene fechaFin y horaFin)
  tieneFechaYHoraFin(total: TotalCitas | undefined): boolean {
    if (!total) return false;

    const fechasHoras = total.fechasHorasEnvios;

    if (!fechasHoras) return false;

    if(total.totalesNoEnviados > 0) return false;

    // Verifica que fechaFin y horaFin tengan valores no vacíos
    return !!(fechasHoras.fechaFin && fechasHoras.fechaFin.trim()) ||
      !!(fechasHoras.horaFin && fechasHoras.horaFin.trim());
  }
}



