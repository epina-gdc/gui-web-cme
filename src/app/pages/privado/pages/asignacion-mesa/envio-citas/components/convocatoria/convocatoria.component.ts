import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardModule} from "primeng/card";
import {SelectModule} from "primeng/select";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-convocatoria',
  imports: [
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

  constructor(private fb: FormBuilder) { }
  tipoMedSelect = signal(0);
  convocatorias = [
    { id: '1', nombre: 'Convocatoria 1' },
    { id: '2', nombre: 'Convocatoria 2' },
    { id: '3', nombre: 'Convocatoria 3' }
  ];

  formulario!: FormGroup;


  ngOnInit(): void {
    this.formulario = this.fb.group({
      convocatoriaId: ['', Validators.required],

    });

  }


  onCambioMedSelec(tipo: number) {
    this.tipoMedSelect.update(valor => tipo);
  }
}
