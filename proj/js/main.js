

/* =====================================================
   ARRANQUE – se carga al final en todas las ventanas.
   Inicializa lo común y luego la lógica de la ventana actual
   (App.pages[<data-page>]).
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, screen, page, KEYS, FLOW, go, openSuccess } = App;

  document.addEventListener('DOMContentLoaded', () => {
    if (!screen) return;

    /* Dirección de la animación de entrada */
    let dir = 'forward';
    try { dir = sessionStorage.getItem(KEYS.dir) || 'forward'; sessionStorage.removeItem(KEYS.dir); } catch {}
    screen.classList.add('enter-' + dir);

    /* Común a todas las ventanas */
    App.addBlobs();
    App.initHero();
    App.bindFields();
    App.initChips();

    /* Lógica propia de la ventana */
    if (App.pages[page]) App.pages[page]();

    /* Botón "Continuar" / "Finalizar" */
    const next = $('[data-next]');
    if (next) {
      const idx = FLOW.indexOf(page);
      if (idx === FLOW.length - 1) next.textContent = 'Finalizar';
      next.addEventListener('click', () => {
        if (App.validators[page] && !App.validators[page]()) return;
        idx < FLOW.length - 1 ? go(FLOW[idx + 1] + '.html') : openSuccess();
      });
    }
  });
})();
