/* =====================================================
   VENTANA: Iniciar sesión (index.html)
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, store, KEYS, flag, unflag, toast, go, openSheet, validEmail, hash } = App;

  App.pages.index = () => {
    const email = $('#email'), pass = $('#password');
    [email, pass].forEach(i => i.addEventListener('input', () => unflag(i)));

    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      const mail = email.value.trim().toLowerCase();
      if (!validEmail(mail)) return flag(email, 'Escribe un correo electrónico válido');
      if (!pass.value) return flag(pass, 'Escribe tu contraseña');
      const user = store.get(KEYS.users, []).find(u => u.email === mail);
      if (!user) return flag(email, 'No encontramos esa cuenta. Regístrate primero');
      if (user.pass !== await hash(pass.value)) return flag(pass, 'Contraseña incorrecta');
      store.set(KEYS.session, { email: mail, name: user.name });
      go('perfil.html');
    });

    $('#guest').addEventListener('click', () => {
      store.set(KEYS.session, { guest: true, name: 'Invitado' });
      go('perfil.html');
    });

    $('#forgot').addEventListener('click', () => openSheet({
      title: 'Recuperar contraseña',
      saveText: 'Enviar',
      fields: [{ key: 'email', label: 'Correo electrónico', type: 'email', value: email.value }],
      onSave: v => {
        if (!validEmail(v.email)) { toast('Escribe un correo válido'); return false; }
        toast('Demo: aquí se enviaría un enlace a ' + v.email);
      }
    }));
  };
})();
