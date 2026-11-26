/* =====================================================
   VENTANA: Registrarse (registro.html)
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, store, KEYS, flag, unflag, go, validEmail, hash } = App;

  App.pages.registro = () => {
    const user = $('#user'), mail = $('#mail'), pass = $('#pass');
    [user, mail, pass].forEach(i => i.addEventListener('input', () => unflag(i)));

    $('#regForm').addEventListener('submit', async e => {
      e.preventDefault();
      const name = user.value.trim(), email = mail.value.trim().toLowerCase();
      if (name.length < 3) return flag(user, 'El nombre de usuario necesita al menos 3 caracteres');
      if (!validEmail(email)) return flag(mail, 'Escribe un Gmail válido');
      if (pass.value.length < 6) return flag(pass, 'La contraseña necesita al menos 6 caracteres');
      const users = store.get(KEYS.users, []);
      if (users.some(u => u.email === email)) return flag(mail, 'Ese correo ya está registrado');
      users.push({ name, email, pass: await hash(pass.value) });
      if (!store.set(KEYS.users, users)) return;
      store.set(KEYS.session, { email, name });
      const prof = store.get(KEYS.profile + email, {});
      if (!prof.nombre) { prof.nombre = name; store.set(KEYS.profile + email, prof); }
      go('perfil.html');
    });
  };
})();
