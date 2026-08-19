import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralComponent } from '@components/general.component';
import { ConvocatoriaActiva } from '@models/convocatoria.interface';
import moment from 'moment';
import { Button } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reporte-propuestas',
  imports: [DatePicker,
    ReactiveFormsModule,
    TableModule,
    Button,
    CommonModule
  ],
  templateUrl: './reporte-propuestas.component.html',
  styleUrl: './reporte-propuestas.component.scss'
})
export class ReportePropuestasComponent extends GeneralComponent implements OnInit {

  fb: FormBuilder = inject(FormBuilder);

  form!: FormGroup;

  minDate!: Date;
  maxDate!: Date;

  propuestas: WritableSignal<any> = signal(null);
  convocatoriaActiva!: ConvocatoriaActiva;

  ngOnInit(): void {
    this.cargarCatalogos();
    this.form = this.inicializarFormulario();
  }

  inicializarFormulario(): FormGroup {
    return this.fb.group({
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
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
    if (this.form.invalid) return;
    const { fechaInicio, fechaFin } = this.form.value;
    console.log('Buscar propuestas:', { fechaInicio, fechaFin });
  }


  onExportarDatos(): void {
    console.log('Exportar datos');
  }

}
