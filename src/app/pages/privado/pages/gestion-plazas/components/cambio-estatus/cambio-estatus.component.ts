import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralComponent } from '@components/general.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { Button } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GestionPlazaInterface } from '@models/gestion-plaza.interface';

@Component({
  selector: 'app-cambio-estatus',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Select,
    TextareaModule,
    Button,
  ],
  templateUrl: './cambio-estatus.component.html',
  styleUrl: './cambio-estatus.component.scss'
})
export class CambioEstatusComponent extends GeneralComponent implements OnInit{

  fb = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);


  form!: FormGroup;
  plaza!: GestionPlazaInterface;
  esEdicion: boolean = false;
  lstEstatus: TipoDropdown[] = [];

  constructor(){
    super();
    this.obtenerDatosDialogo();
  }

  ngOnInit(){
    this.form = this.inicializarFormulario();
    if(!this.esEdicion){
      this.form.disable();
    }
  }

  inicializarFormulario(): FormGroup{
    return this.fb.group({
      estatus: [null, [Validators.required]],
      observaciones: ['']
    });
  }

  obtenerDatosDialogo(): void {
        if (this.config.data) {
            this.plaza = this.config.data.plaza;
            this.esEdicion = this.config.data.edicion ?? false;
        }
    }

  cancelar(){
    this.ref.close();
  }
}
