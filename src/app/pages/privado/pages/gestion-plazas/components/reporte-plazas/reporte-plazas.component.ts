import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GeneralComponent } from '@components/general.component';
import { PillComponent } from '@components/pill/pill.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { ReportePlazasService } from '@services/reporte-plazas.service';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { distinctUntilChanged, filter, switchMap } from 'rxjs';
import { FiltrosReportePlaza } from '@models/reporte-plazas.interface';

import { saveAs } from 'file-saver';
import moment from 'moment';

@Component({
  selector: 'app-reporte-plazas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    InputText,
    Select,
    TableModule,
    PaginatorModule,
    PillComponent,
  ],
  templateUrl: './reporte-plazas.component.html',
  styleUrl: './reporte-plazas.component.scss'
})
export class ReportePlazasComponent extends GeneralComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly reportePlazasService: ReportePlazasService = inject(ReportePlazasService);

  lstReportePlazas: WritableSignal<any> = signal([]);
  ultimaBusqueda: WritableSignal<FiltrosReportePlaza> = signal({});

  lstOoads: TipoDropdown[] = [];
  lstZonas: TipoDropdown[] = [];
  lstEspecialidades: TipoDropdown[] = [];
  lstCategorias: TipoDropdown[] = [];
  lstUnidades: TipoDropdown[] = [];

  tituloModulo: string = "Reporte de plazas";
  form!: FormGroup;
  numPaginaActual: number = 0;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  constructor(private activatedRoute: ActivatedRoute){
    super();
  }

  ngOnInit(): void {
    this.form = this.inicialziarFormulario();

    this.activatedRoute.data
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({respuesta}) => {
        const {categorias, especialidades, ooads, tiposUnidades} = respuesta;
        this.lstOoads = mapearArregloTipoDropdown(ooads.respuesta,'desOoad','cveOoad');
        this.lstEspecialidades = mapearArregloTipoDropdown(especialidades,'desEspecialidad','cveEspecialidad');
        this.lstCategorias = mapearArregloTipoDropdown(categorias.respuesta, 'descCategoria','cveCategoria');
        this.lstUnidades = mapearArregloTipoDropdown(tiposUnidades.respuesta, 'descTipoUnidad','cveTipoUnidad');
    });

    this.form.controls['cveOoad'].valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(value => !!value),
        takeUntilDestroyed(this.destroyRef),
        switchMap(ooad => this._CatalogoGenService.getLstZonas(ooad))
      )
      .subscribe(respuesta => {
        if(respuesta.exito){
          this.lstZonas = mapearArregloTipoDropdown(respuesta.respuesta, 'desZona','cveZona');
        }
    });
  }

  inicialziarFormulario(): FormGroup{
    return this.fb.group({
      cveOoad: [null],
      cveZona: [null],
      cveEspecialidad: [null],
      cveCategoria: [null],
      numPlaza: [null],
      cveUnidad: [null],
    })
  }

  onLimpiar() {
    this.form.reset();
    this.lstZonas = [];
    //this.lstReportePlazas.set([]);
    this.first = 0;
  }

  onExportarDatos() {
    this.reportePlazasService.exportarExcel(this.ultimaBusqueda()).subscribe({
      next: (resp: Blob) => {
        const nombreArchivo = `REPORTE_PLAZAS_${moment().format('YYYYMMDD_HHmm')}.xlsx`
        saveAs(resp,nombreArchivo);
      },
      error: (error) => {
        console.error('Error al descargar el Excel:', error);
        this._alertServices.error('Error al descargar el Excel');
      }
    })
  }

  getPillType(textoEstatus: string): number{
    return 0;
  }

  onPageChange(event: PaginatorState): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.numPaginaActual = event.page ? event.page : 0;
    this.onBuscar();
  }

  setBusquedaReciente(): void {
    const {cveOoad, cveZona, cveEspecialidad, cveCategoria, numPlaza,
           cveUnidad} :FiltrosReportePlaza = this.form.value;

    this.ultimaBusqueda.set({
      idConvocatoria: null,
      cveOoad: cveOoad ? cveOoad : null,
      cveZona: cveZona ? cveZona : null,
      cveEspecialidad: cveEspecialidad ? cveEspecialidad : null,
      cveCategoria: cveCategoria ? cveCategoria : null,
      numPlaza: numPlaza ? numPlaza : null,
      cveUnidad: cveUnidad ? cveUnidad : null,
      page: this.numPaginaActual,
      size: this.rows
    });
    this.onBuscar();
  }

  onBuscar(){
    this.reportePlazasService.consultarLstReportes(this.ultimaBusqueda()).subscribe({
      next: resp => {
        if(resp.respuesta.content.length > 0){
          this.lstReportePlazas.set(resp.respuesta.content);
          this.totalRecords = resp.respuesta.page.totalElements;
        } else {
          this.lstReportePlazas.set([]);
          this.totalRecords = 0;
        }
      },
      error: err => {
        this.lstReportePlazas.set([]);
        this.totalRecords = 0;
      }
    })
  }
}
