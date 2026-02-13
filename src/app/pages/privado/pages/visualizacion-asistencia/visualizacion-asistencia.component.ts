import {Component, HostListener, OnDestroy, signal, WritableSignal} from '@angular/core';
import {CardModule} from 'primeng/card';
import {Button} from 'primeng/button';
import {BehaviorSubject, Subscription, timer} from 'rxjs';
import {AsistenciaService} from '@services/asistencia.service';
import {AlertService} from '@services/alert.service';
import {UsuarioAsistencia} from '@models/asistencia.interface';
import {DocumentoService} from '@services/documentos.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-visualizacion-asistencia',
  imports: [CardModule, Button],
  templateUrl: './visualizacion-asistencia.component.html',
  styleUrl: './visualizacion-asistencia.component.scss'
})
export class VisualizacionAsistenciaComponent implements OnDestroy {
  buffer: string = '';
  ultimaPulsacion: number = Date.now();

  datosMedico = signal<UsuarioAsistencia | null>(null);
  private timerSubscription?: Subscription;
  public medicoCargado$ = new BehaviorSubject<UsuarioAsistencia | null>(null);

  fotoUrl: SafeUrl | null = null;

  /**
   * 1: mostrar QR
   * 2: mostrar datos aspirante
   */
  estatusAssitencia: WritableSignal<number> = signal(1);

  especialidades: string[] = ["Cardiología", "Anestesiología pediátrica", "Neumología"];

  data: any = {
    fecha: "15 de Mayo, 2025",
    hora: "07:00 Hrs.",
    mesa: "5",
    turno: "11:00 a 13:00 hrs."
  }

  constructor(private asistenciaService: AsistenciaService,
              private alerService: AlertService,
              private documentoService: DocumentoService,
              private santitizer: DomSanitizer) {
    this.medicoCargado$.subscribe(medicoCargado => {
      if (medicoCargado) {
        this.cargarDatos(medicoCargado);
      }
    })
  }

  cargarDatos(medicoCargado: any) {
    this.timerSubscription?.unsubscribe();

    this.datosMedico.set(medicoCargado);

    this.timerSubscription = timer(40000).subscribe(() => {
      this.resetearVista();
    });
  }

  resetearVista() {
    this.datosMedico.set(null);
    this.timerSubscription?.unsubscribe();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  handleNuevEscaneo() {
    this.resetearVista();
  }

  confirmarFolio(folio: string = '') {
    const folios = ['A7654321', '']
    const folioConsulta: string = '25D0100121';
    this.asistenciaService.obtenerCita(folioConsulta).subscribe({
      next: respuesta => {
        if (!respuesta.exito) {
          this.alerService.error(respuesta.mensaje);
          return;
        }
        this.alerService.exito(respuesta.mensaje);
        this.datosMedico.set(respuesta.respuesta);
        this.obtenerFotografia(respuesta.respuesta.gui);
      },
      error: error => {
        console.log(error);
        this.alerService.error(error.error);
        this.resetearVista();
      }
    })
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const umbralTiempo = 50; // Milisegundos entre teclas
    const ahora = Date.now();

    // Si el tiempo entre teclas es muy corto, es un escáner, no un humano
    if (ahora - this.ultimaPulsacion > umbralTiempo) {
      this.buffer = '';
    }

    if (event.key === 'Enter') {
      if (this.buffer.length > 0) {
        this.procesarRespuesta(this.buffer);
        this.buffer = '';
      }
    } else {
      // Evitamos capturar teclas de función como 'Shift' o 'Control'
      if (event.key.length === 1) {
        this.buffer += event.key;
      }
    }

    this.ultimaPulsacion = ahora;
  }

  obtenerFotografia(gui: string): void {
    this.documentoService.getFotografia(gui).pipe(
    ).subscribe({
      next: (blob: Blob) => {
        const urlObjeto = URL.createObjectURL(blob);
        this.fotoUrl = this.santitizer.bypassSecurityTrustUrl(urlObjeto);
      },
      error: (err) => {
        console.error('Error al obtener la foto', err);
      }
    });
  }

  procesarRespuesta(codigo: string) {
    console.log('Lectura recibida:', codigo);

    const patronFormato = /^[A-ZÁÉÍÓÚÑ\s]+\|[A-Z0-9]+\|[A-ZÁÉÍÓÚÑ\s]+\|\d{2}\/\d{2}\/\d{4}\|\d{2}:\d{2}\|.+$/i;

    if (patronFormato.test(codigo)) {
      const [nombre, folio, especialidad, fecha, hora, turno] = codigo.split('|');
      this.confirmarFolio(folio);
    } else {
      this.alerService.error('QR incorrecto.');
    }
  }
}
