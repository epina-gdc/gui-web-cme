# Contrato de Servicios - Catalogos de Plaza

Microservicio: `mscme-catalogos`

Context path: `/mscme-catalogos`

Base URL local/configurada: `/mscme-catalogos/api/v1/catalogos/plazas`

Formato de respuesta comun:

```json
{
  "exito": true,
  "mensaje": "Mensaje descriptivo.",
  "respuesta": []
}
```

Notas generales:

- Todos los servicios son de consulta.
- Todos los servicios usan metodo `GET`.
- No requieren body ni parametros.
- La respuesta solo incluye registros activos (`IND_ACTIVO = 1`).
- No se exponen identificadores internos, `indActivo` ni campos de auditoria.
- Cada catalogo conserva los nombres de variables propios (`cve*` y `desc*`).
- En caso de no existir registros activos, `respuesta` se retorna como arreglo vacio.

## 1. Clasificaciones de Unidad de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/clasificaciones-unidad`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Clasificaciones de unidad de plaza obtenidas exitosamente.",
  "respuesta": [
    {
      "cveClasificacionUnidad": "1",
      "descClasificacionUnidad": "ORDINARIA"
    }
  ]
}
```

## 2. Unidades de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/unidades`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Unidades de plaza obtenidas exitosamente.",
  "respuesta": [
    {
      "cveUnidad": "03HD010000",
      "descUnidad": "HOSPITAL GENERAL"
    }
  ]
}
```

## 3. Adscripciones de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/adscripciones`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Adscripciones de plaza obtenidas exitosamente.",
  "respuesta": [
    {
      "cveAdscripcion": "0001",
      "descAdscripcion": "CONSULTA EXTERNA"
    }
  ]
}
```

## 4. Puestos de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/puestos`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Puestos de plaza obtenidos exitosamente.",
  "respuesta": [
    {
      "cvePuesto": "1252",
      "descPuesto": "MEDICO"
    }
  ]
}
```

## 5. Categorias de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/categorias`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Categorias de plaza obtenidas exitosamente.",
  "respuesta": [
    {
      "cveCategoria": "MEDFAM",
      "descCategoria": "MEDICINA FAMILIAR"
    }
  ]
}
```

## 6. Turnos de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/turnos`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Turnos de plaza obtenidos exitosamente.",
  "respuesta": [
    {
      "cveTurno": 1,
      "descTurno": "MATUTINO"
    }
  ]
}
```

## 7. Horarios de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/horarios`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Horarios de plaza obtenidos exitosamente.",
  "respuesta": [
    {
      "cveHorario": "08:00-16:00",
      "descHorario": "08:00 A 16:00"
    }
  ]
}
```

## 8. Tipos de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/tipos-plaza`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Tipos de plaza obtenidos exitosamente.",
  "respuesta": [
    {
      "cveTipoPlaza": "OP",
      "descTipoPlaza": "OPERATIVA"
    }
  ]
}
```

## 9. Marcas de Ocupacion de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/marcas-ocupacion`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Marcas de ocupacion de plaza obtenidas exitosamente.",
  "respuesta": [
    {
      "cveMarcaOcupacion": 1,
      "descMarcaOcupacion": "DEFINITIVA"
    }
  ]
}
```

## 10. Tipos de Unidad de Plaza

URL:

`GET /mscme-catalogos/api/v1/catalogos/plazas/tipos-unidad`

Request:

No aplica.

Response:

```json
{
  "exito": true,
  "mensaje": "Tipos de unidad de plaza obtenidos exitosamente.",
  "respuesta": [
    {
      "cveTipoUnidad": "ORD",
      "descTipoUnidad": "ORDINARIA"
    }
  ]
}
```

## Codigos HTTP

| Codigo                      | Descripcion                                                       |
| --------------------------- | ----------------------------------------------------------------- |
| `200 OK`                    | Consulta realizada correctamente.                                 |
| `500 Internal Server Error` | Error no controlado del servidor o de conexion con base de datos. |

## Archivos Implementados

- `mscme-catalogos/src/main/java/imss/mscme/catalogos/controllers/CatalogosPlazaController.java`
- `mscme-catalogos/src/main/java/imss/mscme/catalogos/services/CatalogosPlazaService.java`
- `mscme-catalogos/src/main/java/imss/mscme/catalogos/models/Mappers/CatalogosPlazaMapper.java`
- `mscme-catalogos/src/main/java/imss/mscme/catalogos/models/Dtos/*PlazaDto.java`
