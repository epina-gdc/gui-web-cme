import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {DatosGeneralesResponse} from '@models/datosGenerales';
import {TitleCasePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ConvocatoriaService} from '@services/convocatoria.service';
import {DocumentoService} from '@services/documentos.service';
import {DatosEmpleo, DocumentoConstancia} from '@models/solicitud-guardar-documentacion.interface';
import {DiaSemanaPipe} from '@pipes/dia-semana.pipe';

interface Especialidad {
  especialidad: string,
  especialidadMedica: string,
  tipoDocumento: string
}

@Component({
  selector: 'app-modal-validacion-medico',
  imports: [
    TitleCasePipe,
    TableModule,
    DiaSemanaPipe
  ],
  templateUrl: './modal-validacion-medico.component.html',
  styleUrl: './modal-validacion-medico.component.scss'
})
export class ModalValidacionMedicoComponent implements OnInit {

  datosGenerales!: DatosGeneralesResponse;
  datosEmpleo!: DatosEmpleo;
  documentosConstancias: DocumentoConstancia[] = [];
  especialidades: Especialidad[] = [];

  nombreFoto!: string;
  datosFoto!: any;
  defaultFile!: SafeResourceUrl | undefined;

  convocatoriaService: ConvocatoriaService = inject(ConvocatoriaService);
  documentoService: DocumentoService = inject(DocumentoService);

  constructor(private readonly config: DynamicDialogConfig,
              private readonly sanitizer: DomSanitizer) {
    if (this.config.data) {
      this.datosGenerales = this.config.data.datosGenerales;
      this.datosEmpleo = this.config.data.datosEmpleo;
      this.especialidades = this.config.data.especialidadesDocumentos;
      this.documentosConstancias = this.config.data.documentosConstancias
      console.log(this.config.data.documentosConstancias);
    }
  }

  ngOnInit() {
    this.obtenerDatosFoto(this.datosGenerales.datosPersonales.idUsuario);
  }

  obtenerDatosFoto(idusuario: number | undefined): void {
    if (!idusuario) return;
    this.convocatoriaService.getDatosFotografia(idusuario).subscribe({
      next: (response: any) => {
        if (!response.exito) return;
        this.datosFoto = response.respuesta.fotografia;
        this.obtenerFotografia()
      }
    });
  }

  obtenerFotografia(): void {
    if (!this.datosFoto) return;
    this.documentoService.getFotografia(this.datosFoto.documento.refGuid).pipe(
    ).subscribe({
      next: (response: any) => {
        let extension = ['png', 'jpeg', 'jpg'];
        if (extension.includes(this.datosFoto.documento.refExtension.toLowerCase())) {
          this.nombreFoto = this.datosFoto.documento.refNombre;
          const blob = new Blob([response], {type: 'blob'});
          this.defaultFile = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
        } else {
          this.nombreFoto = 'Sin foto'
        }
      }
    });
  }

  mostrarDocumento(guid: string) {
    this.documentoService.obtenerDocumento(guid).subscribe({
      next: (response: any) => {

        const tipoArchivo = response.type;
        const fileBlob = new Blob([response], {type: tipoArchivo});
        const fileURL = URL.createObjectURL(fileBlob);

        window.open(fileURL, '_blank');
      }
    });
  }


}
