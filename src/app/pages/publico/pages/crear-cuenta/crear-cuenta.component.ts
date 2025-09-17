import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from "@angular/router";
import { Select } from 'primeng/select';
import { ResidenteComponent } from '../residente/residente.component';
import { ExternoComponent } from '../externo/externo.component';
import { GeneralComponent } from '../../../../components/general.component';


@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    Select,
    ReactiveFormsModule,
  ResidenteComponent,
  ExternoComponent



  ],
  //standalone: true,
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent  extends GeneralComponent implements OnInit  {

  fb = inject(FormBuilder)
  form!: FormGroup;
  blnSeleccionado = false;

  selectedCity: any;
  lstPerfil !: any;


  blnResidente!: boolean;
  perfilElegido!: any;
  ngOnInit() {
    this.blnSeleccionado = false;
    this.getCatalogoPErfiles();
  }


  getCatalogoPErfiles() {
    this.lstPerfil = [{
      id: 1,
      text: 'Residente IMSS'
    },
    { id: 2, text: 'Médico externo' }
    ]
  }


  public medicoResidente() {
    this.blnSeleccionado = true;
    this.blnResidente = true;
    //this.router.navigate('');
  }

  public medicoExterno() {
    this.blnSeleccionado = true;
    this.blnResidente = false;
  }
}
