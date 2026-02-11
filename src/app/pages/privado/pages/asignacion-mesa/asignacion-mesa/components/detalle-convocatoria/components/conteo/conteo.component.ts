import { Component, inject, model, signal } from '@angular/core';

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

  conteo = signal<ConvocatoriaTotales | undefined>(undefined);
  asignacionMesaService = inject(AsignacionMesaService);
  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);

  ngOnInit(): void {
    this.asignacionMesaService.getConvocatoriaTotales(1).subscribe({
      next: (response: any) => {
        console.log('Respuesta:', response);
        this.conteo.update(v => response.respuesta);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }


}
