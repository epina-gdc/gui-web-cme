import {Component} from '@angular/core';
import {CardModule} from 'primeng/card';
import {TabsModule} from 'primeng/tabs';
import {GeneralComponent} from '@components/general.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatosMedicoComponent} from '@privado/propuesta-sindical/components/datos-medico/datos-medico.component';

@Component({
  selector: 'app-propuesta-sindical',
  imports: [CardModule, TabsModule, DatosMedicoComponent],
  templateUrl: './propuesta-sindical.component.html',
  styleUrl: './propuesta-sindical.component.scss'
})
export class PropuestaSindicalComponent extends GeneralComponent{

  tab: number = 0;

  constructor(
    private fb: FormBuilder,
  ){
    super();
  }


}
