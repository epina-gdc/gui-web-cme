import { Component , inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from "@angular/router";
import { ResidenteComponent } from '../residente/residente.component';
import { ExternoComponent } from '../externo/externo.component';


@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    ReactiveFormsModule

    

  ],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent {

  fb = inject(FormBuilder)
  form!: FormGroup;
  blnSeleccionado = false;
  constructor(private router: Router) {
  }
  selectedCity: any;
  lstPerfil = [
    {
      id: 1,
      text: 'Perfil 1'
    },
    { id: 2, text: 'Perfil 2' }
  ]

  blnResidente!: boolean;

  ngOnInit() {
    this.blnSeleccionado = false;
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
