import {Component} from '@angular/core';

import {CardModule} from 'primeng/card';
import {IconFieldModule} from 'primeng/iconfield';
import {InputIconModule} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {AutoCompleteCompleteEvent, AutoCompleteModule} from 'primeng/autocomplete';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

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

  ramas: any[] = [
    { id: 1, nombre: 'Medicina interna' },
    { id: 2, nombre: 'Medicina general' },
    { id: 3, nombre: 'Medicina familiar' },
    { id: 4, nombre: 'Pediatría' },
    { id: 5, nombre: 'Medicina del trabajo' },
    { id: 6, nombre: 'Medicina del deporte' },
  ]

  especialidades: any[] = [
    { id: 1, nombre: 'Cirugía pediátrica (6 años)', cantidad: 34 },
    { id: 2, nombre: 'Alergia a inmunología clínica pediátrica (6 años)', cantidad: 50 },
    { id: 3, nombre: 'Cardiología pediátrica (6 años)', cantidad: 50 },
    { id: 4, nombre: 'Endocrinología pediátrica (5 años)', cantidad: 34 },
    { id: 5, nombre: 'Gastroenterología y nutrición pediátrica (5 años)', cantidad: 12 },
    { id: 6, nombre: 'Hematología pediátrica (5 años)', cantidad: 34 },
    { id: 7, nombre: 'Infectología pediátrica (5 años)', cantidad: 34 },
    { id: 8, nombre: 'Medicina del enfermo en estado crítico (6 años)', cantidad: 34 },
    { id: 9, nombre: 'Nefrología pediátrica (6 años)', cantidad: 34 },
    { id: 10, nombre: 'Neonatología (6 años)', cantidad: 34 },
    { id: 11, nombre: 'Neurología pediátrica (5 años)', cantidad: 34 },
    { id: 12, nombre: 'Oncología pediátrica (5 años)', cantidad: 34 },
    { id: 13, nombre: 'Reumatología pediátrica (5 años)', cantidad: 34 },
    { id: 14, nombre: 'Urgencias pediátricas (5 años)', cantidad: 34 },
    { id: 15, nombre: 'Hematología pediátrica (5 años)', cantidad: 34 }
  ];
  totalMedicos: number = 0;

  filteredRamas: any[] = [];
  ramaActual: any;

  ngOnInit(): void {
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.totalMedicos = this.especialidades.reduce((sum, e) => sum + e.cantidad, 0);
  }

  filterRama(event: AutoCompleteCompleteEvent) {
    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.ramas as any[]).length; i++) {
      let ramaAux = (this.ramas as any[])[i];
      if (ramaAux.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(ramaAux);
      }
    }

    this.filteredRamas = filtered;
  }
}
