export interface TabNode {
  especialidad: string,
  documentos: TabDocumento[]
}

export interface TabDocumento {
  tipoDocumento: string,
  especialidadMedica: string,
  cveEspecialidad: string,
  idDocumento: number,
  guid: string
}
