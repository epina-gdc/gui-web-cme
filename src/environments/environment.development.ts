import {ConfigEnvironment} from '@models/config-environment.interface';

const base: string = 'http://10.166.120:1052/';

export const environment: ConfigEnvironment = {
  production: false,
  api: {
    login: base + 'mscme-autenticacion/api/'
  }
}
