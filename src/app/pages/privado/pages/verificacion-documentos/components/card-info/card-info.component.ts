import {Component} from '@angular/core';
import {BtnRegresarComponent} from '@components/btn-regresar/btn-regresar.component';
import {PillComponent} from '@components/pill/pill.component';
import {Card} from 'primeng/card';

@Component({
  selector: 'app-card-info',
  imports: [BtnRegresarComponent,
    PillComponent,

  Card],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss'
})
export class CardInfoComponent {

}
