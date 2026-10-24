/**
 * Raccoon Café - Datos maestros, Menú y Stock de Libros
 */
const INITIAL_SALAS = [
  {
    id: "sala-cw-1",
    api_id: 1,
    nombre: "Sala Co-work 1",
    tipo: "Co-work",
    capacidad: "6–10 pers.",
    capacidad_num: 10,
    precio_hora: 12.00,
    icono: "fa-laptop-code",
    badge: "Silencio & Foco",
    imagen: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80",
    equipamiento: ["Escritorios ergonómicos", "Regletas de alta densidad", "Wi-Fi 600 Mbps", "Café refill 15% off"],
    descripcion: "Espacio diseñado para concentración individual, estudio o coworking silencioso sin interrupciones.",
    tag: "cowork"
  },
  {
    id: "sala-cw-2",
    api_id: 2,
    nombre: "Sala Co-work 2",
    tipo: "Co-work",
    capacidad: "6–10 pers.",
    capacidad_num: 10,
    precio_hora: 12.00,
    icono: "fa-laptop-code",
    badge: "Luz Natural",
    imagen: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    equipamiento: ["Escritorios individuales", "Lámparas cálidas", "Tomas USB-C", "Sillas soporte lumbar"],
    descripcion: "Ambiente luminoso con ventanales y luz natural. Ideal para jornadas productivas.",
    tag: "cowork"
  },
  {
    id: "sala-enc-1",
    api_id: 3,
    nombre: "Sala Encuentro 1",
    tipo: "Encuentro",
    capacidad: "8–12 pers.",
    capacidad_num: 12,
    precio_hora: 18.00,
    icono: "fa-people-group",
    badge: "Mesa Circular",
    imagen: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    equipamiento: ["Mesa redonda central", "Pizarra acrílica", "Smart TV 55\"", "Conectividad HDMI/AirPlay"],
    descripcion: "Diseño circular perfecto para grupos de lectura, clubes de libros y reuniones.",
    tag: "encuentro"
  },
  {
    id: "sala-enc-2",
    api_id: 4,
    nombre: "Sala Encuentro 2",
    tipo: "Encuentro",
    capacidad: "8–12 pers.",
    capacidad_num: 12,
    precio_hora: 18.00,
    icono: "fa-users-between-lines",
    badge: "Reuniones Corporativas",
    imagen: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    equipamiento: ["Mesa imperial", "Altavoz para conferencias", "Pizarra de vidrio", "Kit papelería ecológica"],
    descripcion: "Orientada a presentaciones profesionales, comités de trabajo y sesiones ejecutivas.",
    tag: "encuentro"
  },
  {
    id: "sala-taller",
    api_id: 5,
    nombre: "Sala Taller Creativo",
    tipo: "Taller",
    capacidad: "12–20 pers.",
    capacidad_num: 20,
    precio_hora: 28.00,
    icono: "fa-palette",
    badge: "Mesas Modulares",
    imagen: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    equipamiento: ["Mesas largas continuas", "Toma de agua & lavabo", "Piso despejado vinílico", "Iluminación 5000K"],
    descripcion: "Acondicionada para cerámica en frío, bordado, acuarela, manualidades y cursos prácticos.",
    tag: "taller"
  },
  {
    id: "sala-social",
    api_id: 6,
    nombre: "Sala Social & Temática",
    tipo: "Social",
    capacidad: "15–25 pers.",
    capacidad_num: 25,
    precio_hora: 38.00,
    icono: "fa-wand-magic-sparkles",
    badge: "Eventos Especiales",
    imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    equipamiento: ["Mesas de café configurables", "Proyector Full HD", "Sistema sonido Bluetooth", "Configuración temática libre"],
    descripcion: "El espacio insignia para fiestas temáticas (Harry Potter, fantasía), cumpleaños y proyecciones.",
    tag: "social"
  }
];

