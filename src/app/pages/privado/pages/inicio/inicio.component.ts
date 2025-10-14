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
import { ContactoRequest, DataContacto, DatosContacto, DatosContactoResponse } from '@models/datosContacto';
import { DatosDocumentoResponse } from '@models/datosDocumento';
import { finalize } from 'rxjs';
import { GeneralComponent } from '../../../../components/general.component';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { SesionUser } from '@models/sesion-user.interface';
import { DataDomicilio, DatosDomicilio, Estado, Pais, Residencia } from '@models/datosDomicilio';
import { ResponseGeneral } from '@models/responseGeneral';

import { Colonia } from '@models/colonia';


import { DataFotografia, FotografiaRequest, FotografiaResponse } from '@models/fotografia';
import { DatosPersonales } from '@models/datosPersonales';
import { Sexo } from '@models/sexo';
import { Dependientes } from '@models/dependiente';

import { OnlyNumbersDirective } from '@directives/only-numbers.directive';
import { EmailAllowCaractersDirective } from '@directives/email-allow-caracters.directive';
import { EstadoCivil } from '@models/estadoCivil';
import { OfertaLaboralComponent } from '@privado/oferta-laboral/oferta-laboral.component';
import { dataGenerales, DatosGeneralesRequest, DatosGeneralesResponse } from '@models/datosGenerales';
import { InteresLaboral } from '@models/aspirante';


