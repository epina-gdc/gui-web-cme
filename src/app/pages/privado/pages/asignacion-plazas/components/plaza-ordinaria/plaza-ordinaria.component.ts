import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {GeneralComponent} from '@components/general.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {PlazaDisponibleCardComponent} from '@components/plaza-disponible-card/plaza-disponible-card.component';
import {FiltroConsultaPlazaInterface} from '@models/filtroConsultaPlaza.interface';
import {HeaderMedicoDetalleOfertaComponent} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DetallePlazaComponent} from '@privado/asignacion-plazas/components/detalle-plaza/detalle-plaza.component';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { DisponiblesRequest, InfoAspirante, Plaza, Regimen, TipoAsignacion } from '@models/datosAsignacion';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import {Paginator, PaginatorState} from 'primeng/paginator';
import { EstadoOfertaService } from '@services/estado-oferta.service';
import {OnlyNumbersDirective} from '@directives/only-numbers.directive';


@Component({
  selector: 'app-plaza-ordinaria',
  imports: [
    ReactiveFormsModule,
    PlazaDisponibleCardComponent,
    Select,
    InputText,
    Button,
    Paginator,
    CommonModule,
    OnlyNumbersDirective
],
  templateUrl: './plaza-ordinaria.component.html',
  styleUrl: './plaza-ordinaria.component.scss',
  providers: [DialogService]
})
export class PlazaOrdinariaComponent extends GeneralComponent implements OnInit{
  @Input() infoAspirante!: InfoAspirante;
  //@Output() asignacionRegistrada = new EventEmitter<{ id: number }>();

  asignacionPlazaService: AsignacionPlazaService = inject(AsignacionPlazaService);
  tipoAsignacion = TipoAsignacion.PlazaOrdinaria;
  fb: FormBuilder = inject(FormBuilder);
  filtroForm!: FormGroup;

  private destroyRef = inject(DestroyRef);

  ref: DynamicDialogRef | undefined;

  especialidadList: TipoDropdown[] = [];
  ooadList: TipoDropdown[] = [];
  unidadList: TipoDropdown[] = [];
  zonaList: TipoDropdown[] = [];
  turnoList: TipoDropdown[] = [];
  marcaOcupacionList: TipoDropdown[] = [];
  horarioList: TipoDropdown[] = [];
  plazasList: WritableSignal<Plaza[]> = signal([]);
  //idEspecialidad: string = '';
  idUsuario: number = 0;
  sinResultados: boolean = false;
  //default_catalogo: TipoDropdown = {value:0,label:'Seleccione una opción'};

  //Consulta paginado
  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;

  constructor(public dialogService: DialogService, private readonly estadoPlazaService: EstadoOfertaService){
    super();
  }

  ngOnInit(): void {
    //this.filtroForm = this.iniciarForm();
    //this.getEspecialidades();
    this.estadoPlazaService.refreshPlazas$.subscribe(() => {
      this.ref?.close();
    });
  }

  ngOnChanges(): void {
    this.filtroForm = this.iniciarForm();
    this.idUsuario = this.infoAspirante.idUsuario;
    this.plazasList.set([]);
    this.getEspecialidades();
  }


  iniciarForm(): FormGroup {
    return this.fb.group({
      especialidad: [null, [Validators.required]],
      ooad: [null],
      unidad: [null],
      plaza: [null, [Validators.maxLength(10)]],
      zona: [null],
      turno: [null],
      marcaOcupacion: [{ value: null, disabled: true }],
      horario: [{ value: null, disabled: true }],
    })
  }

