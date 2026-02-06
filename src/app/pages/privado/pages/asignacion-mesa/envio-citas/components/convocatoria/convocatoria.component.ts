import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaComponent { 

  constructor(private fb: FormBuilder) { }

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
}
