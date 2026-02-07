import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { Select } from 'primeng/select';
import {Button} from 'primeng/button';

type Opt = { label: string; value: string };

@Component({
  selector: 'app-asignacion-sustitucion',
  imports: [CommonModule, ReactiveFormsModule, Select, Button],
  templateUrl: './asignacion-sustitucion.component.html',
  styleUrl: './asignacion-sustitucion.component.scss'
})
export class AsignacionSustitucionComponent {
  ooadOptions: Opt[] = [
    { label: 'Ciudad de México Sur', value: '1' },
    { label: 'Ciudad de México Norte', value: '2' },
  ];
  zonaOptions: Opt[] = [
    { label: 'Centro', value: '1' },
    { label: 'Norte', value: '2' },
    { label: 'Sur', value: '3' },
  ];
  especialidadOptions: Opt[] = [
    { label: 'Cardiología', value: '1' },
    { label: 'Pediatría', value: '2' },
    { label: 'Medicina Interna', value: '3' },
  ];

  asignacionConfirmada = false;

  resumenAsignacion: {
    ooadLabel: string;
    zonaLabel: string;
    especialidadLabel: string;
  } | null = null;

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}
  
  ngOnInit(): void {
    this.form = this.fb.group({
      ooad: ['' as string | null, Validators.required],
      zona: ['' as string | null, Validators.required],
      especialidad: ['' as string | null, Validators.required],
    });
  }

  private labelFrom(options: Opt[], value: string | null): string {
    if (!value) return '';
    return options.find(x => x.value === value)?.label ?? value;
  }

  asignar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    // Aquí iría tu llamada a API (y en el success haces lo de abajo)
    this.resumenAsignacion = {
      ooadLabel: this.labelFrom(this.ooadOptions, v.ooad),
      zonaLabel: this.labelFrom(this.zonaOptions, v.zona),
      especialidadLabel: this.labelFrom(this.especialidadOptions, v.especialidad),
    };

    this.asignacionConfirmada = true;
  }

  editarAsignacion(): void {
    this.asignacionConfirmada = false;
  }

  imprimirCedula(): void {
    // Aquí disparas tu endpoint / impresión
    console.log('Imprimir cédula', this.resumenAsignacion);
  }

}
