import { ChangeDetectionStrategy, Component, effect, inject, model, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AsignacionMesaService, Especialidad, MesaConfiguracion, MesaDisponibilidad, Rama, Turno } from '@pages/privado/pages/asignacion-mesa/asignacion-mesa/services/asignacion-mesa.service';
import { InputNumberModule } from 'primeng/inputnumber';
import dayjs from 'dayjs';
import { CommonModule } from '@angular/common';

import { MessageModule } from 'primeng/message';
import { ConvocatoriaEstadoService } from '@pages/privado/pages/asignacion-mesa/asignacion-mesa/services/convocatoria-estado.service';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { RespuestaTurno } from '@models/repsuesta-turno.interfaace';
interface Opcion {
  id: number;
  nombre: string;
}


export function maxLugaresDisponibles(getMaxValue: () => number | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valorActual = control.value;
    const valorMaximo = getMaxValue();

    if (valorMaximo === null || valorMaximo === undefined || valorActual === null || valorActual === undefined) {
      return null;
    }

    if (valorActual > valorMaximo) {
      return { 
        maxDependiente: { 
          valorActual, 
          valorMaximo 
        } 
      };
    }

    return null;
  };
}



@Component({
  selector: 'app-configuracion',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    DatePickerModule,
    SelectModule,
    InputNumberModule,
    MessageModule,
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss',
})
export class ConfiguracionComponent {

  constructor(private fb: FormBuilder) {
    effect(() => {
      if (this.accionActualiza()) {
        this.obtenerEspecialidadesPorRama();
      }
    });

    effect(() => {
      const rama = this.ramaActual();
      const convocatoria = this.convocatoriaSeleccionada();

      if (rama?.id && convocatoria?.idMesaConvocatoria && convocatoria?.idConvocatoria) {
        this.obtenerEspecialidadesPorRama();
      }
    });
  }
  catalogoService = inject(CatalogosGeneralesService);
  asignacionMesaService = inject(AsignacionMesaService);
  convocatoriaEstado = inject(ConvocatoriaEstadoService);

  convocatoriaSeleccionada = model<MesaConfiguracion | undefined>(undefined);
  accionActualiza = model<boolean | undefined>(undefined);

  ramaActual = model<Rama | undefined>(undefined);

  numLugaresDisponibles = signal<number>(0);


  formulario!: FormGroup;

  // Datos para los selects
  mesas: MesaDisponibilidad[] = [];
  turnos: Turno[] = [];
  especialidades: Especialidad[] = [];

  minDate: Date = new Date();
  maxDate: Date = new Date();

  ngOnInit(): void {
    this.obtenerTurnos();
    this.formulario = this.fb.group({
      fecAtencion: ['', Validators.required],
      numMesa: ['', Validators.required],
      idTurno: ['', Validators.required],
      numMedicosCupo: ['', [Validators.required, Validators.min(1),
       maxLugaresDisponibles(() => this.formulario?.get('numMesa')?.value?.lugaresDisponibles || 0)]],
      idEspecialidad: ['', Validators.required]
    });

    this.minDate = dayjs(this.convocatoriaSeleccionada()?.fechaInicio).toDate();
    this.maxDate = dayjs(this.convocatoriaSeleccionada()?.fechaFin).toDate();

  }

  limpiarFormulario(): void {
    this.formulario.reset();
  }

  onFechaSeleccionada(fecha: Date) {
    if (!fecha) return;
    const fechaFormateada = dayjs(fecha).format('YYYY-MM-DD');

    this.asignacionMesaService.getMesasDisponibilidad(this.convocatoriaSeleccionada()?.idMesaConvocatoria as number, fechaFormateada)
      .subscribe({
        next: (response) => {
          //console.log('Disponibles:', response);
          this.mesas = response.respuesta;
        },
        error: (err) => {
          console.error('Error en consulta:', err);
        }
      });
  }

  obtenerListados(): void {
    this.obtenerTurnos();
    this.obtenerEspecialidadesPorRama();
  }

  obtenerTurnos(): void {
    // listado de mesas
    /*this.asignacionMesaService.getMesasDisponibilidad(this.convocatoriaSeleccionada()?.idMesaConvocatoria as number).subscribe({
      next: (response: any) => {
        //console.log('Disponibles:', response);
        this.mesas = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });*/

    // listado de turnos  

    /*this.asignacionMesaService.getTurnos().subscribe({
      next: (response: any) => {
        //console.log('Respuesta:', response);
        this.turnos = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });*/
    this.catalogoService.getTurno().subscribe({
      next: (response: any) => {
        const turnosFormateados: Turno[] = response.respuesta.map((item: RespuestaTurno) => {
          const fmt = (hora: any) => hora.toString().replace(/(\d+)(\d{2})$/, "$1:$2");
          return {
            value: item.idTurno,
            label: `${fmt(item.horaInicio)} hrs.`
          };
        });
        //console.log('Respuesta:', response);
        this.turnos = turnosFormateados;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });

  }

  obtenerEspecialidadesPorRama(): void {
    const rama = this.ramaActual();
    const convocatoria = this.convocatoriaSeleccionada();

    if (!rama?.id || !convocatoria?.idMesaConvocatoria || !convocatoria?.idConvocatoria) {
      this.especialidades = [];
      return;
    }

    // listado de especialidades por rama
    this.asignacionMesaService.getEspecialidadesRama(rama.id, convocatoria.idMesaConvocatoria, convocatoria.idConvocatoria).subscribe({
      next: (response: any) => {
        //console.log('Respuesta:', response);
        this.especialidades = response.respuesta;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    }

    )

  }

  onChangeMesa($event: any) {
    //console.log($event.value.lugaresDisponibles);
    this.numLugaresDisponibles.set($event.value.lugaresDisponibles);
    // Forzar revalidación del campo dependiente
    this.formulario.get('numMedicosCupo')?.updateValueAndValidity();
  }


  guardar(): void {
    if (this.formulario.valid) {

      const mesaDetalle = {
        idMesaConvocatoria: this.convocatoriaSeleccionada()?.idMesaConvocatoria as number,
        fecAtencion: dayjs(this.formulario.value.fecAtencion).format('YYYY-MM-DD'),
        numMesa: this.formulario.value.numMesa.numeroMesa as number,
        idEspecialidad: this.formulario.value.idEspecialidad as number,
        idTurno: this.formulario.value.idTurno as number,
        numMedicosCupo: this.formulario.value.numMedicosCupo as number
      }
      // Aquí iría la lógica de envío a API
      this.asignacionMesaService.guardarConfiguracionMesa(mesaDetalle).subscribe({
        next: (response: any) => {
          //console.log('Respuesta:', response);
          this.limpiarFormulario();
          this.convocatoriaEstado.notifyRefresh();
          this.accionActualiza.update((value) => true);
          setTimeout(() => {
            this.accionActualiza.update((value) => false);
          }, 500);
        },
        error: (err) => {
          console.error('Error:', err);
        }
      });

    } else {
      //console.log('Formulario inválido');
    }
  }
}
