import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

interface Opcion {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-configuracion',
  imports: [CardModule, 
    ButtonModule, 
    FormsModule, 
    InputTextModule, 
    ReactiveFormsModule, 
    CalendarModule, 
    SelectModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfiguracionComponent {
  formulario!: FormGroup;

  // Datos para los selects
  mesas: Opcion[] = [
    { id: 1, nombre: 'Mesa 1' },
    { id: 2, nombre: 'Mesa 2' },
    { id: 3, nombre: 'Mesa 3' },
    { id: 4, nombre: 'Mesa 4' }
  ];

  turnos: Opcion[] = [
    { id: 1, nombre: 'Matutino' },
    { id: 2, nombre: 'Vespertino' },
    { id: 3, nombre: 'Nocturno' }
  ];

  especialidades: Opcion[] = [
    { id: 1, nombre: 'Cirugía pediátrica (6 años)' },
    { id: 2, nombre: 'Alergia e inmunología (6 años)' },
    { id: 3, nombre: 'Cardiología pediátrica (6 años)' },
    { id: 4, nombre: 'Endocrinología (5 años)' },
    { id: 5, nombre: 'Gastroenterología (5 años)' }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      fechaAtencion: ['', Validators.required],
      mesa: ['', Validators.required],
      turno: ['', Validators.required],
      medicosPorTurno: ['', [Validators.required, Validators.min(1)]],
      especialidad: ['', Validators.required]
    });
  }

  limpiarFormulario(): void {
    this.formulario.reset();
    // Si necesitas mantener la fecha actual al limpiar:
    // this.formulario.patchValue({ fechaAtencion: new Date() });
  }

  guardar(): void {
    if (this.formulario.valid) {
      console.log('Datos guardados:', this.formulario.value);
      // Aquí iría la lógica de envío a API
    } else {
      console.log('Formulario inválido');
    }
  }
 }
