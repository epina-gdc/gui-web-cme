import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {PlazaOrdinariaComponent} from '@privado/asignacion-plazas/components/plaza-ordinaria/plaza-ordinaria.component';
import {CoplamarComponent} from '@privado/asignacion-plazas/components/coplamar/coplamar.component';
import {AsignacionSustitucionComponent} from '@privado/asignacion-plazas/components/asignacion-sustitucion/asignacion-sustitucion.component';
import {InfoAspiranteComponent} from './components/info-aspirante/info-aspirante.component';
import {TabsModule} from 'primeng/tabs';
import {CommonModule} from '@angular/common';

import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button} from "primeng/button";

import {AlertService} from '@services/alert.service';
import {Subject} from 'rxjs';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { BusquedaResponse } from '@models/datosAsignacion';

@Component({
  selector: 'app-asignacion-plazas',
  imports: [
    TabsModule,
    PlazaOrdinariaComponent,
    CoplamarComponent,
    AsignacionSustitucionComponent,
    InfoAspiranteComponent,
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Button
],
  templateUrl: './asignacion-plazas.component.html',
  styleUrl: './asignacion-plazas.component.scss'
})
export class AsignacionPlazasComponent {
  alertaService: AlertService = inject(AlertService);
  asignacionService: AsignacionPlazaService = inject(AsignacionPlazaService);
  
  tab: number = 0;
  form!: FormGroup;
  exist = false;

  busqueda!: BusquedaResponse;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      folio: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  onBuscar() {
    const matricula = this.form.get('folio')!.value as string;
    this.asignacionService.getAspirante(matricula).subscribe({
      next: (response) => {
        //console.log(response);
        if(response.exito){
          this.busqueda = response.respuesta;
          this.exist = true;
        } else {
          this.alertaService.error('No se encontró matrícula/folio.');
          this.exist = false;
        }
      },
      error: (error) => {
        //console.log(error);
        this.alertaService.error('No se encontró matrícula/folio.');
        this.exist = false;
      }
    })
  }

  onLimpiar() {
    this.form.reset({ folio: '' });
    this.exist = false;
  }
}
