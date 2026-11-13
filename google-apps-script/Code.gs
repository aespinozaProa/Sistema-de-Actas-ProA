// Proyecto independiente: no vincularlo a una planilla compartida.
function doPost(e) {
  const reply = value => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
  try {
    const body = JSON.parse(e.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('BRIDGE_SECRET');
    const spreadsheetId = properties.getProperty('SPREADSHEET_ID');
    if (!secret || secret.length < 32 || !spreadsheetId || typeof body.secret !== 'string' || body.secret !== secret) return reply({ok:false});
    const permitted = {Actas:23};
    if (!Object.prototype.hasOwnProperty.call(permitted, body.sheet)) return reply({ok:false});
    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(body.sheet);
    if (!sheet) return reply({ok:false});
    if (body.action === 'read') {
      const rows = sheet.getLastRow();
      return reply({ok:true, values:rows ? sheet.getRange(1, 1, rows, permitted[body.sheet]).getDisplayValues() : []});
    }
    if (body.action === 'append' && Array.isArray(body.values) && body.values.length === permitted[body.sheet] && body.values.every(value => typeof value === 'string' && value.length <= 5000)) {
      const lock = LockService.getScriptLock();
      lock.waitLock(10000);
      try {
        const row = sheet.getLastRow() + 1;
        // setValues interprets leading '=' as a formula even for untrusted text.
        const values = body.values.map(value => value.startsWith('=') ? "'" + value : value);
        sheet.getRange(row, 1, 1, values.length).setNumberFormat('@').setValues([values]);
        SpreadsheetApp.flush();
      } finally { lock.releaseLock(); }
      return reply({ok:true});
    }
    return reply({ok:false});
  } catch (_) { return reply({ok:false}); }
}
