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
  
  tab: number = 0;
  form!: FormGroup;
  exist = false;



  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      folio: ['', [Validators.required, Validators.maxLength(10)]],
    });
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
