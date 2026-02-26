import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {GeneralComponent} from '@components/general.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Badge} from 'primeng/badge';
import {UploadPhotoComponent} from '@components/upload-photo/upload-photo.component';
import {PropuestaSindicalService} from '@services/propuesta-sindical.service';
import {DetallePropuestaSindical, Seccion} from '@models/propuestaSindical.interface';
import {concatMap, of, switchMap, tap, throwError} from 'rxjs';
import {catchError, filter, map} from 'rxjs/operators';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-datos-medico',
  imports: [
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Button,
    Card,
    Badge,
    UploadPhotoComponent,
    Dialog
  ],
  templateUrl: './datos-medico.component.html',
  styleUrl: './datos-medico.component.scss'
})
export class DatosMedicoComponent extends GeneralComponent implements OnInit {
  private readonly ID_MODULO: number = 5;

  datosMedico: WritableSignal<DetallePropuestaSindical | null> = signal(null);
  datoSeccionSindical: WritableSignal<Seccion | null> = signal(null);
  refGuid: WritableSignal<string> = signal("");
  dialogCancelacion: boolean = false;

  needsCleanup: boolean = false;
  blnFotoGuardada: boolean = false;
  defaultFile!: File | undefined;
  selectFile!: File | undefined;

  form!: FormGroup;
  tab: number = 0;

  constructor(
    private fb: FormBuilder,
    private pSindicalService: PropuestaSindicalService
  ) {
    super();
  }

  ngOnInit() {
    this.form = this.iniciarFormulario();
  }

  consultarMatriculaFolio(imprimirPropuesta: boolean = false) {
    //this.blnFotoGuardada = false;
    this.pSindicalService.consultaPropuesta(this.f['matricula'].value).pipe(
      tap(data => {
        if (!data.exito) {
          this._alertServices.error("La matrícula/folio ingresado no cuenta con una asignación, por favor verifícala.");
          this.datosMedico.set(null);
          this.datoSeccionSindical.set(null);
        }
      }),
      filter(data => data.exito),
      switchMap(detalleMedico =>
        this._CatalogoGenService.getSeccionSindical(detalleMedico.respuesta.datosGenerales.cveooadPlaza).pipe(
          map(ooad => ({detalleMedico, ooad}))
        )
      )
    ).subscribe({
      next: data => {
        this.datosMedico.set(data.detalleMedico.respuesta.datosGenerales);
        this.datoSeccionSindical.set(data.ooad.respuesta?.[0] ?? null);
        if (this.datosMedico()?.refGuidFotografia) {
          this.obtenerFotografia(this.datosMedico()?.refGuidFotografia || "");
        }
        if(imprimirPropuesta){
          this.imprimirPropuesta();

        }
      }
    })
  }

  generarNuevaPropuesta() {
    let idSeccion = this.datoSeccionSindical()?.idSeccionSindical || 0;
    let idAsignacion = this.datosMedico()?.idAsignacion || 0;

    this.pSindicalService.nuevaPropuesta(idAsignacion, idSeccion).subscribe({
      next: data => {
        this._alertServices.exito(data.mensaje);
        this.consultarMatriculaFolio(true);
        //this.actualizarFoto();
      },
      error: (error) => {
        this._alertServices.error("No fue posible generar el folio de la propuesta sindical.");
        console.error("Error en la propuesta sindical", error);
      }
    })
  }

  cancelarPropuesta() {
    this.dialogCancelacion = false;
    const idPropuesta = this.datosMedico()?.idPropuestaSindical || 0;
    if (idPropuesta == 0) return
    this.pSindicalService.cancelarPropuesta(idPropuesta).pipe(
      tap(data => {
        this.consultarMatriculaFolio();
      })
    ).subscribe({
      next: data => {
        this._alertServices.exito(data.mensaje);

      }
    })
  }

  imprimirPropuesta(id: number = 0) {
    const idPropuesta = this.datosMedico()?.idPropuestaSindical || id;
    if (idPropuesta == 0) return
    this.pSindicalService.generarPdfPropuesta(idPropuesta).subscribe({
      next: respuesta => {
        if (respuesta.exito) {

          const adjunto = respuesta.respuesta;

          if (adjunto && adjunto.adjunto) {

            const base64Data = adjunto.adjunto;
            const nombreArchivo = adjunto.nombreAdjunto || 'propuesta.pdf';
            const contentType = 'application/pdf';


            const pdfBlob = this.b64toBlob(base64Data, contentType);


            const pdfUrl = URL.createObjectURL(pdfBlob);


            window.open(pdfUrl, '_blank');


          } else {
            console.error('Error: El JSON es exitoso pero falta el Base64 del PDF.');

          }

        } else {
          // El backend indicó que la operación falló (exito: false)
          this._alertServices.error('Error al imprimir los documentos');
          console.error('Error del servicio:', respuesta.mensaje);
          // Mostrar notificación al usuario con el mensaje del backend
        }
      }
    })
  }


