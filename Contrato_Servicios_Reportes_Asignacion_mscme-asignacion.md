# Contrato de Servicios - Reportes de Asignacion HU50-HU55

Microservicio: `mscme-asignacion`

Context path: `/mscme-asignacion`

Base path: `/v1/reportes-asignacion`

Fuente funcional: `Contexto/backlog/SGMP_POP_PlaneacionAgil_Fase3.xlsx`, filas HU050-HU055.

Formato validado por backlog: Excel, no PDF.

## Reglas Tecnicas

- Consultas implementadas con Spring Data JPA y JPQL.
- Respuestas basadas en interface projections.
- Sin JDBC.
- Sin DTOs intermedios para mapear reportes.
- Joins JPQL escritos en una sola linea por join.
- `IND_ACTIVO` se aplica en tablas transaccionales `CMET_*`.
- Los filtros de fecha `fechaInicio` y `fechaFin` son obligatorios.
- Fechas en formato `YYYY-MM-DD`.

## 1. Listado De Asignaciones

```http
GET /mscme-asignacion/v1/reportes-asignacion/listado
```

Consulta paginada para la tabla de busqueda de HU52/HU54.

### Query Params

| Parametro | Tipo | Requerido | Descripcion |
|---|---|---:|---|
| `fechaInicio` | `date` | Si | Fecha inicial de asignacion. |
| `fechaFin` | `date` | Si | Fecha final de asignacion. |
| `idConvocatoria` | `number` | No | Convocatoria. |
| `cveOoad` | `string` | No | OOAD asignada. |
| `cveZona` | `string` | No | Zona asignada. |
| `idTipoAsignacion` | `number` | No | Tipo de asignacion. |
| `cveEspecialidad` | `string` | No | Especialidad. |
| `numPlaza` | `number` | No | Numero de plaza. |
| `matriculaFolio` | `string` | No | Matricula o folio del medico. |
| `page` | `number` | No | Pagina, base cero. |
| `size` | `number` | No | Registros por pagina. |

### Response

```json
{
  "exito": true,
  "mensaje": "Exito",
  "respuesta": {
    "content": [
      {
        "noOoad": "14",
        "ooad": "JALISCO",
        "claveZona": "10",
        "zona": "Zona Norte",
        "tipoAsignacion": "PLAZA ORDINARIA",
        "estatus": "Activo",
        "ooadResidencia": "JALISCO",
        "matriculaFolio": "25D0100031",
        "nombres": "NOMBRE APELLIDO PATERNO APELLIDO MATERNO"
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "size": 10,
    "number": 0
  }
}
```

## 2. Exportar Reporte General Excel

```http
GET /mscme-asignacion/v1/reportes-asignacion/general/excel
```

Genera el Excel general de HU52, agrupado por especialidad.

### Columnas

- Especialidad.
- Plazas Ordinarias.
- Plazas IMSS-Bienestar.
- Sustitucion 08.
- Cambio de Rama.
- Total de asignaciones.
- Renglon final `TOTAL` con suma global.

### Headers

```http
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="reporte-asignaciones-general.xlsx"
```

## 3. Exportar Reporte Detalle Excel

```http
GET /mscme-asignacion/v1/reportes-asignacion/detalle/excel
```

Genera el Excel detallado de HU53/HU54.

### Columnas

- No. OOAD.
- Organo de Operacion Administrativa Desconcentrada.
- Clave Zona.
- Zona.
- Tipo de Asignacion.
- Estatus.
- Matricula/Folio.
- Nombre(s).
- Primer Apellido.
- Segundo Apellido.
- NSS.
- CURP.
- RFC.
- Clave categoria.
- Categoria.
- Clave Especialidad.
- Especialidad.
- Plaza asignada.
- Clave Adscripcion.
- Adscripcion.
- Clave Unidad.
- Unidad.
- Nivel de atencion.
- Tipo de plaza descripcion.
- Tipo Unidad.
- Marca de ocupacion descripcion.
- Horario descripcion.
- No Propuesta Sindical.
- Motivo de rechazo.

### Headers

```http
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="reporte-asignaciones-detalle.xlsx"
```

## Notas De Implementacion

- El listado usa `ReporteAsignacionListadoProjection`.
- El Excel general usa `ReporteAsignacionGeneralProjection`.
- El Excel detalle usa `ReporteAsignacionDetalleProjection`.
- `CMET_PROPUESTA_SINDICAL` se mapea con entidad minima `PropuestaSindical` para poder consultar `No Propuesta Sindical` via JPQL.
- Para `OOAD Residencia`, la implementacion usa la OOAD de la plaza cuando el perfil del medico es interno (`IND_PERFIL_INTERNO = 1`).
