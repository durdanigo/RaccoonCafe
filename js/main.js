/**
 * ===============================================================
 * main.js - Logica del frontend publico de Raccoon Cafe
 * ---------------------------------------------------------------
 * Responsabilidades de la version 1.0:
 *   1. Resolver dinamicamente la URL de la API segun el entorno.
 *   2. Consultar GET /api/health y pintar el indicador de conexion.
 *   3. Renderizar salas, cafeteria y libreria cuando los endpoints
 *      correspondientes esten publicados (degradacion elegante
 *      mientras tanto).
 *   4. Validar y enviar el formulario de contacto.
 * ===============================================================
 */

// ---------------------------------------------------------------
// 1. Configuracion de la API
// ---------------------------------------------------------------
// En local apunta al servidor Express del puerto 5000; publicado en
// GitHub Pages apunta al Web Service de Render.
// >>> Reemplaza "tu-backend-en-render" por el nombre real del servicio.
const API_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://tu-backend-en-render.onrender.com/api';

console.log(`[Raccoon] API en uso: ${API_URL}`);

// ---------------------------------------------------------------
// 2. Utilidades
// ---------------------------------------------------------------

/**
 * Escapa texto antes de insertarlo en el DOM, para evitar inyeccion
 * de HTML desde los datos que devuelve la API.
 * @param {unknown} valor
 * @returns {string}
 */
function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (caracter) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[caracter]));
}

/**
 * Formatea un numero como precio en dolares.
 * @param {number} valor
 * @returns {string}
 */
function precio(valor) {
  return `$${Number(valor || 0).toFixed(2)}`;
}

/**
 * Envoltorio de fetch con timeout y manejo uniforme de errores.
 * @param {string} ruta ruta relativa, por ejemplo '/health'
 * @param {RequestInit} opciones
 * @returns {Promise<any>}
 */
async function pedirApi(ruta, opciones = {}) {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), 20000);

  try {
    const respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      signal: controlador.signal,
      ...opciones,
    });

    const cuerpo = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      const detalle = cuerpo?.mensaje || `El servidor respondio con el codigo ${respuesta.status}`;
      throw new Error(detalle);
    }

    return cuerpo;
  } finally {
    clearTimeout(temporizador);
  }
}

// ---------------------------------------------------------------
// 3. Indicador visual de conexion
// ---------------------------------------------------------------

/**
 * Pinta el estado de la conexion en la barra superior.
 * @param {'conectando'|'ok'|'error'} estado
 * @param {string} texto
 */
function pintarIndicador(estado, texto) {
  const punto = document.getElementById('indicador-punto');
  const etiqueta = document.getElementById('indicador-texto');
  const contenedor = document.getElementById('indicador-api');
  if (!punto || !etiqueta || !contenedor) return;

  const estilos = {
    conectando: { color: 'bg-amber-400', animacion: true },
    ok: { color: 'bg-emerald-400', animacion: false },
    error: { color: 'bg-red-500', animacion: false },
  };

  const estilo = estilos[estado] || estilos.error;

  punto.className = `h-2 w-2 rounded-full ${estilo.color}${estilo.animacion ? ' animate-pulse' : ''}`;
  etiqueta.textContent = texto;
  contenedor.title = texto;
}

/**
 * Consulta GET /api/health y actualiza el indicador.
 * @returns {Promise<boolean>} true si la API respondio correctamente
 */
async function comprobarSalud() {
  pintarIndicador('conectando', 'Conectando...');

  try {
    const datos = await pedirApi('/health');
    const conectada = datos?.ok === true;

    pintarIndicador(
      conectada ? 'ok' : 'error',
      conectada ? 'API conectada' : `Base de datos: ${esc(datos?.baseDatos || 'sin respuesta')}`
    );

    console.log('[Raccoon] Health check:', datos);
    return conectada;
  } catch (error) {
    pintarIndicador('error', 'API sin conexion');
    console.warn(`[Raccoon] No se pudo contactar la API: ${error.message}`);
    return false;
  }
}

// ---------------------------------------------------------------
// 4. Render de catalogos
// ---------------------------------------------------------------

/**
 * Mensaje mostrado cuando un endpoint todavia no esta publicado.
 * @param {string} texto
 * @returns {string} HTML
 */
