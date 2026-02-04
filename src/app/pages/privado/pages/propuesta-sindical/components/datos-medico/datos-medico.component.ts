import {Component, OnInit} from '@angular/core';
import {GeneralComponent} from '@components/general.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Badge} from 'primeng/badge';
import {UploadPhotoComponent} from '@components/upload-photo/upload-photo.component';

@Component({
  selector: 'app-datos-medico',
  imports: [
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Button,
    Card,
    Badge,
    UploadPhotoComponent
  ],
  templateUrl: './datos-medico.component.html',
  styleUrl: './datos-medico.component.scss'
})
export class DatosMedicoComponent extends GeneralComponent implements OnInit {

  needsCleanup: boolean = false;
  defaultFile!: File | undefined;

  form!: FormGroup;
  tab: number = 0;
  data:any = 1;

  constructor(
    private fb: FormBuilder,
  ){
    super();
  }

  ngOnInit() {
    this.form = this.iniciarFormulario();
  }

  iniciarFormulario(): FormGroup{
    return this.fb.group(
      {
        matricula: [null]
      }
    )
  }

  archivoSeleccionado($event: any): void {
    if ($event.length == 0) {
      this._alertServices.alerta('El peso del archivo excede al permitido.');
      return;
    }
    const files: FileList | File[] = $event?.target?.files || $event;
    const archivo: File | undefined = files?.[0];
    if (!archivo) {
      return;
    }

    const formData = new FormData();
    formData.append('file', archivo, archivo.name);
  }

  onCleanupDone(): void {
    // lo que disparará ngOnChanges de nuevo.
    this.needsCleanup = false;
  }

}
