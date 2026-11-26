/* =====================================================
   NÚCLEO · Almacenamiento, sesión y perfil
   Los datos se guardan en localStorage (demo sin servidor).
   ===================================================== */
(() => {
  'use strict';
  const { $ } = App;

  App.KEYS = { users: 'app_users', session: 'app_session', profile: 'app_profile_', dir: 'nav_dir' };

  /* Orden de las ventanas del flujo (define "Paso X de N") */
  App.FLOW = [
    'perfil', 'formacion-academica', 'formacion-extracurricular',
    'experiencia-laboral', 'proyectos', 'habilidades', 'intereses'
  ];
  App.PUBLIC_PAGES = ['index', 'registro'];

  App.store = {
    get(key, fallback) {
      try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch { App.toast('No se pudo guardar: almacenamiento lleno o bloqueado'); return false; }
    }
  };

  /* Ventana actual (se lee de <main data-page="...">) */
  App.screen = $('.screen');
  App.page = App.screen ? App.screen.dataset.page : '';

  /* Sesión: las ventanas privadas exigen haber iniciado sesión */
  App.session = App.store.get(App.KEYS.session, null);
  if (!App.PUBLIC_PAGES.includes(App.page) && !App.session) {
    App.halt = true;
    location.replace('index.html');
    return;
  }

  /* Perfil del usuario (un perfil por correo, o "invitado") */
  const profileKey = () => App.KEYS.profile + (App.session && App.session.email ? App.session.email : 'invitado');
  App.profile = App.store.get(profileKey(), {});
  App.saveProfile = () => App.store.set(profileKey(), App.profile);
})();
