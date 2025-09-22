import {Component} from '@angular/core';
import {Card} from 'primeng/card';
import {GeneralComponent} from '../../../../components/general.component';

@Component({
  selector: 'app-externo',
  imports: [Card],
  templateUrl: './externo.component.html',
  styleUrl: './externo.component.scss'
})
export class ExternoComponent extends GeneralComponent {

}
