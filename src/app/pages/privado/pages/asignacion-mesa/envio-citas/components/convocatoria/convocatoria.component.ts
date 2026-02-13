import { CommonModule } from '@angular/common';
import { Component, effect, inject, model, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { AsignacionMesaService, Convocatoria, ResponseConvocatorias } from '../../../asignacion-mesa/services/asignacion-mesa.service';
import { EnvioCitasService, TotalCitas } from '../../services/envio-citas.service';

export enum TypeMedico {
  BECADOS = 1,
  RESIDENTES = 2,
  EXTERNOS = 3,
}

@Component({
  selector: 'app-convocatoria',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './convocatoria.component.html',
  styleUrl: './convocatoria.component.scss',

})
export class ConvocatoriaComponent {

  constructor() {
    effect(() => {
      this.convocatoriaSelect();
      this.tipoMedSelect();
      this.cargaTotales();
    });
  }

  tipoMed = TypeMedico;
  asignacionMesaService = inject(AsignacionMesaService);
  envioCitasService = inject(EnvioCitasService);

  tipoMedSelect = signal<TypeMedico>(TypeMedico.BECADOS);
  convocatorias: Convocatoria[] = [];
  convocatoriaSelect = model<number | undefined>(undefined);

  totalCitas = model<TotalCitas | undefined>(undefined);


  ngOnInit(): void {
    this.loadConvocatorias();
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


  cargaTotales() {
    if (this.convocatoriaSelect()) {
      this.envioCitasService.consultaTotalesCitas(this.convocatoriaSelect() as number, this.tipoMedSelect()).subscribe({
        next: (response) => {
          console.log(response);
        if(response.exito){
          this.totalCitas.update(valor => response.respuesta);
        }
        },
        error: (err) => {
          console.error('Error al cargar totales:', err);
        }
      });
    }
  }

  onCambioMedSelec(tipo: TypeMedico) {
    this.tipoMedSelect.update(valor => tipo);
  }
}