function aviso(texto) {
  return `<p class="col-span-full rounded-lg border border-dashed border-carbon/20 px-4 py-6 text-center text-sm text-carbon/60">${esc(texto)}</p>`;
}

/**
 * Tarjeta de una sala.
 * @param {object} sala
 * @returns {string} HTML
 */
function tarjetaSala(sala) {
  const etiquetas = {
    cowork: 'Co-work',
    encuentro: 'Encuentro',
    taller: 'Taller',
    social: 'Social',
  };

  const equipamiento = (sala.equipamiento || [])
    .slice(0, 4)
    .map((item) => `<li class="rounded-full bg-carbon/5 px-3 py-1">${esc(item)}</li>`)
    .join('');

  const badge = sala.disponible
    ? '<span class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">Disponible</span>'
    : '<span class="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">No disponible</span>';

  return `
    <article class="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-carbon/5 transition hover:shadow-md">
      <div class="mb-3 flex items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wider text-cobre">${esc(etiquetas[sala.tipo] || sala.tipo)}</p>
          <h3 class="font-display text-xl">${esc(sala.nombre)}</h3>
        </div>
        ${badge}
      </div>

      <p class="mb-4 text-sm text-carbon/70">${esc(sala.descripcion)}</p>

      <ul class="mb-5 flex flex-wrap gap-2 text-xs text-carbon/70">${equipamiento}</ul>

      <div class="mt-auto flex items-end justify-between border-t border-carbon/10 pt-4">
        <p class="text-sm text-carbon/60">
          ${esc(sala.capacidadMinima)} &ndash; ${esc(sala.capacidadMaxima)} personas
        </p>
        <p class="font-display text-lg">${precio(sala.precioHora)}<span class="text-sm text-carbon/60"> / hora</span></p>
      </div>
    </article>`;
}

/**
 * Tarjeta compacta de un producto de cafeteria.
 * @param {object} producto
 * @returns {string} HTML
 */
function tarjetaCafeteria(producto) {
  return `
    <article class="flex items-start justify-between gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-carbon/5">
      <div>
        <h3 class="font-medium">${esc(producto.nombre)}</h3>
        <p class="mt-1 text-sm text-carbon/60">${esc(producto.descripcion)}</p>
      </div>
      <p class="shrink-0 font-display text-lg">${precio(producto.precio)}</p>
    </article>`;
}

/**
 * Tarjeta de un libro, diferenciada por subcategoria.
 * @param {object} libro
 * @returns {string} HTML
 */
function tarjetaLibro(libro) {
  const badges = {
    libro_nuevo: '<span class="rounded-full bg-musgo/15 px-3 py-1 text-xs font-medium text-musgo">Venta &middot; Nuevo</span>',
    libro_usado: '<span class="rounded-full bg-cobre/15 px-3 py-1 text-xs font-medium text-cobre">Venta &middot; Segunda mano</span>',
    lectura_interna: '<span class="rounded-full bg-carbon/10 px-3 py-1 text-xs font-medium text-carbon/70">Solo lectura en el local</span>',
  };

  const condiciones = { excelente: 'Excelente', bueno: 'Buen estado', aceptable: 'Aceptable' };

  const detalle =
    libro.subcategoria === 'lectura_interna'
      ? `Estante ${esc(libro.ubicacion)}`
      : libro.condicion
        ? `Condicion: ${esc(condiciones[libro.condicion] || libro.condicion)}`
        : `Stock: ${esc(libro.stock)}`;

  const valor =
    libro.subcategoria === 'lectura_interna'
      ? '<span class="text-sm text-carbon/60">No se vende</span>'
      : `<span class="font-display text-lg">${precio(libro.precio)}</span>`;

  return `
    <article class="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-carbon/5">
      <div class="mb-3">${badges[libro.subcategoria] || ''}</div>
      <h3 class="font-display text-lg leading-snug">${esc(libro.nombre)}</h3>
      <p class="mt-1 text-sm text-carbon/60">${esc(libro.autor)}</p>
      <div class="mt-auto flex items-end justify-between border-t border-carbon/10 pt-4">
        <p class="text-sm text-carbon/60">${detalle}</p>
        ${valor}
      </div>
    </article>`;
}

/**
 * Carga un catalogo y lo pinta en su contenedor.
 * @param {string} idContenedor
 * @param {string} ruta ruta de la API
 * @param {(item: object) => string} plantilla
 * @param {string} textoVacio
 */