const INITIAL_LIBROS = [
  { id: "lib-1", titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", genero: "Ficción", modalidad: "venta_nuevo", condicion: "Nuevo", precio: 18.50, stock: 4, ubicacion: "Estante A - Novedades", portada_color: "from-amber-700 to-amber-950" },
  { id: "lib-2", titulo: "Hábitos Atómicos", autor: "James Clear", genero: "Desarrollo Personal", modalidad: "venta_nuevo", condicion: "Nuevo", precio: 21.00, stock: 6, ubicacion: "Estante A - No Ficción", portada_color: "from-stone-700 to-stone-900" },
  { id: "lib-3", titulo: "Klara y el Sol", autor: "Kazuo Ishiguro", genero: "Ciencia Ficción", modalidad: "venta_nuevo", condicion: "Nuevo", precio: 19.00, stock: 3, ubicacion: "Estante A - Narrativa", portada_color: "from-yellow-800 to-stone-900" },
  { id: "lib-4", titulo: "Harry Potter y el Prisionero de Azkaban", autor: "J.K. Rowling", genero: "Fantasía", modalidad: "venta_usado", condicion: "Segunda Mano (Buen Estado)", precio: 8.50, stock: 1, ubicacion: "Estante C - Seminuevos", portada_color: "from-purple-900 to-stone-900" },
  { id: "lib-5", titulo: "El Nombre del Viento", autor: "Patrick Rothfuss", genero: "Fantasía Épica", modalidad: "venta_usado", condicion: "Segunda Mano (Excelente)", precio: 12.00, stock: 2, ubicacion: "Estante C - Seminuevos", portada_color: "from-emerald-900 to-stone-900" },
  { id: "lib-6", titulo: "Rayuela", autor: "Julio Cortázar", genero: "Clásico Latinoamericano", modalidad: "venta_usado", condicion: "Segunda Mano (Aceptable)", precio: 6.00, stock: 1, ubicacion: "Estante C - Seminuevos", portada_color: "from-amber-900 to-stone-800" },
  { id: "lib-7", titulo: "Antología Poética", autor: "Mario Benedetti", genero: "Poesía", modalidad: "lectura_local", condicion: "Lectura en Sala", precio: 0.00, stock: 2, ubicacion: "Estante A1 - Sala de Lectura", portada_color: "from-blue-900 to-slate-900" },
  { id: "lib-8", titulo: "El Principito (Edición Ilustrada)", autor: "Antoine de Saint-Exupéry", genero: "Fábula / Clásico", modalidad: "lectura_local", condicion: "Lectura en Sala", precio: 0.00, stock: 3, ubicacion: "Estante B2 - Colección Infantil", portada_color: "from-amber-600 to-stone-900" },
  { id: "lib-9", titulo: "El Código Da Vinci", autor: "Dan Brown", genero: "Misterio / Thriller", modalidad: "venta_usado", condicion: "Segunda Mano (Buen Estado)", precio: 7.00, stock: 1, ubicacion: "Estante C - Seminuevos", portada_color: "from-red-950 to-stone-900" },
  { id: "lib-10", titulo: "Sapiens: De animales a dioses", autor: "Yuval Noah Harari", genero: "Historia / Ensayo", modalidad: "venta_nuevo", condicion: "Nuevo", precio: 23.50, stock: 5, ubicacion: "Estante A - No Ficción", portada_color: "from-sky-950 to-stone-900" }
];

const INITIAL_MENU = [
  { id: "m-1", nombre: "Espresso Raccoon", categoria: "caliente", precio: 2.00, desc: "Doble shot blend Loja y Zaruma tostado medio.", stock_status: "disponible", porciones_hoy: 45 },
  { id: "m-2", nombre: "Americano Doble", categoria: "caliente", precio: 2.50, desc: "Extracción limpia con notas de frutos secos y cacao.", stock_status: "disponible", porciones_hoy: 60 },
  { id: "m-3", nombre: "Cappuccino Tradicional", categoria: "caliente", precio: 3.25, desc: "Espuma densa aterciopelada y lluvia de cacao fino de aroma.", stock_status: "disponible", porciones_hoy: 38 },
  { id: "m-4", nombre: "Flat White de Vainilla", categoria: "caliente", precio: 3.75, desc: "Leche micro-texturizada con extracto natural de vainilla.", stock_status: "disponible", porciones_hoy: 25 },
  { id: "m-5", nombre: "Mocha Blanco & Canela", categoria: "caliente", precio: 4.00, desc: "Espresso, chocolate blanco fundido y toque especiado.", stock_status: "pocas_unidades", porciones_hoy: 8 },
  { id: "m-6", nombre: "Cold Brew Raccoon 18h", categoria: "frio", precio: 3.50, desc: "Maceración en frío por 18 horas, cuerpo sedoso.", stock_status: "disponible", porciones_hoy: 18 },
  { id: "m-7", nombre: "Iced Matcha Latte Ceremonial", categoria: "frio", precio: 4.25, desc: "Matcha japonés premium batido con leche de avena sobre hielo.", stock_status: "disponible", porciones_hoy: 22 },
  { id: "m-8", nombre: "Espresso Tonic Cítrico", categoria: "frio", precio: 3.75, desc: "Agua tónica premium, doble espresso y rodaja de pomelo.", stock_status: "disponible", porciones_hoy: 14 },
  { id: "m-9", nombre: "Infusión Frutos Rojos & Lavanda", categoria: "frio", precio: 2.75, desc: "Flores botánicas orgánicas relajantes, sin cafeína.", stock_status: "disponible", porciones_hoy: 30 },
  { id: "m-10", nombre: "Croissant Francés de Almendras", categoria: "pasteleria", precio: 3.25, desc: "Masa hojaldrada con mantequilla pura y crema frangipane.", stock_status: "pocas_unidades", porciones_hoy: 5 },
  { id: "m-11", nombre: "Tarta de Zanahoria & Nuez Pecana", categoria: "pasteleria", precio: 3.75, desc: "Glaseado artesanal de queso crema y canela.", stock_status: "disponible", porciones_hoy: 11 },
  { id: "m-12", nombre: "Brownie Artesanal Sal Marina", categoria: "pasteleria", precio: 2.80, desc: "Cacao fino de aroma 70% con escamas de sal marina.", stock_status: "disponible", porciones_hoy: 16 },
  { id: "m-13", nombre: "Toast de Masa Madre con Aguacate", categoria: "pasteleria", precio: 4.50, desc: "Rodajas de aguacate, tomates confitados y aceite virgen extra.", stock_status: "disponible", porciones_hoy: 12 },
  { id: "m-14", nombre: "Cookie Vegana de Avena y Chispas", categoria: "pasteleria", precio: 2.25, desc: "Horneada diariamente con avena integral y chocolate negro.", stock_status: "agotado", porciones_hoy: 0 },
  { id: "pkg-1", nombre: "Pack Taller Básico", categoria: "packs", precio: 22.00, desc: "Termo de café americano artesanal + 10 mini croissants recién horneados.", stock_status: "disponible", porciones_hoy: 8 },
  { id: "pkg-2", nombre: "Pack Fiesta Social & Temática", categoria: "packs", precio: 35.00, desc: "Jarra fría de infusión / cold brew + 15 mini brownies + servicio vajilla.", stock_status: "disponible", porciones_hoy: 6 },
  { id: "pkg-3", nombre: "Pack Coffee Break Ejecutivo", categoria: "packs", precio: 28.00, desc: "Café de origen, té variado, mini toasts y bocaditos salados para 8 personas.", stock_status: "disponible", porciones_hoy: 5 }
];

class DataStore {
  constructor() {
    this.salas = INITIAL_SALAS;
    this.libros = this.load(CONFIG.STORAGE_KEY_LIBROS, INITIAL_LIBROS);
    this.menu = this.load(CONFIG.STORAGE_KEY_MENU, INITIAL_MENU);
    this.reservas = this.load(CONFIG.STORAGE_KEY_RESERVAS, []);
  }

  load(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch(e) {}
    return JSON.parse(JSON.stringify(fallback));
  }

  saveLibros() {
    try { localStorage.setItem(CONFIG.STORAGE_KEY_LIBROS, JSON.stringify(this.libros)); } catch(e) {}
  }
  saveMenu() {
    try { localStorage.setItem(CONFIG.STORAGE_KEY_MENU, JSON.stringify(this.menu)); } catch(e) {}
  }
  saveReservas() {
    try { localStorage.setItem(CONFIG.STORAGE_KEY_RESERVAS, JSON.stringify(this.reservas)); } catch(e) {}
  }

  apartarLibro(libroId) {
    const libro = this.libros.find(l => l.id === libroId);
    if (!libro || libro.stock <= 0) return { ok: false, msg: "Sin stock disponible en este momento." };
    libro.stock -= 1;
    this.saveLibros();
    return { ok: true, libro, msg: `¡Has apartado "${libro.titulo}"! Quedan ${libro.stock} unid.` };
  }
}

window.DATA = new DataStore();
