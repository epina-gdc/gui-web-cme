import {CatPerfil, CatSubperfil} from '@models/catalogoGeneral';
import {ConvocatoriaActiva, ConvocatoriaPerfil, ConvocatoriaSubperfil} from '@models/convocatoria.interface';

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

export function perfilesConvocatoriaToCatalogo(perfiles: ConvocatoriaPerfil[] = []): CatPerfil[] {
  return perfiles.map(perfil => ({
    idPerfil: perfil.idPerfil,
    nomPerfil: perfil.nomPerfil ?? perfil.desPerfil ?? perfil.descripcion ?? perfil.clave ?? String(perfil.idPerfil),
    indActivo: perfil.indActivo ?? 1,
    indPerfilInterno: perfil.indPerfilInterno,
    desPerfil: perfil.desPerfil ?? perfil.descripcion ?? perfil.nomPerfil,
    clave: perfil.clave,
    descripcion: perfil.descripcion
  }));
}

export function subperfilesConvocatoriaToCatalogo(subperfiles: ConvocatoriaSubperfil[] = []): CatSubperfil[] {
  return subperfiles
    .filter(subperfil => subperfil.idPerfil !== null && subperfil.idPerfil !== undefined)
    .map(subperfil => ({
      idSubperfil: subperfil.idSubperfil,
      idPerfil: Number(subperfil.idPerfil),
      nomSubperfil: subperfil.nomSubperfil ?? subperfil.desSubperfil ?? subperfil.descripcion ?? subperfil.clave ?? String(subperfil.idSubperfil),
      indActivo: subperfil.indActivo ?? 1,
      desSubperfil: subperfil.desSubperfil ?? subperfil.descripcion ?? subperfil.nomSubperfil,
      clave: subperfil.clave,
      descripcion: subperfil.descripcion
    }));
}

export function filtrarSubperfilesPorPerfil(subperfiles: CatSubperfil[], idPerfil?: number | null): CatSubperfil[] {
  if (idPerfil === null || idPerfil === undefined) {
    return [];
  }

  return subperfiles.filter(subperfil => subperfil.idPerfil === Number(idPerfil));
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
