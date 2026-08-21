import {CommonModule} from '@angular/common';
import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-pill',
  imports: [CommonModule],
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss'
})

export class PillComponent {

  @Input() texto: string = "No cumple con requisitos";
  @Input() pillType: number = 0;

  clases: Map<number, string> = new Map([
    [1, 'pendiente'],
    [2, 'revision'],
    [3, 'cumple'],
    [0, 'noCumple'],
    [4, 'vacante'],
    [5, 'ocupada'],
    [6, 'etiquetada']
  ]);

  settearClase(): string {
    return this.clases.get(this.pillType) ?? '';
  }
}
