import {ChangeDetectionStrategy, Component} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import {CardModule} from 'primeng/card';
import {ChipModule} from 'primeng/chip';
import {ButtonModule} from 'primeng/button';

interface Especialidad {
  id: number;
  descripcion: string; // ej. "Medicina familiar (5 años)"
  cantidad: number;
  hasBecario?: boolean;
}

interface Turno {
  id: number;
  nombre: string; // ej. "Turno 1"
  horaInicio: string; // "09:00"
  horaFin: string;   // "11:00"
  especialidades: Especialidad[];
}

interface Mesa {
  id: number;
  nombre: string; // "Mesa 1"
  turnos: Turno[];
}

@Component({
  selector: 'app-detalle-mesas',
  imports: [
    CardModule,
    DatePickerModule,
    ChipModule,
    ButtonModule,
  ],
  templateUrl: './detalle-mesas.component.html',
  styleUrl: './detalle-mesas.component.scss',
  
})
export class DetalleMesasComponent {
  mesas: Mesa[] = [
    {
      id: 1,
      nombre: 'Mesa 1',
      turnos: [
        {
          id: 1,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 1, descripcion: 'Medicina familiar (5 años)', cantidad: 21 }
          ]
        },
        {
          id: 2,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 2, descripcion: 'Pediatría (4 años)', cantidad: 12 , hasBecario: true},
            {id:3,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:4,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:5,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:6,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:7,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:8,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:9,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:10,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:11,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:12,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:13,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:14,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:15,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:16,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:17,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:18,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:19,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:20,descripcion:'Pediatría (4 años)',cantidad:12},

          ]
        },
        {
          id: 3,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 2, descripcion: 'Pediatría (4 años)', cantidad: 12 },
            {id:3,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:4,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:5,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:6,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:7,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:8,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:9,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:10,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:11,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:12,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:13,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:14,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:15,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:16,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:17,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:18,descripcion:'Pediatría (4 años)',cantidad:12},
            {id:19,descripcion:'Medicina familiar (5 años)',cantidad:21},
            {id:20,descripcion:'Pediatría (4 años)',cantidad:12},

          ]
        }
      ]
    },
    {
      id: 2,
      nombre: 'Mesa 2',
      turnos: [
        {
          id: 3,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 3, descripcion: 'Ginecoobstetricia (5 años)', cantidad: 15 }
          ]
        },
        {
          id: 4,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 4, descripcion: 'Anestesiología (5 años)', cantidad: 10 }
          ]
        }
      ]
    },
    {
      id: 3,
      nombre: 'Mesa 3',
      turnos: [
        {
          id: 5,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 5, descripcion: 'Cirugía general (5 años)', cantidad: 18 }
          ]
        },
        {
          id: 6,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 6, descripcion: 'Traumatología (5 años)', cantidad: 14 }
          ]
        }
      ]
    },
    {
      id: 4,
      nombre: 'Mesa 4',
      turnos: [
        {
          id: 7,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 7, descripcion: 'Oftalmología (5 años)', cantidad: 8 }
          ]
        },
        {
          id: 8,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 8, descripcion: 'Otorrinolaringología (5 años)', cantidad: 9 }
          ]
        }
      ]
    },
    {
      id: 5,
      nombre: 'Mesa 5',
      turnos: [
        {
          id: 9,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 9, descripcion: 'Cardiología (5 años)', cantidad: 2 },
            { id: 10, descripcion: 'Medicina del enfermo en estado crítico (6 años)', cantidad: 3 }
          ]
        }
      ]
    },
    {
      id: 6,
      nombre: 'Mesa 6',
      turnos: [
        {
          id: 11,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 11, descripcion: 'Dermatología (5 años)', cantidad: 7 }
          ]
        },
        {
          id: 12,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 12, descripcion: 'Endocrinología (5 años)', cantidad: 10 }
          ]
        }
      ]
    },
    {
      id: 7,
      nombre: 'Mesa 7',
      turnos: [
        {
          id: 13,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 13, descripcion: 'Gastroenterología (5 años)', cantidad: 5 }
          ]
        },
        {
          id: 14,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 14, descripcion: 'Hematología (5 años)', cantidad: 6 }
          ]
        }
      ]
    },
    {
      id: 8,
      nombre: 'Mesa 8',
      turnos: [
        {
          id: 15,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 15, descripcion: 'Infectología (5 años)', cantidad: 4 }
          ]
        },
        {
          id: 16,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 16, descripcion: 'Nefrología (6 años)', cantidad: 5 }
          ]
        }
      ]
    },
    {
      id: 9,
      nombre: 'Mesa 9',
      turnos: [
        {
          id: 17,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 17, descripcion: 'Neurología (5 años)', cantidad: 6 }
          ]
        },
        {
          id: 18,
          nombre: 'Turno 2',
          horaInicio: '11:00',
          horaFin: '13:00',
          especialidades: [
            { id: 18, descripcion: 'Oncología (5 años)', cantidad: 3 }
          ]
        }
      ]
    },
    {
      id: 10,
      nombre: 'Mesa 10',
      turnos: [
        {
          id: 19,
          nombre: 'Turno 1',
          horaInicio: '09:00',
          horaFin: '11:00',
          especialidades: [
            { id: 19, descripcion: 'Psiquiatría (5 años)', cantidad: 4 },
            { id: 20, descripcion: 'Urgencias (5 años)', cantidad: 8 }
          ]
        }
      ]
    }
  ];



  getTotalMedicosMesa(mesa: Mesa): number {
    return mesa.turnos.reduce(
      (sumTurnos, turno) =>
        sumTurnos +
        turno.especialidades.reduce(
          (sumEsp, especialidad) => sumEsp + especialidad.cantidad,
          0
        ),
      0
    );
  }

}
