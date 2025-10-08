import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Card } from 'primeng/card';
import { BtnRegresarComponent } from '../../../../components/btn-regresar/btn-regresar.component';
import { StepsComponent } from '../../../../components/steps/steps.component';
import { UploadPhotoComponent } from '../../../../components/upload-photo/upload-photo.component';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { UploadDocumentComponent } from '../../../../components/upload-document/upload-document.component';
import { RadioButton } from 'primeng/radiobutton';
import { BOOLEAN_OPCIONES, DEPENDIENTES, INSTITUCIONES } from '@utils/constants';
import { TabPanel, TabView } from 'primeng/tabview';
import { HeaderTabComponent } from '../../../../components/header-tab/header-tab.component';
import {
  HeaderMedicoInternoComponent
} from '@pages/privado/shared/header-medico-interno/header-medico-interno.component';
import { EmptyTabComponent } from '../../../../components/empty-tab/empty-tab.component';
import { TabDocumento, TabNode } from '@models/tab-node.interface';
import { ActivatedRoute } from '@angular/router';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { ConvocatoriaService } from '@services/convocatoria.service';
import { LoaderService } from '../../../../components/loader/services/loader.service';
import { ContactoRequest, DataContacto, DatosContactoResponse } from '@models/datosContacto';
import { DatosDocumentoResponse } from '@models/datosDocumento';
import { finalize } from 'rxjs';
import { GeneralComponent } from '../../../../components/general.component';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { SesionUser } from '@models/sesion-user.interface';
import { DataDomicilio, DatosDomicilio, Residencia, ResidenciaRequest } from '@models/datosDomicilio';
import { ResponseGeneral } from '@models/responseGeneral';
import { HttpErrorResponse } from '@angular/common/http';
import { Colonia } from '@models/colonia';
import{EstadoCivil} from '@models/aspirante';
import { DataFotografia, FotografiaRequest, FotografiaResponse } from '@models/fotografia';
import { DatosPersonales } from '@models/datosPersonales';
import { Sexo } from '@models/sexo';

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
export class InicioComponent extends GeneralComponent {




  readonly dependientes = DEPENDIENTES;
  readonly instituciones = INSTITUCIONES;
  readonly opciones_boolean = BOOLEAN_OPCIONES;

  userService = inject(UserService);
  fb: FormBuilder = inject(FormBuilder);
  formRegistro!: FormGroup;
  formZonaInteres!: FormGroup;
  formDocumentosEspecialidad!: FormGroup;
  userData: SesionUser | null = null;
  zonasInteres: WritableSignal<any[]> = signal([]);
  registrosDocumentosEspecialidad: WritableSignal<TabNode[]> = signal([]);

  steps = [
    { label: 'Información Personal', active: false },
    { label: 'Documentos de escolaridad', active: false },
    { label: 'Oferta laboral', active: false },
  ];

  sustituto!: any;
  empleo!: any;
  institucionSeleccionada = true;

  dummies = [{ label: 'Dummie', value: 'Dummie' }, { label: 'Dummie 2', value: 'Dummie 2' }];

  sexos: TipoDropdown[] = [];
  estadosCiviles: TipoDropdown[] = [];
  paises: TipoDropdown[] = [];
  lugaresNacimiento: TipoDropdown[] = [];
  estados: TipoDropdown[] = [];
  municipios: TipoDropdown[] = [];
  colonias: TipoDropdown[] = [];
  ooad: TipoDropdown[] = [];
  zonas: TipoDropdown[] = [];

  indice: WritableSignal<number> = signal<number>(0);

  catalogoService: CatalogosGeneralesService = inject(CatalogosGeneralesService);
  _ConvocatoriaService: ConvocatoriaService = inject(ConvocatoriaService);
  loaderService: LoaderService = inject(LoaderService);

  constructor(private readonly activatedRoute: ActivatedRoute) {
    super()
    this.userService.userData$.subscribe(user => this.userData = user);
    this.formRegistro = this.asignarFormularioRegistro();
    this.formZonaInteres = this.asignarFormularioZonaInteres();
    this.formDocumentosEspecialidad = this.asignarFormularioDocumentosEspecialidad();
    this.obtenerCatalogos();
    this.suscribirObservables();

    this.obtenerDatosContacto(this.userData?.idUsuario);
    this.obtenerDatosDomicilio(this.userData?.idUsuario);
    this.obtenerDatosFotografia(this.userData?.idUsuario);
  }

  asignarFormularioRegistro(): FormGroup {
    return this.fb.group({
      rfc: [],
      nss: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      fechaNacimiento: [],
      sexo: [],
      estadoCivil: [],
      dependientes: [],
      hijos: [{ value: '', disabled: true }],
      otros: [{ value: '', disabled: true }],
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
    });
  }

