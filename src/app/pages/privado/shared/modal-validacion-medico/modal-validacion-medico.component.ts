import {Component} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {DatosGeneralesResponse} from '@models/datosGenerales';
import {TitleCasePipe} from '@angular/common';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-modal-validacion-medico',
  imports: [
    TitleCasePipe,
    TableModule
  ],
  templateUrl: './modal-validacion-medico.component.html',
  styleUrl: './modal-validacion-medico.component.scss'
})
export class ModalValidacionMedicoComponent {

  datosGenerales!: DatosGeneralesResponse;

  constructor(private readonly config: DynamicDialogConfig) {
    if (this.config.data) {
      this.datosGenerales = this.config.data.datosGenerales;
      console.log(this.config.data.datosGenerales);
    }
  }


}