  iniciarFormulario(): FormGroup {
    return this.fb.group(
      {
        matricula: [null, [Validators.required]],
      }
    )
  }

  limpiar() {
    this.form.reset();
    this.datosMedico.set(null);
    this.datoSeccionSindical.set(null);
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
    this.guardarFoto(formData, archivo);
  }

  onCleanupDone(): void {
    // lo que disparará ngOnChanges de nuevo.
    this.needsCleanup = false;
  }


  obtenerFotografia(guidFoto: string) {
    this.documentoService.getFotografia(guidFoto).pipe(
    ).subscribe({
      next: (response: any) => {

        this.selectFile = response;
        const nombreArchivo = 'foto_perfil.png';
        const tipoArchivo = response.type;
        this.defaultFile = new File([response], nombreArchivo, {type: tipoArchivo});
        this.blnFotoGuardada = true;
      }
    });
  }

  /*private guardarFoto(datos: FormData, archivo: File): void {

    this.blnFotoGuardada = false;
    const idUsuario = this.datosMedico()?.idUsuario;

    if (!idUsuario) {
      this._alertServices.error('No se pudo obtener el ID de usuario.');
      return;
    }


    this.documentoService.guardarFoto(datos, this.ID_MODULO, idUsuario).pipe(
      switchMap((data: any) => {
        if (!data?.guid) {
          // Si la primera llamada falla o no devuelve GUID, lanzamos un error para detener el flujo.
          return throwError(() => new Error(data?.mensaje || 'Error al obtener GUID de la foto.'));
        }
        return of(data);
      }),

      // Manejo de errores para toda la cadena
      catchError((error) => {
        // Capturamos cualquier error lanzado en switchMap o errores HTTP
        this.blnFotoGuardada = false;
        this._alertServices.error(error.error || 'Error en el proceso de guardado de la foto.');
        return of(null); // Devolvemos un observable nulo para completar el flujo sin error.
      })
    ).subscribe({
      // Se ejecuta solo si el pipe se completó sin lanzar un error fatal
      next: (data: any | null) => {
        // Verificamos si el flujo se detuvo por catchError (que devuelve null)
        this.blnFotoGuardada = true;
        this.defaultFile = archivo;
        this.refGuid.set(data.guid);
      }
    });
  }*/

  private guardarFoto(datos: FormData, archivo: File): void {
    this.blnFotoGuardada = false;
    const idUsuario = this.datosMedico()?.idUsuario;
    const idParticipacion = this.datosMedico()?.idParticipacion;

    if (!idUsuario || !idParticipacion) {
      this._alertServices.error('No se pudo obtener la información del usuario.');
      return;
    }

    this.documentoService.guardarFoto(datos, this.ID_MODULO, idUsuario).pipe(
      switchMap((data: any) => {
        if (!data?.guid) {
          return throwError(() => new Error(data?.mensaje || 'Error al obtener GUID de la foto.'));
        }
        this.refGuid.set(data.guid);

        //Actualización en BD
        return this.pSindicalService.actualizarFotogradia(idParticipacion, data.guid);
      }),

      catchError((error) => {
        this.blnFotoGuardada = false;
        this._alertServices.error('Error en el proceso de guardado.');
        console.log(error?.error || error?.message);
        return of(null);
      })

    ).subscribe({
      next: (response: any | null) => {
        console.log('Response', response);
        if(response.exito) {
          this.blnFotoGuardada = true;
          this.defaultFile = archivo;
          this.consultarMatriculaFolio();
        } else {
          this._alertServices.error(response.mensaje);
        }
      }
    });
  }


  private b64toBlob(b64Data: string, contentType: string = '', sliceSize: number = 512): Blob {


    let base64 = b64Data.split(',')[1] ? b64Data.split(',')[1] : b64Data;


    // Eliminar CUALQUIER carácter que NO sea una letra/número válido para Base64,
    // incluyendo espacios, saltos de línea, y caracteres de control.
    // Base64 válido solo incluye A-Z, a-z, 0-9, +, / y = (relleno).
    base64 = base64.replace(/[^A-Za-z0-9+/=]/g, '');

    // 3. Decodificar el Base64
    try {
      const byteCharacters = atob(base64);

      const byteArrays: Uint8Array[] = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays as BlobPart[], {type: contentType});

    } catch (e) {
      // Si incluso después de la limpieza falla, la respuesta NO es Base64.
      console.error("Error crítico: La respuesta HTTP no es un Base64 válido.", e);
      // Lanza un error genérico o notifica al usuario.
      throw new Error("El string Base64 no es válido o contiene caracteres ilegales.");
    }
  }

  /*actualizarFoto(){

     this.pSindicalService.actualizarFotogradia(this.datosMedico()?.idParticipacion || 0, this.refGuid()).subscribe({
       next: (response: any) => {
         this.consultarMatriculaFolio(true);
       }
     })
  }*/


  get f() {
    return this.form.controls;
  }

}
