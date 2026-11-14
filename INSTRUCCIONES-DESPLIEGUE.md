# Boda Coral & Sergio — Guía de Despliegue GRATUITO

Todo lo que necesitas para tener la invitación online **sin pagar nada**.

---

## RESUMEN: 2 cosas que hacer

| Paso | Qué    | Coste  | Para qué |
|------|--------|--------|----------|
| 1    | Google Sheets + Apps Script | Gratis | Guardar las respuestas de los invitados |
| 2    | GitHub Pages | Gratis | Alojar la web y tener un enlace que enviar |

---

## PASO 1 — Base de datos con Google Sheets (guardar respuestas)

### 1.1 Crear la hoja de cálculo

1. Ve a [Google Sheets](https://sheets.google.com) e inicia sesión con tu cuenta de Google.
2. Crea una hoja nueva: **"Boda Coral & Sergio"**.
3. En la **fila 1**, escribe estos encabezados (uno por columna):

   | A | B | C | D | E | F | G |
   |---|---|---|---|---|---|---|
   | Timestamp | Nombre | Asiste | Acompañantes | Alergias | Info Extra | Canciones |

### 1.2 Crear el script que recibe los datos

1. Con la hoja abierta, ve a **Extensiones → Apps Script**.
2. Se abre un editor de código. **Borra** todo lo que aparezca.
3. Abre el archivo `google-apps-script.gs` de este proyecto y **copia todo su contenido**.
4. Pégalo en el editor de Apps Script.
5. Haz clic en el icono de **guardar** (💾) o `Ctrl + S`.

### 1.3 Desplegar como aplicación web

1. Haz clic en **Implementar → Nueva implementación**.
2. Haz clic en el engranaje ⚙️ y selecciona **Aplicación web**.
3. Configura:
   - **Descripción**: "RSVP Boda"
   - **Ejecutar como**: "Yo" *(tu email)*
   - **Quién tiene acceso**: **Cualquier persona**
4. Haz clic en **Implementar**.
5. Google te pedirá permisos → haz clic en **Autorizar acceso** (tendrás que seleccionar tu cuenta y aceptar).
6. Te dará una **URL** larga tipo:  
   `https://script.google.com/macros/s/XXXXXXX/exec`
7. **Copia esa URL**.

### 1.4 Pegar la URL en el código

1. Abre `script.js` en tu editor.
2. Busca esta línea:
   ```
   rsvp: 'YOUR_RSVP_SCRIPT_URL',
   ```
3. Reemplaza `YOUR_RSVP_SCRIPT_URL` por la URL que copiaste. Ejemplo:
   ```
   rsvp: 'https://script.google.com/macros/s/XXXXXXXX/exec',
   ```
4. Guarda el archivo.

**¡Listo!** Ahora cada vez que un invitado rellene el formulario y pulse "Enviar todo", los datos aparecerán como una fila nueva en tu hoja de Google Sheets.

---

## PASO 2 — Alojar la web GRATIS con GitHub Pages

### 2.1 Crear cuenta de GitHub (si no tienes)

1. Ve a [github.com](https://github.com) y regístrate. Es **100% gratis**.

### 2.2 Crear un repositorio

1. Haz clic en **"+"** (arriba a la derecha) → **New repository**.
2. Ponle un nombre, por ejemplo: `boda-coral-sergio`.
3. Marca **Public** (necesario para GitHub Pages gratis).
4. Haz clic en **Create repository**.

### 2.3 Subir los archivos

**Opción A — Desde la web de GitHub (más fácil):**

1. En la página del repositorio, haz clic en **"uploading an existing file"** o en **Add file → Upload files**.
2. Arrastra TODOS los archivos de tu proyecto:
   - `index.html`
   - `styles.css`
   - `script.js`
   - La carpeta `assets/` con todas las imágenes
3. Haz clic en **Commit changes**.

**Opción B — Con Git desde terminal (si sabes usar Git):**

```bash
cd "c:\Users\jorge\Desktop\Proyectos\Boda-Cor_Ser"
git init
git add index.html styles.css script.js assets/
git commit -m "Invitación de boda"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/boda-coral-sergio.git
git push -u origin main
```

> **Nota**: NO subas el archivo `google-apps-script.gs` ni este README al repositorio. (Es solo para ti.)

### 2.4 Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (pestaña de arriba).
2. En el menú lateral izquierdo, baja hasta **Pages**.
3. En **Source**, selecciona **Deploy from a branch**.
4. En **Branch**, selecciona **main** y carpeta **/ (root)**.
5. Haz clic en **Save**.
6. Espera 1-2 minutos y recarga la página.

### 2.5 ¡Tu URL gratuita!

Tu web estará disponible en:

```
https://TU_USUARIO.github.io/boda-coral-sergio/
```

Esa es la URL que puedes **enviar por WhatsApp** a todos tus invitados.

---

## RESUMEN FINAL

| Elemento | Servicio | Coste | URL que obtienes |
|----------|----------|-------|------------------|
| Web de invitación | GitHub Pages | GRATIS | `https://tu-usuario.github.io/boda-coral-sergio/` |
| Base de datos (respuestas) | Google Sheets | GRATIS | Se guardan automáticamente en tu hoja de cálculo |

### Ventajas

- **0 € de coste** — no pagas hosting, dominio ni base de datos.
- **Google Sheets** te sirve como Excel — puedes ver, filtrar y descargar las respuestas.
- **GitHub Pages** soporta HTTPS, es rápido y fiable.
- Puedes actualizar la web subiendo archivos nuevos al repositorio.

### Si quieres un dominio personalizado (OPCIONAL, ~10 €/año)

Si prefieres un enlace tipo `www.bodacoralysergio.com` en lugar del de GitHub:
1. Compra un dominio en [Namecheap](https://namecheap.com), [Porkbun](https://porkbun.com) o similar (~10 €/año).
2. En la configuración DNS del dominio, crea un registro **CNAME** apuntando a `tu-usuario.github.io`.
3. En GitHub Pages → Settings → Pages, escribe tu dominio personalizado.

**Pero esto es totalmente opcional**. La URL de GitHub Pages funciona perfectamente gratis.