  suscribirObservables(): void {
    this.formRegistro.get('pais')?.valueChanges.subscribe(value => this.obtenerEstadoPorPais(value));
    this.formRegistro.get('estado')?.valueChanges.subscribe(value => this.obtenerMunicipioPorEstado(value));
    this.formRegistro.get('municipio')?.valueChanges.subscribe(value => this.obtenerValoresPorMunicipio(value));
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
      ooad: [{ value: '', disabled: false }, [Validators.required]],
      zonaInteres: [{ value: '', disabled: false }, [Validators.required]]
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

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({ respuesta }) => {
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
    const especialidadExistente = { ...especialidades[indiceEspecialidad] };
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

    const especialidadParaModificar = { ...especialidades[indiceEspecialidad] };
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

  datosDocumento!: DatosDocumentoResponse;
  obtenerDatosDocumento(idusuario: number): void {
    if (!idusuario) return;
    this.loaderService.activar();
    this._ConvocatoriaService.getDatosDocumentos(idusuario).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (response: DatosDocumentoResponse) => {
        this.datosDocumento = response;
      }
    });
  }

  
  datosFoto!: FotografiaResponse;
  obtenerDatosFotografia(idusuario: number | undefined): void {
    if (!idusuario) return;
    this.loaderService.activar();

    this._ConvocatoriaService.getDatosFotografia(idusuario).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (response: DataFotografia) => {
        if (response.exito) {
          this.datosFoto = response.respuesta;
          this.setDatosFoto();
        }

      }
    });
  }

  datosContacto!: DatosContactoResponse;
  obtenerDatosContacto(idusuario: number | undefined): void {
    if (!idusuario) return;
    this.loaderService.activar();
    console.log("usuario a buscar: ", idusuario);
    this._ConvocatoriaService.getDatosContacto(idusuario).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (response: DataContacto) => {
        if (response.exito) {
          this.datosContacto = response.respuesta;
          this.setDatosContacto();
        }

      }
    });
  }



  datosDomicilio!: DatosDomicilio;
  obtenerDatosDomicilio(idusuario: number | undefined): void {
    if (!idusuario) return;
    this.loaderService.activar();

    this._ConvocatoriaService.getDatosResidencia(idusuario).pipe(
      finalize((() => this.loaderService.desactivar()))
    ).subscribe({
      next: (response: DataDomicilio) => {
        if (response.exito) {
          this.datosDomicilio = response.respuesta;
          this.setDatosDomicilio();
        }

      }
    });
  }

  private setDatosContacto() {
    this.formRegistro.controls['correo'].setValue(this.datosContacto.datosContacto.refEmail);
    this.formRegistro.controls['correoAdicional'].setValue(this.datosContacto.datosContacto.refCorreoAdicional);
    this.formRegistro.controls['telefonoCasa'].setValue(this.datosContacto.datosContacto.refTelefonoCasa);
    this.formRegistro.controls['telefonoCelular'].setValue(this.datosContacto.datosContacto.refTelefonoCelular);
    this.formRegistro.controls['paisNacimiento'].setValue(this.datosContacto.datosContacto.paisNacimiento);
    this.formRegistro.controls['estadoNacimiento'].setValue(this.datosContacto.datosContacto.lugarNacimiento?.idLugarNacimiento);

  }




  private setDatosDomicilio() {
    this.formRegistro.controls['codigoPostal'].setValue(this.datosDomicilio.datosResidenciaActual?.codigoPostal);
    this.formRegistro.controls['pais'].setValue(this.datosDomicilio.datosResidenciaActual?.pais);
    this.formRegistro.controls['estado'].setValue(this.datosDomicilio.datosResidenciaActual?.estado);
    this.formRegistro.controls['municipio'].setValue(this.datosDomicilio.datosResidenciaActual?.municipio);
    this.formRegistro.controls['colonia'].setValue(this.datosDomicilio.datosResidenciaActual?.colonia);
    this.formRegistro.controls['calle'].setValue(this.datosDomicilio.datosResidenciaActual?.calle);
    this.formRegistro.controls['numeroExterior'].setValue(this.datosDomicilio.datosResidenciaActual?.numeroExterior);


  }

  private setDatosFoto() {
    this.formRegistro.controls['rfc'].setValue(this.datosFoto.datosPersonales?.refRfc);
    this.formRegistro.controls['nss'].setValue(this.datosFoto.datosPersonales?.refNss);
    this.formRegistro.controls['fechaNacimiento'].setValue(this.datosFoto.datosPersonales?.fecNacimiento);
    this.formRegistro.controls['sexo'].setValue(this.datosFoto.datosPersonales?.sexo?.desSexo);
    this.formRegistro.controls['estadoCivil'].setValue(this.datosFoto.datosPersonales?.estadoCivil?.desEstadoCivil);
    


  }

  private saveContacto() {
    let contacto = new ContactoRequest();
    contacto.datosPersonales = this.datosContacto.datosPersonales;

    this.datosContacto.datosContacto.refEmail = this.formRegistro.controls['correo'].value;
    this.datosContacto.datosContacto.refCorreoAdicional = this.formRegistro.controls['correoAdicional'].value;
    this.datosContacto.datosContacto.refTelefonoCasa = this.formRegistro.controls['telefonoCasa'].value;
    this.datosContacto.datosContacto.refTelefonoCelular = this.formRegistro.controls['telefonoCelular'].value;
    this.datosContacto.datosContacto.paisNacimiento = this.formRegistro.controls['paisNacimiento'].value;
    this.datosContacto.datosContacto.lugarNacimiento = this.formRegistro.controls['estadoNacimiento'].value;
    contacto.datosContacto = this.datosContacto.datosContacto;
    this._ConvocatoriaService.guardarContacto(contacto).subscribe({
      next: (data: ResponseGeneral) => {

        if (data.exito) {
          return this._alertServices.exito(data.mensaje)
        }
        return this._alertServices.error(data.mensaje)

      },
      error: (err: HttpErrorResponse) => {
        this._alertServices.error(err.message);

      }
    });

  }

  private saveDomicilio() {
    let residencia = new ResidenciaRequest();
    residencia.datosPersonales = this.datosContacto.datosPersonales;

    this.datosDomicilio.datosResidenciaActual = new Residencia();

    let idColonia = this.formRegistro.controls['colonia'].value;
    this.obtenerColonia(idColonia);
    this.datosDomicilio.datosResidenciaActual.nomCalle = this.formRegistro.controls['calle'].value;
    this.datosDomicilio.datosResidenciaActual.refNumero = this.formRegistro.controls['numeroExterior'].value;
    this.datosDomicilio.datosResidenciaActual.codigoPostal = this.formRegistro.controls['codigoPostal'].value;
    this.datosDomicilio.datosResidenciaActual.pais = this.formRegistro.controls['pais'].value;
    this.datosDomicilio.datosResidenciaActual.estado = this.formRegistro.controls['estado'].value;
    this.datosDomicilio.datosResidenciaActual.municipio = this.formRegistro.controls['municipio'].value;
    residencia.datosResidenciaActual = this.datosDomicilio.datosResidenciaActual;
    this._ConvocatoriaService.guardarResidencia(residencia).subscribe({
      next: (data: ResponseGeneral) => {

        if (data.exito) {
          return this._alertServices.exito(data.mensaje)
        }
        return this._alertServices.error(data.mensaje)

      },
      error: (err: HttpErrorResponse) => {
        this._alertServices.error(err.message);

      }
    });

  }

  private obtenerColonia(idColonia: number) {
    debugger
    let colonia = this.colonias.find(x => x.value == idColonia);
    let asentamiento = new Colonia();
    asentamiento.idColonia = parseInt(colonia?.value + '');
    asentamiento.nomColonia = colonia?.label + '';
    this.datosDomicilio.datosResidenciaActual.colonia = asentamiento;
  }
  private saveFoto() {
    let fotografia = new FotografiaRequest();
    fotografia.datosPersonales = this.datosContacto.datosPersonales;

    fotografia.datosPersonales = new DatosPersonales();
    this.datosFoto.datosPersonales.sexo = new Sexo();
    this.datosFoto.datosPersonales.estadoCivil = new EstadoCivil();

 
    this.datosFoto.datosPersonales.refRfc = this.formRegistro.controls['rfc'].value;
    this.datosFoto.datosPersonales.refNss = this.formRegistro.controls['nss'].value;
    this.datosFoto.datosPersonales.fecNacimiento = this.formRegistro.controls['fechaNacimiento'].value;
    this.datosFoto.datosPersonales.sexo.desSexo = this.formRegistro.controls['sexo'].value;
    this.datosFoto.datosPersonales.estadoCivil.desEstadoCivil = this.formRegistro.controls['estadoCivil'].value;
    
    fotografia.datosPersonales = this.datosFoto.datosPersonales;
    this._ConvocatoriaService.guardarFoto(fotografia).subscribe({
      next: (data: ResponseGeneral) => {

        if (data.exito) {
          return this._alertServices.exito(data.mensaje)
        }
        return this._alertServices.error(data.mensaje)

      },
      error: (err: HttpErrorResponse) => {
        this._alertServices.error(err.message);

      }
    });

  }

  private btnGuardar(paso: number) {
    switch (paso) {
      case 0:
        console.log("el form registro", this.formRegistro);
        this.saveDomicilio();
        this.saveContacto();
        this.saveFoto();

        break;

      default:
        break;
    }
  }

  siguientePasoStepper(): void {

    this.btnGuardar(this.indice());
    this.indice.update(value => value + 1);


  }

  anteriorPasoStepper(): void {
    this.indice.update(value => value - 1);
  }
}
