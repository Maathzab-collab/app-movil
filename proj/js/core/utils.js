/* =====================================================
   NÚCLEO · Utilidades generales
   Crea el espacio de nombres global `App` que usan los demás archivos.
   ===================================================== */
window.App = {
  pages: {},       // lógica de cada ventana (js/pages/*.js)
  validators: {},  // validaciones antes de "Continuar"
  halt: false      // true si hay que detener el arranque (p. ej. sin sesión)
};

(() => {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';

  /* Atajos DOM */
  App.NS = NS;
  App.$  = (s, r = document) => r.querySelector(s);
  App.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  App.el = (tag, cls) => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

  /* Iconos SVG reutilizables */
  const ico = p => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  App.ICONS = {
    x: ico('<path d="M18 6L6 18M6 6l12 12"/>'),
    check: ico('<path d="M20 6L9 17l-5-5"/>'),
    chevron: ico('<path d="M9 18l6-6-6-6"/>'),
    book: ico('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
    award: ico('<circle cx="12" cy="8" r="7"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/>'),
    cap: ico('<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
    upload: ico('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/>')
  };

  /* Validaciones y conversiones */
  App.validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
  App.asArray = v => Array.isArray(v) ? v : String(v || '').split(/[,\n]+/).map(s => s.trim()).filter(Boolean);

  App.hash = async text => {
    if (window.crypto && crypto.subtle) {
      const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 0; for (const c of text) h = (h * 31 + c.charCodeAt(0)) | 0;
    return 'f' + h;
  };
})();
