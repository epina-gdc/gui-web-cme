import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, effect, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { AsignacionMesaService, Convocatoria, ResponseConvocatorias } from '../../../asignacion-mesa/services/asignacion-mesa.service';
import { EnvioCitasService, SolicitudEnvioCitas, TotalCitas, TypeConvocatoria, TypeMedico } from '../../services/envio-citas.service';

@Component({
  selector: 'app-convocatoria',
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    SelectModule,
    ButtonModule
  ],
  templateUrl: './convocatoria.component.html',
  styleUrl: './convocatoria.component.scss',
})
export class ConvocatoriaComponent implements OnInit {

  // INYECCIONES
  destroyRef = inject(DestroyRef);
  asignacionMesaService = inject(AsignacionMesaService);
  envioCitasService = inject(EnvioCitasService);

  // PROPIEDADES
  tipoMed = TypeMedico;
  tipoConvocatoria = TypeConvocatoria;
  convocatorias: Convocatoria[] = [];

  tipoMedicoSelect = model<TypeMedico | undefined>(undefined);
  convocatoriaSelect = model<number | undefined>(undefined);
  totalCitas = model<TotalCitas | undefined>(undefined);
  solicitudEnvioCitas = model<SolicitudEnvioCitas | undefined>(undefined);
  convocatoriaInactivaSeleccionada = model<boolean>(false);
  tipoConvocatoriaSeleccionada = signal<TypeConvocatoria | undefined>(undefined);
  loading = signal(false);

  // MAPA PARA GUARDAR TOTALES POR CONVOCATORIA Y TIPO DE MÉDICO
  private totalesPorConvocatoriaTipo = new Map<string, TotalCitas>();

  // INTERVALO PARA ACTUALIZACIÓN PERIÓDICA
  private intervalId: number | null = null;
  private readonly INTERVAL_TIME = 20000; // 20 segundos

  constructor() {
    // Cargar datos cuando cambian las selecciones, sin iniciar polling.
    effect(() => {
      const convocatoria = this.convocatoriaSelect();
      const tipoMed = this.tipoMedicoSelect();

      this.actualizarConvocatoriaInactivaSeleccionada(convocatoria);
      this.detenerActualizacionPeriodica();

      const tipoConvocatoria = this.obtenerTipoConvocatoria(convocatoria);
      this.tipoConvocatoriaSeleccionada.set(tipoConvocatoria);

      if (!convocatoria || !tipoConvocatoria) {
        this.totalCitas.set(undefined);
        this.tipoMedicoSelect.set(undefined);
        this.loading.set(false);
        return;
      }

      const tiposMedico = this.obtenerTiposMedico(tipoConvocatoria);
      if (!tipoMed || !tiposMedico.includes(tipoMed)) {
        this.tipoMedicoSelect.set(tiposMedico[0]);
        return;
      }

      // Revisar los tipos de médico disponibles para la convocatoria seleccionada.
      this.revisarTiposMedico(convocatoria, tiposMedico);
      this.cargaTotales(convocatoria, tipoMed);
    });

    // El polling solo se activa cuando Detalle confirma que se mandó el envío de citas.
    effect(() => {
      const solicitud = this.solicitudEnvioCitas();

      if (!solicitud) {
        this.detenerActualizacionPeriodica();
        return;
      }

      if (!this.esSolicitudActual(solicitud)) {
        return;
      }

      this.iniciarActualizacionPeriodica(solicitud);
    });
  }

  ngOnInit(): void {
    this.loadConvocatorias();
  }

  ngOnDestroy(): void {
    this.detenerActualizacionPeriodica();
  }

