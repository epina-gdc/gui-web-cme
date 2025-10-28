import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {FileUpload} from 'primeng/fileupload';
import {PrimeTemplate} from 'primeng/api';
import {Button} from 'primeng/button';
import {NgClass} from '@angular/common';

@Component({
  selector: 'upload-document',
  standalone: true,
  imports: [
    FileUpload,
    PrimeTemplate,
    Button,
    NgClass
  ],
  templateUrl: './upload-document.component.html',
  styleUrl: './upload-document.component.scss'
})
export class UploadDocumentComponent implements OnInit, OnChanges {
  @ViewChild('fileDocument') fileUpload!: FileUpload;

  @Input() maxFileSize: number = 5242880;
  @Input() existingFile: File | undefined | null = undefined;
  @Input({required: true}) idArchivo: string = '';
  @Input() disabled: boolean = false;
  @Output() fileSelected = new EventEmitter<any>();
  @Output() fileRemoved = new EventEmitter<any>();

  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(private readonly config: PrimeNG) {
  }

  ngOnInit() {
    // Se usa setTimeout para asegurar que el ViewChild 'fileUpload' esté disponible
    // justo después de que la vista se haya renderizado.
    setTimeout(() => {
      this.updateFileUpload(this.existingFile);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const fileChange = changes['existingFile'];

    // Se actualiza si el valor de existingFile realmente ha cambiado
    if (fileChange && fileChange.currentValue !== fileChange.previousValue) {
      this.updateFileUpload(fileChange.currentValue);
    }
  }

  /**
   * Actualiza el valor interno del componente p-fileUpload y la lista local 'files'.
   */
  private updateFileUpload(file: File | undefined | null): void {
    if (!this.fileUpload) {
      // Debería estar disponible gracias a ngOnInit con setTimeou.
      console.warn('p-fileUpload no está listo para la actualización.');
      return;
    }

    // Limpiar el estado anterior
    this.fileUpload.clear();
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;

    if (file instanceof File) {
      const fileList: any[] = [file];

      // **La clave:** Asignar el archivo a la propiedad 'files' del componente PrimeNG
      this.fileUpload.files = fileList;
      this.files = fileList; // Actualizar la lista local
      this.totalSize = file.size;
    }

  }

  // --- Manejadores de Eventos del Usuario ---

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.fileSelected.emit(this.files);
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= Number.parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
    // Si necesitas notificar que se eliminó, llama a this.onRemoveFile()
  }

  onRemoveFile(file: any, index: number) {
    this.files = [];
    this.fileUpload.clear();
    this.fileRemoved.emit(this.files);
  }

  // --- Métodos de Utilidad y Auxiliares ---

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
    // Lógica para cuando se activa la subida (si es manual)
  }

  cancelarCargaArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('clear_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }

  seleccionarArchivo(): void {
    if (this.disabled) return;
    const elemento: HTMLElement | null = document.getElementById('choose_btn_' + this.idArchivo);
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

  clear() {
    this.updateFileUpload(null); // Se usa la función de actualización para limpiar
  }
}
