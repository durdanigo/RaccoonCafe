/**
 * Raccoon Café - Conector de Servicios Backend (Silencioso para el Cliente)
 */
class ApiService {
  constructor() {
    this.status = { isOnline: false, mode: 'checking' };
  }

  async fetchWithTimeout(url, options = {}, timeoutMs = CONFIG.TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) }
      });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async checkHealth() {
    try {
      const res = await this.fetchWithTimeout(CONFIG.ENDPOINTS.espacios, { method: 'GET' });
      if (res.ok) {
        this.status.isOnline = true;
        this.status.mode = 'online';
        return true;
      }
    } catch (e) {}
    this.status.isOnline = false;
    this.status.mode = 'fallback';
    return false;
  }

  async getEspacios() {
    try {
      const res = await this.fetchWithTimeout(CONFIG.ENDPOINTS.espacios);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((d, i) => ({
            ...d,
            imagen: DATA.salas[i % DATA.salas.length].imagen,
            equipamiento: DATA.salas[i % DATA.salas.length].equipamiento,
            descripcion: d.descripcion || DATA.salas[i % DATA.salas.length].descripcion,
            precio_hora: d.precio_hora || DATA.salas[i % DATA.salas.length].precio_hora,
            badge: DATA.salas[i % DATA.salas.length].badge
          }));
        }
      }
    } catch (e) {}
    return DATA.salas;
  }

  async crearReserva(reservaData) {
    try {
      const res = await this.fetchWithTimeout(CONFIG.ENDPOINTS.reservas, {
        method: 'POST',
        body: JSON.stringify(reservaData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const nueva = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      ...reservaData,
      estado: "Confirmada"
    };
    DATA.reservas.unshift(nueva);
    DATA.saveReservas();
    return nueva;
  }
}

window.apiService = new ApiService();