async function cargarCatalogo(idContenedor, ruta, plantilla, textoVacio) {
  const contenedor = document.getElementById(idContenedor);
  if (!contenedor) return;

  try {
    const datos = await pedirApi(ruta);
    // Se aceptan dos formas de respuesta: un arreglo directo o { datos: [...] }
    const items = Array.isArray(datos) ? datos : datos?.datos || [];

    contenedor.innerHTML = items.length
      ? items.map(plantilla).join('')
      : aviso(textoVacio);
  } catch (error) {
    console.warn(`[Raccoon] ${ruta} no disponible: ${error.message}`);
    contenedor.innerHTML = aviso('Este catalogo se publicara cuando el endpoint correspondiente este en linea.');
  }
}

// ---------------------------------------------------------------
// 5. Formulario de contacto
// ---------------------------------------------------------------

/**
 * Muestra el resultado del envio bajo el formulario.
 * @param {'ok'|'error'} tipo
 * @param {string} texto
 */
function mensajeFormulario(tipo, texto) {
  const caja = document.getElementById('mensaje-formulario');
  if (!caja) return;

  caja.textContent = texto;
  caja.className =
    tipo === 'ok'
      ? 'rounded-lg bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200'
      : 'rounded-lg bg-red-500/15 px-4 py-3 text-sm text-red-200';
}

/**
 * Valida en el cliente y envia el mensaje de contacto a la API.
 * @param {SubmitEvent} evento
 */
async function enviarContacto(evento) {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const boton = formulario.querySelector('button[type="submit"]');
  const datos = Object.fromEntries(new FormData(formulario).entries());

  // --- Validacion en el cliente (el backend vuelve a validar) ---
  if (!datos.nombre || datos.nombre.trim().length < 3) {
    return mensajeFormulario('error', 'El nombre debe tener al menos 3 caracteres.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email || '')) {
    return mensajeFormulario('error', 'Escribe un correo electronico valido.');
  }
  if (!datos.mensaje || datos.mensaje.trim().length < 10) {
    return mensajeFormulario('error', 'El mensaje debe tener al menos 10 caracteres.');
  }

  boton.disabled = true;
  boton.textContent = 'Enviando...';

  try {
    await pedirApi('/contact', { method: 'POST', body: JSON.stringify(datos) });
    formulario.reset();
    mensajeFormulario('ok', 'Mensaje enviado. Te responderemos al correo indicado.');
  } catch (error) {
    mensajeFormulario('error', `No se pudo enviar el mensaje. ${error.message}`);
  } finally {
    boton.disabled = false;
    boton.textContent = 'Enviar mensaje';
  }

  return undefined;
}

// ---------------------------------------------------------------
// 6. Menu movil
// ---------------------------------------------------------------
function activarMenuMovil() {
  const boton = document.getElementById('boton-menu');
  const menu = document.getElementById('menu-movil');
  if (!boton || !menu) return;

  boton.addEventListener('click', () => {
    const abierto = menu.classList.toggle('hidden') === false;
    boton.setAttribute('aria-expanded', String(abierto));
  });

  // Cierra el menu al elegir una seccion.
  menu.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      menu.classList.add('hidden');
      boton.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------------------------------------------------------------
// 7. Arranque
// ---------------------------------------------------------------
async function iniciar() {
  const anio = document.getElementById('anio');
  if (anio) anio.textContent = String(new Date().getFullYear());

  activarMenuMovil();

  const formulario = document.getElementById('formulario-contacto');
  if (formulario) formulario.addEventListener('submit', enviarContacto);

  const apiViva = await comprobarSalud();

  if (apiViva) {
    await Promise.all([
      cargarCatalogo('lista-salas', '/rooms', tarjetaSala, 'Todavia no hay salas registradas.'),
      cargarCatalogo('lista-cafeteria', '/products?categoria=cafeteria', tarjetaCafeteria, 'El menu se publicara pronto.'),
      cargarCatalogo('lista-libreria', '/products?categoria=libro', tarjetaLibro, 'El catalogo se publicara pronto.'),
    ]);
  } else {
    ['lista-salas', 'lista-cafeteria', 'lista-libreria'].forEach((id) => {
      const contenedor = document.getElementById(id);
      if (contenedor) {
        contenedor.innerHTML = aviso('No se pudo contactar la API. Revisa que el backend este en linea.');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', iniciar);
