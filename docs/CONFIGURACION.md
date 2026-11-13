# Configuración del sistema de actas

La planilla «Sistema de actas ProA» conserva los registros, sus revisiones y los ingresos en `Actas`. Las hojas `Actas estudiantiles`, `Reuniones docentes` e `Ingresos al sistema` son vistas automáticas filtradas; se actualizan desde `Actas` y no se editan directamente. Cada modificación agrega una revisión; no se borran versiones anteriores. La planilla original no fue modificada para esta migración.

La sesión institucional dura hasta 24 horas en el mismo navegador. «Cerrar sesión» la elimina de ese dispositivo; se recomienda hacerlo en equipos compartidos. Cada inicio con Google registra nombre, correo y fecha en la planilla. Recuperar una sesión existente al recargar no genera otro ingreso. Si se cambia el secreto del puente, las sesiones existentes dejan de ser válidas.

## Estado de la conexión

La prueba local en `http://localhost:4173/` está conectada al Worker de prueba y a la hoja única. Se verificó el ingreso institucional y el guardado y lectura de un acta estudiantil ficticia, luego eliminada. La vista `?demo=1` es temporal y no guarda en Sheets. Antes de la publicación institucional faltan las pruebas completas y la configuración de la dirección definitiva de GitHub Pages.

El servicio independiente de Apps Script necesita `SPREADSHEET_ID` con el ID de la nueva planilla y un `BRIDGE_SECRET` aleatorio de al menos 32 caracteres. Su código está en `google-apps-script/Code.gs`. Configurá el Worker con `SPREADSHEET_ID`, `APPS_SCRIPT_URL` y `APPS_SCRIPT_SECRET`; mantené el secreto fuera del repositorio. El componente `RECORD_WRITER` coordina ediciones concurrentes.

## Acceso y privacidad

El ingreso requiere una cuenta Google verificada de `@escuelasproa.edu.ar`. Configurá `GOOGLE_CLIENT_ID` en el Worker y `PROA_GOOGLE_CLIENT_ID` en la página con el ID del cliente creado en el proyecto institucional. El servidor verifica firma, audiencia, vencimiento y dominio de Google. Las cuentas de `ADMIN_EMAILS` son administradoras iniciales; desde Ajustes pueden asignar o quitar el rol a quienes hayan iniciado sesión. Los cambios de rol se guardan en el Durable Object `proa-roles-v1` y prevalecen sobre la lista inicial; debe permanecer al menos una persona administradora. Los roles de la aplicación no transfieren la propiedad de la planilla ni las cuentas de GitHub o Cloudflare.

La nueva planilla permanece privada hasta que su propietaria cambie la configuración de compartir. Un botón que abre el enlace no concede por sí mismo permisos de edición. La opción «cualquier persona con el enlace» permitiría que cualquier destinatario o tercero que obtenga el enlace consulte y modifique las actas.

## Respaldo

La persona responsable debe respaldar periódicamente la planilla y comprobar que puede restaurarla. Si la cuenta personal que administra Apps Script pierde acceso a la planilla o revoca los permisos, el sistema deja de funcionar. Las cuotas y servicios gratuitos pueden cambiar.
