import { Component } from '@angular/core';

import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-especialidad',
  imports: [CardModule, IconFieldModule, InputIconModule, InputTextModule],
  templateUrl: './especialidad.component.html',
  styleUrl: './especialidad.component.scss',
})
export class EspecialidadComponent {
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

  ngOnInit(): void {
    this.calcularTotal();
  }

  private calcularTotal(): void {
    this.totalMedicos = this.especialidades.reduce((sum, e) => sum + e.cantidad, 0);
  }
}
