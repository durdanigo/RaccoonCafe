# Raccoon Café — Sitio público (Frontend)

Frontend del cliente de **Raccoon Café**, un café-librería que combina alquiler de salas modulares, cafetería de especialidad y librería mixta.

Sitio estático construido con **HTML5 + Tailwind CSS + JavaScript modular**, que consume por `fetch` la API REST del proyecto. No requiere Node, ni build, ni instalación de dependencias: se publica tal cual en GitHub Pages.

> La API vive en un repositorio aparte (Node.js + Express + MongoDB Atlas, desplegada en Render).

---

## Arquitectura

```
┌──────────────────────┐      HTTPS      ┌──────────────────────┐    mongodb+srv    ┌──────────────────┐
│  Este repositorio    │ ──────────────► │  API REST            │ ────────────────► │  MongoDB Atlas   │
│  HTML5 + Tailwind    │  fetch / JSON   │  (repositorio aparte)│     Mongoose      │  (M0 Free Tier)  │
│  JavaScript modular  │ ◄────────────── │  Render              │ ◄──────────────── │                  │
│  GitHub Pages        │                 └──────────────────────┘                   └──────────────────┘
└──────────────────────┘
```

---

## Estructura

```
raccoon-cafe-frontend/
├── css/
│   └── styles.css     # Complementos de Tailwind: foco, scroll, movimiento reducido
├── js/
│   └── main.js        # API_URL dinámica, fetch, render y formulario
└── index.html         # Header, hero, salas, cafetería, librería, contacto, footer
```

> Si el repositorio ya tiene otro contenido y prefieres aislar el sitio, mete estos tres archivos en una carpeta `docs/` y configura GitHub Pages para servir desde `/docs` (ver *Publicación*).

---

## Secciones de la página

| Sección | Contenido |
|---|---|
| **Header / Navbar** | Logo, enlaces de navegación, menú hamburguesa en móvil e indicador de conexión con la API. |
| **Hero** | Propuesta de valor y tarjeta resumen de las tres líneas de negocio. |
| **Salas** | Tarjetas de las 6 salas: tipo, descripción, chips de equipamiento, aforo, precio por hora y badge de disponibilidad. |
| **Cafetería** | Menú con nombre, descripción y precio. |
| **Librería** | Tarjetas diferenciadas visualmente por badge: *Venta · Nuevo*, *Venta · Segunda mano* (con su condición) y *Solo lectura en el local* (con su estante). |
| **Contacto** | Formulario con validación en el cliente que envía a `POST /api/contact`. |
| **Footer** | Créditos y stack de despliegue. |

---

## Configuración: apuntar a tu API

Lo **único** que hay que configurar está en las primeras líneas de `js/main.js`:

```javascript
const API_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://tu-backend-en-render.onrender.com/api';
```

Reemplaza `tu-backend-en-render` por el nombre real de tu servicio en Render. Así:

- Abierto en **localhost** → consume la API local del puerto 5000.
- Abierto en **GitHub Pages** → consume la API de Render.

No hay que tocar nada más ni mantener dos versiones del archivo.

---

## Ejecución local

El sitio es estático, así que sirve con cualquier servidor. **No lo abras con doble clic** (`file://`): el navegador bloquea los módulos ES y las peticiones `fetch` desde ese protocolo.

```bash
npx serve . -l 5500
```

O con la extensión **Live Server** de VS Code, que usa el puerto 5500 por defecto — el mismo que la API ya trae en su lista blanca de CORS.

Abre `http://localhost:5500`.

### Indicador de conexión

El punto del encabezado refleja el estado de `GET /api/health`:

| Color | Significado |
|---|---|
| 🟡 Ámbar (parpadeando) | Consultando la API. |
| 🟢 Verde | API conectada y base de datos operativa. |
| 🔴 Rojo | No se pudo contactar la API, o respondió sin conexión a la base. |

Si sale rojo, abre la consola del navegador (F12): `main.js` registra ahí la URL que está usando y el detalle del error.

---

## Publicación en GitHub Pages

1. **Settings → Pages**
2. **Source:** *Deploy from a branch*
3. **Branch:** `main` · **Folder:** `/ (root)` — o `/docs` si metiste los archivos en esa carpeta.
4. Guarda y espera uno o dos minutos.

Tu sitio queda en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

### Autorizar este origen en la API

El backend ya acepta cualquier subdominio `https://*.github.io`, así que normalmente no hay que hacer nada. Si quieres restringirlo a tu dominio exacto, pon en las variables de entorno de Render:

```
CLIENT_URL=https://<tu-usuario>.github.io
```

---

## Decisiones técnicas

**Tailwind por CDN, no por build.** El sitio se publica en GitHub Pages sin paso de compilación: no hay `node_modules`, ni `npm install`, ni CI. La paleta de marca se define en el bloque `tailwind.config` dentro del `<head>`:

| Token | Color | Uso |
|---|---|---|
| `carbon` | `#1F1A17` | Header, footer, sección de contacto |
| `moka` | `#6B4A32` | Fondo del hero |
| `crema` | `#F4EBE2` | Fondo general |
| `musgo` | `#4F6B4A` | Badge de libro nuevo |
| `cobre` | `#C97B4A` | Acento, botones, foco |

**Escape de HTML.** Todo dato que llega de la API pasa por `esc()` antes de insertarse en el DOM, de modo que un nombre de producto con `<script>` se renderiza como texto y no se ejecuta.

**Degradación elegante.** Si la API está caída o un endpoint todavía no existe, cada sección muestra un aviso con borde punteado en lugar de quedarse en "Cargando..." indefinidamente. `pedirApi()` aborta cualquier petición que pase de 20 segundos.

**Validación doble.** El formulario de contacto valida en el cliente (nombre ≥ 3 caracteres, correo con formato válido, mensaje ≥ 10 caracteres) para dar respuesta inmediata, pero el backend vuelve a validar: la validación del cliente es comodidad, no seguridad.

**Accesibilidad.** Etiquetas `<label>` asociadas a cada campo, `aria-live` en el indicador y en el mensaje del formulario, `aria-expanded` en el botón del menú, foco visible en todos los elementos interactivos y respeto por `prefers-reduced-motion`.

---

## Compatibilidad

Navegadores con soporte de módulos ES, `fetch` y `AbortController`: Chrome 66+, Firefox 60+, Safari 12.1+, Edge 79+.

---

## Hoja de ruta

| Versión | Alcance |
|---|---|
| **1.0** ✅ | Sitio público con catálogos, formulario de contacto e indicador de conexión. |
| 2.0 | Registro e inicio de sesión de clientes contra `/api/auth`. |
| 3.0 | Flujo de reserva: selección de sala, bloque horario, asistentes, switch de alimentos internos/externos y resumen de costos desglosado. |
| 4.0 | Área de cliente con el historial de reservas. |

---

## Autoría

Proyecto académico desarrollado por **Silvia Milena Pazmiño Montes** — Ingeniería en Computación, ESPOL (FIEC), Guayaquil, Ecuador.

Licencia MIT.
