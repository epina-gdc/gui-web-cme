import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

// Definición de la interfaz para el estado compartido (opcional, pero recomendado)
export interface OfertaEstado {
  titulo: string;
  subTitulo: string;
  badgeValue: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EstadoOfertaService {
  // BehaviorSubject: Almacena el estado actual y lo emite a los nuevos suscriptores
  private readonly estadoFuente = new BehaviorSubject<OfertaEstado>({
    titulo: '',
    subTitulo: '',
    badgeValue: true,
  });

  private readonly favoritos =  new BehaviorSubject<number>(4)

  // Observable público para que los componentes puedan suscribirse
  estadoActual$ = this.estadoFuente.asObservable();

  favoritosActuales$ = this.favoritos.asObservable();

  constructor() {
  }

  /**
   * Método para actualizar el estado desde cualquier componente
   * @param nuevoEstado El objeto con los nuevos valores de la oferta.
   */
  actualizarEstado(nuevoEstado: OfertaEstado): void {
    // Emite el nuevo estado a todos los suscriptores
    this.estadoFuente.next(nuevoEstado);
  }

  actualizarFavoritos(nuevosFavoritos: number): void {
    this.favoritos.next(nuevosFavoritos)
  }
}
