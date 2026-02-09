export interface SesionUser {
  idPerfil: number;
  idUsuario: number;
  nomApellidoMaterno: string;
  nomApellidoPaterno: string;
  nomNombre: string;
  perfil: string;
  idSubperfil: number;
  refCurp: string;
  refEmail: string;
  sub: string;
  cveMatricula?: string;
  refFolio: string;
  subperfil: string;
  fechaRegistro: string;
  refPasaporte?: string;
  menu: 0 | 1;
  modulos: ModuloUser[],
  url: string
}


export interface ModuloUser {
  idModuloMenu: number,
  nombre: string,
  ruta: string,
  icono: null,
  submodulos: SubModuloUser[]
}


export interface SubModuloUser {
  idModuloMenu: number,
  nombre: string,
  ruta: string,
  icono: null | string,
  submodulos: SubModuloUser[]
}
