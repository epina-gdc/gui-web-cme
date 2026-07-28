import {ConvocatoriaActiva} from '@models/convocatoria.interface';

export const TITULO_CONVOCATORIA_DEFAULT = 'Convocatoria para M\u00e9dicos Especialistas';

export interface EncabezadoConvocatoriaActiva {
  titulo: string;
  subtitulo: string;
  registroActivo: boolean;
}

export function construirEncabezadoConvocatoriaActiva(convocatoria?: ConvocatoriaActiva | null): EncabezadoConvocatoriaActiva {
  if (!convocatoria) {
    return {
      titulo: TITULO_CONVOCATORIA_DEFAULT,
      subtitulo: '',
      registroActivo: false,
    };
  }

  return {
    titulo: convocatoria.desConvocatoria || TITULO_CONVOCATORIA_DEFAULT,
    subtitulo: construirSubtituloConvocatoriaActiva(convocatoria),
    registroActivo: convocatoria.registroActivo === true,
  };
}

export function construirSubtituloConvocatoriaActiva(convocatoria: ConvocatoriaActiva): string {
  const anioInicio = obtenerAnio(convocatoria.stpFechaInicioRegistro);
  const anioFin = obtenerAnio(convocatoria.stpFechaFinRegistro);

  if (!anioInicio && !anioFin) {
    return '';
  }

  if (!anioInicio || !anioFin || anioInicio === anioFin) {
    return `Reclutamiento IMSS ${anioInicio ?? anioFin}`;
  }

  return `Reclutamiento IMSS ${anioInicio}-${anioFin}`;
}

function obtenerAnio(fecha?: string | null): number | null {
  if (!fecha) {
    return null;
  }

  const anio = fecha.match(/^(\d{4})/)?.[1];
  if (anio) {
    return Number(anio);
  }

  const fechaParseada = new Date(fecha);
  return Number.isNaN(fechaParseada.getTime()) ? null : fechaParseada.getFullYear();
}
