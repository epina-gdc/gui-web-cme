export interface TipoAsignacionMonitoreo {
    idTipoAsignacion: number;
    tipoAsignacion: string;
    total: number;
}

export interface AsignacionesMonitoreoRespuesta {
    exito: boolean;
    mensaje: string;
    respuesta: TipoAsignacionMonitoreo[];
}
