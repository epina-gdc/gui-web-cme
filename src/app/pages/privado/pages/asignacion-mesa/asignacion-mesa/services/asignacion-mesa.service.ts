import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { catchError, map, Observable, throwError } from 'rxjs';


// Clase base (la que ya tienes)
export class ResponseGeneral {
  exito!: boolean;
  mensaje!: string;
}

// Clase para el tipo de convocatoria
export class TipoConvocatoria {
  idTipoConvocatoria!: number;
  desTipoConvocatoria!: string;
  indActivo!: number;
}

// Clase para una convocatoria
export class Convocatoria {
  idConvocatoria!: number;
  desConvocatoria!: string;
  fecInicio!: string;  // o Date si prefieres
  tipo!: TipoConvocatoria;
  fecFin!: string;     // o Date si prefieres
  indActivo!: number;
}

// Clase derivada para la respuesta de convocatorias
export class ResponseConvocatorias extends ResponseGeneral {
  respuesta!: Convocatoria[];
}

@Injectable({
  providedIn: 'root'
})
export class AsignacionMesaService {

  http = inject(HttpClient);

  header: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  private readonly VERSION_API: string = '/v1/';
  private readonly serverEndPointURLCatalogos = `${environment.api.apiCatalogos + this.VERSION_API + 'catalogos'}`;


  /**
     * Obtener lista de convocatorias
     */
  getLstConvocatorias(): Observable<ResponseConvocatorias> {
    return this.http.get<ResponseConvocatorias>(this.serverEndPointURLCatalogos, { headers: this.header }).pipe(
      catchError(this.handleError),
      map((response: ResponseConvocatorias) => {
        return response;
      })
    );
  }

  /**
     * Manejador de errores
     */
  private handleError(error: HttpErrorResponse) {
    console.log("Error " + error.status + '. Contácte al administrador');
    // Return an observable with a user-facing error message.
    return throwError(() => error);
  }

}
