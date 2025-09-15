import {Component} from '@angular/core';
import {Card} from 'primeng/card';
import {IconCardComponent} from '../../../../components/icon-card/icon-card.component';
import {BtnRegresarComponent} from '../../../../components/btn-regresar/btn-regresar.component';
import {StepsComponent} from '../../../../components/steps/steps.component';

@Component({
  selector: 'app-inicio',
  imports: [
    Card,
    IconCardComponent,
    BtnRegresarComponent,
    StepsComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  steps = [
    { label: 'Personal', active: false },
    { label: 'Seat', active: true },
    { label: 'Payment', active: false },
  ];
}
