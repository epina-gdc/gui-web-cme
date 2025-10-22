import {TipoDropdown} from '@models/tipo-dropdown.interface';

export const DEPENDIENTES = [
  { name: 'Padres', key: 'A' },
  { name: 'Hijos', key: 'M' },
  { name: 'Cónyuge', key: 'P' },
  { name: 'Otros', key: 'R' }
]

export const BOOLEAN_OPCIONES = [
  { name: 'Sí', key: '1' },
  { name: 'No', key: '0' }
]

export const INSTITUCIONES = [
  { name: 'Pública', key: '1' },
  { name: 'Privada', key: '0' }
]

export const CME_TOKEN: string = "access_token";

export const DIAS: TipoDropdown[] = [
  { label: 'Lunes', value: 0 },
  { label: 'Martes', value: 1 },
  { label: 'Miercoles', value: 2 },
  { label: 'Jueves', value: 3 },
  { label: 'Viernes', value: 4 },
  { label: 'Sabado', value: 5 },
  { label: 'Domingo', value: 6 }
];
