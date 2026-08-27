# Contrato de Servicios - Administracion de Plazas

Microservicio: `mscme-admon-plazas`

Context path: `/mscme-admon-plazas`

Base URLs locales/configuradas:

- Administracion de plazas: `/mscme-admon-plazas/v1/administracionPlazas`
- Carga de layout de plaza: `/mscme-admon-plazas/v1/cargaLayoutPlaza`

Autenticacion: `Authorization: Bearer <token>`

Swagger/OpenAPI:

- Swagger UI: `/mscme-admon-plazas/swagger-ui`
- OpenAPI JSON: `/mscme-admon-plazas/v3/api-docs`

Formato de respuesta comun:

```json
{
  "exito": true,
  "mensaje": "Mensaje descriptivo.",
  "respuesta": {}
}
```

## HU63. Carga XLSX de Plazas

Servicios incluidos:

| Servicio | Metodo | URL |
| --- | --- | --- |
| Cargar layout de plazas | `POST` | `/mscme-admon-plazas/v1/cargaLayoutPlaza/cargarArchivo` |
| Consultar ultima carga por convocatoria | `GET` | `/mscme-admon-plazas/v1/cargaLayoutPlaza/ultimaCarga` |

### HU63.1 Cargar Layout de Plazas

URL:

`POST /mscme-admon-plazas/v1/cargaLayoutPlaza/cargarArchivo`

Headers:

| Header | Requerido | Descripcion |
| --- | --- | --- |
| `Authorization` | Si | Token JWT en formato `Bearer <token>`. |
| `Content-Type` | Si | `multipart/form-data`. |

Form data:

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `idConvocatoria` | `Long` | Si | Identificador de la convocatoria a la que pertenece el layout. |
| `archivo` | `MultipartFile` | Si | Archivo Excel `.xlsx` o `.xls` con el layout de plazas. |

Columnas esperadas del archivo:

| Orden | Columna |
| --- | --- |
| 1 | `NUM_PLAZA` |
| 2 | `CVE_OOAD` |
| 3 | `DESC_OOAD` |
| 4 | `CVE_ZONA` |
| 5 | `DESC_ZONA` |
| 6 | `CLASIFICACION` |
| 7 | `CVE_UNIDAD` |
| 8 | `DESC_UNIDAD` |
| 9 | `CVE_DEPARTAMENTO` |
| 10 | `DESC_DEPARTAMENTO` |
| 11 | `CVE_PUESTO` |
| 12 | `DESC_PUESTO` |
| 13 | `CVE_CATEGORIA` |
| 14 | `DESC_CATEGORIA` |
| 15 | `CVE_AREA_RESPONSABILIDAD` |
| 16 | `DESC_AREA_RESPONSABILIDAD` |
| 17 | `CVE_TURNO` |
| 18 | `DESC_TURNO` |
| 19 | `CVE_HORARIO` |
| 20 | `DESC_HORARIO` |
| 21 | `CVE_TIPO_PLAZA` |
| 22 | `DESC_TIPO_PLAZA` |
| 23 | `CVE_MARCA_OCUPACION` |
| 24 | `DESC_MARCA_OCUPACION` |
| 25 | `DES_REGIMEN` |
| 26 | `REF_DIRECCION_UNIDAD` |
| 27 | `IND_HOSPITAL_NUEVO` |
| 28 | `REF_SUELDO_MENSUAL_BRUTO` |
| 29 | `REF_SUELDO_MENSUAL_NETO` |
| 30 | `IND_ACCESO_CREDITO` |
| 31 | `REF_CRED_HIPOTECARIO_IMPORTE` |
| 32 | `REF_CRED_AUTOMOTRIZ_IMPORTE` |
| 33 | `REF_CRED_HIPOTECARIO_QUINCENAL` |
| 34 | `REF_CRED_AUTOMOTRIZ_QUINCENAL` |
| 35 | `REF_BONO_DIFICIL_COBERTURA` |
| 36 | `REF_ALTO_COSTO_VIDA` |

Reglas:

