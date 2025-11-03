import {Component, Input, input} from '@angular/core';
import {BtnRegresarComponent} from '@components/btn-regresar/btn-regresar.component';
import {PillComponent} from '@components/pill/pill.component';
import {Card} from 'primeng/card';
import {DetalleDocumentacionDatosPersonales} from '@models/detalleDocumentacionAspirante.interface';
import {TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-card-info',
  imports: [BtnRegresarComponent,
    PillComponent,

    Card, TitleCasePipe],
  templateUrl: './card-info.component.html',
  styleUrl: './card-info.component.scss'
})
export class CardInfoComponent {
  @Input() datosPersonales!: DetalleDocumentacionDatosPersonales;

}
