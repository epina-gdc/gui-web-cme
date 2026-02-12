import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AsignacionMesaService, Especialida, MesaConfiguracion, MesaDisponibilidad, Rama, Turno } from '@pages/privado/pages/asignacion-mesa/asignacion-mesa/services/asignacion-mesa.service';
import { InputNumberModule } from 'primeng/inputnumber';
import dayjs from 'dayjs';
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
    DatePickerModule,
    SelectModule,
    InputNumberModule
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent {

  asignacionMesaService = inject(AsignacionMesaService);

  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  accionGuardar = model<boolean | undefined>(undefined);

  ramaActual = model<Rama | undefined>(undefined);


  formulario!: FormGroup;

  // Datos para los selects
  mesas: MesaDisponibilidad[] = [];
  turnos: Turno[] = [];
  especialidades: Especialida[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formulario = this.fb.group({
      fecAtencion: ['', Validators.required],
      numMesa: ['', Validators.required],
      idTurno: ['', Validators.required],
      numMedicosCupo: ['', [Validators.required, Validators.min(1)]],
      idEspecialidad: ['', Validators.required]
    });
    this.obtenerListados();
  }

  limpiarFormulario(): void {
    this.formulario.reset();
  }

  obtenerListados(): void {
    // listado de mesas
    this.asignacionMesaService.getMesasDisponibilidad(this.convocatoriaSeleccionada()?.idMesaConvocatoria as number).subscribe({
      next: (response: any) => {
        console.log('Respuesta:', response);
        this.mesas = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });

    // listado de turnos  

    this.asignacionMesaService.getTurnos().subscribe({
      next: (response: any) => {
        console.log('Respuesta:', response);
        this.turnos = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });

    // listado de especialidades por rama 

    this.asignacionMesaService.getEspecialidadesRama(this.ramaActual()?.id as number, this.convocatoriaSeleccionada()?.idMesaConvocatoria as number, this.convocatoriaSeleccionada()?.idConvocatoria as number).subscribe({
      next: (response: any) => {
        console.log('Respuesta:', response);
        this.especialidades = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    }

    )

  }

  guardar(): void {
    if (this.formulario.valid) {

      const mesaDetalle = {
        idMesaConvocatoria: this.convocatoriaSeleccionada()?.idMesaConvocatoria as number,
        fecAtencion: dayjs(this.formulario.value.fecAtencion).format('YYYY-MM-DD'),
        numMesa: this.formulario.value.numMesa as number,
        idEspecialidad: this.formulario.value.idEspecialidad as number,
        idTurno: this.formulario.value.idTurno as number,
        numMedicosCupo: this.formulario.value.numMedicosCupo as number
      }
      // Aquí iría la lógica de envío a API
      this.asignacionMesaService.guardarConfiguracionMesa(mesaDetalle).subscribe({
        next: (response: any) => {
          console.log('Respuesta:', response);
          //this.limpiarFormulario();
          //this.obtenerListados();
          this.accionGuardar.update((value) => true);
          setTimeout(() => {
            this.accionGuardar.update((value) => false);
          }, 500);

        },
        error: (err) => {
          console.error('Error:', err);
        }
      });




    } else {
      console.log('Formulario inválido');
    }
  }
}