- El archivo es obligatorio y no debe estar vacio.
- El servicio valida extension `.xlsx` o `.xls`.
- No permite iniciar otra carga si existe carga en proceso activa para la misma convocatoria.
- El servicio busca la fila de encabezado tecnico localizando la columna `NUM_PLAZA`; pueden existir filas previas informativas antes del encabezado.
- Si existen plazas activas en estatus `Ocupada` para la convocatoria, la carga se interrumpe con el mensaje `No es posible realizar la carga, ya existen plazas ocupadas para la convocatoria proporcionada.`
- Si no existen plazas ocupadas, antes de guardar las nuevas plazas elimina fisicamente las plazas activas existentes de la convocatoria (`DELETE FROM CMEC_PLAZA_LAYOUT WHERE ID_CONVOCATORIA = :idConvocatoria AND IND_ACTIVO = 1`).
- Cada plaza cargada queda con estatus `Etiquetada`.
- Cada plaza cargada queda con `origenPlaza = LAYOUT`.
- El servicio registra control de carga en `CMET_CONTROL_CARGA_PLAZA`.
- El control de carga se guarda en transaccion independiente para conservar el registro de inicio/fin aunque la carga falle y haga rollback.
- Al finalizar registra bitacora general del modulo de administracion de plazas.

Response exitoso:

```json
{
  "exito": true,
  "mensaje": "Se cargaron con éxito las plazas.",
  "respuesta": {
    "totalRegistros": 100,
    "totalPlazasOfertadas": 98,
    "totalPlazasConCredito": 10,
    "totalErrores": 2,
    "plazasValidas": [],
    "plazasGuardadas": [
      {
        "idPlaza": 1000,
        "idConvocatoria": 1,
        "numPlaza": 123456,
        "cveOoad": "03",
        "descOoad": "OOAD",
        "cveZona": 1,
        "descZona": "ZONA 1",
        "clasificacion": "ORDINARIA",
        "cveUnidad": "03HD010000",
        "descUnidad": "UNIDAD MEDICA",
        "cveDepartamento": "DEP01",
        "descDepartamento": "DEPARTAMENTO",
        "cvePuesto": "20360180",
        "descPuesto": "PUESTO",
        "cveCategoria": "CAT01",
        "descCategoria": "MEDICO NO FAMILIAR",
        "cveAreaResponsabilidad": "04",
        "descAreaResponsabilidad": "ESPECIALIDAD",
        "cveTurno": 1,
        "descTurno": "MATUTINO",
        "cveHorario": "H1",
        "descHorario": "08:00 A 16:00",
        "cveTipoPlaza": "TP01",
        "descTipoPlaza": "OPERATIVA BASE",
        "cveMarcaOcupacion": 1,
        "descMarcaOcupacion": "VACANTE",
        "desRegimen": "ORDINARIO",
        "refDireccionUnidad": "DIRECCION DE UNIDAD",
        "indHospitalNuevo": 0,
        "refSueldoMensualBruto": 10000.00,
        "refSueldoMensualNeto": 8000.00,
        "indAccesoCredito": 1,
        "refCredHipotecarioImporte": 100000.00,
        "refCredAutomotrizImporte": 50000.00,
        "refCredHipotecarioQuincenal": 1000.00,
        "refCredAutomotrizQuincenal": 500.00,
        "refBonoDificilCobertura": 0.00,
        "refAltoCostoVida": 50.00
      }
    ],
    "plazasConError": [
      {
        "numFila": 10,
        "numPlaza": 123457,
        "cveOoad": 3,
        "descOoad": "OOAD",
        "errores": [
          "La plaza ya existe para la convocatoria."
        ]
      }
    ]
  }
}
```

### HU63.2 Ultima Carga de Layout por Convocatoria

URL:

`GET /mscme-admon-plazas/v1/cargaLayoutPlaza/ultimaCarga`

Query params:

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `idConvocatoria` | `Long` | Si | Identificador de la convocatoria. |

Request body:

No aplica.

Reglas:

- Consulta el registro de control de carga mas reciente para la convocatoria.
- Ordena por `STP_ALTA_REGISTRO DESC` e identificador descendente.
- Si no existe carga previa, la respuesta puede venir en `null`.

Response:

```json
{
  "exito": true,
  "mensaje": "Éxito",
  "respuesta": {
    "id": 1,
    "idConvocatoria": 1,
    "idEstatusCarga": 2,
    "desEstatusCarga": "FINALIZADO",
    "nomArchivo": "layout_plazas.xlsx",
    "numTotalRegistros": 100,
    "numRegistrosValidos": 98,
    "numRegistrosRechazados": 2,
    "numPlazasOfertadas": 98,
    "numPlazasConCredito": 10,
    "stpInicioCarga": "20/08/2026 10:00:00",
    "stpFinCarga": "20/08/2026 10:02:00",
    "refMensajeResultado": "Se cargaron con éxito las plazas."
  }
}
```

