# Repository Guidelines

## Estructura del proyecto y módulos

Este repositorio contiene una aplicación Angular 19 llamada `gui-web-cme`. El código fuente vive en `src/`. Las rutas principales cargan módulos diferidos desde `src/app/pages/publico` y `src/app/pages/privado`; conserva esa separación entre flujos públicos y autenticados. Los elementos reutilizables están en `src/app/components`, y la capa compartida de dominio se organiza en `src/app/core` (`services`, `models`, `guards`, `interceptors`, `validators`, `directives`, `pipes`, `utils`). Los estilos globales parten de `src/styles.scss`; los tokens y ajustes de UI están en `src/assets/scss/design-system` y `src/assets/scss/primeng-custom`. Los assets publicados por Angular se toman desde `public/`; `src/assets/` contiene recursos usados por el código fuente.

## Comandos de desarrollo, compilación y pruebas

- `npm install`: instala dependencias bloqueadas por `package-lock.json`.
- `npm start`: ejecuta `ng serve` en modo desarrollo, normalmente en `http://localhost:4200/`.
- `npm run build`: genera el build de producción en `dist/gui-web-cme`.
- `npm run watch`: compila con `--watch` usando configuración `development`.
- `npm test`: ejecuta pruebas unitarias con Karma y Jasmine.

## Estilo de código y nomenclatura

Usa TypeScript estricto (`strict`, `strictTemplates`, `noImplicitReturns`) y evita relajar tipos sin justificación. `.editorconfig` define UTF-8, espacios de 2 caracteres, salto final de línea y comillas simples en TypeScript. Mantén los archivos Angular en tríos `*.component.ts`, `*.component.html`, `*.component.scss`. Nombra carpetas y selectores en kebab-case (`registro-medico`) y clases/interfaces en PascalCase. Prefiere aliases configurados en `tsconfig.json`, por ejemplo `@services/*`, `@models/*`, `@guards/*`, `@components/*`, en lugar de imports relativos profundos.

## Directrices para pruebas

Las pruebas unitarias usan Jasmine/Karma y se colocan junto al archivo probado como `*.spec.ts`; ya existen ejemplos en `src/app/app.component.spec.ts` y componentes de páginas. Agrega o actualiza pruebas para lógica de formularios, validadores, guards, servicios y componentes con comportamiento condicional. Antes de abrir un PR, ejecuta `npm test`; para cambios de integración o rutas, ejecuta también `npm run build`.

## Commits y pull requests

El historial usa mensajes breves en español, por ejemplo `Creación de cuenta` o `Fix - Validación anterior basada en IDs.`. Mantén commits pequeños, con verbo o alcance claro. En PRs incluye resumen funcional, pantallas o GIFs para cambios visuales, pasos de prueba ejecutados y el issue/ticket relacionado. Señala cambios en `environment`, interceptores, guards o Docker/nginx porque afectan despliegue y seguridad.
