import {ConstanciasCursosComponent} from './../constancias-cursos/constancias-cursos.component';
import {Component} from '@angular/core';
import {CardModule} from 'primeng/card';
import {TabsModule} from 'primeng/tabs';

import {DocsObligatoriosComponent} from '../docs-obligatorios/docs-obligatorios.component';
import {DocsEspecialidadComponent} from '../docs-especialidad/docs-especialidad.component';
import {CardInfoComponent} from '@pages/privado/pages/verificacion-documentos/components/card-info/card-info.component';

@Component({
  selector: 'app-documentacion',
  imports: [CardModule, TabsModule,
    DocsObligatoriosComponent, DocsEspecialidadComponent, ConstanciasCursosComponent,
    CardInfoComponent],
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.scss'
})
export class DocumentacionComponent {
  tab: number = 0 ;

}
