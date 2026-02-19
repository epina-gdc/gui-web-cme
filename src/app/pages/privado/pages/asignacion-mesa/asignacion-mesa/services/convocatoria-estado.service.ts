import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConvocatoriaEstadoService {

  convocatoriaActual = signal<any | null>(null);

  refreshTick = signal(0);

  notifyRefresh() {
    this.refreshTick.update(v => v + 1);
  }
}