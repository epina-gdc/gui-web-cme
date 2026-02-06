import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { Card } from "primeng/card";
import { CommonModule } from '@angular/common';
import { PaginatorModule, PaginatorState } from "primeng/paginator";
@Component({
  selector: 'app-buscar-convocatoria',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    TableModule,
    MenuModule,
    ButtonModule, Card,
    PaginatorModule
  ],
  templateUrl: './buscar-convocatoria.component.html',
  styleUrl: './buscar-convocatoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuscarConvocatoriaComponent {
  formulario!: FormGroup;
  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;

  activeTab: WritableSignal<number> = signal(0);
  // Datos para los dropdowns
  convocatorias = [
    { id: '1', nombre: 'Convocatoria 1' },
    { id: '2', nombre: 'Convocatoria 2' },
    { id: '3', nombre: 'Convocatoria 3' }
  ];

  mesasDisponibles = Array.from({ length: 50 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  medicosPorMesa = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  // Datos de la tabla
  convocatoriasTabla = [
    {
      id: '2',
      nombre: 'Convocatoria 2',
      mesas: 8,
      medicosPorMesa: 45,
      estatus: 'Pendiente',
      porcentaje: 80
    },
    {
      id: '1',
      nombre: 'Convocatoria 1',
      mesas: 12,
      medicosPorMesa: 30,
      estatus: 'Completada',
      porcentaje: 100
    }
  ];

  accionesMenu: MenuItem[] = [
    { label: 'Editar', icon: 'pi pi-pencil', command: () => console.log('Editar') },
    { label: 'Eliminar', icon: 'pi pi-trash', command: () => console.log('Eliminar') },
    { separator: true },
    { label: 'Ver detalles', icon: 'pi pi-eye', command: () => console.log('Detalles') }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      convocatoriaId: ['', Validators.required],
      mesas: ['', Validators.required],
      medicos: ['', Validators.required]
    });

    this.totalElementos = 24;
  }

  guardarConfiguracion(): void {
    if (this.formulario.valid) {
      const { convocatoriaId, mesas, medicos } = this.formulario.value;

      // Buscar si ya existe en la tabla
      const idx = this.convocatoriasTabla.findIndex(c => c.id === convocatoriaId);
      const convocatoria = this.convocatorias.find(c => c.id === convocatoriaId);

      if (idx !== -1) {
        // Actualizar existente
        this.convocatoriasTabla[idx] = {
          ...this.convocatoriasTabla[idx],
          mesas,
          medicosPorMesa: medicos,
          estatus: 'Pendiente',
          porcentaje: 80
        };
      } else {
        // Agregar nueva
        this.convocatoriasTabla.push({
          id: convocatoriaId,
          nombre: convocatoria?.nombre || `Convocatoria ${convocatoriaId}`,
          mesas,
          medicosPorMesa: medicos,
          estatus: 'Pendiente',
          porcentaje: 80
        });
      }

      // Resetear formulario
      this.formulario.reset();
      console.log('Configuración guardada:', this.formulario.value);
    }
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

  
}
