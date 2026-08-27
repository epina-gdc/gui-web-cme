import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { PlazaOrdinariaComponent } from '@privado/asignacion-plazas/components/plaza-ordinaria/plaza-ordinaria.component';
import { CoplamarComponent } from '@privado/asignacion-plazas/components/coplamar/coplamar.component';
import { AsignacionSustitucionComponent } from '@privado/asignacion-plazas/components/asignacion-sustitucion/asignacion-sustitucion.component';
import { InfoAspiranteComponent } from './components/info-aspirante/info-aspirante.component';
import { TabsModule } from 'primeng/tabs';
import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Button } from "primeng/button";

import { AlertService } from '@services/alert.service';
import { Subject, takeUntil } from 'rxjs';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { BusquedaResponse } from '@models/datosAsignacion';
import { Mensajes } from '@utils/mensajes';
import { EstadoOfertaService } from '@services/estado-oferta.service';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { ConvocatoriaActiva } from '@models/convocatoria.interface';
import { HttpRespuesta } from '@models/http-respuesta.interface';

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
export class AsignacionPlazasComponent implements OnInit, OnDestroy {
  private readonly ID_TIPO_CONVOCATORIA_MINIDRAFT = 2;
  private readonly DES_TIPO_CONVOCATORIA_MINIDRAFT = 'MINIDRAFT';
  private readonly IND_PERFIL_INTERNO = 1;
  private readonly TAB_PLAZAS_ORDINARIAS = 0;
  private readonly TAB_ASIGNACION_SUSTITUCION = 2;

  alertaService: AlertService = inject(AlertService);
  asignacionService: AsignacionPlazaService = inject(AsignacionPlazaService);
  catalogosGeneralesService: CatalogosGeneralesService = inject(CatalogosGeneralesService);
  mensajes: Mensajes = new Mensajes();

  tab: number = 0;
  form!: FormGroup;
  exist = false;
  tieneAsignacion: boolean = false;
  refreshKey = 0;

  busqueda!: BusquedaResponse;
  convocatoriaActiva: ConvocatoriaActiva | null = null;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private readonly estadoPlazaService: EstadoOfertaService) { }

  ngOnInit(): void {
    this.estadoPlazaService.refreshPlazas$
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      //console.log('oninit');
      this.refresh();
    });

    this.form = this.fb.group({
      folio: ['', [Validators.required, Validators.maxLength(10)]],
    });

    this.obtenerConvocatoriaActiva();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onBuscar(refresh: boolean = false) {
    this.form.get('folio')?.markAsTouched();
    this.form.updateValueAndValidity();

    const matricula = (this.form.get('folio')?.value ?? '').toString().trim();
    //console.log('refresh: ', refresh, matricula);
    if (!matricula) return; // evita buscar vacío

    this.asignacionService.getAspirante(matricula).subscribe({
      next: (response) => {
        //console.log('Result Busqueda', response);
        if (response.exito) {
          this.busqueda = structuredClone(response.respuesta);
          this.exist = true;
          if (this.busqueda.asignacionMedico?.id != null && this.busqueda.asignacionMedico?.id > 0)
            this.tieneAsignacion = true;
          else
            this.tieneAsignacion = false;
          if(refresh)
            this.refreshKey++;
          else
            this.refreshKey = 0;
          this.ajustarTabVisible();
        } else {
          this.alertaService.error(response.mensaje);
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
    this.tab = 0;
  }

  onLimpiar() {
    this.form.reset({ folio: '' });
    this.exist = false;
    this.tab = 0;
  }

  /*onRegistroGuardado(e: { id: number }) {
    //Refresh datos
    this.refresh();
  }*/

  refresh() {
    if (this.form == undefined) {
      return;
    }
    this.tab = 0;
    this.onBuscar(true); 
  }

  get mostrarCambioRama(): boolean {
    return !this.esConvocatoriaMinidraft;
  }

  get mostrarTabAsignacionSustitucion(): boolean {
    return !this.esConvocatoriaMinidraft || !this.esPerfilInternoAspirante;
  }

  private obtenerConvocatoriaActiva(): void {
    this.catalogosGeneralesService.getConvocatoriaActiva()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response: HttpRespuesta<ConvocatoriaActiva | undefined>) => {
        this.convocatoriaActiva = response.exito ? response.respuesta ?? null : null;
        this.ajustarTabVisible();
      },
      error: (error) => {
        console.log('Error al consultar convocatoria activa', error);
        this.convocatoriaActiva = null;
        this.ajustarTabVisible();
      }
    });
  }

  private get esConvocatoriaMinidraft(): boolean {
    const idTipoConvocatoria = this.obtenerIdTipoConvocatoria(this.convocatoriaActiva);
    const desTipoConvocatoria = this.obtenerDescripcionTipoConvocatoria(this.convocatoriaActiva);

    return idTipoConvocatoria === this.ID_TIPO_CONVOCATORIA_MINIDRAFT
      || desTipoConvocatoria === this.DES_TIPO_CONVOCATORIA_MINIDRAFT;
  }

  private get esPerfilInternoAspirante(): boolean {
    return this.obtenerIndPerfilInternoAspirante() === this.IND_PERFIL_INTERNO;
  }

  private obtenerIdTipoConvocatoria(convocatoria?: ConvocatoriaActiva | null): number | null {
    const idTipoConvocatoria = convocatoria?.tipo?.idTipoConvocatoria
      ?? (convocatoria as (ConvocatoriaActiva & { idTipoConvocatoria?: number | string | null }) | null | undefined)?.idTipoConvocatoria;

    return this.obtenerNumero(idTipoConvocatoria);
  }

  private obtenerDescripcionTipoConvocatoria(convocatoria?: ConvocatoriaActiva | null): string {
    return convocatoria?.tipo?.desTipoConvocatoria?.trim().toUpperCase() ?? '';
  }

  private obtenerIndPerfilInternoAspirante(): number | null {
    const indicadorAspirante = this.obtenerNumero(
      this.busqueda?.datosGenerales?.indPerfilInterno
    );

    if (indicadorAspirante !== null) {
      return indicadorAspirante;
    }

    const idPerfil = this.obtenerNumero(this.busqueda?.datosGenerales?.idPerfil);
    if (idPerfil === null) {
      return null;
    }

    const perfilConvocatoria = this.convocatoriaActiva?.perfiles?.find(
      perfil => this.obtenerNumero(perfil.idPerfil) === idPerfil
    );

    return this.obtenerNumero(perfilConvocatoria?.indPerfilInterno);
  }

  private ajustarTabVisible(): void {
    if (!this.mostrarTabAsignacionSustitucion && this.tab === this.TAB_ASIGNACION_SUSTITUCION) {
      this.tab = this.TAB_PLAZAS_ORDINARIAS;
    }
  }

  private obtenerNumero(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    const numero = Number(value);
    return Number.isNaN(numero) ? null : numero;
  }

}
