import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { TipoBusquedaPlaza } from '@models/gestion-plaza.interface';

@Injectable({
  providedIn: 'root'
})
export class GestionPlazaEstadoService {
  private readonly _tipoBusqueda: WritableSignal<TipoBusquedaPlaza> = signal<TipoBusquedaPlaza>(TipoBusquedaPlaza.BusquedaLayout);

  public readonly tipoBusqueda: Signal<TipoBusquedaPlaza> = this._tipoBusqueda.asReadonly();

  setTipoBusqueda(tipo: TipoBusquedaPlaza): void {
    this._tipoBusqueda.set(tipo);
  }
}
