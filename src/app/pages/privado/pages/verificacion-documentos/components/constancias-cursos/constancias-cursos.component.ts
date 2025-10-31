import {NgClass} from '@angular/common';
import {Component, signal, WritableSignal} from '@angular/core';

@Component({
  selector: 'app-constancias-cursos',
  imports: [NgClass],
  templateUrl: './constancias-cursos.component.html',
  styleUrl: './constancias-cursos.component.scss'
})
export class ConstanciasCursosComponent {

  tabActive: WritableSignal<number> = signal(0);

  documentacion: any[] = [
    {
      idDocumento: 1,
      nombreDocumento: "Nombre de la constancia que capturó el usuario 1",
      doc: []
    },
    {
      idDocumento: 2,
      nombreDocumento: "Nombre de la constancia que capturó el usuario 2",
      doc: []
    },
    {
      idDocumento: 3,
      nombreDocumento: "Nombre de la constancia que capturó el usuario 3",
      doc: []
    }
  ]

  docSeleccionado(id:number) {
    this.tabActive.set(id);
  }
}
