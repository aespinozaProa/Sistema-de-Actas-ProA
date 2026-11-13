# Configuración del sistema de actas

La planilla «Sistema de actas ProA» conserva los registros y sus revisiones en `Actas`. Las hojas `Actas estudiantiles` y `Reuniones docentes` son vistas automáticas filtradas; se actualizan desde `Actas` y no se editan directamente. Cada modificación agrega una revisión; no se borran versiones anteriores. La planilla original no fue modificada para esta migración.

## Estado de la conexión

La prueba local en `http://localhost:4173/` está conectada al Worker de prueba y a la hoja única. Se verificó el ingreso institucional y el guardado y lectura de un acta estudiantil ficticia, luego eliminada. La vista `?demo=1` es temporal y no guarda en Sheets. Antes de la publicación institucional faltan las pruebas completas y la configuración de la dirección definitiva de GitHub Pages.

El servicio independiente de Apps Script necesita `SPREADSHEET_ID` con el ID de la nueva planilla y un `BRIDGE_SECRET` aleatorio de al menos 32 caracteres. Su código está en `google-apps-script/Code.gs`. Configurá el Worker con `SPREADSHEET_ID`, `APPS_SCRIPT_URL` y `APPS_SCRIPT_SECRET`; mantené el secreto fuera del repositorio. El componente `RECORD_WRITER` coordina ediciones concurrentes.

## Acceso y privacidad

El ingreso requiere una cuenta Google verificada de `@escuelasproa.edu.ar`. Configurá `GOOGLE_CLIENT_ID` en el Worker y `PROA_GOOGLE_CLIENT_ID` en la página con el ID del cliente creado en el proyecto institucional. El servidor verifica firma, audiencia, vencimiento y dominio de Google. Las cuentas de `ADMIN_EMAILS` son administradoras; otras cuentas institucionales son autoras. La gestión individual de accesos no está habilitada. Se comprobó el ingreso con una cuenta institucional; todavía se requiere completar las demás pruebas antes de usar datos reales.

La nueva planilla permanece privada hasta que su propietaria cambie la configuración de compartir. Un botón que abre el enlace no concede por sí mismo permisos de edición. La opción «cualquier persona con el enlace» permitiría que cualquier destinatario o tercero que obtenga el enlace consulte y modifique las actas.

## Respaldo

La persona responsable debe respaldar periódicamente la planilla y comprobar que puede restaurarla. Si la cuenta personal que administra Apps Script pierde acceso a la planilla o revoca los permisos, el sistema deja de funcionar. Las cuotas y servicios gratuitos pueden cambiar.
