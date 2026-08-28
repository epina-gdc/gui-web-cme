import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { GeneralComponent } from '@components/general.component';
import { PillComponent } from '@components/pill/pill.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

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

  lstReportePlazas: WritableSignal<any> = signal([]);


  lstOoads: TipoDropdown[] = [];
  lstZonas: TipoDropdown[] = [];
  lstEspecialidades: TipoDropdown[] = [];
  lstCategorias: TipoDropdown[] = [];
  lstUnidades: TipoDropdown[] = [];

  tituloModulo: string = "Reporte de plazas";
  tituloTabla: string = "Reporte de plazas";
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
  }

  inicialziarFormulario(): FormGroup{
    return this.fb.group({
      ooad: [null],
      zona: [null],
      especialidad: [null],
      categoria: [null],
      noPlaza: [null],
      unidad: [null],
    })

  }


  onLimpiar() {

  }

  onExportarDatos() {

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

  onBuscar(){

  }
}