Notas generales:

- Las consultas retornan solo plazas activas (`IND_ACTIVO = 1`).
- La busqueda de plazas permite filtrar por convocatoria; si no se envia `idConvocatoria`, usa la convocatoria vigente en el periodo actual.
- La baja de plaza es logica.
- El filtro `origenPlaza` acepta valores como `MANUAL` o `LAYOUT`.
- La validacion de plazas ocupadas se realiza por `idConvocatoria`.
- El alta manual toma la convocatoria activa vigente; no requiere `idConvocatoria` en el request.
- El alta manual valida duplicidad por `idConvocatoria activa + cveOoad + numPlaza + IND_ACTIVO = 1`.
- En alta manual, `numPlaza` es opcional; si no se envia, el backend asigna `MAX(NUM_PLAZA) + 1` de la convocatoria activa vigente considerando solo plazas activas.
- El alta manual solo permite estatus `Vacante` o `Etiquetada`.
- La edicion de plaza recibe `idPlaza` dentro del body, no como path param.
- La actualizacion de estatus usa metodo `PUT` y recibe `idPlaza`, `idEstatus` y `desObservaciones` dentro del body.
- La carga de layout acepta archivos `.xlsx` y `.xls` segun validacion actual del servicio.
- La carga de layout reemplaza las plazas activas de la convocatoria cuando no existen plazas ocupadas.
- Si existen plazas ocupadas para la convocatoria, la carga se rechaza.

## 1. Busqueda de Plazas por Filtro

URL:

`GET /mscme-admon-plazas/v1/administracionPlazas/busquedaPlazasFiltro`

Query params:

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `cveOoad` | `Long` | No | Clave de OOAD. |
| `numPlaza` | `Integer` | No | Numero de plaza. |
| `origenPlaza` | `String` | No | Origen de plaza: `MANUAL` o `LAYOUT`. |
| `idConvocatoria` | `Long` | No | Identificador de convocatoria. Si no se envia, se calcula la convocatoria vigente actual. |
| `cveZona` | `Integer` | No | Clave de zona. |
| `cveCategoria` | `String` | No | Clave de categoria. |
| `cveEspecialidad` | `String` | No | Clave de especialidad; se compara contra `CVE_AREA_RESPONSABILIDAD`. |
| `cveUnidad` | `String` | No | Clave de unidad. |
| `page` | `Integer` | No | Numero de pagina. Default Spring Pageable. |
| `size` | `Integer` | No | Tamanio de pagina. Default `10`. |
| `sort` | `String` | No | Ordenamiento Spring Pageable. |

Request body:

No aplica.

Reglas:

- Todos los filtros son opcionales.
- Si `idConvocatoria` no se envia, el backend busca la convocatoria activa vigente por fecha actual.
- Si no existe convocatoria vigente y no se envia `idConvocatoria`, responde error con mensaje de convocatoria no encontrada.
- `origenPlaza` se compara en mayusculas.
- `cveCategoria`, `cveEspecialidad` y `cveUnidad` se comparan sin transformacion de mayusculas/minusculas, solo con `trim`.

Response:

```json
{
  "exito": true,
  "mensaje": "Exito",
  "respuesta": {
    "content": [
      {
        "idPlaza": 57,
        "cveOoad": "03",
        "cvePuesto": "20360180",
        "cveUnidad": "03HD010000",
        "porcAltoCostoVida": 50,
        "especialidad": "ONCOLOGIA MEDICA",
        "categoria": "MEDICO NO FAMILIAR",
        "regimen": "ORDINARIO",
        "turno": "VESPERTINO",
        "tipoPlaza": "OPERATIVA BASE",
        "marcaOcupacion": "VACANTE",
        "umf": "HOSPITAL",
        "nuevoHospital": 0,
        "ubicacion": "OOAD",
        "zona": "ZONA 1",
        "direccion": "DIRECCION DE UNIDAD",
        "sueldoMensualBruto": 10000.00,
        "sueldoMensualNeto": 8000.00,
        "horario": "08:00 A 16:00",
        "numPlaza": "123456",
        "clasificacion": "ORDINARIA",
        "ooad": "OOAD",
        "creditos": 0,
        "bonoDificilCobertura": 0,
        "accesoCredito": false,
        "creditoAutomotriz": 0,
        "descuentoQuincenalCreditoAutomotriz": 0,
        "creditoHipotecario": 0,
        "descuentoQuincenalCreditoHipotecario": 0,
        "esFavorita": null,
        "cveZona": 1,
        "idEstatusPlaza": 1,
        "estatusPlaza": "Vacante",
        "idConvocatoria": 1,
        "origenPlaza": "LAYOUT",
        "observaciones": null
      }
    ],
    "page": {
      "size": 10,
      "number": 0,
      "totalElements": 1,
      "totalPages": 1
    }
  }
}
```

