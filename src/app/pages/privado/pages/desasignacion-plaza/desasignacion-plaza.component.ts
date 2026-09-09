import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';

import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';

import {
  BusquedaResponse,
  DesasignacionRequest,
  InfoAspirante,
  Plaza,
  TipoAsignacion
} from '@models/datosAsignacion';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import { TituloCase } from '@pipes/titulo-case.pipe';
import { AlertService } from '@services/alert.service';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { DocumentoService } from '@services/documentos.service';

interface AspiranteDesasignacion {
  fotoUrl: string;
  nombreCompleto: string;
  matricula: string;
  especialidades: string[];
  sexo: string;
  curp: string;
  rfc: string;
  modalidad: string;
  ooadResidencia: string;
  asignacion: {
    ooad: string;
    zona: string;
    especialidad: string;
  };
  plaza: Plaza;
}

@Component({
  selector: 'app-desasignacion-plaza',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Button,
    Card,
    Avatar,
    TagModule,
    DialogModule,
    Select,
    TextareaModule,
    TituloCase
  ],
  templateUrl: './desasignacion-plaza.component.html',
  styleUrl: './desasignacion-plaza.component.scss'
})
export class DesasignacionPlazaComponent implements OnInit, OnDestroy {
  private readonly MSG_SIN_ASIGNACION = 'La matrícula/folio del médico aspirante no tiene una asignación. Por favor, verifica su información.';
  private readonly IND_PERFIL_INTERNO = 1;

  private readonly fb = inject(FormBuilder);
  private readonly asignacionService = inject(AsignacionPlazaService);
  private readonly catalogosService = inject(CatalogosGeneralesService);
  private readonly documentoService = inject(DocumentoService);
  private readonly alertaService = inject(AlertService);
  private readonly destroy$ = new Subject<void>();

  form!: FormGroup;
  modalForm!: FormGroup;
  busqueda: BusquedaResponse | null = null;
  aspirante: AspiranteDesasignacion = this.crearAspiranteVacio();
  motivosDesasignacion: TipoDropdown[] = [];

  hasSearched = false;
  exist = false;
  isSearching = false;
  isSaving = false;
  isLoadingMotivos = false;
  modalVisible = false;

  private fotoObjectUrl = '';
  private searchRequestId = 0;

