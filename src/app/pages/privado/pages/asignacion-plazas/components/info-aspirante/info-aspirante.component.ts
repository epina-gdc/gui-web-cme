import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Card } from "primeng/card";
import { Avatar } from 'primeng/avatar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { AsignacionRequest, BusquedaResponse, CedulaResponse, Plaza, TipoAsignacion } from '@models/datosAsignacion';
import { DocumentoService } from '@services/documentos.service';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CatalogosGeneralesService } from '@services/catalogos-generales.service';
import { mapearArregloTipoDropdown } from '@utils/funciones';
import { AsignacionPlazaService } from '@services/asignacion-plaza.service';
import { AlertService } from '@services/alert.service';
import { Mensajes } from '@utils/mensajes';
import { VerificacionDocsService } from '@services/verificacion-docs.service';
import { DictamenRespuesta } from '@models/dictamen-respuesta.interface';
import { AdjuntoOpinion, OpinionTecnicaRespuesta } from '@models/opnion-tecnia-respuesta.interface';
import { TipoDropdown } from '@models/tipo-dropdown.interface';
import {TituloCase} from '@pipes/titulo-case.pipe';
import { EstadoOfertaService } from '@services/estado-oferta.service';

@Component({
  selector: 'app-info-aspirante',
  imports: [CommonModule, Card, Avatar, DialogModule, ConfirmDialogModule, Select, Button, FormsModule, TagModule, TituloCase],
  providers: [ConfirmationService],
  templateUrl: './info-aspirante.component.html',
  styleUrl: './info-aspirante.component.scss'
})
export class InfoAspiranteComponent {
  @Input() asignacion!: BusquedaResponse;
  @Input() refreshKey!: number;
  //@Output() asignacionRegistrada = new EventEmitter<{ id: number }>();


  documentoService: DocumentoService = inject(DocumentoService);
  catalogosService: CatalogosGeneralesService = inject(CatalogosGeneralesService);
  asignacionService: AsignacionPlazaService = inject(AsignacionPlazaService);
  verificacionDocsService = inject(VerificacionDocsService);
  alertaService: AlertService = inject(AlertService);
  confirmacionService: ConfirmationService = inject(ConfirmationService);
  fotoFile!: File | undefined;
  mensajes: Mensajes = new Mensajes();
  idUsuario: number = 0;
  tieneAsignacion: boolean = false;
  tipoAsignacion: number = 0;
  muestraTag: boolean=false;

  aspirante = {
    fotoUrl: '',
    nombreCompleto: '',
    matricula: '',
    especialidades: [''],
    sexo: '',
    curp: '',
    rfc: '',
    email: '',
    emailAdicional: '',
    asignacion: {
      ooad: '',
      zona: '',
      especialidad: ''
    }, 
    plaza: new Plaza()
  };


  visibleRechazo = false;
  loading = false;

  motivos: TipoDropdown[] = [];

  motivoSeleccionado: string | null = null;

  constructor(private readonly estadoPlazaService: EstadoOfertaService) {}

  ngOnInit(): void {
    //this.obtenerAspirante();
    this.getMotivosRechazo();
  }

  ngOnChanges(): void {
    this.obtenerAspirante();
  }

  obtenerAspirante() {
    this.idUsuario = this.asignacion.datosGenerales?.idUsuario ?? 0;
    this.aspirante.nombreCompleto = this.asignacion.datosGenerales?.nombreCompleto ?? '';
    this.aspirante.matricula = this.asignacion.datosGenerales?.matriculaFolio ?? '';
    this.aspirante.especialidades = this.asignacion.datosGenerales?.especialidades == null ? [] : this.asignacion.datosGenerales?.especialidades.split(',').map(item => item.trim()) ?? [];
    this.aspirante.sexo = this.asignacion.datosGenerales?.genero ?? '';
    this.aspirante.curp = this.asignacion.datosGenerales?.curp ?? '';
    this.aspirante.rfc = this.asignacion.datosGenerales?.rfc ?? '';
    this.aspirante.email = this.asignacion.datosGenerales?.correo ?? '';
    this.aspirante.emailAdicional = this.asignacion.datosGenerales?.correoAdicional ?? '';
    this.obtenerFotografia(this.asignacion.datosGenerales?.refFotografia ?? '');
    if (this.asignacion.asignacionMedico?.id != null && this.asignacion.asignacionMedico?.id > 0) {
      //Sustitución
      this.aspirante.asignacion.ooad = this.asignacion.asignacionMedico?.idSustitucion?.desOoad ?? '';
      this.aspirante.asignacion.zona = this.asignacion.asignacionMedico?.idSustitucion?.desZona ?? '';
      this.aspirante.asignacion.especialidad = this.asignacion.asignacionMedico?.idSustitucion?.desEspecialidad ?? '';
      this.aspirante.plaza = this.asignacion.asignacionMedico.idPlazaLayout ?? new Plaza();

      this.tieneAsignacion = true;
      this.tipoAsignacion = this.asignacion.asignacionMedico.idTipoAsignacion?.id ?? 0;
      this.muestraTag = true;
      console.log('Key:', this.refreshKey);
      if(this.refreshKey == 0)
        this.getMessage(this.tipoAsignacion);
    } else {
      this.tieneAsignacion = false;
      this.muestraTag = false;
      this.tipoAsignacion = 0;
    }
    console.log('KeyFinal:', this.refreshKey);
  }

