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
import { AsignacionMesaService, Convocatoria, ResponseConvocatorias } from '../../services/asignacion-mesa.service';
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
  styleUrl: './buscar-convocatoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscarConvocatoriaComponent implements OnInit{

  asignacionMesaService = inject(AsignacionMesaService);

  formulario!: FormGroup;
  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;

  convocatoriaSeleccionada = model<any | null>(null);

  activeTab: WritableSignal<number> = signal(0);
  // Datos para los select
  convocatorias: Convocatoria[] | undefined

  // Datos de la tabla
  convocatoriasTabla = [
   
  ];


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      convocatoriaId: [undefined, Validators.required],
      mesas: [undefined, Validators.required],
      medicos: [undefined, Validators.required]
    });

    this.totalElementos = 24;


    this.loadConvocatorias();

  }

  loadConvocatorias(): void {
    this.asignacionMesaService.getLstConvocatorias().subscribe({
      next: (response: ResponseConvocatorias) => {
        if (response.exito) {
          this.convocatorias = response.respuesta;
        } 
      },
      error: (err) => {}
    });
  }


  guardarConfiguracion(): void {
    
    console.log(this.formulario.value)
  }


  cambiarPagina(event: PaginatorState): void {
    if (event.page) {
      this.numPaginaActual = event.page;
    }
    if (this.activeTab() === 0) {
      this.consultarConvocatorias();
    }
  }
  consultarConvocatorias() {
    this.totalElementos = 24;
  }

  onSeleccion(convocatoria: any) {
    if (convocatoria) {
      this.convocatoriaSeleccionada.set(convocatoria || null);
    } else {
      this.convocatoriaSeleccionada.set(null);
    }
  }

}
