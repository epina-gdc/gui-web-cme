import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { Select } from 'primeng/select';
import { RadioButton, RadioButtonModule } from 'primeng/radiobutton';
import { GeneralComponent } from '../../../../components/general.component';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RegistroMedico } from '@models/datosMedico';

@Component({
  selector: 'app-crear-cuenta',
  imports: [
    Card,
    Button,
    Select,
    ReactiveFormsModule,
    CommonModule,
    RadioButtonModule,
    FormsModule,


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
  lstDocumentos: any;
  registroMedico!: RegistroMedico;
  blnResidente!: boolean;

  ngOnInit() {
    this.registroMedico = new RegistroMedico();
    this.blnResidente = true;
    this.blnSeleccionado = false;
    this.form = this.inicializarForm();

    this.lstPerfil = this.getCatalogoPerfiles();

  }




  inicializarForm(): FormGroup {
    return this.fb.group({
      perfil: ['', [Validators.required]],
      modalidad: ['', ''],
      documento: ['', ''],

    });
  }




  public btnAceptar() {

    if (this.form.valid) {
      this.registroMedico.modalidad = this.form.controls['perfil'].value;
      console.log("el valor elegido es ", this.form);

      switch (this.registroMedico.modalidad) {
        case 1:

          break;
        case 2:

          if (this.form.controls['documento'].value === '1') {
            this.registroMedico.blnPasaporte = false;
          } else {
            this.registroMedico.blnPasaporte = true;
          }





          this._router.navigate(['publico/' + this._nav.registroMedico]);

          break;


        default:
          break;
      }
      console.log("registroMedico es ", this.registroMedico);
      this.saveSession("registroMedico", this.registroMedico)
      this._router.navigate(['publico/' + this._nav.registroMedico]);
    } else {

    }
  }



  cambiaPerfil() {

    console.log("hay cambios en el selct ");
    this.registroMedico.perfil = this.form.controls['perfil'].value;
    if (this.registroMedico.perfil == 2) {

      this.camposExterno();




    }

    if (this.registroMedico.perfil == 1) {
      this.camposResidente();



    }
  }

  private camposResidente() {
    this.clearCampos();
    this.blnResidente = true;
  }
  private camposExterno() {
    this.lstModalidad = this.getCatalogoModalidad();
    this.lstDocumentos = this.getCatalogoDocumento();
    this.blnResidente = false;



    this.form.controls['modalidad'].setValidators([Validators.required]);
    this.form.controls['documento'].setValidators([Validators.required]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['documento'].updateValueAndValidity();
  }

  private clearCampos(){
    this.form.controls['modalidad'].setValidators([]);
    this.form.controls['documento'].setValidators([]);
    this.form.controls['modalidad'].updateValueAndValidity();
    this.form.controls['documento'].updateValueAndValidity();
  }

  cambiaModalidad() {

    this.registroMedico.modalidad = this.form.controls['modalidad'].value;
    console.log("hay cambios en el selct ", this.registroMedico);
  }
}
