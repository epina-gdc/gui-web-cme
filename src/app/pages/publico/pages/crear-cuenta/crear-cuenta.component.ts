import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import {RadioButton, RadioButtonModule} from 'primeng/radiobutton';
import { GeneralComponent } from '../../../../components/general.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    Select,
    ReactiveFormsModule,
    CommonModule,
    RadioButton,


  ],
  standalone: true,
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent extends GeneralComponent implements OnInit {

  fb = inject(FormBuilder)
  form!: FormGroup;
  blnSeleccionado = false;

  lstPerfil !: any;
  lstModalidad!: any;


  blnResidente!: boolean;
  perfilElegido!: any;
  ngOnInit() {
    this.blnResidente = true;
    this.blnSeleccionado = false;
    this.form = this.inicializarForm();
    this.getCatalogoPErfiles();
     this.getCatalogoModalidad();
  }


  getCatalogoPErfiles() {
    this.lstPerfil = [{
      id: 1,
      text: 'Residente IMSS'
    },
    { id: 2, text: 'Médico externo' }
    ]
  }


  getCatalogoModalidad() {
    this.lstModalidad = [{
      id: 1,
      text: 'Médico cursando la residencia'
    },
    { id: 2, text: 'Médico especialista con estudio en el extranjero ' },
    { id: 3, text: 'Médicos especialistas egresados 2025 de otra Institucional de Salud' },
    { id: 4, text: 'Médico especialista IMSS egresado de dos años anteriores ' }
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

  cambia(){
    console.log("hay cambios en el selct ");
    this.perfilElegido = this.form.controls['perfil'].value;
    if(this.perfilElegido == 2){
      this.blnResidente = false
    }
  }
}
