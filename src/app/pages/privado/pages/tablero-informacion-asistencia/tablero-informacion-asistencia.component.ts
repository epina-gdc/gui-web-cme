import {Component, OnInit} from '@angular/core';
import {MenuPlazasComponent} from '@privado/asignacion-plazas/components/menu-plazas/menu-plazas.component';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {GeneralComponent} from '@components/general.component';
import { DatePickerModule } from 'primeng/datepicker';
import {Select} from 'primeng/select';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-tablero-informacion-asistencia',
  imports: [
    MenuPlazasComponent,
    DatePickerModule,
    ReactiveFormsModule,
    Select,
    Button
  ],
  templateUrl: './tablero-informacion-asistencia.component.html',
  styleUrl: './tablero-informacion-asistencia.component.scss'
})
export class TableroInformacionAsistenciaComponent extends GeneralComponent implements OnInit{

  filtroForm!: FormGroup;

  dropDummie: TipoDropdown[] = [
    {value: 1, label: 'Uno'},
    {value: 2, label: 'Dos'},
  ]

  totales: any[] = [
    
  ]

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
