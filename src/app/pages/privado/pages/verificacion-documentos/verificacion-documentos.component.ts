import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Card } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { GeneralComponent } from '../../../../components/general.component';
import { BtnRegresarComponent } from '../../../../components/btn-regresar/btn-regresar.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';

@Component({
  selector: 'app-verificacion-documentos',
  imports: [
    Card,
    SelectModule,
    InputText,
    BtnRegresarComponent,
    ReactiveFormsModule
  ],
  templateUrl: './verificacion-documentos.component.html',
  styleUrl: './verificacion-documentos.component.scss'
})
export class VerificacionDocumentosComponent extends GeneralComponent{

  dummies = [{ label: 'Dummie 1', value: 'Dummie 1' }, { label: 'Dummie 2', value: 'Dummie 2' }];

  filtroForm!: FormGroup;

  especialidad: TipoDropdown[] = [];
  estatus: TipoDropdown[] = [];
  contratacion: TipoDropdown[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder
    )
    {
      super();
      this.filtroForm = this.inicializarForm();
      this.obtenerCatalogos();
  }

  obtenerCatalogos(){
    this.especialidad = this.dummies;
    this.estatus = this.dummies;
    this.contratacion = this.dummies;
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      especialidad: [],
      estatus: [],
      matricula: [],
      contratacion: [],
    });
  }

}
