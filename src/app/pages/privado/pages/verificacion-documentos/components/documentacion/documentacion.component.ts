import {Component} from '@angular/core';
import {CardModule} from 'primeng/card';
import {TabsModule} from 'primeng/tabs';

import {PillComponent} from '@components/pill/pill.component';
import {BtnRegresarComponent} from '@components/btn-regresar/btn-regresar.component';


@Component({
  selector: 'app-documentacion',
  imports: [BtnRegresarComponent,CardModule,PillComponent,TabsModule],
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.scss'
})
export class DocumentacionComponent {

}
