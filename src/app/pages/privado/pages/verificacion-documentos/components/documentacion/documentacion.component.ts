import {Component, signal} from '@angular/core';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';

import { PillComponent } from '@components/pill/pill.component';
import { BtnRegresarComponent } from '@components/btn-regresar/btn-regresar.component';
import { DocsObligatoriosComponent } from '../docs-obligatorios/docs-obligatorios.component';
import { DocsEspecialidadComponent } from '../docs-especialidad/docs-especialidad.component';

@Component({
  selector: 'app-documentacion',
  imports: [BtnRegresarComponent,CardModule,PillComponent,TabsModule,DocsObligatoriosComponent, DocsEspecialidadComponent],
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.scss'
})
export class DocumentacionComponent {
  tab: number = 0 ;

}
