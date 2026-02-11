import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CardModule } from "primeng/card";
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from "primeng/paginator";
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import {
  AsignacionMesaService,
  Convocatoria,
  MesaConfiguracion,
  MesaConvocatoriaRequest,
  ResponseConfiguracionMesas,
  ResponseConvocatorias
} from '../../services/asignacion-mesa.service';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-buscar-convocatoria',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    TableModule,
    MenuModule,
    ButtonModule,
    CardModule,
    PaginatorModule,
    TagModule,
    PopoverModule,
    InputNumberModule
  ],
  templateUrl: './buscar-convocatoria.component.html',
  styleUrl: './buscar-convocatoria.component.scss'
})
export class BuscarConvocatoriaComponent implements OnInit {

  asignacionMesaService = inject(AsignacionMesaService);

  formulario!: FormGroup;
  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;

  convocatoriaSeleccionada = model<Convocatoria | undefined>(undefined);

  activeTab: WritableSignal<number> = signal(0);

  // Datos para los select
  convocatorias: Convocatoria[] = [];

  configuracionMesasTabla = model<MesaConfiguracion[]>([]);

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      idConvocatoria: [undefined, Validators.required],
      numMesasDisponibles: [undefined, [Validators.required, Validators.min(1)]],
      numMedicosPorMesa: [undefined, [Validators.required, Validators.min(1)]]
    });

    this.loadConvocatorias();
    this.consultarConvocatorias();
  }

  loadConvocatorias(): void {
    this.asignacionMesaService.getLstConvocatorias().subscribe({
      next: (response: ResponseConvocatorias) => {
        if (response.exito) {
          this.convocatorias = response.respuesta;

        }
      },
      error: (err) => {
        console.error('Error al cargar convocatorias:', err);
      }
    });
  }

  consultarConvocatorias() {
    this.asignacionMesaService.getLstConfiguracionMesas(this.numPaginaActual, this.rows).subscribe({
      next: (response: ResponseConfiguracionMesas) => {
        if (response.exito) {
          this.configuracionMesasTabla.update(v => response.respuesta.content);
          this.totalElementos = response.respuesta.page.totalElements;
        }
      },
      error: (err) => {
        console.error('Error al consultar configuración de mesas:', err);
      }
    });
  }

  guardarConfiguracion(): void {
    if (this.formulario.valid) {
      const formData = this.formulario.value as MesaConvocatoriaRequest;

      this.asignacionMesaService.guardarMesaConvocatoria(formData).subscribe({
        next: (response) => {
          console.log('Configuración guardada exitosamente:', response);
          this.consultarConvocatorias();
          this.formulario.reset();
        },
        error: (err) => {
          console.error('Error al guardar configuración:', err);
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }

  cambiarPagina(event: PaginatorState): void {
    if (event.page !== undefined) {
      this.numPaginaActual = event.page;
    }
    if (this.activeTab() === 0) {
      this.consultarConvocatorias();
    }
  }

  onSeleccion(convocatoria: Convocatoria) {
    this.convocatoriaSeleccionada.set(convocatoria);

  }
}