import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, effect, inject, model, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from "primeng/card";
import { SelectModule } from "primeng/select";
import { ButtonModule } from "primeng/button";
import { AsignacionMesaService, Convocatoria, ResponseConvocatorias } from '../../../asignacion-mesa/services/asignacion-mesa.service';
import { EnvioCitasService, TotalCitas, TypeMedico } from '../../services/envio-citas.service';

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
  convocatorias: Convocatoria[] = [];
  
  tipoMedicoSelect = model<TypeMedico | undefined>(undefined);
  convocatoriaSelect = model<number | undefined>(undefined);
  totalCitas = model<TotalCitas | undefined>(undefined);
  loading = signal(false);

  // INTERVALO PARA ACTUALIZACIÓN PERIÓDICA
  private intervalId: number | null = null;
  private readonly INTERVAL_TIME = 20000; // 20 segundos

  constructor() {
    // Cargar datos cuando cambian las selecciones
    effect(() => {
      const convocatoria = this.convocatoriaSelect();
      const tipoMed = this.tipoMedicoSelect();

      if (convocatoria && tipoMed) {
        this.cargaTotales(convocatoria, tipoMed);
      }
    });
  }

  ngOnInit(): void {
    this.loadConvocatorias();
    this.tipoMedicoSelect.set(TypeMedico.BECADOS);
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
  // CARGA INICIAL DE LOS TOTALES
  // ============================================
  private cargaTotales(convocatoriaId: number, tipoMed: TypeMedico): void {
    // Limpiar los totales antes de cargar nuevos datos
    this.totalCitas.set(undefined);
    
    // Consultar los totales
    this.consultarTotales(convocatoriaId, tipoMed);
    
    // Iniciar actualización periódica
    this.iniciarActualizacionPeriodica(convocatoriaId, tipoMed);
  }

  // ============================================
  // ACTUALIZACIÓN PERIÓDICA DE LOS TOTALES (cada 20 segundos)
  // ============================================
  private iniciarActualizacionPeriodica(convocatoriaId: number, tipoMed: TypeMedico): void {
    // Detener actualización anterior si existe
    this.detenerActualizacionPeriodica();

    // Actualizar cada 20 segundos
    this.intervalId = window.setInterval(() => {
      const tipoActual = this.tipoMedicoSelect();
      const convocatoriaActual = this.convocatoriaSelect();
      
      // Solo continuar si el tipo y convocatoria siguen siendo los mismos
      if (tipoActual === tipoMed && convocatoriaActual === convocatoriaId) {
        this.actualizarTotales(convocatoriaId, tipoMed);
      } else {
        this.detenerActualizacionPeriodica();
      }
    }, this.INTERVAL_TIME);
  }

  // ============================================
  // ACTUALIZAR LOS TOTALES (sin limpiar)
  // ============================================
  private actualizarTotales(convocatoriaId: number, tipoMed: TypeMedico): void {
    this.consultarTotales(convocatoriaId, tipoMed);
  }

  // ============================================
  // CONSULTA LOS TOTALES AL SERVICIO (lógica común)
  // ============================================
  private consultarTotales(convocatoriaId: number, tipoMed: TypeMedico): void {
    this.loading.set(true);
    
    this.envioCitasService.consultaTotalesCitas(convocatoriaId, tipoMed)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Respuesta totales:', response);
          if (response.exito) {
            this.totalCitas.set(response.respuesta);
            
            // Verificar si ya terminó después de actualizar
            if (this.tieneFechaYHoraFin(response.respuesta)) {
              this.detenerActualizacionPeriodica();
              console.log('Proceso completado: fechaFin y horaFin disponibles');
            }
          }
          this.loading.set(false);
        },
        error: (err) => {
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
      console.log('Actualización periódica detenida');
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

  onCambioMedSelec(tipo: TypeMedico): void {
    // Limpiar los totales antes de cambiar el tipo
    this.totalCitas.set(undefined);
    // Establecer el nuevo tipo de médico
    this.tipoMedicoSelect.set(tipo);
  }
}