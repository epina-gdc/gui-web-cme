import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Router } from "@angular/router";
import { Select } from 'primeng/select';
import { ResidenteComponent } from '../residente/residente.component';
import { ExternoComponent } from '../externo/externo.component';
import { GeneralComponent } from '../../../../components/general.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    Select,
    ReactiveFormsModule,
    CommonModule



  ],
  //standalone: true,
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent extends GeneralComponent implements OnInit {

  fb = inject(FormBuilder)
  form!: FormGroup;
  blnSeleccionado = false;

  lstPerfil !: any;


  blnResidente!: boolean;
  perfilElegido!: any;
  ngOnInit() {
    this.blnSeleccionado = false;
    this.form = this.inicializarForm();
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

  inicializarForm(): FormGroup {
    return this.fb.group({
      perfil: ['', [Validators.required]],

    });
  }




  public btnAceptar() {
    
    if (this.form.valid) {
      this.perfilElegido = this.form.controls['perfil'].value;
      console.log("el valor elegido es ",this.lstPerfil[ this.perfilElegido-1].text);

      switch (this.perfilElegido) {
        case 1:
          this._router.navigate(['publico/'+this._nav.formMedicoResidente]);
          break;
        case 2:
          this._router.navigate(['publico/'+this._nav.formMedicoExterno]);
          break;


        default:
          break;
      }
    } else {

    }
  }
}
