import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralComponent } from '@components/general.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { Button } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GestionPlazaInterface } from '@models/gestion-plaza.interface';
import { GestionPlazaService } from '@services/gestion-plaza.service';

@Component({
  selector: 'app-cambio-estatus',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    TextareaModule,
    Select
  ],
  templateUrl: './cambio-estatus.component.html',
  styleUrl: './cambio-estatus.component.scss'
})
export class CambioEstatusComponent extends GeneralComponent implements OnInit {

  fb = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  gestionPlazaService: GestionPlazaService = inject(GestionPlazaService)

  form!: FormGroup;
  plaza!: any;
  esEdicion: boolean = false;

  lstEstatus: TipoDropdown[] = [];

  ngOnInit() {
    this.obtenerDatosDialogo();
    this.form = this.inicializarFormulario();

    if (!this.esEdicion || this.plaza?.idEstatusPlaza == 2) {
      this.form.disable();
    }
  }

  inicializarFormulario(): FormGroup {
    const valorEstatus = this.plaza?.idEstatusPlaza != null
      ? Number(this.plaza.idEstatusPlaza)
      : null;

    const obs = this.plaza?.desObservaciones ?? this.plaza?.observaciones ?? '';

    return this.fb.group({
      estatus: [valorEstatus, [Validators.required]],
      observaciones: [obs]
    });
  }

  obtenerDatosDialogo(): void {
    if (this.config.data) {
      this.plaza = this.config.data.plaza;
      this.esEdicion = this.config.data.edicion ?? false;
      this.lstEstatus = this.config.data.lstEstatusPlaza;
    }
  }

  cambiarEstatus(){

    const datosForm = this.form.value
    const obj = {
      idPlaza: this.plaza.idPlaza,
      idEstatus: datosForm.estatus,
      desObservaciones: datosForm.observaciones
    }

    this.gestionPlazaService.cambiarEstatusPlaza(obj).subscribe({
      next: resp => {
        if(resp.exito){
          this._alertServices.exito(this._Mensajes.MSG025a);
          this.ref.close(true);
        }else{
          this._alertServices.error(resp.mensaje);
          this.ref.close(false);
        }
      }
    })

  }

  cancelar() {
    this.ref.close();
  }
}
