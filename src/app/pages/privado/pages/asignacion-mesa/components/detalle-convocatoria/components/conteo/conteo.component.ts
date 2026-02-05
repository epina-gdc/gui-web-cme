import { Component } from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-conteo',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule],
  templateUrl: './conteo.component.html',
  styleUrl: './conteo.component.scss',
})
export class ConteoComponent {
  conteo = {
    becados: { actual: 0, total: 300 },
    residentes: { actual: 0, total: 200 },
    externos: { actual: 0, total: 100 }
  };

  constructor() { }

  ngOnInit(): void {
    // Aquí podrías cargar datos desde un servicio si es dinámico
    // Ejemplo:
    // this.cargarConteo();
  }

  // Ejemplo de método para actualizar (opcional)
  actualizarConteo(categoria: keyof typeof this.conteo, valor: number): void {
    this.conteo[categoria].actual = Math.min(valor, this.conteo[categoria].total);
  }
}
