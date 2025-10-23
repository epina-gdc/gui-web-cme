export interface SolicitudGuardarDocumentacion {
  "datosPersonales": {
    "idUsuario": number
  },
  "documentosObligatorios": DocumentoObligatorio[],
  //documentacion de la especialidad
  // de 1 a  3 especialidades
  "especialidadesDocumentos": [
    {
      //vendra del catalogo externo agregar cve y descripcion
      //uno por cada especialidad
      "cveEspecialidad": "09",
      "desEspecialidad": "NEUROLOGÍA",
      //cada especialidad tiene  una lista de docs
      "documentosEspecialidad": [
        {
          //por cada especialidad agregar
          // Diploma Institucional de Especialidad
          //segundo select
          "tipoDocumentoEspecialidad": {
            "idTipoDocumentoEspecialidad": 21
          },
          //referecia al cargar documento
          "documento": {
            "refGuid": "c0bbf87c-0e34-4ff0-8f10-c3f5d510da94"
          }
        },
        //otro tipo de documento para la misma especialidad
        {
          // para probar misma especialidad diferente tipo de docuemento
          "tipoDocumentoEspecialidad": {
            "idTipoDocumentoEspecialidad": 3
          },
          //referecia al cargar documento
          "documento": {
            "refGuid": "0a1904c1-59c5-4141-93e4-2d472e53304e"
          }
        }
      ]
    },
    // otra especialidad
    {
      //vendra del catalogo externo agregar cve y descripcion
      //uno por cada especialidad
      "cveEspecialidad": "05",
      "desEspecialidad": "MEDICINA INTERNA",
      //cada especialidad tiene  una lista de docs
      "documentosEspecialidad": [
        {
          //por cada especialidad agregar
          // Diploma Institucional de Especialidad
          //segundo select
          "tipoDocumentoEspecialidad": {
            "idTipoDocumentoEspecialidad": 21
          },
          //referecia al cargar documento
          "documento": {
            "refGuid": "ec27d768-9546-4d70-9c62-ce70fe699c45"
          }
        }
      ]
    }
  ],
  // documentos constancia
  // solo para extranjeros
  "documentosConstancias": [
    {
      "refConstancia": "nombre constancia uno ",
      "documento": {
        "refGuid": "b7c58223-6b7e-4183-84a4-cf86c4a049df"
      }
    },
    {
      "refConstancia": "constancia dos ",
      "documento": {
        "refGuid": "fa985357-a6b5-4b7a-95ea-bbbeddd36299"
      }
    }
  ],
  //card datos de empleo solo para externos
  "datosEmpleo": {
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
}

export interface DocumentoObligatorio {
  tipoDocumentoObligatorio: {
    idDocumentoObligatorio: number
    desDocumentoObligatorio?: "TITULO" | "CEDULA"
  },
  documento: {
    refGuid: string
  }
}

