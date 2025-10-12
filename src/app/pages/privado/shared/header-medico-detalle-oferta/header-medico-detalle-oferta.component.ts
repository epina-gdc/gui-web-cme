import { Component } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-header-medico-detalle-oferta',
  imports: [
    Button
  ],
  templateUrl: './header-medico-detalle-oferta.component.html',
  styleUrl: './header-medico-detalle-oferta.component.scss'
})
export class HeaderMedicoDetalleOfertaComponent {

  constructor(public ref: DynamicDialogRef) {
  }

  closeDialog(): void {
    this.ref.close('Data to return to opener');
  }
}