  obtenerFotografia(uuidArchivo: string): void {
    this.documentoService.getFotografia(uuidArchivo).pipe(
    ).subscribe({
      next: (response: any) => {
        //this.selectFile = response;
        const nombreArchivo = 'foto_perfil.png';
        const tipoArchivo = response.type;
        this.fotoFile = new File([response], nombreArchivo, { type: tipoArchivo });
        this.aspirante.fotoUrl = URL.createObjectURL(this.fotoFile);
      },
      error: (error) => {
        console.log(error);
        this.aspirante.fotoUrl = '';
      }
    });
  }

  getMotivosRechazo(): void {
    this.catalogosService.getMotivosRechazo().subscribe({
      next: (result) => {
        if (result.exito && Array.isArray(result.respuesta) && result.respuesta.length > 0) {
          this.motivos = mapearArregloTipoDropdown(result.respuesta, 'desMotivo', 'idMotivoRechazo');
          return;
        }
      }
    })
  }

  cambiarRama() {
    this.confirmacionService.confirm({
      key: 'cambioRama',
      message: '¿Está seguro de asignar un cambio de rama?',
      header: 'Cambio de rama',
      acceptLabel: 'Confirmar cambio de rama',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'btn-modal-confirmar',
      rejectButtonStyleClass: 'btn-modal-cancelar',
      accept: () => {
        this.asignarPlaza(TipoAsignacion.CambioRama);
      }
    });
  }

  rechazarOferta() {
    this.motivoSeleccionado = null;

    this.confirmacionService.confirm({
      key: 'rechazoOferta',
      header: 'Rechazo de oferta',
      message: '',
      acceptVisible: false,
      rejectVisible: false
    });
  }

  cancelarConfirmacion() {
    this.confirmacionService.close(); // cierra el confirmDialog actual
  }

  confirmarRechazo() {
    if (!this.motivoSeleccionado) {
      return;
    }
    //console.log('Rechazo con motivo:', this.motivoSeleccionado);
    this.asignarPlaza(TipoAsignacion.RechazoOferta, Number(this.motivoSeleccionado));
    this.confirmacionService.close();
  }

  reimprimirVerificacion() {
    if (this.asignacion.datosGenerales?.idTipoConvocatoria == 1) {
      this.descargaDictamen(this.idUsuario);
    }
    else {
      this.descargaOpinion(this.idUsuario);
    }
  }

  imprimirCedula(){
    this.descargaCedula(this.idUsuario);
  }

  asignarPlaza(tipo: number, motivoRechazo?: number) {
    let request: AsignacionRequest = {
      idUsuario: this.idUsuario,
      idTipoAsignacionPlaza: tipo,
      idMotivoRechazo: motivoRechazo
    }
    this.asignacionService.asignarPlaza(request).subscribe({
      next: (response) => {
        console.log('Result ', response);
        if (response.exito) {
          this.alertaService.exito(tipo == TipoAsignacion.CambioRama ? this.mensajes.MSG052 : this.mensajes.MSG050);
          //this.asignacionRegistrada.emit({ id: this.idUsuario });
          this.estadoPlazaService.notificarRefreshPlazas();
        } else {
          this.alertaService.error(response.mensaje);
        }
      },
      error: (error) => {
        //console.log(error);
        this.alertaService.error('Ocurrió un error al registrar la asignación.');
      }
    });
  }

  descargaCedula(idUsuario: number) {
    this.asignacionService.descargarCedula(idUsuario).subscribe({
      next: (respuesta: CedulaResponse) => {
        if (respuesta.exito) {
          const adjunto = respuesta.respuesta;
          if (adjunto && adjunto.adjunto) {
            const base64Data = adjunto.adjunto;
            const nombreArchivo = adjunto.nombreAdjunto || 'cedula.pdf';
            const contentType = 'application/pdf';
            const pdfBlob = this.b64toBlob(base64Data, contentType);
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          } else {
            console.error('Error: El JSON es exitoso pero falta el Base64 del PDF.');
          }
        } else {
          this.alertaService.error('Error al imprimir la cedula');
          console.error('Error del servicio:', respuesta.mensaje);
        }
      },
      error: (error) => {
        // Manejar errores de conexión o HTTP
        this.alertaService.error('Error al imprimir los documentos');
        console.error('Error de conexión o HTTP al obtener la cedula:', error);
      }
    });
  }

