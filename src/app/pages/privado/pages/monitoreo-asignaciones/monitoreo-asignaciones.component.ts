import { Component, OnInit, OnDestroy, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AsignacionesMonitoreoService } from '@services/asignaciones-monitoreo.service';
import { TipoAsignacionMonitoreo } from '@models/tipo-asignacion-monitoreo.interface';

@Component({
    selector: 'app-monitoreo-asignaciones',
    imports: [CommonModule],
    templateUrl: './monitoreo-asignaciones.component.html',
    styleUrl: './monitoreo-asignaciones.component.scss'
})
export class MonitoreoAsignacionesComponent implements OnInit, OnDestroy {
    // Inyección de dependencias
    private readonly asignacionesService = inject(AsignacionesMonitoreoService);

    // Variables para los datos
    asignaciones: TipoAsignacionMonitoreo[] = [];
    totalAsignaciones: number = 0;
    cargando: boolean = true;
    error: string | null = null;
    ultimaActualizacion: Date = new Date();

    cont: number = 98; // Contador para pruebas de celebración

    // Variables para el contador y celebración
    mostrarCelebration: boolean = false;
    totalFormateado: string = '00';

    // Confetti
    private confettiCanvasId = 'confetti-canvas-monitoreo';
    private confettiInterval: any = null;
    private confettiTimeoutId: any = null;

    // Subject para desuscribir en OnDestroy
    private destroy$ = new Subject<void>();
    // NgZone para asegurar detección de cambios al usar timers/workers
    private readonly ngZone = inject(NgZone);

    constructor() { }

    ngOnInit(): void {
        this.iniciarMonitoreoEnTiempoReal();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.clearConfettiTimers();
        this.removeConfettiCanvas();
    }

    /**
     * Inicia el monitoreo de asignaciones cada 60 segundos
     */
    private iniciarMonitoreoEnTiempoReal(): void {
        this.asignacionesService
            .obtenerAsignacionesEnTiempoReal()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (asignaciones: TipoAsignacionMonitoreo[]) => {
                    this.asignaciones = asignaciones;
                    this.totalAsignaciones = this.asignacionesService.calcularTotalExcluyendoRechazos(asignaciones);
                    this.totalFormateado = this.totalAsignaciones.toString().padStart(2, '0');
                    this.ultimaActualizacion = new Date();
                    this.cargando = false;
                    this.error = null;

                    //this.cont++; // Incrementar contador para pruebas

                    //this.totalFormateado = this.cont.toString().padStart(2, '0');

                    // Verificar si es múltiplo de 100
                    //if (this.cont > 0 && this.cont % 100 === 0) {
                    if (this.totalAsignaciones > 0 && this.totalAsignaciones % 100 === 0) {
                        this.mostrarCelebration = true;
                        this.launchCanvasConfetti(4000);

                        if (this.confettiTimeoutId) {
                            clearTimeout(this.confettiTimeoutId);
                        }
                        this.confettiTimeoutId = setTimeout(() => {
                            this.ngZone.run(() => {
                                this.mostrarCelebration = false;
                            });
                            this.removeConfettiCanvas();
                        }, 5000);

                        setTimeout(() => {
                            this.mostrarCelebration = false;
                        }, 5000);

                    }
                },
                error: (err: any) => {
                    console.error('Error al cargar asignaciones:', err);
                    this.error = 'Error al cargar las asignaciones. Por favor, intenta más tarde.';
                    this.cargando = false;
                }
            });
    }

    /**
     * Crear canvas para confetti y devolverlo
     */
    private ensureConfettiCanvas(): HTMLCanvasElement {
        let canvas = document.getElementById(this.confettiCanvasId) as HTMLCanvasElement | null;
        if (canvas) return canvas;

        canvas = document.createElement('canvas');
        canvas.id = this.confettiCanvasId;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
        return canvas;
    }

    private removeConfettiCanvas(): void {
        const canvas = document.getElementById(this.confettiCanvasId);
        if (canvas) {
            try { canvas.remove(); } catch (e) { /* ignore */ }
        }
    }

    private clearConfettiTimers(): void {
        if (this.confettiInterval) {
            clearInterval(this.confettiInterval);
            this.confettiInterval = null;
        }
        if (this.confettiTimeoutId) {
            clearTimeout(this.confettiTimeoutId);
            this.confettiTimeoutId = null;
        }
    }

    /**
     * Lanza confeti usando canvas-confetti (dinámico)
     * @param duration Duración en ms del lanzamiento continuo
     */
    private async launchCanvasConfetti(duration = 3000): Promise<void> {
        try {
            const canvas = this.ensureConfettiCanvas();
            const module = await import(/* webpackChunkName: "canvas-confetti" */ 'canvas-confetti');
            const confettiLib = module.default || module;
            const confetti = confettiLib.create(canvas, { resize: true, useWorker: true });

            const end = Date.now() + duration;
            const fire = () => {
                confetti({
                    particleCount: 20,
                    spread: 60,
                    startVelocity: 45,
                    ticks: 200,
                    origin: { x: Math.random(), y: Math.random() * 0.6 }
                });
            };

            // Primer burst inmediato
            fire();

            // Repetir bursts mientras no llegue al tiempo
            this.confettiInterval = setInterval(() => {
                if (Date.now() > end) {
                    this.clearConfettiTimers();
                    return;
                }
                fire();
            }, 350);

            // Auto-limpiar el canvas después de un tiempo extra
            setTimeout(() => {
                this.clearConfettiTimers();
                // remove canvas after short delay
                setTimeout(() => this.removeConfettiCanvas(), 1000);
            }, duration + 500);

        } catch (err) {
            console.error('No se pudo cargar canvas-confetti:', err);
        }
    }

    /**
     * Obtener título dinámico
     */
    get titulo(): string {
        return this.mostrarCelebration ? 'Bienvenidos Médicos Especialistas' : 'Asignaciones';
    }

    /**
     * Formatea la hora de la última actualización
     */
    get horaActualizacion(): string {
        return this.ultimaActualizacion.toLocaleTimeString('es-MX');
    }

    /**
     * Obtener solo las asignaciones sin "RECHAZO DE OFERTA" para mostrar
     */
    get asignacionesFiltradasParaMostrar(): TipoAsignacionMonitoreo[] {
        return this.asignaciones.filter(a => a.tipoAsignacion !== 'RECHAZO DE OFERTA');
    }
}
