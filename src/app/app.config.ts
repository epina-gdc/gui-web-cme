import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import Aura from '@primeng/themes/aura';
import {es} from "primelocale/es.json"
import {routes} from './app.routes';
import {providePrimeNG} from 'primeng/config';
import {provideHttpClient} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {Mensajes} from '@utils/mensajes';

export const appConfig: ApplicationConfig = {
  providers: [Mensajes,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG(
      {
        theme: {
          preset: Aura, options: {
            darkModeSelector: 'none',
            cssLayer: {
              name: 'primeng-base',
              order: 'framework, primeng-base, app-components, app-overrides'
            }
          }
        }, translation: es,
      }
    ),
    provideAnimations(),
  ]
};