## 2. Detalle de Plaza

URL:

`GET /mscme-admon-plazas/v1/administracionPlazas/buscarDetallePlaza/{idPlaza}`

Path params:

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `idPlaza` | `Long` | Si | Identificador de la plaza. |

Request body:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Exito",
  "respuesta": {
    "idPlaza": 57,
    "cveOoad": "03",
    "cvePuesto": "20360180",
    "cveUnidad": "03HD010000",
    "porcAltoCostoVida": 50,
    "especialidad": "ONCOLOGIA MEDICA",
    "categoria": "MEDICO NO FAMILIAR",
    "regimen": "ORDINARIO",
    "turno": "VESPERTINO",
    "tipoPlaza": "OPERATIVA BASE",
    "marcaOcupacion": "VACANTE",
    "umf": "HOSPITAL",
    "nuevoHospital": 0,
    "ubicacion": "OOAD",
    "zona": "ZONA 1",
    "direccion": "DIRECCION DE UNIDAD",
    "sueldoMensualBruto": 10000.00,
    "sueldoMensualNeto": 8000.00,
    "horario": "08:00 A 16:00",
    "numPlaza": "123456",
    "clasificacion": "ORDINARIA",
    "ooad": "OOAD",
    "creditos": 0,
    "bonoDificilCobertura": 0,
    "accesoCredito": false,
    "creditoAutomotriz": 0,
    "descuentoQuincenalCreditoAutomotriz": 0,
    "creditoHipotecario": 0,
    "descuentoQuincenalCreditoHipotecario": 0,
    "esFavorita": null,
    "cveZona": 1,
    "idEstatusPlaza": 1,
    "estatusPlaza": "Vacante",
    "idConvocatoria": 1,
    "origenPlaza": "LAYOUT",
    "observaciones": null
  }
}
```

## 3. Registrar Plaza

URL:

`POST /mscme-admon-plazas/v1/administracionPlazas/registrarPlaza`

Headers:

| Header | Requerido | Descripcion |
| --- | --- | --- |
| `Authorization` | Si | Token JWT en formato `Bearer <token>`. |
| `Content-Type` | Si | `application/json`. |

Request:

```json
{
  "numPlaza": 123456,
  "cveOoad": 3,
  "descOoad": "OOAD",
  "cveZona": 1,
  "descZona": "ZONA 1",
  "clasificacion": "ORDINARIA",
  "cveUnidad": "03HD010000",
  "descUnidad": "HOSPITAL",
  "cveDepartamento": "001",
  "descDepartamento": "ADSCRIPCION",
  "cvePuesto": "20360180",
  "descPuesto": "MEDICO",
  "cveCategoria": "MF",
  "descCategoria": "MEDICO NO FAMILIAR",
  "cveAreaResponsabilidad": "A1",
  "descAreaResponsabilidad": "ONCOLOGIA MEDICA",
  "cveTurno": 2,
  "descTurno": "VESPERTINO",
  "cveHorario": "08-16",
  "descHorario": "08:00 A 16:00",
  "cveTipoPlaza": "OP",
  "descTipoPlaza": "OPERATIVA BASE",
  "cveMarcaOcupacion": 1,
  "descMarcaOcupacion": "VACANTE",
  "descRegimen": "ORDINARIO",
  "refDireccionUnidad": "DIRECCION DE UNIDAD",
  "indHospitalNuevo": 0,
  "refSueldoMensualBruto": 10000.00,
  "refSueldoMensualNeto": 8000.00,
  "indAccesoCredito": 0,
  "refCredHipotecarioImporte": 0,
  "refCredAutomotrizImporte": 0,
  "refCredHipotecarioQuincenal": 0,
  "refCredAutomotrizQuincenal": 0,
  "refBonoDificilCobertura": 0,
  "refAltoCostoVida": 50,
  "idEstatusPlaza": 1,
  "origenPlaza": "MANUAL",
  "desObservaciones": "Alta manual"
}
```

Campos minimos obligatorios validados por servicio:

- `cveOoad`
- `idEstatusPlaza`

Reglas:

- `idConvocatoria` no es obligatorio para alta manual; el backend usa la convocatoria activa vigente.
- Si no existe convocatoria activa vigente, el servicio responde error: `No existe una convocatoria activa vigente.`
- `numPlaza` es opcional en alta manual. Si no se envia, el backend consulta `CMEC_PLAZA_LAYOUT` por la convocatoria activa vigente y asigna el siguiente consecutivo: `NVL(MAX(NUM_PLAZA), 0) + 1` con `IND_ACTIVO = 1`.
- La plaza se registra con `origenPlaza = MANUAL` cuando no se envia `origenPlaza`.
- Si se envia `origenPlaza`, el backend lo normaliza a mayusculas.

Response exitoso:

```json
{
  "exito": true,
  "mensaje": "Plaza registrada con éxito.",
  "respuesta": {
    "idPlaza": 1000,
    "cveOoad": "03",
    "cvePuesto": "20360180",
    "cveUnidad": "03HD010000",
    "especialidad": "ONCOLOGIA MEDICA",
    "categoria": "MEDICO NO FAMILIAR",
    "regimen": "ORDINARIO",
    "turno": "VESPERTINO",
    "tipoPlaza": "OPERATIVA BASE",
    "marcaOcupacion": "VACANTE",
    "numPlaza": "123456",
    "idEstatusPlaza": 1,
    "estatusPlaza": "Vacante",
    "idConvocatoria": 1,
    "origenPlaza": "MANUAL",
    "observaciones": "Alta manual"
  }
}
```

Response de validacion:

```json
{
  "exito": false,
  "mensaje": "cveOoad e idEstatusPlaza son obligatorios."
}
```

## 4. Actualizar Plaza

URL:

`PUT /mscme-admon-plazas/v1/administracionPlazas/actualizarPlaza`

Headers:

| Header | Requerido | Descripcion |
| --- | --- | --- |
| `Authorization` | Si | Token JWT en formato `Bearer <token>`. |
| `Content-Type` | Si | `application/json`. |

Request:

Mismo contrato que `POST /registrarPlaza`, agregando `idPlaza` obligatorio dentro del body.

```json
{
  "idPlaza": 1000,
  "numPlaza": 123456,
  "cveOoad": 3,
  "descOoad": "OOAD",
  "cveZona": 1,
  "descZona": "ZONA 1",
  "clasificacion": "ORDINARIA",
  "cveUnidad": "03HD010000",
  "descUnidad": "HOSPITAL",
  "cveDepartamento": "001",
  "descDepartamento": "ADSCRIPCION",
  "cvePuesto": "20360180",
  "descPuesto": "MEDICO",
  "cveCategoria": "MF",
  "descCategoria": "MEDICO NO FAMILIAR",
  "cveAreaResponsabilidad": "A1",
  "descAreaResponsabilidad": "ONCOLOGIA MEDICA",
  "cveTurno": 2,
  "descTurno": "VESPERTINO",
  "cveHorario": "08-16",
  "descHorario": "08:00 A 16:00",
  "cveTipoPlaza": "OP",
  "descTipoPlaza": "OPERATIVA BASE",
  "cveMarcaOcupacion": 1,
  "descMarcaOcupacion": "VACANTE",
  "descRegimen": "ORDINARIO",
  "refDireccionUnidad": "DIRECCION DE UNIDAD",
  "indHospitalNuevo": 0,
  "refSueldoMensualBruto": 10000.00,
  "refSueldoMensualNeto": 8000.00,
  "indAccesoCredito": 0,
  "refCredHipotecarioImporte": 0,
  "refCredAutomotrizImporte": 0,
  "refCredHipotecarioQuincenal": 0,
  "refCredAutomotrizQuincenal": 0,
  "refBonoDificilCobertura": 0,
  "refAltoCostoVida": 50,
  "idEstatusPlaza": 1,
  "origenPlaza": "MANUAL",
  "desObservaciones": "Actualizacion manual"
}
```

Campos minimos obligatorios validados por servicio:

- `idPlaza`
- `cveOoad`
- `numPlaza`
- `idEstatusPlaza`

Response:

```json
{
  "exito": true,
  "mensaje": "Registro actualizado exitosamente",
  "respuesta": {
    "idPlaza": 1000,
    "numPlaza": "123456",
    "idConvocatoria": 1,
    "origenPlaza": "MANUAL",
    "observaciones": "Actualizacion manual"
  }
}
```

## 5. Baja Logica de Plaza

URL:

`DELETE /mscme-admon-plazas/v1/administracionPlazas/eliminarPlaza/{idPlaza}`

Headers:

| Header | Requerido | Descripcion |
| --- | --- | --- |
| `Authorization` | Si | Token JWT en formato `Bearer <token>`. |

Path params:

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `idPlaza` | `Long` | Si | Identificador de la plaza. |

Request body:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Registro eliminado exitosamente"
}
```

