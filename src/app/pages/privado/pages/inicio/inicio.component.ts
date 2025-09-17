import {Component} from '@angular/core';
import {Card} from 'primeng/card';
import {IconCardComponent} from '../../../../components/icon-card/icon-card.component';
import {BtnRegresarComponent} from '../../../../components/btn-regresar/btn-regresar.component';
import {StepsComponent} from '../../../../components/steps/steps.component';
import {UploadPhotoComponent} from '../../../../components/upload-photo/upload-photo.component';

@Component({
  selector: 'app-inicio',
  imports: [
    Card,
    IconCardComponent,
    BtnRegresarComponent,
    StepsComponent,
    UploadPhotoComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  steps = [
    { label: 'Información Personal', active: false },
    { label: 'Documentación', active: false },
    { label: 'Oferta laboral', active: false },
  ];
}
