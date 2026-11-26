/* =====================================================
   VENTANA: Mi perfil (perfil.html)
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, profile, saveProfile, flag, go } = App;

  App.pages.perfil = () => {
    const img = $('#avatarImg'), face = $('#avatarSvg'), input = $('#avatarInput');
    const showPhoto = src => { img.src = src; img.hidden = false; face.style.display = 'none'; };
    if (profile.foto) showPhoto(profile.foto);

    $('#avatar').addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const im = new Image();
        im.onload = () => {
          const size = 240, c = document.createElement('canvas');
          c.width = c.height = size;
          const s = Math.min(im.width, im.height);
          c.getContext('2d').drawImage(im, (im.width - s) / 2, (im.height - s) / 2, s, s, 0, 0, size, size);
          profile.foto = c.toDataURL('image/jpeg', 0.8);
          saveProfile(); showPhoto(profile.foto);
        };
        im.src = reader.result;
      };
      reader.readAsDataURL(file);
    });

    $('#verPortafolio').addEventListener('click', () => go('portafolio.html'));

    const curp = $('#curp');
    curp.addEventListener('input', () => { curp.value = curp.value.toUpperCase(); profile.curp = curp.value; saveProfile(); });
  };

  /* Validación antes de "Continuar" */
  App.validators.perfil = () => {
    const nombre = $('#nombre');
    if (!nombre.value.trim()) { flag(nombre, 'Escribe tu nombre'); return false; }
    const curp = $('#curp');
    if (curp.value && !/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(curp.value)) {
      flag(curp, 'La CURP debe tener 18 caracteres válidos'); return false;
    }
    return true;
  };
})();
