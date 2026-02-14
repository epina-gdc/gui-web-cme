import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monitoreo-asignaciones',
  imports: [CommonModule],
  templateUrl: './monitoreo-asignaciones.component.html',
  styleUrl: './monitoreo-asignaciones.component.scss'
})
export class MonitoreoAsignacionesComponent implements OnInit, OnDestroy {
  valor = 1;
  pausado = false;

  private intervaloId: number | null = null;

  constructor() {}
  
  ngOnInit(): void {
    this.iniciarContador();
  }

  ngOnDestroy(): void {
    this.detenerContador();
  }

  iniciarContador(): void {
    if (this.intervaloId !== null) return;

    this.intervaloId = window.setInterval(() => {
      if (this.pausado) return;

      this.valor++;

      if (this.valor % 100 === 0) {
        this.detenerTemporalmente();
      }
    }, 1000);
  }

  detenerContador(): void {
    if (this.intervaloId !== null) {
      clearInterval(this.intervaloId);
      this.intervaloId = null;
    }
  }

  detenerTemporalmente(): void {
    this.pausado = true;

    setTimeout(() => {
      this.pausado = false;
    }, 5000); // 
  }

  get titulo(): string {
    return this.pausado ? 'Bienvenidos Médicos Especialistas' : 'Asignaciones';
  }

  get valorFormateado(): string {
    return this.valor.toString().padStart(2, '0');
  }
}
