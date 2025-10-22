import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentosLocalstorageService {

  readonly DOC_STORAGE_KEY = 'docs_aspirante';

  constructor() {
  }

  getDocumentosIDs() {
    const data = localStorage.getItem(this.DOC_STORAGE_KEY);
    return data ? JSON.parse(data) : {
      obligatorios: {},
      especialidades: [],
      constancias: []
    };
  }

  guardarRefGuidObligatorio(idDocumentoObligatorio: number, refGuid: string) {

    //  Obtener los datos existentes o inicializar un objeto vacío
    const informacionGuardada = localStorage.getItem(this.DOC_STORAGE_KEY);
    let informacionActualizada = informacionGuardada ? JSON.parse(informacionGuardada) : {
      obligatorios: {},
      especialidades: [],
      constancias: []
    };

    // Se convierte el idDocumentoObligatorio a string para usarlo como clave de objeto
    informacionActualizada.obligatorios[idDocumentoObligatorio] = refGuid;

    // Guardar el objeto actualizado en localStorage
    localStorage.setItem(this.DOC_STORAGE_KEY, JSON.stringify(informacionActualizada));

  }

  obtenerRefGuid(idDocumentoObligatorio: number) {
    const informacionGuardada = localStorage.getItem(this.DOC_STORAGE_KEY);

    if (informacionGuardada) {
      const documento = JSON.parse(informacionGuardada);
      return documento.obligatorios[idDocumentoObligatorio] ?? null;
    }
    return null;
  }
}
