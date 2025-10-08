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
import {BOOLEAN_OPCIONES, DEPENDIENTES, INSTITUCIONES} from '@utils/constants';
import {TabPanel, TabView} from 'primeng/tabview';
import {HeaderTabComponent} from '../../../../components/header-tab/header-tab.component';
import {
  HeaderMedicoInternoComponent
} from '@pages/privado/shared/header-medico-interno/header-medico-interno.component';
import {EmptyTabComponent} from '../../../../components/empty-tab/empty-tab.component';
import {TabDocumento, TabNode} from '@models/tab-node.interface';
import {ActivatedRoute} from '@angular/router';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {mapearArregloTipoDropdown} from '@utils/funciones';
import {CatalogosGeneralesService} from '@services/catalogos-generales.service';
import {LoaderService} from '../../../../components/loader/services/loader.service';
import {finalize} from 'rxjs';
import {OfertaCardComponent} from '../../../../components/oferta-card/oferta-card.component';
import {KpiCardComponent} from '../../../../components/kpi-card/kpi-card.component';
import {UserService} from '@services/user.service';
import {SesionUser} from '@models/sesion-user.interface';
import {OnlyNumbersDirective} from '@directives/only-numbers.directive';
import {GeneralComponent} from '../../../../components/general.component';
import {EmailAllowCaractersDirective} from '@directives/email-allow-caracters.directive';
import {AlphanumericDirective} from '@directives/only-alphanumeric.directive';

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
    EmptyTabComponent,
    OnlyNumbersDirective,
    EmailAllowCaractersDirective,
    EmptyTabComponent,
    OfertaCardComponent,
    KpiCardComponent,
    AlphanumericDirective
  ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss',
})
export class InicioComponent extends GeneralComponent {

  readonly dependientes = DEPENDIENTES;
  readonly instituciones = INSTITUCIONES;
  readonly opciones_boolean = BOOLEAN_OPCIONES;

  fb: FormBuilder = inject(FormBuilder);
  formRegistro!: FormGroup;
  formZonaInteres!: FormGroup;
  formDocumentosEspecialidad!: FormGroup;
  formTablero!: FormGroup;

  zonasInteres: WritableSignal<any[]> = signal([]);
  registrosDocumentosEspecialidad: WritableSignal<TabNode[]> = signal([]);

  steps = [
    {label: 'Información Personal', active: false},
    {label: 'Documentos de escolaridad', active: false},
    {label: 'Oferta laboral', active: false},
  ];

  sustituto!: any;
  empleo!: any;
  institucionSeleccionada = true;
  userData!: SesionUser;

  dummies = [{label: 'Dummie', value: 'Dummie'}, {label: 'Dummie 2', value: 'Dummie 2'}];

  sexos: TipoDropdown[] = [];
  estadosCiviles: TipoDropdown[] = [];
  paises: TipoDropdown[] = [];
  lugaresNacimiento: TipoDropdown[] = [];
  estados: TipoDropdown[] = [];
  municipios: TipoDropdown[] = [];
  colonias: TipoDropdown[] = [];
  ooad: TipoDropdown[] = [];
  zonas: TipoDropdown[] = [];

  ooad_tablero: TipoDropdown[] = [];
  zona_tablero: TipoDropdown[] = [];
  especialidad_tablero: TipoDropdown[] = [];
  regimen_tablero: TipoDropdown[] = [];
  bono_tablero: TipoDropdown[] = [];

  indice: WritableSignal<number> = signal<number>(2);

  catalogoService: CatalogosGeneralesService = inject(CatalogosGeneralesService);
  loaderService: LoaderService = inject(LoaderService);
  userService: UserService = inject(UserService);

  constructor(private readonly activatedRoute: ActivatedRoute) {
    super();
    this.formRegistro = this.asignarFormularioRegistro();
    this.formZonaInteres = this.asignarFormularioZonaInteres();
    this.formDocumentosEspecialidad = this.asignarFormularioDocumentosEspecialidad();
    this.formTablero = this.asignarFormTablero();
    this.obtenerCatalogos();
    this.suscribirObservables();
    this.subscribirseACambioComponentes();
    this.settearDatosUsuario();
  }

