export interface RespuestaConsultaDocumentos {
  "participacion": {
    "idParticipacion": 103,
    "idUsuario": 281,
    "idConvocatoria": 1,
    "desFolioMe": null,
    "resultadoVerificacion": {
      "idResultadoVerificacion": 62,
      "estatusVerificacion": {
        "idEstatusVerificacion": 1,
        "desEstatus": "Pendiente"
      },
      "refObservaciones": "Aspirante sube documentos"
    }
  },
  datosPersonales: null,
  documentosObligatorios: RespuestaDocumentosObligatorios[],
  especialidadesDocumentos: RespuestaDocumentosEspecialidad[],
  documentosConstancias: RespuestaDocumentosConstancia[],
  "datosEmpleo": {
    "idDatoEmpleo": 63,
    "indOtroEmpleo": 0,
    "indMedicoSustituto": 0,
    "tipoInstitucion": null,
    "nomInstitucion": null,
    "nomEspecificacionInstitucion": null,
    "cveOoad": null,
    "desOoad": null,
    "horarioLaboralOtroEmpleo": null,
    "horarioLaboralMedicoSustituto": null,
    "refJornadaInicio": null,
    "refJornadaFin": null,
    "diaSemanaInicio": null,
    "diaSemanaFin": null
  }
}

export interface RespuestaDocumentosObligatorios {
  idDocumentoObligatorio: number,
  tipoDocumentoObligatorio: {
    idDocumentoObligatorio: number,
    desDocumentoObligatorio: string
  },
  documento: {
    refGuid: string,
    refNombre: string,
    refExtension: string
  }
}

export interface RespuestaDocumentosConstancia {
  idDocumentoConstancia: number,
  refConstancia: string,
  documento: {
    refGuid: string,
    refNombre: string,
    refExtension: string
  }
}

export interface RespuestaDocumentosEspecialidad {
  idEspecialidadDocumento: number,
  cveEspecialidad: string,
  desEspecialidad: string,
  documentosEspecialidad: ItemDocumentoEspecialidad[]
}

export interface ItemDocumentoEspecialidad {
  idDocumentoEspecialidad: number,
  tipoDocumentoEspecialidad: {
    idTipoDocumentoEspecialidad: number,
    desTipoDocumentoEspecialidad: string
  },
  documento: {
    refGuid: string,
    refNombre: string,
    refExtension: string
  },
  indCubre: null
}
