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
import {EmptyTabComponent} from '../../../../components/empty-tab/empty-tab.component';
import {TabDocumento, TabNode} from '@models/tab-node.interface';

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
    HeaderMedicoInternoComponent,
    EmptyTabComponent
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
  formDocumentosEspecialidad!: FormGroup;

  zonasInteres: WritableSignal<any[]> = signal([]);
  registrosDocumentosEspecialidad: WritableSignal<TabNode[]> = signal([]);

  steps = [
    {label: 'Información Personal', active: false},
    {label: 'Documentos de escolaridad', active: false},
    {label: 'Oferta laboral', active: false},
  ];

  sustituto!: any;
  empleo!: any;

  dummies = [{label: 'Dummie', value: 'Dummie'}, {label: 'Dummie 2', value: 'Dummie 2'}]

  indice: WritableSignal<number> = signal<number>(1);

  constructor() {
    this.formRegistro = this.asignarFormularioRegistro();
    this.formZonaInteres = this.asignarFormularioZonaInteres();
    this.formDocumentosEspecialidad = this.asignarFormularioDocumentosEspecialidad();
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

  asignarFormularioDocumentosEspecialidad(): FormGroup {
    return this.fb.group({
      especialidad: [],
      documento: []
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

  obtenerNuevoDocumento(): TabDocumento {
    return {
      tipoDocumento: this.formDocumentosEspecialidad.get('documento')?.value,
      especialidadMedica: this.formDocumentosEspecialidad.get('especialidad')?.value
    }
  }

  agregarDocumento(): void {
    const nuevoDocumento = this.obtenerNuevoDocumento();
    if (!nuevoDocumento) return;
    const especialidades = this.registrosDocumentosEspecialidad();
    const indiceEspecialidad = especialidades.findIndex(e => e.especialidad === nuevoDocumento.especialidadMedica);

    // Si la especialidad no existe, la creamos
    if (indiceEspecialidad === -1) {
      const nuevaEspecialidad: TabNode = {
        especialidad: nuevoDocumento.especialidadMedica,
        documentos: [nuevoDocumento]
      };
      this.registrosDocumentosEspecialidad.update(value => [...value, nuevaEspecialidad]);
      return;
    }

    // Si la especialidad ya existe, verificamos si el documento es un duplicado
    const especialidadExistente = {...especialidades[indiceEspecialidad]};
    const documentoYaExiste = especialidadExistente.documentos.some(doc => doc.tipoDocumento === nuevoDocumento.tipoDocumento);

    if (documentoYaExiste) {
      console.warn('El documento ya existe para esta especialidad. No se ha añadido.');
      return; // No hacemos nada si es un duplicado
    }

    // Añadimos el nuevo documento y actualizamos el signal
    especialidadExistente.documentos.push(nuevoDocumento);

    const especialidadesActualizadas = [...especialidades.slice(0, indiceEspecialidad),
      especialidadExistente,
      ...especialidades.slice(indiceEspecialidad + 1)
    ];
    this.registrosDocumentosEspecialidad.update(() => especialidadesActualizadas);
  }

  eliminarDocumento(especialidadMedica: string, tipoDocumento: string): void {
    const especialidades = this.registrosDocumentosEspecialidad();
    const indiceEspecialidad = especialidades.findIndex(e => e.especialidad === especialidadMedica);

    if (indiceEspecialidad === -1) {
      console.error('La especialidad no se encontró, no se puede eliminar el documento.');
      return;
    }

    const especialidadParaModificar = {...especialidades[indiceEspecialidad]};
    const documentosActualizados = especialidadParaModificar.documentos.filter(d => d.tipoDocumento !== tipoDocumento);

    // Si la lista de documentos queda vacía, eliminamos la especialidad completa
    if (documentosActualizados.length === 0) {
      const especialidadesSinEspecialidad = [...especialidades.slice(0, indiceEspecialidad),
        ...especialidades.slice(indiceEspecialidad + 1)
      ];
      this.registrosDocumentosEspecialidad.update(() => especialidadesSinEspecialidad);
    } else {
      // Si aún hay documentos, actualizamos la especialidad con la nueva lista
      especialidadParaModificar.documentos = documentosActualizados;
      const especialidadesModificadas = [...especialidades.slice(0, indiceEspecialidad),
        especialidadParaModificar,
        ...especialidades.slice(indiceEspecialidad + 1)
      ];
      this.registrosDocumentosEspecialidad.update(() => especialidadesModificadas);
    }
  }

  siguientePasoStepper(): void {
    this.indice.update(value => value + 1);
  }

  anteriorPasoStepper(): void {
    this.indice.update(value => value - 1);
  }
}
