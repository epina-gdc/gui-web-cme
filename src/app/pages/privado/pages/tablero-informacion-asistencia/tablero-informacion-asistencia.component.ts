import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {GeneralComponent} from '@components/general.component';
import {DatePickerModule} from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-tablero-informacion-asistencia',
  imports: [
    DatePickerModule,
    ReactiveFormsModule,
    Select,
    Button,
    CardModule
  ],
  templateUrl: './tablero-informacion-asistencia.component.html',
  styleUrl: './tablero-informacion-asistencia.component.scss'
})
export class TableroInformacionAsistenciaComponent extends GeneralComponent implements OnInit{

  filtroForm!: FormGroup;

  dropDummie: TipoDropdown[] = [
    {value: 1, label: 'Uno'},
    {value: 2, label: 'Dos'},
  ];

  dropTurno: TipoDropdown[] = [
    {value: 1, label: '09:00 - 11:00 hrs.'},
    {value: 2, label: '11:00 - 13:00 hrs.'},
    {value: 3, label: '13:00 - 15:00 hrs.'},
    {value: 4, label: '15:00 - 17:00 hrs.'},
    {value: 5, label: '17:00 - 19:00 hrs.'},
  ];

  constructor(
    private fb: FormBuilder,
  ){
     super();
  }

  ngOnInit(): void {
    this.filtroForm = this.inicializarForm();
  }

  inicializarForm(): FormGroup {
    return this.fb.group({
      fecha: [''],
      turno: [''],
      tipoAsistencia: [''],
    })
  }

}
