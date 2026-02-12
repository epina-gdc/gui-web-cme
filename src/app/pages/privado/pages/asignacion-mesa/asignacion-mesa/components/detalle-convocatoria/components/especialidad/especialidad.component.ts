import { Component, effect, inject, model, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsignacionMesaService, MesaConfiguracion, Rama, TotalesMedicosRama } from '../../../../services/asignacion-mesa.service';

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

  constructor() {
    effect(() => {
      this.onSelectRama(this.ramaActual());
    });

  }

  asignacionMesaService = inject(AsignacionMesaService);

  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  ramas: Rama[] = []


  especialidades: any[] = [];
  totalMedicos: number = 0;

  filteredRamas: any[] = [];
  ramaActual = model<Rama | undefined>(undefined);

  totalesMedicosRama: TotalesMedicosRama = {};


  ngOnInit(): void {
    this.obtenerRamas();
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.totalMedicos = this.especialidades.reduce((sum, e) => sum + e.cantidad, 0);
  }

  obtenerRamas() {
    this.asignacionMesaService.getRamasConvocatoria(this.convocatoriaSeleccionada()?.idConvocatoria as number).subscribe({
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


    if (this.ramas && this.ramas.length > 0) {
      for (let i = 0; i < (this.ramas).length; i++) {
        let ramaAux = (this.ramas)[i];
        if (ramaAux.label.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(ramaAux);
        }
      }
    }


    this.filteredRamas = filtered;
  }

  onSelectRama(ramaSeleccionada: Rama | undefined) {

    if (ramaSeleccionada) {
      // obetenr el total de medicos especialidad rama
      this.asignacionMesaService.getTotalesMedicosRama(ramaSeleccionada.id, this.convocatoriaSeleccionada()?.idMesaConvocatoria as number, this.convocatoriaSeleccionada()?.idConvocatoria as number).subscribe({
        next: (response: any) => {
          console.log('Respuesta:', response);
          this.totalesMedicosRama = response.respuesta;
          this.especialidades = response.respuesta.especialidades;
          this.calcularTotal();
        },
        error: (err) => {
          console.error('Error:', err);
        }
      }

      );

      // obtener especialidades por rama

      

    }


  }
}
