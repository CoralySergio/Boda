/*
 * ═══════════════════════════════════════════════════════════════
 * GOOGLE APPS SCRIPT — Recibir respuestas RSVP de la boda
 * ═══════════════════════════════════════════════════════════════
 *
 * INSTRUCCIONES:
 * 1. Ve a https://sheets.google.com y crea una hoja nueva llamada "Boda Coral & Sergio"
 * 2. En la fila 1, pon estos encabezados (cada uno en una columna):
 *      A1: Timestamp
 *      B1: Nombre
 *      C1: Asiste
 *      D1: Acompañantes
 *      E1: Alergias
 *      F1: Info Extra
 *      G1: Canciones
 *
 * 3. Ve a Extensiones > Apps Script
 * 4. Borra todo el código que aparezca y pega TODO este archivo
 * 5. Haz clic en "Implementar" > "Nueva implementación"
 * 6. Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo" (tu cuenta)
 *    - Quién tiene acceso: "Cualquier persona"
 * 7. Haz clic en "Implementar" y copia la URL que te da
 * 8. Pega esa URL en script.js donde dice YOUR_RSVP_SCRIPT_URL
 *
 * ¡Listo! Cada vez que un invitado envíe el formulario,
 * aparecerá una fila nueva en tu hoja de cálculo.
 * ═══════════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    // Abrir la hoja de cálculo activa (la que contiene este script)
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    var data;

    // Intentar leer como formulario URL-encoded (application/x-www-form-urlencoded)
    if (e.parameter && e.parameter.nombre) {
      data = e.parameter;
    }
    // Si no, intentar parsear como JSON
    else if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    else {
      data = {};
    }

    // Escribir una fila nueva con los datos
    sheet.appendRow([
      data.timestamp   || new Date().toISOString(),
      data.nombre      || '',
      data.asiste      || '',
      data.acompanantes|| '',
      data.alergias    || '',
      data.info_extra  || '',
      data.canciones   || ''
    ]);

    // Respuesta exitosa
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Respuesta de error
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Necesario para que Google permita las peticiones desde el navegador (CORS)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ result: 'ok', message: 'El servicio está activo' }))
    .setMimeType(ContentService.MimeType.JSON);
}
