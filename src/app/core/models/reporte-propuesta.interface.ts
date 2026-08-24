export interface ReportePropuestaInterface {
  idAsig: number | null;
  idPropuestaSindical: number | null;
  matriculaFolio: string | null;
  plaza: number | null;
  folioPropuestaSindical: string | null;
  nombres: string | null;
  primerApellido: string | null;
  segundoApellido: string | null;
  fechaNacimiento: string | null;
  edad: number | null;
  curp: string | null;
  rfc: string | null;
  ooadAsignada: string | null;
  zona: string | null;
  categoria: string | null;
  especialidad: string | null;
  modalidad: string | null;
  folioRegistro: string | null;
  nacionalidad: string | null;
  seccionSindical: string | null;
  regimen: string | null;
  entidad: string | null;
  alcaldiaMunicipio: string | null;
  colonia: string | null;
  codigoPostal: null,
  calle: string | null;
  numeroExterior: string | null;
  telefono: string | null;
  celular: string | null;
  usuarioMesaPropuesta: string | null;
  fechaPropuestaSindical: string | null;
  estatusPropuesta: string | null;
  tipoAsignacion: string | null;
  fechaPropuesta: string | null;
}

export interface PaginadoReporteFiltros {
  contenido: ReportePropuestaInterface[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
}





