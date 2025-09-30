import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoaderService {
  /**
   * Para saber cuantas veces ha sido activado. Solo se podrá desactivar si el numero de activaciones es igual a cero.
   * @private
   */
  private readonly activaciones: number[] = [];

  private readonly loaderSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  loader$: Observable<boolean> = this.loaderSubject.asObservable();

  activar(): void {
    this.activaciones.push(1);
    this.loaderSubject.next(true);
  }

  desactivar(): void {
    this.activaciones.pop();
    if (this.activaciones.length === 0) {
      this.loaderSubject.next(false);
    }
  }
}
