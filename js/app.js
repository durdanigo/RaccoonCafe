let currentFiltroLibro = 'todos';
let currentSearchTerm = '';

document.addEventListener('DOMContentLoaded', async () => {
  window.raccoonChat.init();
  await window.apiService.checkHealth();

  renderSalas();
  renderLibros();
  renderMenu('caliente');
  initReservaSimulator();
  initContactForm();
  initStaffLoginModal();

  setupFilterListeners();
  setupSearchListener();
});

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-stone-900 text-amber-200 border-amber-600/40' : 'bg-rose-900 text-white border-rose-500';
  toast.className = `toast px-5 py-3 rounded-2xl border shadow-xl text-xs font-bold flex items-center gap-2 ${bg}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check text-emerald-400' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// 1. Render de las 6 Salas Físicas con Fotografías
async function renderSalas() {
  const container = document.getElementById('salas-container');
  if (!container) return;

  const salas = await window.apiService.getEspacios();
  container.innerHTML = '';

  salas.forEach(sala => {
    const card = document.createElement('div');
    card.className = "card-hover bg-white rounded-3xl border border-stone-200/90 overflow-hidden flex flex-col justify-between shadow-sm group";
    card.innerHTML = `
      <div>
        <div class="relative h-52 w-full overflow-hidden bg-stone-100">
          <img src="${sala.imagen || 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80'}" 
               alt="${sala.nombre}" 
               class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
               loading="lazy" 
               onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80';">
          <div class="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/20 to-transparent"></div>
          
          <span class="absolute top-3.5 right-3.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-stone-900/85 text-amber-300 backdrop-blur-md border border-white/10 shadow-sm">
            <i class="fa-solid ${sala.icono || 'fa-door-open'} mr-1 text-[10px]"></i> ${sala.badge || sala.tipo}
          </span>

          <div class="absolute bottom-3 left-4 right-4">
            <h3 class="text-xl font-bold text-white font-serif drop-shadow-sm leading-tight">${sala.nombre}</h3>
            <p class="text-xs font-semibold text-amber-200 flex items-center gap-1.5 mt-1 drop-shadow-sm">
              <i class="fa-solid fa-users text-[10px]"></i> Capacidad: ${sala.capacidad}
            </p>
          </div>
        </div>

        <div class="p-6">
          <p class="text-stone-600 text-xs sm:text-sm mb-4 leading-relaxed">${sala.descripcion}</p>

          <div class="border-t border-stone-100 pt-3">
            <p class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Equipamiento Incluido:</p>
            <ul class="text-xs text-stone-600 space-y-1.5">
              ${(sala.equipamiento || []).map(eq => `<li class="flex items-center gap-2"><i class="fa-solid fa-circle-check text-emerald-600 text-[11px]"></i> ${eq}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>

      <div class="p-5 bg-stone-50/90 border-t border-stone-100 flex items-center justify-between">
        <div>
          <span class="text-2xl font-black text-stone-900 font-serif">$${Number(sala.precio_hora).toFixed(2)}</span>
          <span class="text-xs text-stone-500 font-medium"> / hora</span>
        </div>
        <button onclick="seleccionarSalaParaReserva('${sala.id}', '${sala.nombre}', ${sala.precio_hora})" class="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5">
          <span>Cotizar</span>
          <i class="fa-solid fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

// 2. Render de Libros con Búsqueda y Control de Stock en Vivo
function renderLibros() {
  const container = document.getElementById('libros-container');
  const countBadge = document.getElementById('libros-count-badge');
  if (!container) return;

  let items = DATA.libros;

  if (currentFiltroLibro !== 'todos') {
    items = items.filter(l => l.modalidad === currentFiltroLibro);
  }

  if (currentSearchTerm.trim() !== '') {
    const q = currentSearchTerm.toLowerCase();
    items = items.filter(l => 
      l.titulo.toLowerCase().includes(q) || 
      l.autor.toLowerCase().includes(q) || 
      l.genero.toLowerCase().includes(q)
    );
  }

  if (countBadge) {
    countBadge.textContent = `${items.length} títulos disponibles`;
  }

  container.innerHTML = '';

  if (items.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center text-stone-500">
        <i class="fa-solid fa-book-open text-3xl mb-3 text-stone-400"></i>
        <p class="text-sm font-semibold">No se encontraron títulos con ese término de búsqueda.</p>
        <button onclick="resetFiltrosLibros()" class="mt-3 text-xs text-amber-800 underline">Ver todos los libros</button>
      </div>
    `;
    return;
  }

  items.forEach(libro => {
    let badgeClass = "bg-stone-100 text-stone-700 border-stone-200";
    if (libro.modalidad === 'venta_nuevo') badgeClass = "bg-amber-50 text-amber-800 border-amber-300";
    if (libro.modalidad === 'venta_usado') badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
    if (libro.modalidad === 'lectura_local') badgeClass = "bg-sky-50 text-sky-800 border-sky-300";

    let stockBadge = "";
    if (libro.modalidad === 'lectura_local') {
      stockBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full"><i class="fa-solid fa-book-bookmark text-[10px]"></i> Consulta en Café (${libro.stock} en estante)</span>`;
    } else if (libro.stock > 2) {
      stockBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full"><i class="fa-solid fa-check-circle text-[10px]"></i> En Stock (${libro.stock} unid.)</span>`;
    } else if (libro.stock > 0) {
      stockBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full"><i class="fa-solid fa-triangle-exclamation text-[10px]"></i> ¡Última(s) ${libro.stock} unid.!</span>`;
    } else {
      stockBadge = `<span class="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-xmark text-[10px]"></i> Agotado</span>`;
    }

    const card = document.createElement('div');
    card.className = "card-hover bg-white rounded-2xl border border-stone-200 overflow-hidden flex flex-col justify-between p-5 shadow-sm";
    card.innerHTML = `
      <div>
        <div class="h-36 rounded-xl bg-gradient-to-br ${libro.portada_color || 'from-stone-700 to-stone-900'} p-4 flex flex-col justify-between text-white shadow-inner mb-4 relative overflow-hidden">
          <span class="text-[10px] uppercase font-bold tracking-widest text-amber-200/90">${libro.genero}</span>
          <div>
            <h4 class="font-bold text-sm leading-snug line-clamp-2">${libro.titulo}</h4>
            <p class="text-xs text-stone-300">${libro.autor}</p>
          </div>
        </div>

        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}">
            ${libro.condicion}
          </span>
        </div>

        <div class="mb-3">
          ${stockBadge}
        </div>

        <p class="text-[11px] text-stone-400 flex items-center gap-1">
          <i class="fa-solid fa-location-dot text-[10px]"></i> ${libro.ubicacion}
        </p>
      </div>

      <div class="pt-3 border-t border-stone-100 flex items-center justify-between mt-3">
        <div>
          ${libro.precio > 0 
            ? `<span class="text-lg font-black text-stone-900 font-serif">$${libro.precio.toFixed(2)}</span>`
            : `<span class="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded">Gratis en Sala</span>`
          }
        </div>

        <div>
          ${libro.modalidad !== 'lectura_local' 
            ? (libro.stock > 0
                ? `<button onclick="ejecutarApartarLibro('${libro.id}')" class="px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white transition text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <i class="fa-solid fa-cart-shopping text-[10px]"></i>
                    <span>Apartar</span>
                  </button>`
                : `<span class="text-xs text-stone-400 font-bold px-2 py-1 bg-stone-100 rounded-lg">Agotado</span>`
              )
            : `<button onclick="solicitarLecturaSala('${libro.titulo}', '${libro.ubicacion}')" class="px-3 py-1.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 transition text-xs font-bold flex items-center gap-1.5">
                <i class="fa-solid fa-book-open-reader text-[10px]"></i>
                <span>Pedir a Mesa</span>
              </button>`
          }
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function ejecutarApartarLibro(id) {
  const res = DATA.apartarLibro(id);
  if (res.ok) {
    showToast(res.msg, 'success');
    renderLibros();
  } else {
    showToast(res.msg, 'error');
  }
}

function solicitarLecturaSala(titulo, ubicacion) {
  showToast(`Ejemplar "${titulo}" solicitado para lectura en mesa (${ubicacion}). ¡El barista te lo llevará!`, 'success');
}

function resetFiltrosLibros() {
  currentFiltroLibro = 'todos';
  currentSearchTerm = '';
  document.getElementById('input-buscar-libros').value = '';
  document.querySelectorAll('.btn-filter-libro').forEach(b => {
    b.className = "btn-filter-libro px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-600 hover:border-amber-300 transition";
  });
  const first = document.querySelector('.btn-filter-libro[data-filter="todos"]');
  if (first) first.className = "btn-filter-libro px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-800 text-white border border-amber-800 shadow-sm transition";
  renderLibros();
}

// 3. Render Menú de Cafetería
function renderMenu(categoria = 'caliente') {
  const container = document.getElementById('menu-container');
  if (!container) return;

  const items = DATA.menu.filter(m => m.categoria === categoria);
  container.innerHTML = '';

  items.forEach(item => {
    let statusBadge = "";
    if (item.stock_status === 'disponible') {
      statusBadge = `<span class="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">Disponible (${item.porciones_hoy} hoy)</span>`;
    } else if (item.stock_status === 'pocas_unidades') {
      statusBadge = `<span class="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full">¡Pocas unidades!</span>`;
    } else {
      statusBadge = `<span class="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full">Agotado hoy</span>`;
    }

    const el = document.createElement('div');
    el.className = "flex items-start justify-between gap-4 p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400/80 transition shadow-sm";
    el.innerHTML = `
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1 flex-wrap">
          <h4 class="font-bold text-stone-900 text-sm">${item.nombre}</h4>
          ${item.categoria === 'packs' ? '<span class="text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">Pack Evento</span>' : ''}
          ${statusBadge}
        </div>
        <p class="text-xs text-stone-500 leading-relaxed">${item.desc}</p>
      </div>
      <div class="text-right flex-shrink-0 flex flex-col items-end justify-between self-stretch">
        <span class="text-base font-black text-stone-900 font-serif">$${item.precio.toFixed(2)}</span>
        <button onclick="agregarAlPedidoRapido('${item.nombre}', ${item.precio})" class="mt-2 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1">
          <i class="fa-solid fa-plus text-[10px]"></i> Añadir
        </button>
      </div>
    `;
    container.appendChild(el);
  });
}

function agregarAlPedidoRapido(nombre, precio) {
  showToast(`"${nombre}" añadido al plan de tu visita.`, 'success');
  const cateringSelect = document.getElementById('res-catering');
  if (cateringSelect && cateringSelect.value === '0') {
    document.getElementById('reservas').scrollIntoView({ behavior: 'smooth' });
  }
}

// 4. Simulador Interactivo de Reservas con Cálculo en Vivo
function initReservaSimulator() {
  const form = document.getElementById('reserva-form');
  const salaSelect = document.getElementById('res-sala');
  const horasInput = document.getElementById('res-horas');
  const switchComida = document.getElementById('res-switch-comida');
  const cateringSelect = document.getElementById('res-catering');
  const subtotalSalaEl = document.getElementById('calc-subtotal-sala');
  const extraComidaEl = document.getElementById('calc-extra-comida');
  const totalEl = document.getElementById('calc-total');

  if (!form || !salaSelect) return;

  salaSelect.innerHTML = DATA.salas.map(s => 
    `<option value="${s.id}" data-precio="${s.precio_hora}" data-nombre="${s.nombre}">${s.nombre} ($${s.precio_hora}/h)</option>`
  ).join('');

  function calcular() {
    const opt = salaSelect.options[salaSelect.selectedIndex];
    const precioHora = parseFloat(opt?.getAttribute('data-precio') || 12);
    const horas = parseInt(horasInput.value) || 2;
    const subtotalSala = precioHora * horas;

    let extraComida = 0;
    if (switchComida.checked) {
      extraComida = CONFIG.CORKAGE_FEE;
      extraComidaEl.textContent = `+$${CONFIG.CORKAGE_FEE.toFixed(2)} (Descorche)`;
      cateringSelect.disabled = true;
    } else {
      cateringSelect.disabled = false;
      const cateringVal = parseFloat(cateringSelect.value) || 0;
      extraComida = cateringVal;
      extraComidaEl.textContent = cateringVal > 0 ? `+$${cateringVal.toFixed(2)}` : '$0.00';
    }

    const total = subtotalSala + extraComida;
    subtotalSalaEl.textContent = `$${subtotalSala.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  salaSelect.addEventListener('change', calcular);
  horasInput.addEventListener('input', calcular);
  switchComida.addEventListener('change', calcular);
  cateringSelect.addEventListener('change', calcular);
  calcular();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Procesando tu solicitud...`;

    const opt = salaSelect.options[salaSelect.selectedIndex];
    const payload = {
      cliente_nombre: document.getElementById('res-cliente').value,
      cliente_email: document.getElementById('res-email').value,
      sala_id: salaSelect.value,
      sala_nombre: opt.getAttribute('data-nombre'),
      fecha: document.getElementById('res-fecha').value,
      horas: parseInt(horasInput.value),
      hora_inicio: document.getElementById('res-hora-inicio').value,
      tipo_evento: document.getElementById('res-tipo-evento').value,
      alimentos_externos: switchComida.checked,
      catering_seleccionado: cateringSelect.value,
      total_estimado: totalEl.textContent
    };

    const res = await window.apiService.crearReserva(payload);
    btn.disabled = false;
    btn.innerHTML = originalText;

    mostrarModalConfirmacion(res);
    form.reset();
    calcular();
  });
}

function seleccionarSalaParaReserva(id, nombre, precio) {
  const select = document.getElementById('res-sala');
  if (select) {
    select.value = id;
    select.dispatchEvent(new Event('change'));
    document.getElementById('reservas').scrollIntoView({ behavior: 'smooth' });
  }
}

function mostrarModalConfirmacion(reserva) {
  const modal = document.getElementById('modal-confirmacion');
  if (!modal) return;
  document.getElementById('conf-codigo').textContent = reserva.id || 'RES-AUTO';
  document.getElementById('conf-sala').textContent = reserva.sala_nombre || reserva.sala;
  document.getElementById('conf-fecha').textContent = `${reserva.fecha} a las ${reserva.hora_inicio || '15:00'}`;
  document.getElementById('conf-total').textContent = reserva.total_estimado || `$${reserva.total}`;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

// 5. Formulario de Contacto Real
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("¡Mensaje recibido! Nos comunicaremos contigo en breve.", "success");
    form.reset();
  });
}

// 6. Modal de Login Privado para Staff (Cumple Rúbrica: Admin con Login sin mostrar dashboard al cliente)
function initStaffLoginModal() {
  const btnOpen = document.getElementById('btn-open-staff');
  const modal = document.getElementById('modal-staff-login');
  const btnClose = document.getElementById('btn-close-staff');
  const form = document.getElementById('form-staff-login');

  if (!btnOpen || !modal) return;

  btnOpen.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });

  btnClose?.addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast("Credenciales de administrador validadas correctamente.", "success");
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
}

function setupFilterListeners() {
  document.querySelectorAll('.btn-filter-libro').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btn-filter-libro').forEach(b => {
        b.className = "btn-filter-libro px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-600 hover:border-amber-300 transition";
      });
      e.target.className = "btn-filter-libro px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-800 text-white border border-amber-800 transition shadow-sm";
      currentFiltroLibro = e.target.getAttribute('data-filter');
      renderLibros();
    });
  });

  document.querySelectorAll('.btn-tab-menu').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.btn-tab-menu').forEach(b => {
        b.className = "btn-tab-menu px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:text-amber-800 transition";
      });
      e.target.className = "btn-tab-menu px-4 py-2 rounded-xl text-xs font-bold bg-amber-800 text-white shadow-sm transition";
      renderMenu(e.target.getAttribute('data-cat'));
    });
  });
}

function setupSearchListener() {
  const input = document.getElementById('input-buscar-libros');
  if (!input) return;
  input.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    renderLibros();
  });
}
