import { NgClass } from '@angular/common';
import { Component, Input, signal, WritableSignal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeneralComponent } from '@components/general.component';
import { DetalleDocumentacionDocumentoObligatorio } from '@models/detalleDocumentacionAspirante.interface';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-docs-obligatorios',
  imports: [NgClass,
    PdfViewerModule],
  templateUrl: './docs-obligatorios.component.html',
  styleUrl: './docs-obligatorios.component.scss'
})
export class DocsObligatoriosComponent extends GeneralComponent{
  @Input() docsObligatorios: DetalleDocumentacionDocumentoObligatorio[] = [];

  
  pdfSrc: SafeResourceUrl | undefined;


  tabActive: WritableSignal<number> = signal(0);
  

  constructor(
    
    private sanitizer: DomSanitizer
   ) {
    super();
    
    
  }







  docSeleccionado(id: number, guid: string) {
        this.tabActive.set(id);
    this.obtenerPrevisualizacionDocumento(guid);
  }


  obtenerPrevisualizacionDocumento(guid: string) {
    this.documentoService.obtenerDocumento(guid).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
      },
      error: (err: any) => {
        console.error(this._Mensajes.MSJ_ERROR_CARGANDO_DOCUMENTO, err);
        this._alertServices.error(this._Mensajes.MSJ_ERROR_CARGANDO_DOCUMENTO);
      }
    });
  }


}
