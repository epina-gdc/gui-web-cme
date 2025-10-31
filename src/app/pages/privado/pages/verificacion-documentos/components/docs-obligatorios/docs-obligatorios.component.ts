import { NgClass } from '@angular/common';
import { Component, WritableSignal, signal } from '@angular/core';
import { DomSanitizer,SafeResourceUrl } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-docs-obligatorios',
  imports: [NgClass,
    PdfViewerModule],
  templateUrl: './docs-obligatorios.component.html',
  styleUrl: './docs-obligatorios.component.scss'
})
export class DocsObligatoriosComponent {

  url: string = '';



  tabActive: WritableSignal<number> = signal(0);

  documentacion: any[] = [
    {
      idDocumento: 1,
      nombreDocumento: "INE",
      doc: []
    },
    {
      idDocumento: 2,
      nombreDocumento: "Título de medicina general",
      doc: []
    },
    {
      idDocumento: 3,
      nombreDocumento: "Cédula profesional de medicina general",
      doc: []
    }
  ]
  pdfSrc:any;
  trustedUrl: SafeResourceUrl | null = null;
  constructor(private sanitizer: DomSanitizer) {
    this.url= 'https://www.sony.com/electronics/support/res/manuals/4124/41241131M.pdf';
    this.trustedUrl =  sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.pdfSrc = sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  docSeleccionado(id:number) {
    this.tabActive.set(id);
  }


}
