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
  "indOtroEmpleo": 1,
  "indMedicoSustituto": 0,
  //publica o privada
  "tipoInstitucion": {
    "idTipoInstitucion": 1
  },
  "nomEspecificacionInstitucion": "Especialista en Medicina Interna",
  "cveOoad": "36",
  "desOoad": "CDMX",
  "refJornadaInicio": "09:00",
  "refJornadaFin": "19:00",
  "diaSemanaInicio": {
    "idDiaSemana": "1"
  },
  "diaSemanaFin": {
    "idDiaSemana": "5"
  }
}
