import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, model, OnDestroy, OnInit, signal } from '@angular/core';
import { Avatar } from "primeng/avatar";
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { Button } from "primeng/button";
import { EnvioCitasService, TotalCitas, TypeMedico } from '../../services/envio-citas.service';

import { Mensajes } from '@utils/mensajes';
import { AlertService } from '@services/alert.service';

@Component({
  selector: 'app-detalle-convocatoria',
  imports: [CommonModule, CardModule, Avatar, ProgressBarModule, Button],
  templateUrl: './detalle-convocatoria.component.html',
  styleUrl: './detalle-convocatoria.component.scss',

})
export class DetalleConvocatoriaComponent implements OnInit, OnDestroy {

  envioCitasService = inject(EnvioCitasService);
  alertaService = inject(AlertService)
  mensajes = inject(Mensajes);


  totalCitas = model<TotalCitas | undefined>(undefined);
  convocatoriaSelect = model<number | undefined>(undefined);
  tipoMedicoSelect = model<TypeMedico | undefined>(undefined);

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
  }

  onEnviarCitas() {

    if(!this.convocatoriaSelect() || !this.tipoMedicoSelect()){
      return
    }
    this.envioCitasService.guardarAsignacionCitas(this.convocatoriaSelect() as number, this.tipoMedicoSelect() as number).subscribe({
      next: (response) => {
        if (response.exito) {
          this.alertaService.informacion(this.mensajes.MSG_INICIO_CORREOS);
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



}
