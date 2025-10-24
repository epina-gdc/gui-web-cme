import {TipoInstitucion} from '@models/solicitud-guardar-documentacion.interface';

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
  datosEmpleo: RespuestaDatosEmpleo
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

export interface RespuestaDatosEmpleo {
  idDatoEmpleo: number,
  indOtroEmpleo: 1 | 0,
  indMedicoSustituto: 1 | 0,
  tipoInstitucion: TipoInstitucion | null,
  nomInstitucion: string | null,
  nomEspecificacionInstitucion: string | null,
  cveOoad: string | null,
  desOoad: string | null,
  horarioLaboralOtroEmpleo: string | null,
  horarioLaboralMedicoSustituto: string | null,
  refJornadaInicio: string | null,
  refJornadaFin: string | null,
  diaSemanaInicio: string | null,
  diaSemanaFin: string | null
}
