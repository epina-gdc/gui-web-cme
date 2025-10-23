export interface SolicitudGuardarDocumentacion {
  datosPersonales: {
    idUsuario: number
  },
  documentosObligatorios: SolicitudDocumentoObligatorio[],
  especialidadesDocumentos: DocumentoEspecialidad[],
  documentosConstancias?: DocumentoConstancia [],
  "datosEmpleo"?: DatosEmpleo
}

export interface SolicitudDocumentoObligatorio {
  tipoDocumentoObligatorio: {
    idDocumentoObligatorio: number
    desDocumentoObligatorio?: "TITULO" | "CEDULA PROFESIONAL"
  },
  documento: {
    refGuid: string
  }
}

export interface DocumentoEspecialidad {
  "cveEspecialidad": string,
  "desEspecialidad": string,
  "documentosEspecialidad": RefDocumentoEspecialidad[]
}

export interface RefDocumentoEspecialidad {
  tipoDocumentoEspecialidad: {
    idTipoDocumentoEspecialidad: number
  },
  documento: {
    refGuid: string
  }
}


export interface DocumentoConstancia {
  refConstancia: string,
  documento: {
    refGuid: string
  }
}

export interface DatosEmpleo {
  indOtroEmpleo: 1 | 0,
  indMedicoSustituto: 1 | 0,
  tipoInstitucion: {
    idTipoInstitucion: 1 | 0 | null
  },
  nomEspecificacionInstitucion: string | null,
  cveOoad: string | null,
  desOoad: string | null,
  refJornadaInicio: string | null,
  refJornadaFin: string | null,
  diaSemanaInicio: {
    idDiaSemana: string | null
  },
  diaSemanaFin: {
    idDiaSemana: string | null
  }
}
