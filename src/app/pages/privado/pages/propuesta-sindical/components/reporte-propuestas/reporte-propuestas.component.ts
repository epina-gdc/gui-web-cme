import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralComponent } from '@components/general.component';
import { ConvocatoriaActiva } from '@models/convocatoria.interface';
import { ReportePropuestaInterface } from '@models/reporte-propuesta.interface';
import { AlertService } from '@services/alert.service';
import { PropuestaSindicalService, FiltrosReporte } from '@services/propuesta-sindical.service';
import { Mensajes } from '@utils/mensajes';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-propuestas',
  imports: [DatePicker,
    ReactiveFormsModule,
    TableModule,
    Button,
    CommonModule,
    PaginatorModule
  ],
  templateUrl: './reporte-propuestas.component.html',
  styleUrl: './reporte-propuestas.component.scss'
})
export class ReportePropuestasComponent extends GeneralComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);
  pSindicalService: PropuestaSindicalService = inject(PropuestaSindicalService);
  alertaService: AlertService = inject(AlertService);
  mensajes = inject(Mensajes);

  form!: FormGroup;

  minDate!: Date;
  maxDate!: Date;

  first: number = 0;
  rows: number = 10;
  numPaginaActual: number = 0;
  totalElementos: number = 0;

  propuestas: WritableSignal<ReportePropuestaInterface[]> = signal([]);
  convocatoriaActiva!: ConvocatoriaActiva;

  ngOnInit(): void {
    this.cargarCatalogos();
    this.form = this.inicializarFormulario();
  }

  inicializarFormulario(): FormGroup {
    return this.fb.group({
      fechaInicio: [null],
      fechaFin: [null],
    });
  }

  cargarCatalogos(): void {
    this._CatalogoGenService.getConvocatoriaActiva().subscribe({
      next: (response) => {
        if (response?.respuesta) {
          this.convocatoriaActiva = response.respuesta;

          if (this.convocatoriaActiva.fecInicio) {
            this.minDate = moment(this.convocatoriaActiva.fecInicio).toDate();
          }

          if (this.convocatoriaActiva.fecFin) {
            this.maxDate = moment(this.convocatoriaActiva.fecFin).toDate();
          }
        }
      },
      error: (err) => {
        console.error('Error al consultar convocatoria activa:', err);
      }
    });
  }

  onBuscar(): void {

    const { fechaInicio, fechaFin } = this.form.value;

    const objBusqueda: FiltrosReporte = {
      idConvocatoria: this.convocatoriaActiva?.idConvocatoria ?? null,
      cveOoad: null,
      numPlaza: null,
      fechaInicio: fechaInicio ? moment(fechaInicio).format('YYYY-MM-DD') : moment(this.minDate).format('YYYY-MM-DD'),
      fechaFin: fechaFin ? moment(fechaFin).format('YYYY-MM-DD') : moment(this.maxDate).format('YYYY-MM-DD'),
      estatusPropuesta: null,
      page: this.numPaginaActual,
      size: this.rows
    }

    this.pSindicalService.consultarPropuestas(objBusqueda).subscribe({
      next: resp => {
        if(resp.respuesta?.content){
          this.propuestas.set(resp.respuesta.content);
          this.totalElementos = resp.respuesta.page.totalElements;
        }else{
          this.propuestas.set([]);
          this.totalElementos = 0;
        }
      },
      error: err => {
        this.alertaService.error(this.mensajes.MSG018);
        this.propuestas.set([]);
        this.totalElementos = 0;
      }
    })
  }


  onExportarDatos(): void {

    const { fechaInicio, fechaFin } = this.form.value;

    const objBusqueda: FiltrosReporte = {
      idConvocatoria: this.convocatoriaActiva?.idConvocatoria ?? null,
      cveOoad: null,
      numPlaza: null,
      fechaInicio: fechaInicio ? moment(fechaInicio).format('YYYY-MM-DD') : moment(this.minDate).format('YYYY-MM-DD'),
      fechaFin: fechaFin ? moment(fechaFin).format('YYYY-MM-DD') : moment(this.maxDate).format('YYYY-MM-DD'),
      estatusPropuesta: null,
      page: this.numPaginaActual,
      size: this.rows
    }

    this.pSindicalService.exportarExcel(objBusqueda).subscribe({
      next: (resp: Blob) => {
        const nombreArchivo = `REPORTE_PROPUESTAS_${moment().format('YYYYMMDD_HHmm')}.xlsx`
        saveAs(resp,nombreArchivo);
      },
      error: (error) => {
        console.error('Error al descargar el Excel:', error);
        this._alertServices.error('Error al descargar el Excel');
      }
    })
  }

  onPageChange(event: any): void {
    this.first = event.first ?? 0;
    this.rows = event.rows ?? 10;
    this.numPaginaActual = event.page;
    this.onBuscar();
  }

}