  descargaDictamen(idUsuario: number) {
    this.verificacionDocsService.descargarDictamen(idUsuario).subscribe({
      next: (respuesta: DictamenRespuesta) => {
        if (respuesta.exito) {
          const adjunto = respuesta.respuesta;
          if (adjunto && adjunto.adjuntoBase64) {
            const base64Data = adjunto.adjuntoBase64;
            const nombreArchivo = adjunto.nombreAdjunto || 'dictamen.pdf';
            const contentType = 'application/pdf';
            const pdfBlob = this.b64toBlob(base64Data, contentType);
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
          } else {
            console.error('Error: El JSON es exitoso pero falta el Base64 del PDF.');
          }
        } else {
          // El backend indicó que la operación falló (exito: false)
          this.alertaService.error('Error al imprimir los documentos');
          console.error('Error del servicio:', respuesta.mensaje);
          // Mostrar notificación al usuario con el mensaje del backend
        }
      },
      error: (error) => {
        // Manejar errores de conexión o HTTP
        this.alertaService.error('Error al imprimir los documentos');
        console.error('Error de conexión o HTTP al obtener el dictamen:', error);
        // Mostrar notificación de error genérico.
      }
    });
  }

  descargaOpinion(idUsuario: number) {
    this.verificacionDocsService.descargarOpinion(idUsuario).subscribe({
      next: (respuesta: OpinionTecnicaRespuesta) => {
        if (respuesta.exito && respuesta.respuesta && respuesta.respuesta.length > 0) {
          respuesta.respuesta.forEach((adjunto: AdjuntoOpinion) => {
            if (adjunto.adjuntoBase64) {
              const base64Data = adjunto.adjuntoBase64;
              const contentType = 'application/pdf';
              const pdfBlob = this.b64toBlob(base64Data, contentType);
              const pdfUrl = URL.createObjectURL(pdfBlob);
              // 5. Abrir la URL en una nueva ventana/pestaña
              // Nota: El navegador puede bloquear la apertura de múltiples ventanas si no es en respuesta directa a una acción del usuario.
              window.open(pdfUrl, '_blank');
            }
          });

        } else {
          // Manejar el caso donde 'exito' es false o no hay adjuntos
          const mensaje = respuesta.mensaje || 'No se encontraron opiniones técnicas para descargar.';
          this.alertaService.error('Error al imprimir los documentos');
          console.error('Error o falta de datos:', mensaje);
          // Mostrar notificación al usuario.
        }
      },
      error: (error) => {
        // Manejar errores de conexión o HTTP
        this.alertaService.error('Error al imprimir los documentos');
        console.error('Error de conexión o HTTP al obtener las opiniones:', error);
      }
    });
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

  getMessage(tipo: number): void {
    switch (tipo) {
      case TipoAsignacion.PlazaOrdinaria: return this.alertaService.informacion(this.mensajes.MSG057a);
      case TipoAsignacion.PlazaCoplamar: return  this.alertaService.informacion(this.mensajes.MSG057a);
      case TipoAsignacion.Sustitucion08: return this.alertaService.informacion(this.mensajes.MSG057);
      case TipoAsignacion.CambioRama: return this.alertaService.informacion(this.mensajes.MSG049);
      case TipoAsignacion.RechazoOferta: return this.alertaService.informacion(this.mensajes.MSG051);
      default: null;
    }
  }

  private b64toBlob(b64Data: string, contentType: string = '', sliceSize: number = 512): Blob {
    let base64 = b64Data.split(',')[1] ? b64Data.split(',')[1] : b64Data;
    // Eliminar CUALQUIER carácter que NO sea una letra/número válido para Base64,
    // incluyendo espacios, saltos de línea, y caracteres de control.
    // Base64 válido solo incluye A-Z, a-z, 0-9, +, / y = (relleno).
    base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');
    // 3. Decodificar el Base64
    try {
      const byteCharacters = atob(base64);
      const byteArrays: Uint8Array[] = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      return new Blob(byteArrays as BlobPart[], { type: contentType });
    } catch (e) {
      // Si incluso después de la limpieza falla, la respuesta NO es Base64.
      console.error("Error crítico: La respuesta HTTP no es un Base64 válido.", e);
      // Lanza un error genérico o notifica al usuario.
      throw new Error("El string Base64 no es válido o contiene caracteres ilegales.");
    }
  }

}