  asignarFormularioRegistro(): FormGroup {
    return this.fb.group({
      rfc: [],
      nss: [{value: '', disabled: false}, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      fechaNacimiento: [{value: '', disabled: true}],
      sexo: [{value: '', disabled: true}],
      estadoCivil: [],
      dependientes: [],
      hijos: [{value: '', disabled: true}, [Validators.required, Validators.min(1)]],
      otros: [{value: '', disabled: true}, [Validators.required]],
      correo: [{value: '', disabled: true}],
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
    });
  }

  suscribirObservables(): void {
    this.formRegistro.get('pais')?.valueChanges.subscribe(value => this.obtenerEstadoPorPais(value));
    this.formRegistro.get('estado')?.valueChanges.subscribe(value => this.obtenerMunicipioPorEstado(value));
    this.formRegistro.get('municipio')?.valueChanges.subscribe(value => this.obtenerValoresPorMunicipio(value));
  }

  settearDatosUsuario(): void {
    this.userService.userData$.subscribe({next: (info) => this.userData = info});
    const fecha = this.obtenerFechaNacimientoDeCURP(this.userData.refCurp);
    const sexo = this.obtenerSexoDeCurp(this.userData.refCurp);
    this.formRegistro.get('fechaNacimiento')?.setValue(fecha);
    this.formRegistro.get('sexo')?.setValue(sexo);
    this.formRegistro.get('correo')?.setValue(this.userData.refEmail);
  }

  obtenerFechaNacimientoDeCURP(curp: string): Date {
    let anio = parseInt(curp.substring(4, 6), 10).toString();
    const mes = curp.substring(6, 8);
    const dia = curp.substring(8, 10);
    anio.length == 1 ? anio = 20 + anio : anio = 19 + anio;
    return new Date(parseInt(anio, 10), parseInt(mes, 10) - 1, parseInt(dia, 10));
  }

  obtenerSexoDeCurp(curp: string): any {
    const sexo = curp[10] as 'H' | 'M';
    const sexosMap = {
      'H': this.sexos.find(sexo => sexo.label === 'Masculino'),
      'M': this.sexos.find(sexo => sexo.label === 'Mujer')
    };
    return sexosMap[sexo];
  }

  subscribirseACambioComponentes(): void {
    this.formRegistro.get('dependientes')?.valueChanges.subscribe(value => {
        this.formRegistro.get('hijos')?.disable();
        this.formRegistro.get('otros')?.disable();
        this.formRegistro.get('hijos')?.patchValue(null);
        this.formRegistro.get('otros')?.patchValue(null);
        this.formRegistro.get('hijos')?.reset;
        this.formRegistro.get('otros')?.reset;

        if (this.formRegistro.get('dependientes')?.value === this.dependientes[1]) {
          this.formRegistro.get('hijos')?.enable();
        }
        if (this.formRegistro.get('dependientes')?.value === this.dependientes[3]) {
          this.formRegistro.get('otros')?.enable();
        }
      }
    );
  }

  obtenerEstadoPorPais(pais: number): void {
    if (!pais) return;
    this.loaderService.activar();
    this.catalogoService.getLstEstadosByPais(pais).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (valor) => {
        this.estados = mapearArregloTipoDropdown(valor.respuesta, 'desEstado', 'idEstado');
      }
    });
  }

  obtenerMunicipioPorEstado(estado: number): void {
    if (!estado) return;
    this.loaderService.activar();
    this.catalogoService.getLstDelegacionesMunicipiosByEstado(estado).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (valor) => {
        this.municipios = mapearArregloTipoDropdown(valor.respuesta, 'desMunicipio', 'idMunicipio');
      }
    });
  }

  obtenerValoresPorMunicipio(municipio: number): void {
    this.obtenerOOADPorMunicipio(municipio);
    this.obtenerZonasPorMunicipio(municipio);
    this.obtenerAlcaldiaPorMunicipio(municipio);
  }

  obtenerAlcaldiaPorMunicipio(municipio: number): void {
    if (!municipio) return;
    this.loaderService.activar();
    this.catalogoService.getLstColoniasByDelegacion(municipio).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (valor) => {
        this.colonias = mapearArregloTipoDropdown(valor.respuesta, 'nomColonia', 'idColonia');
      }
    });
  }

  obtenerOOADPorMunicipio(municipio: number): void {
    if (!municipio) return;
    this.loaderService.activar();
    this.catalogoService.getLstOOADS(municipio).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (valor) => {
        this.ooad = mapearArregloTipoDropdown(valor.respuesta, 'desOoad', 'idOoad');
      }
    });
  }

  obtenerZonasPorMunicipio(municipio: number): void {
    if (!municipio) return;
    this.catalogoService.getLstZonas(municipio).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (valor) => {
        this.zonas = mapearArregloTipoDropdown(valor.respuesta, 'desZona', 'idZona');
      }
    });
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

  devolverTextoOoad(idOOAD: string): string {
    const ooad = this.ooad.find(element => idOOAD == element.value);
    return ooad?.label || "";
  }

  devolverTextoZonaInnteres(idZona: string): string {
    const zona = this.zonas.find(element => idZona == element.value);
    return zona?.label || "";
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      const [sexos, estadosCiviles, paises, lugaresNacimiento] = respuesta;
      this.sexos = mapearArregloTipoDropdown(sexos.respuesta, 'desSexo', 'idSexo');
      this.estadosCiviles = mapearArregloTipoDropdown(estadosCiviles.respuesta, 'desEstadoCivil', 'idEstadoCivil');
      this.paises = mapearArregloTipoDropdown(paises.respuesta, 'desPais', 'idPais');
      this.lugaresNacimiento = mapearArregloTipoDropdown(lugaresNacimiento.respuesta, 'desLugarNacimiento', 'idLugarNacimiento');
    });
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
    if (this.indice() == 0 || this.formRegistro.invalid) {
      this._alertServices.alerta(this._Mensajes.MSG023);
    }
    this.indice.update(value => value + 1);
  }

  anteriorPasoStepper(): void {
    this.indice.update(value => value - 1);
  }

  asignarFormTablero(): FormGroup {
    return this.fb.group({
      ooad_tablero: [],
      zona_tablero: [],
      especialidad_tablero: [],
      regimen_tablero: [],
      bono_tablero: []
    })
  }
}
