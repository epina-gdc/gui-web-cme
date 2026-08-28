import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {SplitByWidthDirective} from '@directives/split-by-width.directive';
import {Card} from 'primeng/card';
import {CurrencyPipe} from '@angular/common';
import {TooltipModule} from 'primeng/tooltip';
import {EstadoOfertaService} from '@services/estado-oferta.service';
import {Button} from 'primeng/button';
import { agregarIdParticipacionSiap, AsignacionRequest, InfoAspirante, Plaza } from '@models/datosAsignacion';
import { AlertService } from '@services/alert.service';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-plaza',
  imports: [
    SplitByWidthDirective,
    CurrencyPipe,
    Card,
    TooltipModule,
    Button
  ],
  templateUrl: './detalle-plaza.component.html',
  styleUrl: './detalle-plaza.component.scss',
  providers: [CurrencyPipe]
})
export class DetallePlazaComponent implements OnInit{

  data: {
    plaza: Plaza,
    idUsuario: number,
    tipoAsignacion: number,
    infoAspirante?: InfoAspirante
  } = {plaza: new Plaza(), idUsuario: 0, tipoAsignacion: 0};
  plazaSeleccionada: Plaza = new Plaza();
  alertaService: AlertService = inject(AlertService);
  asignacionPlazaService: AsignacionPlazaService = inject(AsignacionPlazaService);
  isSaving = false;


  constructor(
    private readonly config: DynamicDialogConfig,
    private readonly currencyPipe: CurrencyPipe,
    private readonly estadoPlazaService: EstadoOfertaService,
  ){

  }

  ngOnInit(){
    if (this.config?.data) {
        this.data = this.config.data;
        this.plazaSeleccionada = this.config.data.plaza;
    }
    const nuevoEstado = {
      titulo: this.data.plaza.especialidad ?? '',
      subTitulo: this.data.plaza.categoria ?? '',
      badgeValue: this.data.plaza.nuevoHospital == 1 ? true : false,
    };
    this.estadoPlazaService.actualizarEstado(nuevoEstado);
  }

  asignar(){
    if (this.isSaving) return;

    this.isSaving = true;


    let request: AsignacionRequest = agregarIdParticipacionSiap({
      idUsuario: this.data.idUsuario,
      idTipoAsignacionPlaza: this.data.tipoAsignacion,
      idPlaza: this.data.plaza.idPlaza,
    }, this.data.infoAspirante)
    //console.log(request);
    this.asignacionPlazaService.asignarPlaza(request)
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: (response) => {
          //console.log('Result ', response);
          if (response.exito) {
            this.alertaService.exito('Felicidades se asignó con éxito la plaza No.<strong>' + this.data.plaza.numPlaza + '<strong>');
            this.showConfetti();
            this.estadoPlazaService.notificarRefreshPlazas();
          } else {
            this.alertaService.error(response.mensaje);
            return;
          }
        },
        error: (error) => {
          //console.log(error);
          this.alertaService.error('Ocurrió un error al registrar la asignación.');
          return;
        }
      });
  }


  infoTexto(credito: any) {
    const creditoFormateado = this.currencyPipe.transform(
      credito,
      'USD',
      'symbol',
      '1.2-2',
      'en-US'
    ) ?? '';
    return `El importe máximo del descuento quincenal es de hasta ${creditoFormateado} pesos`
  }

  // Confetti
  private confettiCanvasId = 'confetti-canvas-monitoreo';
  private confettiInterval: any = null;
  private confettiTimeoutId: any = null;

  showConfetti() {
    this.launchCanvasConfetti(4000);

    if (this.confettiTimeoutId) {
      clearTimeout(this.confettiTimeoutId);
    }
    this.confettiTimeoutId = setTimeout(() => {
      this.removeConfettiCanvas();
    }, 5000);

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


}