  ngOnInit(): void {
    this.form = this.fb.group({
      folio: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[a-zA-Z0-9]+$/)]],
    });

    this.modalForm = this.fb.group({
      idMotivoDesasignacion: [null, Validators.required],
      desJustificacion: [{ value: '', disabled: true }, [Validators.maxLength(500)]],
    });

    this.modalForm.get('idMotivoDesasignacion')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((motivo) => this.actualizarEstadoObservaciones(motivo));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.revocarFoto();
  }

  normalizarFolio(): void {
    const control = this.form.get('folio');
    const value = String(control?.value ?? '');
    const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);

    if (value !== cleanValue) {
      control?.setValue(cleanValue, { emitEvent: false });
    }
  }

  onBuscar(): void {
    this.form.get('folio')?.markAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid || this.isSearching) {
      return;
    }

    const matricula = String(this.form.get('folio')?.value ?? '').trim();
    const currentRequestId = ++this.searchRequestId;
    this.isSearching = true;
    this.hasSearched = true;
    this.limpiarResultado(false);

    this.asignacionService.getAspirante(matricula)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          if (currentRequestId === this.searchRequestId) {
            this.isSearching = false;
          }
        })
      )
      .subscribe({
        next: (response) => {
          if (currentRequestId !== this.searchRequestId) {
            return;
          }

          if (response?.exito && response?.respuesta) {
            const resultado = structuredClone(response.respuesta) as BusquedaResponse;
            const idAsignacion = this.obtenerNumero(resultado.asignacionMedico?.id);

            if (idAsignacion !== null && idAsignacion > 0) {
              this.busqueda = resultado;
              this.exist = true;
              this.cargarAspirante();
              return;
            }

            this.mostrarSinAsignacion();
            return;
          }

          const mensaje = response?.mensaje || 'No se encontró matrícula/folio.';
          this.alertaService.error(mensaje);
        },
        error: (error) => {
          if (currentRequestId !== this.searchRequestId) {
            return;
          }

          const mensaje = error?.error?.mensaje || 'No se encontró matrícula/folio.';
          this.alertaService.error(mensaje);
        }
      });
  }

  onLimpiar(): void {
    this.searchRequestId++;
    this.form.reset({ folio: '' });
    this.hasSearched = false;
    this.limpiarResultado(true);
  }

  abrirModalDesasignacion(): void {
    if (!this.idAsignacion || this.isSaving) {
      return;
    }

    this.modalForm.reset({ idMotivoDesasignacion: null, desJustificacion: '' });
    this.modalForm.get('desJustificacion')?.disable({ emitEvent: false });
    this.modalVisible = true;
    this.consultarMotivosDesasignacion();
  }

  cancelarModal(): void {
    this.modalVisible = false;
  }

  confirmarDesasignacion(): void {
    this.modalForm.markAllAsTouched();

    if (this.modalForm.invalid || this.isSaving || !this.idAsignacion) {
      return;
    }

    const rawValue = this.modalForm.getRawValue();
    const idMotivoDesasignacion = this.obtenerNumero(rawValue.idMotivoDesasignacion);

    if (idMotivoDesasignacion === null) {
      return;
    }

    const desJustificacion = String(rawValue.desJustificacion ?? '').trim();
    const request: DesasignacionRequest = {
      idAsignacion: this.idAsignacion,
      idMotivoDesasignacion,
      desJustificacion
    };

    this.isSaving = true;
    this.asignacionService.desasignarPlaza(request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isSaving = false)
      )
      .subscribe({
        next: (response) => {
          if (response.exito) {
            this.alertaService.exito(this.mensajeExitoDesasignacion);
            this.modalVisible = false;
            this.onLimpiar();
            return;
          }

          this.alertaService.error(response.mensaje);
        },
        error: (error) => {
          const mensaje = error?.error?.mensaje || 'No fue posible realizar la desasignación.';
          this.alertaService.error(mensaje);
        }
      });
  }

  get tipoAsignacion(): number {
    return this.obtenerNumero(this.busqueda?.asignacionMedico?.idTipoAsignacion?.id) ?? 0;
  }

  get idAsignacion(): number | null {
    return this.obtenerNumero(this.busqueda?.asignacionMedico?.id);
  }

  get esPlazaConDetalle(): boolean {
    return this.tipoAsignacion === TipoAsignacion.PlazaOrdinaria || this.tipoAsignacion === TipoAsignacion.PlazaCoplamar;
  }

  get esSustitucion(): boolean {
    return this.tipoAsignacion === TipoAsignacion.Sustitucion08;
  }

  get esMedicoInterno(): boolean {
    const indPerfilInterno = this.obtenerNumero(this.busqueda?.datosGenerales?.indPerfilInterno);
    return indPerfilInterno === this.IND_PERFIL_INTERNO || this.aspirante.modalidad.trim().toUpperCase() === 'INTERNO';
  }

  get observacionesLength(): number {
    return String(this.modalForm.get('desJustificacion')?.value ?? '').length;
  }

  get textoBotonDesasignar(): string {
    switch (this.tipoAsignacion) {
      case TipoAsignacion.PlazaOrdinaria: return 'Desasignar Plaza';
      case TipoAsignacion.PlazaCoplamar: return 'Desasignar Plaza COPLAMAR';
      case TipoAsignacion.Sustitucion08: return 'Desasignar Sustitución 08';
      case TipoAsignacion.CambioRama: return 'Desasignar Cambio de Rama';
      case TipoAsignacion.RechazoOferta: return 'Desasignar Rechazo de Oferta';
      default: return 'Desasignar';
    }
  }

  get mensajeExitoDesasignacion(): string {
    switch (this.tipoAsignacion) {
      case TipoAsignacion.PlazaOrdinaria: return 'Se realizó la desasignación de la plaza.';
      case TipoAsignacion.PlazaCoplamar: return 'Se realizó la desasignación de la plaza COPLAMAR.';
      case TipoAsignacion.Sustitucion08: return 'Se realizó la desasignación de la sustitución 08.';
      case TipoAsignacion.CambioRama: return 'Se realizó la desasignación del cambio de rama.';
      case TipoAsignacion.RechazoOferta: return 'Se realizó la desasignación del rechazo de oferta.';
      default: return 'Se realizó la desasignación.';
    }
  }

  getTagTexto(tipo: number): string {
    switch (tipo) {
      case TipoAsignacion.PlazaOrdinaria: return 'Plaza Ordinaria';
      case TipoAsignacion.PlazaCoplamar: return 'Plaza Coplamar';
      case TipoAsignacion.Sustitucion08: return 'Sustitución 08';
      case TipoAsignacion.CambioRama: return 'Cambio de rama';
      case TipoAsignacion.RechazoOferta: return 'Rechazo de oferta';
      default: return '';
    }
  }

  getTagClass(tipo: number): string {
    switch (tipo) {
      case TipoAsignacion.PlazaOrdinaria: return 'tag-ordinaria';
      case TipoAsignacion.PlazaCoplamar: return 'tag-coplamar';
      case TipoAsignacion.Sustitucion08: return 'tag-sustitucion';
      case TipoAsignacion.CambioRama: return 'tag-cambio';
      case TipoAsignacion.RechazoOferta: return 'tag-rechazo';
      default: return '';
    }
  }

  private limpiarResultado(limpiarBusqueda: boolean): void {
    this.exist = false;
    this.busqueda = null;
    this.aspirante = this.crearAspiranteVacio();
    this.revocarFoto();

    if (limpiarBusqueda) {
      this.modalVisible = false;
      this.modalForm?.reset({ idMotivoDesasignacion: null, desJustificacion: '' });
      this.modalForm?.get('desJustificacion')?.disable({ emitEvent: false });
    }
  }

  private mostrarSinAsignacion(): void {
    this.exist = false;
    this.busqueda = null;
    this.aspirante = this.crearAspiranteVacio();
    this.alertaService.alerta(this.MSG_SIN_ASIGNACION);
  }

  private cargarAspirante(): void {
    const datos = this.busqueda?.datosGenerales;
    const asignacion = this.busqueda?.asignacionMedico;

    this.aspirante = {
      fotoUrl: '',
      nombreCompleto: datos?.nombreCompleto ?? '',
      matricula: datos?.matriculaFolio ?? datos?.matricula ?? datos?.folio ?? '',
      especialidades: this.separarEspecialidades(datos?.especialidades),
      sexo: datos?.genero ?? '',
      curp: datos?.curp ?? '',
      rfc: datos?.rfc ?? '',
      modalidad: this.obtenerModalidad(datos),
      ooadResidencia: this.obtenerOoadResidencia(datos),
      asignacion: {
        ooad: asignacion?.idSustitucion?.desOoad ?? '',
        zona: asignacion?.idSustitucion?.desZona ?? '',
        especialidad: asignacion?.idSustitucion?.desEspecialidad ?? ''
      },
      plaza: asignacion?.idPlazaLayout ?? new Plaza()
    };

    this.obtenerFotografia(datos?.refFotografia ?? '');
  }

  private consultarMotivosDesasignacion(): void {
    if (this.isLoadingMotivos) {
      return;
    }

    this.isLoadingMotivos = true;
    this.catalogosService.getMotivosDesasignacion()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingMotivos = false)
      )
      .subscribe({
        next: (response) => {
          if (response.exito && Array.isArray(response.respuesta)) {
            this.motivosDesasignacion = response.respuesta
              .filter((motivo) => this.obtenerNumero(motivo.indActivo) !== 0)
              .map((motivo) => ({
                label: motivo.desMotivoDesasignacion,
                value: motivo.idMotivoDesasignacion
              }));
            return;
          }

          this.motivosDesasignacion = [];
          this.alertaService.error(response.mensaje || 'No fue posible consultar los motivos de desasignación.');
        },
        error: (error) => {
          this.motivosDesasignacion = [];
          const mensaje = error?.error?.mensaje || 'No fue posible consultar los motivos de desasignación.';
          this.alertaService.error(mensaje);
        }
      });
  }

  private actualizarEstadoObservaciones(motivo: unknown): void {
    const observacionesControl = this.modalForm.get('desJustificacion');

    if (motivo) {
      observacionesControl?.enable({ emitEvent: false });
      return;
    }

    observacionesControl?.reset('', { emitEvent: false });
    observacionesControl?.disable({ emitEvent: false });
  }

  private obtenerFotografia(uuidArchivo: string): void {
    this.revocarFoto();

    if (!uuidArchivo) {
      return;
    }

    this.documentoService.getFotografia(uuidArchivo)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.fotoObjectUrl = URL.createObjectURL(response);
          this.aspirante.fotoUrl = this.fotoObjectUrl;
        },
        error: () => {
          this.aspirante.fotoUrl = '';
        }
      });
  }

  private revocarFoto(): void {
    if (this.fotoObjectUrl) {
      URL.revokeObjectURL(this.fotoObjectUrl);
      this.fotoObjectUrl = '';
    }
  }

  private crearAspiranteVacio(): AspiranteDesasignacion {
    return {
      fotoUrl: '',
      nombreCompleto: '',
      matricula: '',
      especialidades: [],
      sexo: '',
      curp: '',
      rfc: '',
      modalidad: '',
      ooadResidencia: '',
      asignacion: {
        ooad: '',
        zona: '',
        especialidad: ''
      },
      plaza: new Plaza()
    };
  }

  private separarEspecialidades(especialidades?: string | null): string[] {
    if (!especialidades) {
      return [];
    }

    return especialidades.split(',')
      .map((especialidad) => especialidad.trim())
      .filter(Boolean);
  }

  private obtenerModalidad(datos?: InfoAspirante): string {
    const modalidad = this.obtenerTextoPropiedad(datos, ['modalidad', 'desModalidad', 'tipoMedico']);

    if (modalidad) {
      return modalidad;
    }

    const indPerfilInterno = this.obtenerNumero(datos?.indPerfilInterno);

    if (indPerfilInterno === 1) {
      return 'Interno';
    }

    if (indPerfilInterno === 0) {
      return 'Externo';
    }

    return '';
  }

  private obtenerOoadResidencia(datos?: InfoAspirante): string {
    return this.obtenerTextoPropiedad(datos, [
      'desOoadResidencia',
      'ooadResidencia',
      'nomOoadResidencia',
      'desOoad'
    ]);
  }

  private obtenerTextoPropiedad(objeto: object | null | undefined, propiedades: string[]): string {
    if (!objeto) {
      return '';
    }

    const record = objeto as Record<string, unknown>;

    for (const propiedad of propiedades) {
      const value = record[propiedad];
      const texto = value === null || value === undefined ? '' : String(value).trim();

      if (texto) {
        return texto;
      }
    }

    return '';
  }

  private obtenerNumero(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numero = Number(value);
    return Number.isNaN(numero) ? null : numero;
  }
}
