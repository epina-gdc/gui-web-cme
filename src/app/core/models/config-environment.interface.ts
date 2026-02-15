export interface ConfigEnvironment {
  production: boolean;
  api: {
    login: string;
    apiCatalogos:string;
    apiRegistro:string;
    apiConvocatoria:string;
    apiDocumentos:string;
    apiAsignacionMesa:string;
    apiCalificaciones: string;
    apiAsistencia: string;
    apiAsignacionPlaza:string;
    apiSindical: string;
    apiAsignacionMonitoreo: string;
  }
}
