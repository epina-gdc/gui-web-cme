import { Component } from '@angular/core';
import {Card} from "primeng/card";
import {Rating} from 'primeng/rating';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-detalle-oferta-laboral',
  imports: [
    Card,
    Rating,
    FormsModule
  ],
  templateUrl: './detalle-oferta-laboral.component.html',
  styleUrl: './detalle-oferta-laboral.component.scss'
})
export class DetalleOfertaLaboralComponent {
  value: any;

}
