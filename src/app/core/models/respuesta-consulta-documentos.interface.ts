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
  "datosPersonales": null,
  "documentosObligatorios": RespuestaDocumentosObligatorios[],
  "especialidadesDocumentos": [
    {
      "idEspecialidadDocumento": 65,
      "cveEspecialidad": "61",
      "desEspecialidad": "ANESTESIOLOGIA",
      "documentosEspecialidad": [
        {
          "idDocumentoEspecialidad": 93,
          "tipoDocumentoEspecialidad": {
            "idTipoDocumentoEspecialidad": 4,
            "desTipoDocumentoEspecialidad": "Certificado de Especialidad en Pediatría"
          },
          "documento": {
            "refGuid": "b6d2cc1b-c9e5-451a-a4b8-a9d81a1af560",
            "refNombre": "test",
            "refExtension": "pdf"
          },
          "indCubre": null
        },
        {
          "idDocumentoEspecialidad": 94,
          "tipoDocumentoEspecialidad": {
            "idTipoDocumentoEspecialidad": 3,
            "desTipoDocumentoEspecialidad": "Cédula Profesional"
          },
          "documento": {
            "refGuid": "c4ad60bd-1f43-4085-b4e7-209cae6efe48",
            "refNombre": "test",
            "refExtension": "pdf"
          },
          "indCubre": null
        },
        {
          "idDocumentoEspecialidad": 95,
          "tipoDocumentoEspecialidad": {
            "idTipoDocumentoEspecialidad": 21,
            "desTipoDocumentoEspecialidad": "Diploma Institucional de Especialidad"
          },
          "documento": {
            "refGuid": "fbe70a92-469b-4b93-a113-50568abb7d7c",
            "refNombre": "test",
            "refExtension": "pdf"
          },
          "indCubre": null
        }
      ]
    }
  ],
  "documentosConstancias": [
    {
      "idDocumentoConstancia": 65,
      "refConstancia": "Constancia de curso de sanidad actualizada",
      "documento": {
        "refGuid": "160b9492-61ad-4f01-adf0-2995d27f3b78",
        "refNombre": "test",
        "refExtension": "pdf"
      }
    }
  ],
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
