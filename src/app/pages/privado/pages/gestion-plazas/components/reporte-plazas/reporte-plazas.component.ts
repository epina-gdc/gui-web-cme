import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { GeneralComponent } from '@components/general.component';
import { PillComponent } from '@components/pill/pill.component';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
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

  lstReportePlazas: WritableSignal<any> = signal([]);


  lstOoad: TipoDropdown[] = [];
  lstZona: TipoDropdown[] = [];
  lstEspecialidad: TipoDropdown[] = [];
  lstCategoria: TipoDropdown[] = [];
  lstUnidad: TipoDropdown[] = [];

  tituloModulo: string = "Reporte de plazas";
  tituloTabla: string = "Reporte de plazas";
  form!: FormGroup;
  numPaginaActual: number = 0;
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;


  constructor(){
    super();
  }

  ngOnInit(): void {
    this.form = this.inicialziarFormulario();
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
