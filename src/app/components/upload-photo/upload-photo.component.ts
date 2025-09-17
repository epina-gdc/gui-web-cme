import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {LowerCasePipe} from '@angular/common';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'upload-photo',
  imports: [
    Button,
    PrimeTemplate,
    LowerCasePipe,
    FileUpload
  ],
  templateUrl: './upload-photo.component.html',
  styleUrl: './upload-photo.component.scss'
})
export class UploadPhotoComponent {
  @Input() maxFileSize: number = 5120000;
  @Output() fileSelected = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(private readonly config: PrimeNG) {}

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.fileSelected.emit(this.files);
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

  onTemplatedUpload() { }

  cancelarCargaArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('clear_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }

  seleccionarArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('choose_btn');
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
