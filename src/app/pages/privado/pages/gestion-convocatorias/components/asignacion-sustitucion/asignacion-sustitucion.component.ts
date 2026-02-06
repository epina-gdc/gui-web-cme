import {Component, signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {TipoDropdown} from '@models/tipo-dropdown.interface';
import {ToggleSwitch} from 'primeng/toggleswitch';
import {Button} from 'primeng/button';
import {TableModule} from 'primeng/table';
import {Paginator} from 'primeng/paginator';

@Component({
  selector: 'app-asignacion-sustitucion',
  imports: [
    Card,
    FormsModule,
    ReactiveFormsModule,
    Select,
    ToggleSwitch,
    Button,
    TableModule,
    Paginator
  ],
  templateUrl: './asignacion-sustitucion.component.html',
  styleUrl: './asignacion-sustitucion.component.scss'
})
export class AsignacionSustitucionComponent {
  form!: FormGroup;

  first: number = 0;
  rows: number = 10;
  totalElementos = 0;




  options: TipoDropdown[] = [
    {value: 1, label: 'A'},
    {value: 2, label: 'B'},
    {value: 3, label: 'C'},
    {value: 4, label: 'D'},
  ];


  datosConfiguracion: WritableSignal<any[]> = signal([
    {'nombreOoad': 'Baja California Norte',
      'zona': 'Zona 1',
      'especialidad': 'Medicina interna',
      'estatus': false,
    }
  ]);

  constructor(
    private fb: FormBuilder,
  ){
    this.form = this.inicializarForm();
  }




  inicializarForm(): FormGroup{
    return this.fb.group({
      convocatoria: [null],
      limiteContratacionesEspecifica: [null],
      ooad: [null, Validators.required],
      zona: [null, Validators.required],
      especialidad: [null, Validators.required],
      limiteContrataciones: [null],
    })
  }


  onPageChange(valor: any){
    console.log(valor);
  }

}
