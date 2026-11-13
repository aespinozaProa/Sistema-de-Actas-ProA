# Puente opcional de Google Sheets

Este puente está preparado para pruebas y todavía no está desplegado. Permite que un Worker autorizado acceda a la hoja Actas sin crear una cuenta de servicio. El proyecto debe ser **independiente**, creado en la cuenta que lo ejecutará: no lo vincules a la planilla, porque quienes pueden editarla también podrían editar un script vinculado.

1. Creá un proyecto independiente en Apps Script y copiá el contenido de `Code.gs`.
2. En las propiedades del proyecto configurá `SPREADSHEET_ID` con el identificador de la planilla y `BRIDGE_SECRET` con un secreto aleatorio de al menos 32 caracteres. No compartas el secreto ni lo subas a GitHub.
3. Implementalo como aplicación web que se ejecute como la cuenta que lo despliega. El servicio debe poder ser invocado por el Worker; solo acepta operaciones cuando se suministra el secreto.
4. Configurá en el Worker los secretos `APPS_SCRIPT_URL` y `APPS_SCRIPT_SECRET`, con la dirección de implementación y el mismo secreto, respectivamente. Si están configurados se usa el puente en vez de la cuenta de servicio de Sheets.

La cuenta que despliega necesita acceso continuo a la planilla. Si deja de tenerlo o revoca la autorización, el sistema dejará de guardar. El secreto permite leer y agregar filas: restringí el acceso al proyecto y a Cloudflare. La autorización por correo, el despliegue y las pruebas reales siguen pendientes; no usar con datos reales hasta verificarlos.
