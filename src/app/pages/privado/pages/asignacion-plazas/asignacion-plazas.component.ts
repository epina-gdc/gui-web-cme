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
import { Mensajes } from '@utils/mensajes';
import { EstadoOfertaService } from '@services/estado-oferta.service';

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
  mensajes: Mensajes = new Mensajes();
  
  tab: number = 0;
  form!: FormGroup;
  exist = false;
  tieneAsignacion: boolean = false;
  refreshKey = 0;

  busqueda!: BusquedaResponse;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private readonly estadoPlazaService: EstadoOfertaService) {}

  ngOnInit(): void {
    this.estadoPlazaService.refreshPlazas$.subscribe(() => {
      this.refresh();
    });
    
    this.form = this.fb.group({
      folio: ['', [Validators.required, Validators.maxLength(10)]],
    });
  }

  onBuscar() {
    this.form.get('folio')?.markAsTouched();
    this.form.updateValueAndValidity();

    const matricula = (this.form.get('folio')?.value ?? '').toString().trim();

    if (!matricula) return; // evita buscar vacío

    this.asignacionService.getAspirante(matricula).subscribe({
      next: (response) => {
        console.log('Result Busqueda', response);
        if(response.exito){
          this.busqueda = structuredClone(response.respuesta);
          this.exist = true;
          if(this.busqueda.asignacionMedico?.id != null && this.busqueda.asignacionMedico?.id > 0)
            this.tieneAsignacion = true;
          else
            this.tieneAsignacion = false;
        } else {
          this.alertaService.error('No se encontró matrícula/folio.');
          this.exist = false;
          this.tieneAsignacion = false;
        }
      },
      error: (error) => {
        //console.log(error);
        this.alertaService.error('No se encontró matrícula/folio.');
        this.exist = false;
        this.tieneAsignacion = false;
      }
    });
  }

  onLimpiar() {
    this.form.reset({ folio: '' });
    this.exist = false;
  }

  onRegistroGuardado(e: { id: number }) {
    //Refresh datos
    this.refresh();
  }

  refresh(){
    this.onBuscar();
    this.refreshKey++;
  }

}