## 6. Actualizar Estatus de Plaza

URL:

`PUT /mscme-admon-plazas/v1/administracionPlazas/actualizarEstatusPlaza`

Headers:

| Header | Requerido | Descripcion |
| --- | --- | --- |
| `Authorization` | Si | Token JWT en formato `Bearer <token>`. |
| `Content-Type` | Si | `application/json`. |

Request:

```json
{
  "idPlaza": 1000,
  "idEstatus": 1,
  "desObservaciones": "Cambio autorizado por administracion de plazas"
}
```

Reglas:

- `desObservaciones` es obligatorio.
- `desObservaciones` no debe exceder 500 caracteres.
- `idPlaza` identifica la plaza a actualizar.
- `idEstatus` identifica el nuevo estatus.
- El cambio registra bitacora funcional en `CMET_BITACORA_ADMON_PLAZA` con estatus anterior, estatus nuevo, observaciones y auditoria.

Response:

```json
{
  "exito": true,
  "mensaje": "Registro actualizado exitosamente"
}
```

## 7. Validacion de Plazas Ocupadas por Convocatoria

URL:

`GET /mscme-admon-plazas/v1/administracionPlazas/plazaValidacion`

Query params:

| Parametro | Tipo | Requerido | Descripcion |
| --- | --- | --- | --- |
| `idConvocatoria` | `Long` | Si | Identificador de la convocatoria a validar. |

