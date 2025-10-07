import {Component, Input} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {Card} from 'primeng/card';

@Component({
  selector: 'kpi-card',
  imports: [
    Avatar,
    Card
  ],
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss'
})
export class KpiCardComponent {
  @Input() encabezado: string = '';
  @Input() descripcion: string = '';

}
