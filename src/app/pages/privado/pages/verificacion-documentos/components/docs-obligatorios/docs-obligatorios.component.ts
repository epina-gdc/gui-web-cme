import {NgClass, NgTemplateOutlet} from '@angular/common';
import {Component, HostListener, Input, OnDestroy, signal, WritableSignal} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {GeneralComponent} from '@components/general.component';
import {DetalleDocumentacionDocumentoObligatorio} from '@models/detalleDocumentacionAspirante.interface';

@Component({
  selector: 'app-docs-obligatorios',
  imports: [NgClass, NgTemplateOutlet],
  templateUrl: './docs-obligatorios.component.html',
  styleUrl: './docs-obligatorios.component.scss'
})
export class DocsObligatoriosComponent extends GeneralComponent implements OnDestroy {
  @Input() docsObligatorios: DetalleDocumentacionDocumentoObligatorio[] = [];

  pdfSrc: SafeResourceUrl | undefined;
  private currentPdfUrl: string | undefined;

  tabActive: WritableSignal<number> = signal(0);

  private readonly MOBILE_BREAKPOINT = 984;

  isMobileView: boolean = false;

  constructor(
    private readonly sanitizer: DomSanitizer
  ) {
    super();
    this.checkScreenSize();
  }

  ngOnDestroy() {
    this.revokeCurrentUrl();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.checkScreenSize();
  }

  private revokeCurrentUrl(): void {
    if (this.currentPdfUrl) {
      URL.revokeObjectURL(this.currentPdfUrl);
      this.currentPdfUrl = undefined;
    }
  }

  private checkScreenSize(): void {
    this.isMobileView = window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  docSeleccionado(id: number, guid: string) {
    this.tabActive.set(id);
    this.obtenerPrevisualizacionDocumento(guid);
  }

  obtenerPrevisualizacionDocumento(guid: string) {
    this.revokeCurrentUrl();

    this.pdfSrc = undefined;

    this.documentoService.obtenerDocumento(guid).subscribe({
      next: (response: any) => {
        const blob = new Blob([response], {type: 'application/pdf'});
        this.currentPdfUrl = URL.createObjectURL(blob);
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentPdfUrl);
      },
      error: (err: any) => {
        this.revokeCurrentUrl();
        console.error(this._Mensajes.MSJ_ERROR_CARGANDO_DOCUMENTO, err);
        this._alertServices.error(this._Mensajes.MSJ_ERROR_CARGANDO_DOCUMENTO);
      }
    });
  }

}
