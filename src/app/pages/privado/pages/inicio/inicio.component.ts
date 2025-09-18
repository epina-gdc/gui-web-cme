import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {IconCardComponent} from '../../../../components/icon-card/icon-card.component';
import {BtnRegresarComponent} from '../../../../components/btn-regresar/btn-regresar.component';
import {StepsComponent} from '../../../../components/steps/steps.component';
import {UploadPhotoComponent} from '../../../../components/upload-photo/upload-photo.component';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-inicio',
  imports: [
    Card,
    IconCardComponent,
    BtnRegresarComponent,
    StepsComponent,
    UploadPhotoComponent,
    InputText,
    ReactiveFormsModule,
    Select,
    DatePickerModule,
    Button
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

  fb = inject(FormBuilder)
  formRegistro!: FormGroup;

  steps = [
    {label: 'Información Personal', active: false},
    {label: 'Documentación', active: false},
    {label: 'Oferta laboral', active: false},
  ];

  dummies = [{label: 'Dummie', value: 'Dummie'}]

  indice: WritableSignal<number> = signal<number>(0);

  constructor() {
    this.formRegistro = this.asignarFormularioRegistro();
  }

  asignarFormularioRegistro(): FormGroup {
    return this.fb.group({
      rfc: [],
      nss: [],
      fechaNacimiento: [],
      sexo: [],
      estadoCivil: [],
      dependientes: [],
      hijos: [{value: '', disabled: true}],
      otros: [{value: '', disabled: true}],
      correo: [],
      correoAdicional: [],
      telefonoCasa: [],
      telefonoCelular: [],
      paisNacimiento: [],
      estadoNacimiento: [],
      codigoPostal: [],
      pais: [],
      estado: [],
      municipio: [],
      colonia: [],
      calle: [],
      numeroExterior: []
    })
  }
}
