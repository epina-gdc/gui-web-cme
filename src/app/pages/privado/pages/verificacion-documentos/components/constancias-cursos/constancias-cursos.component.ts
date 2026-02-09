import {NgClass, NgTemplateOutlet} from '@angular/common';
import {Component, HostListener, Input, signal, WritableSignal} from '@angular/core';
import {GeneralComponent} from '@components/general.component';
import {DomSanitizer} from '@angular/platform-browser';
import {DetalleDocumentacionDocumentoConstancia} from '@models/detalleDocumentacionAspirante.interface';
import {PdfViewerModule} from 'ng2-pdf-viewer';

@Component({
  selector: 'app-constancias-cursos',
  imports: [NgClass, NgTemplateOutlet, PdfViewerModule],
  templateUrl: './constancias-cursos.component.html',
  styleUrl: './constancias-cursos.component.scss'
})
export class ConstanciasCursosComponent extends GeneralComponent {
  @Input() docsConstancias: DetalleDocumentacionDocumentoConstancia[] = [];

  tabActive: WritableSignal<number> = signal(0);
  pdfSrc: Uint8Array | undefined;
  blnShowImg!: boolean;

  private readonly MOBILE_BREAKPOINT = 984;

  isMobileView: boolean = false;

  constructor(
    private sanitizer: DomSanitizer
  ) {
    super();
    this.blnShowImg = false;
    this.checkScreenSize();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  docSeleccionado(id: number, guid: string, extension: string) {
    this.tabActive.set(id);
    this.obtenerPrevisualizacionDocumento(guid, extension);
  }


  obtenerPrevisualizacionDocumento(guid: string, extension: string) {
    this.documentoService.obtenerDocumentoArrayBuffer(guid).subscribe({
      next: (response: any) => {
        this.pdfSrc = new Uint8Array(response);
      },
      error: (err: any) => {
        console.error(this._Mensajes.MSJ_ERROR_CARGANDO_DOCUMENTO, err);
        this.pdfSrc = undefined;
        this._alertServices.error(this._Mensajes.MSJ_ERROR_CARGANDO_DOCUMENTO);
      }
    });
  }
}