  loadConvocatorias(): void {
    this.loading.set(true);

    this.asignacionMesaService.getLstConvocatorias()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: ResponseConvocatorias) => {
          if (response.exito) {
            this.convocatorias = response.respuesta;
            this.actualizarConvocatoriaInactivaSeleccionada(this.convocatoriaSelect());
            this.tipoConvocatoriaSeleccionada.set(this.obtenerTipoConvocatoria(this.convocatoriaSelect()));
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar convocatorias:', err);
          this.loading.set(false);
        }
      });
  }

  // ============================================
  // REVISAR LOS TIPOS DE MÉDICO DISPONIBLES AL SELECCIONAR CONVOCATORIA
  // ============================================
  private revisarTiposMedico(convocatoriaId: number, tiposMedico: TypeMedico[]): void {
    tiposMedico.forEach(tipoMedico => this.consultarTotalesTipo(convocatoriaId, tipoMedico));
  }

  // ============================================
  // CONSULTAR TOTALES DE UN TIPO ESPECÍFICO (sin afectar la vista actual)
  // ============================================
  private consultarTotalesTipo(convocatoriaId: number, tipoMed: TypeMedico): void {
    this.envioCitasService.consultaTotalesCitas(convocatoriaId, tipoMed)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (response.exito) {
            const datosTotales = response.respuesta;
            // Guardar en el mapa sin afectar la vista actual
            this.guardarTotales(convocatoriaId, tipoMed, datosTotales);
          }
        },
        error: (err) => {
          console.error(`Error al cargar totales ${tipoMed}:`, err);
        }
      });
  }

  // ============================================
  // CARGA INICIAL DE LOS TOTALES (para el tipo seleccionado)
  // ============================================
  private cargaTotales(convocatoriaId: number, tipoMed: TypeMedico): void {
    // Limpiar los totales antes de cargar nuevos datos
    this.totalCitas.set(undefined);

    // Consultar los totales sin activar polling
    this.consultarTotales(convocatoriaId, tipoMed);
  }

  // ============================================
  // ACTUALIZACIÓN PERIÓDICA DE LOS TOTALES (solo durante envío de citas)
  // ============================================
  private iniciarActualizacionPeriodica(solicitud: SolicitudEnvioCitas): void {
    // Detener actualización anterior si existe
    this.detenerActualizacionPeriodica();

    // Actualizar inmediatamente después de iniciar el envío
    this.actualizarTotales(solicitud);

    this.intervalId = window.setInterval(() => {
      if (this.esSolicitudActual(solicitud)) {
        this.actualizarTotales(solicitud);
      } else {
        this.detenerActualizacionPeriodica();
      }
    }, this.INTERVAL_TIME);
  }

  // ============================================
  // ACTUALIZAR LOS TOTALES (sin limpiar)
  // ============================================
  private actualizarTotales(solicitud: SolicitudEnvioCitas): void {
    this.consultarTotales(solicitud.idConvocatoria, solicitud.idTipoMedico, solicitud.idSolicitud);
  }

  // ============================================
  // CONSULTA LOS TOTALES AL SERVICIO (lógica común - afecta la vista)
  // ============================================
  private consultarTotales(convocatoriaId: number, tipoMed: TypeMedico, idSolicitud?: number): void {
    this.loading.set(true);

    this.envioCitasService.consultaTotalesCitas(convocatoriaId, tipoMed)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!this.esSeleccionActual(convocatoriaId, tipoMed)
            || !this.esSolicitudEnvioVigente(idSolicitud, convocatoriaId, tipoMed)) {
            return;
          }

          //console.log('Respuesta totales:', response);
          if (response.exito) {
            const datosTotales = response.respuesta;
            this.totalCitas.set(datosTotales);

            // Guardar los totales por convocatoria y tipo de médico
            this.guardarTotales(convocatoriaId, tipoMed, datosTotales);

            // Verificar si ya terminó después de actualizar
            if (this.tieneFechaYHoraFin(datosTotales)) {
              this.detenerActualizacionPeriodica();
              if (idSolicitud !== undefined) {
                this.solicitudEnvioCitas.set(undefined);
              }
              //console.log(' Proceso completado: fechaFin y horaFin disponibles');
            }
          }
          this.loading.set(false);
        },
        error: (err) => {
          if (!this.esSeleccionActual(convocatoriaId, tipoMed)
            || !this.esSolicitudEnvioVigente(idSolicitud, convocatoriaId, tipoMed)) {
            return;
          }

          console.error('Error al cargar totales:', err);
          this.loading.set(false);
        }
      });
  }

  // ============================================
  // DETENER LA ACTUALIZACIÓN PERIÓDICA
  // ============================================
  private detenerActualizacionPeriodica(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      //console.log('Actualización periódica detenida');
    }
  }

  // VERIFICA SI EL PROCESO HA FINALIZADO (tiene fechaFin y horaFin)
  private tieneFechaYHoraFin(total: TotalCitas | undefined): boolean {
    if (!total) return false;

    const fechasHoras = total.fechasHorasEnvios;

    if (!fechasHoras) return false;

    // Verifica que fechaFin y horaFin tengan valores no vacíos
    return !!(fechasHoras.fechaFin && fechasHoras.fechaFin.trim()) &&
           !!(fechasHoras.horaFin && fechasHoras.horaFin.trim());
  }

  // ============================================
  // VERIFICA SI UN TIPO DE MÉDICO YA SE PROCESÓ
  // ============================================
  protected tieneProcesoCompletado(tipo: TypeMedico): boolean {
    const convocatoriaId = this.convocatoriaSelect();
    if (!convocatoriaId) {
      return false;
    }

    const totales = this.obtenerTotales(convocatoriaId, tipo);
    return this.tieneFechaYHoraFin(totales);
  }

  protected mostrarTarjetas(): boolean {
    return !!this.convocatoriaSelect() && !!this.tipoConvocatoriaSeleccionada();
  }

  protected esConvocatoriaDraft(): boolean {
    return this.tipoConvocatoriaSeleccionada() === TypeConvocatoria.DRAFT;
  }

  protected esConvocatoriaMiniDraft(): boolean {
    return this.tipoConvocatoriaSeleccionada() === TypeConvocatoria.MINI_DRAFT;
  }

  protected obtenerClaseColumna(): string {
    return this.esConvocatoriaMiniDraft() ? 'lg:col-4' : 'lg:col-3';
  }

  private guardarTotales(convocatoriaId: number, tipo: TypeMedico, totales: TotalCitas): void {
    this.totalesPorConvocatoriaTipo.set(this.obtenerLlaveTotales(convocatoriaId, tipo), totales);
  }

  private obtenerTotales(convocatoriaId: number, tipo: TypeMedico): TotalCitas | undefined {
    return this.totalesPorConvocatoriaTipo.get(this.obtenerLlaveTotales(convocatoriaId, tipo));
  }

  private obtenerLlaveTotales(convocatoriaId: number, tipo: TypeMedico): string {
    return `${convocatoriaId}-${tipo}`;
  }

  private actualizarConvocatoriaInactivaSeleccionada(idConvocatoria: number | undefined): void {
    this.convocatoriaInactivaSeleccionada.set(this.esConvocatoriaInactiva(idConvocatoria));
  }

  private esConvocatoriaInactiva(idConvocatoria: number | undefined): boolean {
    if (!idConvocatoria) {
      return false;
    }

    return this.convocatorias.find(convocatoria => convocatoria.idConvocatoria === idConvocatoria)?.activa === false;
  }

  private obtenerTipoConvocatoria(idConvocatoria: number | undefined): TypeConvocatoria | undefined {
    const idTipoConvocatoria = this.convocatorias
      .find(convocatoria => convocatoria.idConvocatoria === idConvocatoria)
      ?.tipo?.idTipoConvocatoria;

    return idTipoConvocatoria === TypeConvocatoria.DRAFT || idTipoConvocatoria === TypeConvocatoria.MINI_DRAFT
      ? idTipoConvocatoria
      : undefined;
  }

  private obtenerTiposMedico(tipoConvocatoria: TypeConvocatoria): TypeMedico[] {
    return tipoConvocatoria === TypeConvocatoria.MINI_DRAFT
      ? [TypeMedico.SUSTITUTOS, TypeMedico.EXTERNOS]
      : [TypeMedico.BECADOS, TypeMedico.RESIDENTES, TypeMedico.EXTERNOS];
  }

  private esSeleccionActual(convocatoriaId: number, tipo: TypeMedico): boolean {
    return this.convocatoriaSelect() === convocatoriaId && this.tipoMedicoSelect() === tipo;
  }

  private esSolicitudActual(solicitud: SolicitudEnvioCitas): boolean {
    return this.convocatoriaSelect() === solicitud.idConvocatoria
      && this.tipoMedicoSelect() === solicitud.idTipoMedico
      && this.solicitudEnvioCitas()?.idSolicitud === solicitud.idSolicitud;
  }

  private esSolicitudEnvioVigente(idSolicitud: number | undefined, convocatoriaId: number, tipo: TypeMedico): boolean {
    if (idSolicitud === undefined) {
      return true;
    }

    const solicitud = this.solicitudEnvioCitas();
    return !!solicitud
      && solicitud.idSolicitud === idSolicitud
      && solicitud.idConvocatoria === convocatoriaId
      && solicitud.idTipoMedico === tipo;
  }

  onCambioMedSelec(tipo: TypeMedico): void {
    const tipoConvocatoria = this.tipoConvocatoriaSeleccionada();
    if (tipoConvocatoria && this.obtenerTiposMedico(tipoConvocatoria).includes(tipo)) {
      this.tipoMedicoSelect.set(tipo);
    }
  }
}
