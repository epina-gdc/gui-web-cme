import { Component } from '@angular/core';
import {Card} from "primeng/card";
import {Avatar} from 'primeng/avatar';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-info-aspirante',
  imports: [CommonModule, Card, Avatar],
  templateUrl: './info-aspirante.component.html',
  styleUrl: './info-aspirante.component.scss'
})
export class InfoAspiranteComponent {

  medico = {
    fotoUrl: '/assets/images/img_medico.png',
    nombreCompleto: 'Pablo Andrés García Bernal',
    matricula: '311080212',
    especialidades: ['Anestesiología pediátrica', 'Cardiología', 'Anatomía patológica'],
    sexo: 'Hombre',
    curp: 'BBPA841316HDFLRR01',
    rfc: 'BBPA841316HDF',
    email: 'pablo_garcia@gmail.com',
    emailAdicional: 'pablo_bernal@gmail.com',
  };

  rechazarOferta() {
    // abrir diálogo / confirm
  }

  cambiarRama() {
    // navegación / modal
  }

  reimprimirVerificacion() {
    // imprimir / generar PDF
  }

}