import moment from 'moment';


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
    OfertaLaboralComponent
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
  // userData!: SesionUser;

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

  constructor(private readonly activatedRoute: ActivatedRoute) {

    super()
    this.userService.userData$.subscribe(user => this.userData = user);

    this.formRegistro = this.asignarFormularioRegistro();
    this.formZonaInteres = this.asignarFormularioZonaInteres();
    this.formDocumentosEspecialidad = this.asignarFormularioDocumentosEspecialidad();
    this.obtenerCatalogos();
    this.suscribirObservables();
    this.subscribirseACambioComponentes();
    this.subscribirseEstadoNacimiento();
    this.subscribirseEstadoCivil();
    this.settearDatosUsuario();
    this.subscribirsePaisNacimiento();
    this.obtenerDatosGenerales(this.userData?.idUsuario);




  }
  asignarFormularioRegistro(): FormGroup {
    return this.fb.group({
      rfc: [],

      nss: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      fechaNacimiento: [{ value: '', disabled: true }],
      sexo: [{ value: '', disabled: true }],
      estadoCivil: [],
      dependientes: [],
      hijos: [{ value: '', disabled: true }, [Validators.required, Validators.min(1)]],
      otros: [{ value: '', disabled: true }, [Validators.required]],
      correo: [{ value: '', disabled: true }],

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
    this.formRegistro.get('paisNacimiento')?.valueChanges.subscribe(value => this.obtenerEstadoPorPais(value));
    this.formRegistro.get('pais')?.valueChanges.subscribe(value => this.obtenerEstadoPorPais(value));
    this.formRegistro.get('estado')?.valueChanges.subscribe(value => this.obtenerMunicipioPorEstado(value));
    this.formRegistro.get('municipio')?.valueChanges.subscribe(value => this.obtenerValoresPorMunicipio(value));
  }

  settearDatosUsuario(): void {
    // this.userService.userData$.subscribe({ next: (info) => this.userData = info });
    console.log("this.userData ", this.userData);
    const fecha = this.obtenerFechaNacimientoDeCURP(this.userData?.refCurp + '');
    const sexo = this.obtenerSexoDeCurp(this.userData?.refCurp + '');
    this.formRegistro.get('fechaNacimiento')?.setValue(fecha);
    this.formRegistro.get('sexo')?.setValue(sexo);
    this.formRegistro.get('correo')?.setValue(this.userData?.refEmail + '');
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

  estadoCilvilSeleccionado!: any;
  subscribirseEstadoCivil(): void {

    this.formRegistro.get('estadoCivil')?.valueChanges.subscribe(value => {
      this.estadoCilvilSeleccionado = value;
    }
    );
  }

  paisNacimientoSeleccionado!: any;
  subscribirsePaisNacimiento(): void {

    this.formRegistro.get('paisNacimiento')?.valueChanges.subscribe(value => {
      this.paisNacimientoSeleccionado = value;
    }
    );
  }
  estadoNacimientoSeleccionado!: any;
  subscribirseEstadoNacimiento(): void {

    this.formRegistro.get('estadoNacimiento')?.valueChanges.subscribe(value => {
      this.estadoNacimientoSeleccionado = value;
    }
    );
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
    this.catalogoService.getLstEstadosByPais(pais).subscribe({
      next: (valor) => {
        this.estados = mapearArregloTipoDropdown(valor.respuesta, 'desEstado', 'idEstado');
      }
    });
  }

  obtenerMunicipioPorEstado(estado: number): void {
    if (!estado) return;
    this.catalogoService.getLstDelegacionesMunicipiosByEstado(estado).subscribe({
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
    this.catalogoService.getLstColoniasByDelegacion(municipio).subscribe({
      next: (valor) => {
        this.colonias = mapearArregloTipoDropdown(valor.respuesta, 'nomColonia', 'idColonia');
      }
    });
  }

  obtenerOOADPorMunicipio(municipio: number): void {
    if (!municipio) return;
    this.catalogoService.getLstOOADS(municipio).subscribe({
      next: (valor) => {
        this.ooad = mapearArregloTipoDropdown(valor.respuesta, 'desOoad', 'idOoad');
      }
    });
  }

  obtenerZonasPorMunicipio(municipio: number): void {
    if (!municipio) return;
    this.catalogoService.getLstZonas(municipio).subscribe({
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
    if (this.zonasInteres().length <= 2) {
      const nuevaZona = this.crearRegistroZonaInteres();
      if (this.zonasInteres().filter(x => x.ooad == nuevaZona.ooad && x.zonaInteres == nuevaZona.zonaInteres).length == 0) {
        this.zonasInteres.update(value => [...value, nuevaZona]);
      } else {

        this._alertServices.alerta("Ya seleccionaste esta opción anteriormente");
      }



    } else {
      this._alertServices.alerta("Ya seleccionaste tus 3 opciones.");
    }
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


  datosFoto!: FotografiaResponse;




  datosGenerales!: DatosGeneralesResponse;
  obtenerDatosGenerales(idusuario: number | undefined): void {
    if (!idusuario) return;

    console.log("usuario a buscar: ", idusuario);
    this._ConvocatoriaService.getDatosGenerales(idusuario).pipe(

    ).subscribe({
      next: (response: dataGenerales) => {
        if (response.exito) {
          this.datosGenerales = response.respuesta;
          this.setDatosGenerales();
        }

      }
    });
  }






  datosDomicilio!: DatosDomicilio;


  datosInteresLaboral!: any;



  private setDatosGenerales() {

    if (this.datosGenerales.datosContacto) {
      this.formRegistro.controls['correo'].setValue(this.datosGenerales.datosContacto.refEmail);
      this.formRegistro.controls['correoAdicional'].setValue(this.datosGenerales.datosContacto.refCorreoAdicional);
      this.formRegistro.controls['telefonoCasa'].setValue(this.datosGenerales.datosContacto.refTelefonoCasa);
      this.formRegistro.controls['telefonoCelular'].setValue(this.datosGenerales.datosContacto.refTelefonoCelular);
    }


    if (this.datosGenerales.datosPersonales) {
      this.formRegistro.controls['rfc'].setValue(this.datosGenerales.datosPersonales?.refRfc);
      this.formRegistro.controls['nss'].setValue(this.datosGenerales.datosPersonales?.refNss);

        this.formRegistro.get('estadoCivil')?.patchValue(this.datosGenerales.datosPersonales?.estadoCivil?.idEstadoCivil);
        this.formRegistro.get('paisNacimiento')?.patchValue(this.datosGenerales.datosPersonales.paisNacimiento?.idPais);
        this.formRegistro.get('estadoNacimiento')?.patchValue(this.datosGenerales.datosPersonales.lugarNacimiento?.idLugarNacimiento);


    }

    if (this.datosGenerales.datosResidenciaActual) {

    //domicilio
    this.formRegistro.controls['codigoPostal'].setValue(this.datosGenerales.datosResidenciaActual?.colonia?.refCodigoPostal);
    this.formRegistro.get('pais')?.patchValue(this.datosGenerales.datosResidenciaActual?.pais?.idPais);
    this.formRegistro.get('estado')?.patchValue(this.datosGenerales.datosResidenciaActual?.estado?.idEstado);
    this.formRegistro.get('municipio')?.patchValue(this.datosGenerales.datosResidenciaActual?.delegacion?.idMunicipio);
    this.formRegistro.get('colonia')?.patchValue(this.datosGenerales.datosResidenciaActual?.colonia?.idColonia);


    this.formRegistro.controls['calle'].setValue(this.datosGenerales.datosResidenciaActual?.nomCalle);
    this.formRegistro.controls['numeroExterior'].setValue(this.datosGenerales.datosResidenciaActual?.refNumero);
    }
    //foto



    if (this.datosGenerales.dependientes?.indPadres == 1 && this.datosGenerales.dependientes?.refCantidadHijos == null) {
      this.formRegistro.get('dependientes')?.setValue(this.dependientes[0]);
    } else {
      this.formRegistro.get('dependientes')?.setValue(this.dependientes[1]);
    }

    if (this.datosGenerales.dependientes?.indConyuge == 1) {
      this.formRegistro.get('dependientes')?.setValue(this.dependientes[2]);
    }
    if (this.datosGenerales.dependientes?.refOtro != null) {
      this.formRegistro.get('dependientes')?.setValue(this.dependientes[3]);
    }
    this.subscribirseACambioComponentes();
    this.formRegistro.get('hijos')?.setValue(this.datosGenerales.dependientes?.refCantidadHijos);
    this.formRegistro.get('otros')?.setValue(this.datosGenerales.dependientes?.refOtro);
    let lst = [];


    if (this.datosGenerales.zonasInteresLaboral) {

      const zonasInteresLaboral = this.datosGenerales.zonasInteresLaboral.map((zona:InteresLaboral) =>({
        idInteresOoadZona: zona.idInteresOoadZona,
        cveOoad: zona.cveOoad,
        desOoad: zona.desOoad,
        cveZona: zona.cveZona,
        desZona: zona.desZona,
        ooad: zona.cveOoad,
        zonaInteres: zona.cveZona
      }));


    this.zonasInteres.set(zonasInteresLaboral);

  }



  }







  private saveContacto(): DatosContacto {
    let contacto = {...this.datosGenerales.datosContacto}
    contacto.refCorreoAdicional = this.formRegistro.controls['correoAdicional'].value;
    contacto.refTelefonoCasa = this.formRegistro.controls['telefonoCasa'].value;
    contacto.refTelefonoCelular = this.formRegistro.controls['telefonoCelular'].value;
    let pais:Pais ={
      nomPaisNacimiento: this.paisNacimientoSeleccionado.label,
      idPais: this.paisNacimientoSeleccionado.value,
      cvePais: '',
      desPais: ''
    }
    contacto.paisNacimiento = pais;
    let estado :Estado ={
      idLugarNacimiento: this.estadoNacimientoSeleccionado.value,
      idEstado: 0,
      desEstado: ''
    }

    contacto.lugarNacimiento = estado;

    return contacto;
  }

  private saveDomicilio(): Residencia {
    let residencia = new Residencia();


    let idColonia = this.formRegistro.controls['colonia'].value;
    residencia.colonia = this.obtenerColonia(idColonia);
    residencia.nomCalle = this.formRegistro.controls['calle'].value;
    residencia.refNumero = this.formRegistro.controls['numeroExterior'].value;

    return residencia;
  }


  private saveDependientes(): Dependientes {
    let dependientes = new Dependientes();
    let d = this.formRegistro.controls['dependientes'].value;

    dependientes.indConyuge = d.key == 'P' ? 1 : 0;
    dependientes.indPadres = d.key == 'A' ? 1 : 0;
    dependientes.refCantidadHijos = this.formRegistro.controls['hijos'].value;
    dependientes.refOtro = this.formRegistro.controls['otros'].value;

    return dependientes;
  }
  private saveDatosGenerales() {
    let datos = new DatosGeneralesRequest();
    datos.datosContacto = this.saveContacto();
    datos.datosResidenciaActual = this.saveDomicilio();
    datos.datosPersonales = this.saveFoto();
    datos.dependientes = this.saveDependientes();



  //  datos.zonasInteresLaboral = new Array<InteresLaboral>();


    const zonasInteresLaboral = this.zonasInteres().map((reg:InteresLaboral) =>({
      cveOoad: reg.ooad+'',
      desOoad : this.devolverTextoOoad(reg.ooad+''),
      desZona :this.devolverTextoZonaInnteres(reg.zonaInteres+''),
      cveZona: reg.zonaInteres+''
    }));

      datos.zonasInteresLaboral=zonasInteresLaboral;


    this._ConvocatoriaService.guardarDatosGenerales(datos).subscribe({
      next: (data: ResponseGeneral) => {

        if (data.exito) {
          this.indice.update((value: number) => value + 1);
          return this._alertServices.exito(data.mensaje)

        }
        return this._alertServices.error(data.mensaje)

      },
      error: (err: ResponseGeneral) => {
        this._alertServices.error(err.mensaje);

      }
    });

  }

  private obtenerColonia(idColonia: number): Colonia {

    let colonia = this.colonias.find(x => x.value == idColonia);
    return {
    idColonia : parseInt(colonia?.value + ''),
    nomColonia : colonia?.label + '',
    refCodigoPostal : '' + this.formRegistro.controls['codigoPostal'].value
    }

  }
  private saveFoto(): DatosPersonales {
    let fotografia = new FotografiaRequest();
    fotografia.datosPersonales = this.datosGenerales.datosPersonales;



    fotografia.datosPersonales.estadoCivil = new EstadoCivil();
    fotografia.datosPersonales.estadoCivil.idEstadoCivil = parseInt(this.estadoCilvilSeleccionado.value.toString());


    let fechaFormateada = moment(this.formRegistro.controls['fechaNacimiento'].value, "DD/MM/YYYY").format('DD/MM/YYYY');

    fotografia.datosPersonales.refRfc = this.formRegistro.controls['rfc'].value;
    fotografia.datosPersonales.refNss = this.formRegistro.controls['nss'].value;
    fotografia.datosPersonales.fecNacimiento = fechaFormateada;
    let sexo = this.formRegistro.controls['sexo'].value;
    let sex:Sexo = {
    idSexo : sexo.value,
    }
    fotografia.datosPersonales.sexo = sex;




    return fotografia.datosPersonales;
  }

  private btnGuardar(paso: number) {
    switch (paso) {
      case 0:
        console.log("el form registro", this.formRegistro);

        this.saveDatosGenerales();
        break;

      default:
        break;
    }
  }



  siguientePasoStepper(): void {


    //
    switch (this.indice()) {
      case 0:
        if (this.formRegistro.invalid) {
          this._alertServices.alerta(this._Mensajes.MSG023);
        }
        return this.btnGuardar(this.indice());



        break;

      case 1:
        if (this.formDocumentosEspecialidad.valid)
          this.btnGuardar(this.indice());

        this._alertServices.alerta(this._Mensajes.MSG023);

        break;

      default:
        break;
    }






  }

  anteriorPasoStepper(): void {
    this.indice.update(value => value - 1);
  }
}
