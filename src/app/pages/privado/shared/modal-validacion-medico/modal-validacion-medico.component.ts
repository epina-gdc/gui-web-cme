import {Component, inject, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DatosGeneralesResponse} from '@models/datosGenerales';
import {TitleCasePipe} from '@angular/common';
import {TableModule} from 'primeng/table';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ConvocatoriaService} from '@services/convocatoria.service';
import {DocumentoService} from '@services/documentos.service';
import {DatosEmpleo, DocumentoConstancia} from '@models/solicitud-guardar-documentacion.interface';
import {DiaSemanaPipe} from '@pipes/dia-semana.pipe';
import {Button} from 'primeng/button';

interface Especialidad {
  especialidad: string,
  especialidadMedica: string,
  tipoDocumento: string,
  guid: string
}

@Component({
  selector: 'app-modal-validacion-medico',
  imports: [
    TitleCasePipe,
    TableModule,
    DiaSemanaPipe,
    Button
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

  guid_obligatorio_1: string = '';
  guid_obligatorio_2: string = '';
  guid_obligatorio_3: string = '';

  constructor(private readonly config: DynamicDialogConfig,
              private readonly sanitizer: DomSanitizer,
              public ref: DynamicDialogRef,) {
    if (this.config.data) {
      this.datosGenerales = this.config.data.datosGenerales;
      this.datosEmpleo = this.config.data.datosEmpleo;
      this.especialidades = this.config.data.especialidadesDocumentos;
      this.documentosConstancias = this.config.data.documentosConstancias;
      const documentosObligatorios = this.config.data.documentosObligatorios;
      if (!documentosObligatorios) return;
      const documento_ob1 = documentosObligatorios.find((d: any) => d.tipoDocumentoObligatorio.idDocumentoObligatorio === 1);
      const documento_ob2 = documentosObligatorios.find((d: any) => d.tipoDocumentoObligatorio.idDocumentoObligatorio === 2);
      const documento_ob3 = documentosObligatorios.find((d: any) => d.tipoDocumentoObligatorio.idDocumentoObligatorio === 3);
      if (documento_ob1) {
        this.guid_obligatorio_1 = documento_ob1.documento.refGuid;
      }
      if (documento_ob2) {
        this.guid_obligatorio_2 = documento_ob2.documento.refGuid;
      }
      if (documento_ob3) {
        this.guid_obligatorio_3 = documento_ob3.documento.refGuid;
      }
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

  cancelar(): void {
    this.ref.close();
  }

  finalizar(): void {
    this.ref.close({finalizar: true});
  }

}
