import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {FileUpload} from 'primeng/fileupload';
import {PrimeTemplate} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'upload-document',
  imports: [
    FileUpload,
    PrimeTemplate,
    Button
  ],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss'
})
export class UploadDocumentComponent {
  @Input() maxFileSize: number = 5120000;
  @Input() idTipoDocumento!: number;
  @Output() fileSelected = new EventEmitter<{ files: any[], idTipoDocumento: number }>();
  @Output() fileRemoved = new EventEmitter<any>();
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(private config: PrimeNG) {
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.fileSelected.emit({files: this.files, idTipoDocumento: this.idTipoDocumento}); // Enviamos el tipo de documento
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onRemoveFile(file: any, index: number) {
    this.files.splice(index, 1);
    this.fileRemoved.emit(this.files);
  }

  formatSize(bytes: any) {
    const k: number = 1024;
    const dm: number = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }
    const i: number = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize: number = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    return `${formattedSize} ${sizes[i]}`;
  }

  onTemplatedUpload() {
  }

  cancelarCargaArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('clear_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }

  seleccionarArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('choose_btn_' + this.idTipoDocumento);
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }

  cargarArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('load_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  choose(event: any, callback: any) {
    callback();
  }

  uploadEvent(callback: any) {
    callback();
  }

}