Request body:

No aplica.

Response cuando existen plazas ocupadas:

```json
{
  "exito": true,
  "mensaje": "Validación realizada correctamente.",
  "respuesta": {
    "puedeIniciarProceso": false,
    "existenPlazasOcupadas": true,
    "totalPlazasOcupadas": 8
  }
}
```

Response cuando no existen plazas ocupadas:

```json
{
  "exito": true,
  "mensaje": "Validación realizada correctamente.",
  "respuesta": {
    "puedeIniciarProceso": true,
    "existenPlazasOcupadas": false,
    "totalPlazasOcupadas": 0
  }
}
```

Regla:

- Si `existenPlazasOcupadas = true`, el frontend no debe permitir iniciar el proceso desde el boton.
- La validacion considera plazas activas de la convocatoria con estatus `Ocupada` (`ID_ESTATUS_PLAZA = 2`).

## Codigos HTTP

| Codigo | Descripcion |
| --- | --- |
| `200 OK` | Operacion realizada correctamente. |
| `400 Bad Request` | Solicitud invalida o campos obligatorios faltantes. |
| `401 Unauthorized` | Token ausente, expirado o invalido. |
| `403 Forbidden` | Solicitud sin autenticacion efectiva. |
| `500 Internal Server Error` | Error no controlado, recurso no encontrado manejado como excepcion o error de base de datos. |

## Archivos Implementados

- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/controllers/AdministracionPlazaController.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/controllers/CargaLayoutPlazaController.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/AdministracionPlazasService.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/CargaLayoutPlazaService.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/ControlCargaPlazaService.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/Impl/AdministracionPlazasServiceImpl.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/Impl/CargaLayoutPlazaServiceImpl.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/Impl/ControlCargaPlazaServiceImpl.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/services/Impl/PlazaExcelUtilServiceImpl.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/request/PlazaRequest.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/request/PlazasFiltroRequest.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/request/ActualizarEstatusPlazaRequest.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/response/ControlCargaPlazaDTO.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/response/DetallePlazaDTO.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/response/PlazaValidacionResponse.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/models/entities/PlazaLayout.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/mappers/ControlCargaPlazaMapper.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/repository/PlazaLayoutRepository.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/repository/ControlCargaPlazaRepository.java`
- `mscme-admon-plazas/src/main/java/mx/gob/imss/mscme/admonplazas/repository/specification/PlazaLayoutSpecification.java`
