/**
 * Raccoon Café & Coworking - Configuración de Servicios
 */
const CONFIG = {
  APP_NAME: "Raccoon Café & Coworking",
  VERSION: "2.0",
  API_BASE_URL: "https://dannurda.alwaysdata.net/api",
  
  ENDPOINTS: {
    tipos_espacio: "https://dannurda.alwaysdata.net/api/tipos-espacio/",
    espacios: "https://dannurda.alwaysdata.net/api/espacios/",
    servicios: "https://dannurda.alwaysdata.net/api/servicios/",
    clientes: "https://dannurda.alwaysdata.net/api/clientes/",
    reservas: "https://dannurda.alwaysdata.net/api/reservas/",
    pagos: "https://dannurda.alwaysdata.net/api/pagos/",
    dashboard: "https://dannurda.alwaysdata.net/api/dashboard/",
    login: "https://dannurda.alwaysdata.net/api/login/"
  },
  
  CORKAGE_FEE: 15.00, // Tarifa fija de descorche por alimentos externos
  TIMEOUT_MS: 4000,
  STORAGE_KEY_LIBROS: "raccoon_stock_libros_v2",
  STORAGE_KEY_MENU: "raccoon_stock_menu_v2",
  STORAGE_KEY_RESERVAS: "raccoon_reservas_v2"
};

window.CONFIG = CONFIG;
