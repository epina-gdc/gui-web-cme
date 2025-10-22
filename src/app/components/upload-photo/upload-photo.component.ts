import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {Button} from 'primeng/button';
import {PrimeTemplate} from 'primeng/api';
import {FileUpload} from 'primeng/fileupload';

@Component({
  selector: 'upload-photo',
  imports: [
    Button,
    PrimeTemplate,
    FileUpload
  ],
  templateUrl: './upload-photo.component.html',
  styleUrl: './upload-photo.component.scss'
})
export class UploadPhotoComponent implements OnInit, OnChanges {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  @Input() maxFileSize: number = 5120000;
  @Input() existingFile: File | undefined = undefined;
  @Output() fileSelected = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(private readonly config: PrimeNG) {
  }

  ngOnInit() {
    if (this.existingFile instanceof File) {
      const file: File = this.existingFile;
      this.fileUpload.clear();
      const fileList: any[] = [file];
      this.fileUpload.files = fileList; // La propiedad que usa el template
      this.files = fileList;
    }
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.fileSelected.emit(this.files);
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= Number.parseInt(this.formatSize(file.size));
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
    const formattedSize: number = Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
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

  ngOnChanges(changes: SimpleChanges): void {
    const fileChange = changes['existingFile'];

    if (fileChange?.currentValue instanceof File) {
      const file: File = fileChange.currentValue;

      // Limpiar la lista de archivos actuales
      this.fileUpload.clear();

      // Crear una lista de archivos para inyectar
      const fileList: any[] = [file];

      // Asignar el archivo directamente a las propiedades internas del p-fileUpload
      this.fileUpload.files = fileList; // La propiedad que usa el template

      // Opcional: Asignar a su propiedad 'files' para mantener la consistencia
      this.files = fileList;

    } else if (fileChange?.currentValue === null && fileChange.previousValue) {
      // Lógica de limpieza
      this.fileUpload.clear();
      this.files = [];
    }
  }

}