  getEspecialidades(): void{
    this.asignacionPlazaService.getEspecialidadByMatricula(this.infoAspirante.matriculaFolio).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.especialidadList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          var idEspecialidad = result.respuesta[0]?.value ?? null;
          this.filtroForm.get('especialidad')?.patchValue(idEspecialidad);
          this.consultarPlazas();
          this.getOoad();
          this.getTurno();
          this.getMarcaOcupacion();
          return;
        } else{
          this.especialidadList = [];
          return;
        }
      }
    })
  }

  getOoad(): void{
    const cveEspecialidad = this.filtroForm.get('especialidad')?.value;
    this.asignacionPlazaService.getOoadByEspecialidad(Regimen.PlazaOrdinaria, cveEspecialidad).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.ooadList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.ooadList.unshift(this.default_catalogo);
          return;
        } else{
          this.ooadList = [];
          return;
        }
      }
    })
  }

  getUnidad():void{
    const idEspecialidad = this.filtroForm.get('especialidad')?.value;
    //console.log(idEspecialidad);
    const idOoad = this.filtroForm.get('ooad')?.value;
    //console.log(idOoad);
    this.asignacionPlazaService.getUnidadByOoad(Regimen.PlazaOrdinaria, idEspecialidad, idOoad).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.unidadList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.ooadList.unshift(this.default_catalogo);
          return;
        } else{
          this.unidadList = [];
          return;
        }
      }
    })
  }

  getZona():void{
    const idEspecialidad = this.filtroForm.get('especialidad')?.value;
    const idOoad = this.filtroForm.get('ooad')?.value;

    this.asignacionPlazaService.getZonaByOoad(Regimen.PlazaOrdinaria, idEspecialidad, idOoad).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.zonaList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.zonaList.unshift(this.default_catalogo);
          return;
        } else{
          this.zonaList = [];
          return;
        }
      }
    })
  }

  getTurno():void{
    const idEspecialidad = this.filtroForm.get('especialidad')?.value;

    this.asignacionPlazaService.getTurnoByEspecialidad(Regimen.PlazaOrdinaria, idEspecialidad).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.turnoList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.ooadList.unshift(this.default_catalogo);
          return;
        } else{
          this.turnoList = [];
          return;
        }
      }
    })
  }

  getMarcaOcupacion(): void {
    const idEspecialidad = this.filtroForm.get('especialidad')?.value;
    const marcaOcupacionCtrl = this.filtroForm.get('marcaOcupacion');

    if (!idEspecialidad) {
      this.resetMarcaOcupacion();
      return;
    }

    marcaOcupacionCtrl?.enable({ emitEvent: false });

    this.asignacionPlazaService.getMarcaOcupacionByEspecialidad(Regimen.PlazaOrdinaria, idEspecialidad).subscribe({
      next: (result) => {
        if (this.filtroForm.get('especialidad')?.value !== idEspecialidad) {
          return;
        }

        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.marcaOcupacionList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          return;
        } else {
          this.marcaOcupacionList = [];
          return;
        }
      }
    })
  }

  getHorario(): void {
    const idEspecialidad = this.filtroForm.get('especialidad')?.value;
    const idTurno = this.filtroForm.get('turno')?.value;
    const horarioCtrl = this.filtroForm.get('horario');

    if (!idEspecialidad || !idTurno) {
      this.resetHorario();
      return;
    }

    horarioCtrl?.enable({ emitEvent: false });

    this.asignacionPlazaService.getHorarioByTurno(Regimen.PlazaOrdinaria, idEspecialidad, idTurno).subscribe({
      next: (result) => {
        if (this.filtroForm.get('especialidad')?.value !== idEspecialidad || this.filtroForm.get('turno')?.value !== idTurno) {
          return;
        }

        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.horarioList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          return;
        } else {
          this.horarioList = [];
          return;
        }
      }
    })
  }

  onChangeEspecialidad(){
    this.plazasList.set([]);
    this.ooadList = [];
    const ooadCtrl = this.filtroForm.get('ooad');
    ooadCtrl?.reset(null);

    this.unidadList = [];
    const unidadCtrl = this.filtroForm.get('unidad');
    unidadCtrl?.reset(null);

    this.zonaList = [];
    const zonaCtrl = this.filtroForm.get('zona');
    zonaCtrl?.reset(null);

    this.turnoList = [];
    const turnoCtrl = this.filtroForm.get('turno');
    turnoCtrl?.reset(null);

    this.resetMarcaOcupacion();
    this.resetHorario();

    ooadCtrl?.updateValueAndValidity({ emitEvent: false });
    this.filtroForm.updateValueAndValidity({ emitEvent: false });

    this.getOoad();
    this.getTurno();
    this.getMarcaOcupacion();
    this.consultarPlazas();
  }

  onChangeOoad(){
    this.unidadList = [];
    const unidadCtrl = this.filtroForm.get('unidad');
    unidadCtrl?.reset(null);

    this.zonaList = [];
    const zonaCtrl = this.filtroForm.get('zona');
    zonaCtrl?.reset(null);

    unidadCtrl?.updateValueAndValidity({ emitEvent: false });
    this.filtroForm.updateValueAndValidity({ emitEvent: false });

    this.getUnidad();
    this.getZona();
  }

  onChangeTurno(): void {
    this.resetHorario();
    this.getHorario();
  }

  limpiar(){
    this.filtroForm.get('especialidad')?.patchValue('');
    this.filtroForm.get('ooad')?.patchValue('');
    this.filtroForm.get('unidad')?.patchValue('');
    this.filtroForm.get('plaza')?.patchValue('');
    this.filtroForm.get('zona')?.patchValue('');
    this.filtroForm.get('turno')?.patchValue('');
    this.resetMarcaOcupacion();
    this.resetHorario();
    this.plazasList.set([]);
    this.ooadList = [];
    this.unidadList = [];
    this.zonaList = [];
    this.turnoList = [];
  }

  consultarPlazas(inicio: boolean = true): void {
    if (inicio) {
      this.numPaginaActual = 0;
      this.first = 0;
    }
    const v = this.filtroForm.getRawValue();

    let request: DisponiblesRequest = {
      cveEspecialidad: v.especialidad,
      cveOoad: v.ooad ?? null,
      cveUnidad: v.unidad ?? null,
      cveZona: v.zona ?? null,
      cveTurno: v.turno ?? null,
      numPlaza: v.plaza ?? null,
      regimen: Regimen.PlazaOrdinaria
    }
    if (v.marcaOcupacion !== null && v.marcaOcupacion !== undefined && v.marcaOcupacion !== '') {
      request.cveMarcaOcupacion = v.marcaOcupacion;
    }
    if (v.horario !== null && v.horario !== undefined && v.horario !== '') {
      request.cveHorario = v.horario;
    }
    //console.log('envio',request);

    this.asignacionPlazaService.plazasDisponibles(request, this.numPaginaActual, this.rows).subscribe({
      next: (result) => {
        //console.log('Plazas', result);
        if(result.exito && Array.isArray(result.respuesta.content) && result.respuesta.content.length > 0){
          this.totalElementos = result.respuesta.page.totalElements;
          this.plazasList.set(result.respuesta.content);
          this.sinResultados = false;
        } else{
          this.plazasList.set([]);
          this.sinResultados = true;
          return;
        }
      },
      error: (error) => {
        //console.log(error);
        this.plazasList.set([]);
        this.sinResultados = true;
        return;
      }
    });
  }

  cambiarPagina(event: PaginatorState): void {
    /*if (event.page) {
      this.numPaginaActual = event.page;
    }
    this.consultarPlazas(false);*/
    if (event.page !== undefined && event.page !== null) {
      this.numPaginaActual = event.page;
    }
    this.first = event.first ?? 0;    
    this.rows = event.rows ?? this.rows;
    this.consultarPlazas(false);
  }

  objFiltro(): FiltroConsultaPlazaInterface {
    return {
      especialidad: (this.f['especialidad'].value)?.value || null,
      ooad: (this.f['ooad'].value)?.value || null,
      unidad: (this.f['unidad'].value)?.value || null,
      plaza: this.f['plaza'].value
    }
  }

  show(plaza: any){
    this.ref = this.dialogService.open(DetallePlazaComponent, {
      style:{
        'border-bottom': '17px solid #41ABD9',
        'border-radius': '9px'
      },
      data: {...plaza},
      modal: true,
      width: '848px',
      height: '55vh',
      focusOnShow: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      templates: {
        header: HeaderMedicoDetalleOfertaComponent
      },
      styleClass: 'oferta-detail'
    });




  }

  get f() {
    return this.filtroForm.controls;
  }

  private resetMarcaOcupacion(): void {
    this.marcaOcupacionList = [];
    const marcaOcupacionCtrl = this.filtroForm.get('marcaOcupacion');
    marcaOcupacionCtrl?.reset(null, { emitEvent: false });
    marcaOcupacionCtrl?.disable({ emitEvent: false });
  }

  private resetHorario(): void {
    this.horarioList = [];
    const horarioCtrl = this.filtroForm.get('horario');
    horarioCtrl?.reset(null, { emitEvent: false });
    horarioCtrl?.disable({ emitEvent: false });
  }

}
