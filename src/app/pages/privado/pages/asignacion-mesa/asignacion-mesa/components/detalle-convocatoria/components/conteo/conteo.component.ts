import { Component, effect, inject, model, signal } from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AsignacionMesaService, ConvocatoriaTotales, MesaConfiguracion } from '../../../../services/asignacion-mesa.service';

@Component({
  selector: 'app-conteo',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  templateUrl: './conteo.component.html',
  styleUrl: './conteo.component.scss',
})
export class ConteoComponent {

  constructor() {
    effect(() => {
      const idConvocatoria = this.obtenerIdConvocatoriaSeleccionada();
      if (idConvocatoria === null) {
        this.conteo.set(undefined);
        return;
      }

      this.cargaConteo(idConvocatoria);
    });

    effect(() => {
      if (this.accionActualiza()) {
        const idConvocatoria = this.obtenerIdConvocatoriaSeleccionada();
        if (idConvocatoria !== null) {
          this.cargaConteo(idConvocatoria);
        }
      }
    });

  }

  accionActualiza = model<boolean | undefined>(undefined);

  conteo = signal<ConvocatoriaTotales | undefined>(undefined);
  asignacionMesaService = inject(AsignacionMesaService);
  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);

  cargaConteo(idConvocatoria: number) {
    this.asignacionMesaService.getConvocatoriaTotales(idConvocatoria).subscribe({
      next: (response: any) => {
        //console.log('Respuesta:', response);
        this.conteo.update(v => response.respuesta);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  private obtenerIdConvocatoriaSeleccionada(): number | null {
    const idConvocatoria = this.convocatoriaSeleccionada()?.idConvocatoria;

    if (idConvocatoria === null || idConvocatoria === undefined) {
      return null;
    }

    const id = Number(idConvocatoria);
    return Number.isNaN(id) ? null : id;
  }

}
