import { DropMotivo } from '@models/datosAsignacion';
import {TipoDropdown} from '@models/tipo-dropdown.interface';

export function mapearArregloTipoDropdown(arr: any[] = [], label: string = '', value: string = ''): TipoDropdown[] {
  return arr.map(obj => ({
    label: obj[label],
    value: obj[value]
  }));
}

export function mapearArregloMotivos(arr: any[] = [], label: string = '', value: string = ''): DropMotivo[] {
  return arr.map(obj => ({
    desMotivo: obj[label],
    idMotivoRechazo: obj[value]
  }));
}
