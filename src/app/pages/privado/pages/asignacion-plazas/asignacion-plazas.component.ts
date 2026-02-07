import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {PlazaOrdinariaComponent} from '@privado/asignacion-plazas/components/plaza-ordinaria/plaza-ordinaria.component';
import {CoplamarComponent} from '@privado/asignacion-plazas/components/coplamar/coplamar.component';
import {AsignacionSustitucionComponent} from '@privado/asignacion-plazas/components/asignacion-sustitucion/asignacion-sustitucion.component';
import {TabsModule} from 'primeng/tabs';
import {CommonModule} from '@angular/common';
import {Card} from "primeng/card";
//import { FormsModule } from '@angular/forms';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { InputText} from 'primeng/inputtext';
import { Button } from "primeng/button";
import { Avatar } from 'primeng/avatar';
import { AlertService } from '@services/alert.service';
import { Subject, debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-asignacion-plazas',
  imports: [
    TabsModule,
    PlazaOrdinariaComponent,
    CoplamarComponent,
    AsignacionSustitucionComponent,
    CommonModule,
    Card,
    ReactiveFormsModule,
    InputText,
    Button,
    Avatar
],
  templateUrl: './asignacion-plazas.component.html',
  styleUrl: './asignacion-plazas.component.scss'
})
export class AsignacionPlazasComponent {
  alertaService: AlertService = inject(AlertService);
  
  tab: number = 0;
  form!: FormGroup;
  exist = false;

  nombreFoto = '';
  defaultFile = '/assets/images/img_medico.png';

  medico = {
    fotoUrl: '/assets/images/img_medico.png',
    nombreCompleto: 'Pablo Andrés García Bernal',
    matricula: '311080212',
    especialidades: ['Anestesiología pediátrica', 'Cardiología', 'Anatomía patológica'],
    sexo: 'Hombre',
    curp: 'BBPA841316HDFLRR01',
    rfc: 'BBPA841316HDF',
    email: 'pablo_garcia@gmail.com',
    emailAdicional: 'pablo_bernal@gmail.com',
  };

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      folio: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  rechazarOferta() {
    // abrir diálogo / confirm
  }

  cambiarRama() {
    // navegación / modal
  }

  reimprimirVerificacion() {
    // imprimir / generar PDF
  }


  onLimpiar() {
    this.form.reset({ folio: '' });
    this.exist = false;
  }

  onBuscar() {
    const value = this.form.get('folio')!.value as string;;
    if (value == '123') {
      this.exist = true;
      return;
    } 
    
    this.alertaService.error('No se encontró matrícula/folio.');

    //Get datos
    // this.service.buscar(value).subscribe(res => this.hayResultados = res?.length > 0);
    this.exist = false; // placeholder
  }
}
