import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {BtnRegresarComponent} from '../../../../components/btn-regresar/btn-regresar.component';
import {StepsComponent} from '../../../../components/steps/steps.component';
import {UploadPhotoComponent} from '../../../../components/upload-photo/upload-photo.component';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {DatePickerModule} from 'primeng/datepicker';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {UploadDocumentComponent} from '../../../../components/upload-document/upload-document.component';
import {RadioButton} from 'primeng/radiobutton';
import {BOOLEAN_OPCIONES, DEPENDENTIES} from '@utils/constants';
import {TabPanel, TabView} from 'primeng/tabview';
import {HeaderTabComponent} from '../../../../components/header-tab/header-tab.component';
import {
  HeaderMedicoInternoComponent
} from '@pages/privado/shared/header-medico-interno/header-medico-interno.component';

@Component({
  selector: 'app-inicio',
  imports: [
    Card,
    BtnRegresarComponent,
    StepsComponent,
    UploadPhotoComponent,
    InputText,
    ReactiveFormsModule,
    Select,
    DatePickerModule,
    Button,
    TableModule,
    UploadDocumentComponent,
    RadioButton,
    TabPanel,
    TabView,
    HeaderTabComponent,
    FormsModule,
    HeaderMedicoInternoComponent
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent {

  readonly dependientes = DEPENDENTIES;
  readonly opciones_boolean = BOOLEAN_OPCIONES;

  fb: FormBuilder = inject(FormBuilder);
  formRegistro!: FormGroup;
  formZonaInteres!: FormGroup;

  zonasInteres: WritableSignal<any[]> = signal([]);

  steps = [
    {label: 'Información Personal', active: false},
    {label: 'Documentos de escolaridad', active: false},
    {label: 'Oferta laboral', active: false},
  ];

  sustituto!: any;
  empleo!: any;

  dummies = [{label: 'Dummie', value: 'Dummie'}, {label: 'Dummie 2', value: 'Dummie 2'}]

  indice: WritableSignal<number> = signal<number>(0);

  constructor() {
    this.formRegistro = this.asignarFormularioRegistro();
    this.formZonaInteres = this.asignarFormularioZonaInteres();
  }

  asignarFormularioRegistro(): FormGroup {
    return this.fb.group({
      rfc: [],
      nss: [{value: '', disabled: false}, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
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

  asignarFormularioZonaInteres(): FormGroup {
    return this.fb.group({
      ooad: [{value: '', disabled: false}, [Validators.required]],
      zonaInteres: [{value: '', disabled: false}, [Validators.required]]
    })
  }

  agregarZonaInteres(): void {
    const nuevaZona = this.crearRegistroZonaInteres();
    this.zonasInteres.update(value => [...value, nuevaZona]);
    this.formZonaInteres.reset();
  }

  crearRegistroZonaInteres() {
    return this.formZonaInteres.value
  }

  eliminarZonaInteres(indice: number): void {
    const zonasActualizadas = [...this.zonasInteres().slice(0, indice),
      ...this.zonasInteres().slice(indice + 1)];
    this.zonasInteres.update(() => zonasActualizadas);
  }

  siguientePasoStepper(): void {
    this.indice.update(value => value + 1);
  }

  anteriorPasoStepper(): void {
    this.indice.update(value => value - 1);
  }
}
