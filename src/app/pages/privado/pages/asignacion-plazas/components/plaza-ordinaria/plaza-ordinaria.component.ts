import {Component, DestroyRef, inject, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {GeneralComponent} from '@components/general.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AsignacionService} from '@services/asignacion.service';
import {Select} from 'primeng/select';
import {selectData} from '@privado/asignacion-plazas/dummies';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {PlazaDisponibleCardComponent} from '@components/plaza-disponible-card/plaza-disponible-card.component';
import {FiltroConsultaPlazaInterface} from '@models/filtroConsultaPlaza.interface';
import {
  HeaderMedicoDetalleOfertaComponent
} from '@pages/privado/shared/header-medico-detalle-oferta/header-medico-detalle-oferta.component';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DetallePlazaComponent} from '@privado/asignacion-plazas/components/detalle-plaza/detalle-plaza.component';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { InfoAspirante } from '@models/datosAsignacion';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { Regimen } from '../../../../../../core/models/datosAsignacion';

import { of } from 'rxjs';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-plaza-ordinaria',
  imports: [
    ReactiveFormsModule,
    PlazaDisponibleCardComponent,
    Select,
    InputText,
    Button,
  ],
  templateUrl: './plaza-ordinaria.component.html',
  styleUrl: './plaza-ordinaria.component.scss',
  providers: [DialogService]
})
export class PlazaOrdinariaComponent extends GeneralComponent implements OnInit{
  @Input() infoAspirante!: InfoAspirante;

  asignacionService: AsignacionService = inject(AsignacionService);
  asignacionPlazaService: AsignacionPlazaService = inject(AsignacionPlazaService);

  fb: FormBuilder = inject(FormBuilder);
  filtroForm!: FormGroup;

  private destroyRef = inject(DestroyRef);

  ref: DynamicDialogRef | undefined;

  especialidadList: TipoDropdown[] = [];
  ooadList: TipoDropdown[] = [];
  unidadList: TipoDropdown[] = [];
  plazasList: WritableSignal<any[]> = signal([]);
  idEspecialidad: string = '';
  //default_catalogo: TipoDropdown = {value:0,label:'Seleccione una opción'};

  constructor(public dialogService: DialogService){
    super();
  }

  ngOnInit(): void {
    this.filtroForm = this.iniciarForm();
    //this.getCatalogos();
    this.getEspecialidades();
  }

  ngOnChanges(): void {
    this.filtroForm = this.iniciarForm();
    //this.getCatalogos();
    this.getEspecialidades();
  }


  iniciarForm(): FormGroup {
    return this.fb.group({
      especialidad: [null as TipoDropdown['value'] | null, [Validators.required]],
      ooad: [{ value: null as TipoDropdown['value'] | null}, [Validators.required]],
      unidad: [{ value: null as TipoDropdown['value'] | null }, [Validators.required]],
      plaza: ['', [Validators.maxLength(10)]],
    })
  }

  getEspecialidades(): void{
    this.asignacionPlazaService.getEspecialidadByMatricula(this.infoAspirante.matriculaFolio).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.especialidadList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.especialidadList.unshift(this.default_catalogo);
          this.idEspecialidad = result.respuesta[0]?.value ?? null;
          this.filtroForm.get('especialidad')?.patchValue(this.idEspecialidad);
          this.getOoad(Number(this.idEspecialidad));
          return;
        }
      }
    })
  }

  getOoad(cveEspecialidad: number): void{
    this.asignacionPlazaService.getOoadByEspecialidad(Regimen.PlazaOrdinaria, cveEspecialidad).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.ooadList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.ooadList.unshift(this.default_catalogo);
          return;
        }
      }
    })
  }

  getUnidad():void{
    const idEspecialidad = this.filtroForm.get('especialidad')?.value;
    console.log(idEspecialidad);
    const idOoad = this.filtroForm.get('ooad')?.value;
    console.log(idOoad);
    this.asignacionPlazaService.getUnidadByOoad(Regimen.PlazaOrdinaria, idEspecialidad, idOoad).subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.unidadList = mapearArregloTipoDropdown(result.respuesta, 'label', 'value');
          //this.ooadList.unshift(this.default_catalogo);
          return;
        }
      }
    })
  }

  consultarPlazas(): void {

    this.asignacionService.consultarPlazas(this.objFiltro()).subscribe({
      next: (result) => {
        this.plazasList.set(result);
      }
    })
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
      height: '50vh',
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

}
