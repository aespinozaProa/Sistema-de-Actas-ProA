# Sistema de Actas · ProA

PWA para registrar y consultar actas estudiantiles y reuniones docentes. La interfaz se publica con GitHub Pages; el acceso y los datos quedan detrás de un Cloudflare Worker que usa Google Sheets.

## Desarrollo

La interfaz no necesita compilación. En Windows, abrí `Abrir vista local.bat` para iniciar la versión conectada en `http://localhost:4173/`. La ruta `?demo=1` muestra datos ficticios temporales y no guarda en la planilla. El identificador público de Google y la dirección del servicio se configuran en `assets/config.js`; nunca se colocan claves en ese archivo.

El Worker se configura y despliega desde `worker/`; consultá [Configuración](docs/CONFIGURACION.md). Instalá sus dependencias con `npm ci --prefix worker` y ejecutá `npm test` y `npm run check` desde la raíz.

Las actas son información sensible. No incluyas claves, datos reales de estudiantes ni exportaciones de la planilla en este repositorio.
