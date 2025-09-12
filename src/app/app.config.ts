import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import Aura from '@primeng/themes/aura';
import {es} from "primelocale/es.json"
import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePrimeNG(
      {
        theme: {
          preset: Aura, options: {
            darkModeSelector: 'none',
            cssLayer: {
              name: 'primeng-base',
              order: 'primeng-base, app-components, app-overrides'
            }
          }
        }, translation: es,
      }
    ),
  ]
};
