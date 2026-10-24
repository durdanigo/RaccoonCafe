/**
 * Raccoon Café - Chatbot "Bandido" (Asistente Cliente)
 */
class RaccoonChatbot {
  constructor() {
    this.isOpen = false;
  }

  init() {
    this.chatBtn = document.getElementById('chat-toggle-btn');
    this.chatWindow = document.getElementById('chat-window');
    this.chatMessages = document.getElementById('chat-messages');
    this.chatInput = document.getElementById('chat-input');
    this.chatSendBtn = document.getElementById('chat-send-btn');
    this.chatBadge = document.getElementById('chat-badge');

    if (!this.chatBtn) return;

    this.chatBtn.addEventListener('click', () => this.toggleChat());
    document.getElementById('chat-close-btn')?.addEventListener('click', () => this.toggleChat());
    
    this.chatSendBtn.addEventListener('click', () => this.handleSend());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    document.querySelectorAll('.chat-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.target.getAttribute('data-query') || e.target.textContent;
        this.chatInput.value = text;
        this.handleSend();
      });
    });

    this.appendBotMessage("¡Hola! Soy **Bandido**, el mapache barista de Raccoon Café 🦝☕. ¿En qué te puedo asesorar? Pregúntame sobre el **stock de libros**, nuestras **6 salas de reuniones**, el servicio de **alimentos externos ($15)** o el menú de café de especialidad.");
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.chatWindow.classList.remove('hidden');
      this.chatWindow.classList.add('flex');
      if (this.chatBadge) this.chatBadge.classList.add('hidden');
      setTimeout(() => this.chatInput.focus(), 200);
    } else {
      this.chatWindow.classList.add('hidden');
      this.chatWindow.classList.remove('flex');
    }
  }

  handleSend() {
    const query = this.chatInput.value.trim();
    if (!query) return;

    this.appendUserMessage(query);
    this.chatInput.value = '';

    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      const response = this.generateResponse(query);
      this.appendBotMessage(response);
    }, 550);
  }

  appendUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = "flex justify-end mb-3";
    bubble.innerHTML = `<div class="bg-amber-700 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] text-sm shadow-sm">${this.escapeHTML(text)}</div>`;
    this.chatMessages.appendChild(bubble);
    this.scrollToBottom();
  }

  appendBotMessage(markdownText) {
    const bubble = document.createElement('div');
    bubble.className = "flex gap-2.5 mb-3";
    bubble.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-stone-800 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-amber-600/30">
        <img src="logo.png" alt="Bandido" class="w-full h-full object-cover" onerror="this.innerHTML='🦝'">
      </div>
      <div class="bg-white border border-stone-200 text-stone-800 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] text-sm shadow-sm">
        ${this.formatMarkdown(markdownText)}
      </div>
    `;
    this.chatMessages.appendChild(bubble);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'chat-typing-indicator';
    indicator.className = "flex gap-2.5 mb-3 items-center";
    indicator.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-xs overflow-hidden">
        <img src="logo.png" class="w-full h-full object-cover" onerror="this.innerText='🦝'">
      </div>
      <div class="bg-stone-100 rounded-full px-4 py-2 text-stone-500 text-xs flex gap-1 items-center">
        <span>Bandido está escribiendo</span>
        <span class="animate-bounce">.</span>
        <span class="animate-bounce delay-100">.</span>
        <span class="animate-bounce delay-200">.</span>
      </div>
    `;
    this.chatMessages.appendChild(indicator);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    document.getElementById('chat-typing-indicator')?.remove();
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  generateResponse(rawQuery) {
    const q = rawQuery.toLowerCase();

    if (q.includes('stock') || q.includes('libro') || q.includes('lectura') || q.includes('usado') || q.includes('comprar')) {
      if (q.includes('harry')) {
        const hp = DATA.libros.find(l => l.titulo.includes('Harry'));
        return `Sobre **Harry Potter y el Prisionero de Azkaban**:\n- Condición: Segunda Mano (${hp?.condicion})\n- Precio: **$${hp?.precio.toFixed(2)}**\n- Stock actual: **${hp?.stock} unidad(es)**.\n¡Puedes apartarlo directamente en el catálogo con un clic!`;
      }
      if (q.includes('soledad') || q.includes('garcia')) {
        const libro = DATA.libros.find(l => l.titulo.includes('Soledad'));
        return `**Cien Años de Soledad** de Gabriel García Márquez está disponible nuevo por **$${libro?.precio.toFixed(2)}** con un stock de **${libro?.stock} ejemplares**.`;
      }
      return "En nuestra librería manejamos 3 modalidades:\n1. **Nuevos:** *Hábitos Atómicos* ($21), *Sapiens* ($23.50), *Cien Años de Soledad* ($18.50).\n2. **Segunda Mano:** *Harry Potter* ($8.50), *El Nombre del Viento* ($12), *Rayuela* ($6).\n3. **Lectura en Sala:** *El Principito* y *Mario Benedetti* (Consulta libre en estantes A1 y B2).\n¡El stock se descuenta en vivo al apartarlos!";
    }

    if (q.includes('sala') || q.includes('espacio') || q.includes('capacidad') || q.includes('aforo') || q.includes('foto')) {
      if (q.includes('social') || q.includes('fiesta') || q.includes('tematica') || q.includes('cumple')) {
        return "La **Sala Social & Temática** (15 a 25 personas) tiene una tarifa de **$38/hora**. Cuenta con proyector Full HD, sonido y mesas de cafetería configurables. ¡Es la favorita para eventos temáticos de Harry Potter o cumpleaños! Puedes decorarla a tu gusto.";
      }
      if (q.includes('taller') || q.includes('ceramica') || q.includes('bordado')) {
        return "Nuestra **Sala Taller Creativo** (12 a 20 personas) cuesta **$28/hora**. Tiene piso vinílico despejado de fácil aseo, mesas continuas y toma de agua/lavabo para artes plásticas.";
      }
      if (q.includes('cowork') || q.includes('co-work') || q.includes('estudiar')) {
        return "Disponemos de **2 Salas Co-work** (6–10 personas cada una) por **$12/hora**. Equipadas con escritorios individuales, sillas ergonómicas y regletas.";
      }
      if (q.includes('encuentro') || q.includes('reunion') || q.includes('club')) {
        return "Tenemos **2 Salas de Encuentro** (8–12 personas) a **$18/hora**. Mesa redonda central, pizarra y pantalla para reuniones corporativas o clubes de lectura.";
      }
      return "En Raccoon Café tenemos **6 salas físicas en total** con fotos reales:\n- 2 Salas Co-work (6–10 pers, $12/h)\n- 2 Salas Encuentro (8–12 pers, $18/h)\n- 1 Sala Taller (12–20 pers, $28/h)\n- 1 Sala Social (15–25 pers, $38/h).";
    }

    if (q.includes('comida') || q.includes('pastel') || q.includes('torta') || q.includes('descorche') || q.includes('catering') || q.includes('traer')) {
      return "¡Por supuesto! En Raccoon Café tienes dos opciones:\n1. **Traer tu propia comida o pastel:** Cobramos una tarifa fija de descorche y limpieza de **$15.00** por reserva.\n2. **Pedir de nuestro menú:** Puedes pedir café de barista o sumar el *Pack Fiesta Social* ($35) o el *Pack Taller* ($22).";
    }

    if (q.includes('cafe') || q.includes('menú') || q.includes('menu') || q.includes('precio') || q.includes('bebida') || q.includes('croissant')) {
      return "Nuestro menú barista incluye cafés calientes (Espresso $2.00, Flat White $3.75), bebidas frías (Cold Brew $3.50, Iced Matcha $4.25) y repostería artesanal horneada cada mañana.";
    }

    return "¡Hola! Como mapache barista, te confirmo que en Raccoon Café puedes reservar salas desde $12/h, degustar café de especialidad y revisar nuestro stock de libros en tiempo real.";
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }
}

window.raccoonChat = new RaccoonChatbot();
