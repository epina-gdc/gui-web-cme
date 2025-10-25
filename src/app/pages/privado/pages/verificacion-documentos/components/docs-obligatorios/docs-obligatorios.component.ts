import { NgClass } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';

@Component({
  selector: 'app-docs-obligatorios',
  imports: [NgClass],
  templateUrl: './docs-obligatorios.component.html',
  styleUrl: './docs-obligatorios.component.scss'
})
export class DocsObligatoriosComponent {

  tabActive: WritableSignal<number> = signal(0);

  documentacion: any[] = [
    {
      idDocumento: 1,
      nombreDocumento: "INE",
      doc: []
    },
    {
      idDocumento: 2,
      nombreDocumento: "Título de medicina general",
      doc: []
    },
    {
      idDocumento: 3,
      nombreDocumento: "Cédula profesional de medicina general",
      doc: []
    }
  ]

  docSeleccionado(id:number) {
    this.tabActive.set(id);
  }
}
