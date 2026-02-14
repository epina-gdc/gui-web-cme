import { Component, effect, inject, model, signal } from '@angular/core';

import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AsignacionMesaService, Especialidad, MesaConfiguracion, Rama, ResponseRamaConvocatoria, TotalesMedicosRama } from '../../../../services/asignacion-mesa.service';

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

    effect(() => {
      if (this.accionActualiza()) {
        this.obtenerRamas();
        this.onSelectRama(this.ramaActual());
      }
    });
  }

  accionActualiza = model<boolean | undefined>(undefined);
  asignacionMesaService = inject(AsignacionMesaService);
  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  ramas: Rama[] = [];
  especialidades: Especialidad[] = [];
  totalMedicos: number = 0;
  filteredRamas: Rama[] = [];
  ramaActual = model<Rama | undefined>(undefined);
  totalesMedicosRama: TotalesMedicosRama = {};
  datoRama: Especialidad | undefined = {};

  ngOnInit(): void {
    this.obtenerRamas();
  }

  obtenerRamas() {
    this.asignacionMesaService.getRamasConvocatoria(this.convocatoriaSeleccionada()?.idConvocatoria as number).subscribe({
      next: (response: ResponseRamaConvocatoria) => {
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
    let filtered: Rama[] = [];
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
          this.totalesMedicosRama = response.respuesta.totalMedicos;
          this.filtrarEspecialidades(response.respuesta.especialidades)
          this.accionActualiza.update((value) => true);
          setTimeout(() => {
            this.accionActualiza.update((value) => false);
          }, 500);

        },
        error: (err) => {
          console.error('Error:', err);
        }
      }
      );
    }
  }

  filtrarEspecialidades(lstEspecialidades: Especialidad[]) {
    this.datoRama = lstEspecialidades.find(especialidad => this.ramaActual()?.cveRama == especialidad.cveEspecialidad);
    this.especialidades = lstEspecialidades.filter(especialidad => this.ramaActual()?.cveRama != especialidad.cveEspecialidad);
  }

}
