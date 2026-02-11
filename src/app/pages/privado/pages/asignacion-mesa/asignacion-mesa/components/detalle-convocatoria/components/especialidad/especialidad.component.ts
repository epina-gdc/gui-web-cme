import { Component, inject, model } from '@angular/core';

import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsignacionMesaService, MesaConfiguracion, Rama } from '../../../../services/asignacion-mesa.service';

@Component({
  selector: 'app-especialidad',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    AutoCompleteModule],
  templateUrl: './especialidad.component.html',
  styleUrl: './especialidad.component.scss',
})
export class EspecialidadComponent {

  asignacionMesaService = inject(AsignacionMesaService);

  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  ramas: Rama[] = []


  especialidades: any[] = [];
  totalMedicos: number = 0;

  filteredRamas: any[] = [];
  ramaActual: any;

  ngOnInit(): void {
    this.obtenerRamas();
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.totalMedicos = this.especialidades.reduce((sum, e) => sum + e.cantidad, 0);
  }

  obtenerRamas() {
    this.asignacionMesaService.getRamasConvocatoria( this.convocatoriaSeleccionada()?.idConvocatoria as number ).subscribe({
      next: (response: any) => {
        console.log('Respuesta:', response);
        this.ramas = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    }

    );
  }

  filterRama(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.ramas).length; i++) {
      let ramaAux = (this.ramas)[i];
      if (ramaAux.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(ramaAux);
      }
    }

    this.filteredRamas = filtered;
  }
}
