import {Component, EventEmitter, Output} from '@angular/core';
import {Card} from 'primeng/card';
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';
import {Badge} from 'primeng/badge';

@Component({
  selector: 'oferta-card',
  imports: [
    Card,
    Rating,
    FormsModule,
    Badge
  ],
  templateUrl: './oferta-card.component.html',
  styleUrl: './oferta-card.component.scss'
})
export class OfertaCardComponent {
  value: any;


  @Output() abrirDetalleEvent =  new EventEmitter<boolean>();

  verMas(): void {
    this.abrirDetalleEvent.emit(true);
  }
}
