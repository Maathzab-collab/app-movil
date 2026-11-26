/* =====================================================
   NÚCLEO · Componentes comunes de las ventanas
   - bindFields: campos guardados automáticamente, archivos, ojo de contraseña
   - initChips:  campo de etiquetas (Enter o coma para agregar)
   - initHero:   progreso, botón atrás y cerrar sesión
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, $$, el, ICONS, asArray, store, profile, saveProfile, unflag, toast, go, KEYS, FLOW, page } = App;

  /* Campos de texto y archivos ligados al perfil */
  App.bindFields = () => {
    $$('[data-field]').forEach(inp => {
      const key = inp.dataset.field;
      if (profile[key] != null) inp.value = profile[key];
      inp.addEventListener('input', () => { unflag(inp); profile[key] = inp.value; saveProfile(); });
    });

    $$('.upload[data-file]').forEach(fp => {
      const key = fp.dataset.file;
      const input = $('input[type=file]', fp);
      const label = $('.file-name', fp);
      const multiple = input.multiple;
      const placeholder = label.textContent;
      const render = () => {
        const names = [].concat(profile[key] || []);
        label.innerHTML = '';
        if (names.length) {
          fp.classList.add('has-file');
          names.forEach(n => { const d = el('div'); d.textContent = n; label.appendChild(d); });
        } else {
          fp.classList.remove('has-file');
          label.textContent = placeholder;
        }
      };
      render();
      fp.addEventListener('click', () => input.click());
      input.addEventListener('change', () => {
        if (!input.files.length) return;
        const names = [...input.files].map(f => f.name);
        profile[key] = multiple ? names : names[0];
        saveProfile(); render();
      });
    });

    $$('.eye').forEach(b => b.addEventListener('click', () => {
      const inp = $('input', b.parentElement);
      inp.type = inp.type === 'password' ? 'text' : 'password';
    }));
  };

  /* Campo de etiquetas: Enter o coma para agregar */
  App.initChips = () => {
    $$('[data-chips]').forEach(box => {
      const key = box.dataset.chips;
      const list = $('.chip-list', box), input = $('input', box);
      const sug = box.parentElement.querySelector('.suggest');
      const suggestions = (box.dataset.suggest || '').split(',').map(s => s.trim()).filter(Boolean);
      let items = asArray(profile[key]);

      const commit = () => { profile[key] = items; saveProfile(); render(); };
      const add = text => {
        const t = text.trim().slice(0, 40);
        if (!t || items.some(x => x.toLowerCase() === t.toLowerCase())) return;
        if (items.length >= 30) return toast('Máximo 30 etiquetas');
        items.push(t); commit();
      };
      const render = () => {
        list.innerHTML = '';
        items.forEach((t, i) => {
          const c = el('span', 'chip');
          c.append(t);
          const b = el('button'); b.type = 'button'; b.setAttribute('aria-label', 'Quitar ' + t);
          b.innerHTML = ICONS.x;
          b.addEventListener('click', () => { items.splice(i, 1); commit(); });
          c.appendChild(b); list.appendChild(c);
        });
        if (sug) {
          sug.innerHTML = '';
          suggestions.filter(s => !items.some(x => x.toLowerCase() === s.toLowerCase())).forEach(s => {
            const b = el('button'); b.type = 'button'; b.textContent = '+ ' + s;
            b.addEventListener('click', () => add(s));
            sug.appendChild(b);
          });
        }
      };

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input.value); input.value = ''; }
        else if (e.key === 'Backspace' && !input.value && items.length) { items.pop(); commit(); }
      });
      input.addEventListener('input', () => {
        if (input.value.includes(',')) { input.value.split(',').forEach(add); input.value = ''; }
      });
      input.addEventListener('blur', () => { add(input.value); input.value = ''; });
      box.addEventListener('click', () => input.focus());
      render();
    });
  };

  /* Encabezado: progreso, atrás y salir */
  App.initHero = () => {
    const idx = FLOW.indexOf(page);
    const steps = $('.steps'), label = $('.step-label');
    if (steps && idx > -1) {
      FLOW.forEach((_, i) => { const s = el('i'); if (i <= idx) s.className = 'on'; steps.appendChild(s); });
      if (label) label.textContent = `Paso ${idx + 1} de ${FLOW.length}`;
    }
    const back = $('#back');
    if (back) {
      const target = back.dataset.back || (idx > 0 ? FLOW[idx - 1] + '.html' : null);
      if (target) back.addEventListener('click', () => go(target, 'back'));
      else back.classList.add('invisible');
    }
    const prev = $('#prev');
    if (prev) {
      if (idx > 0) prev.addEventListener('click', () => go(FLOW[idx - 1] + '.html', 'back'));
      else prev.remove();
    }
    const out = $('#logout');
    if (out) out.addEventListener('click', () => { localStorage.removeItem(KEYS.session); go('index.html', 'back'); });
  };
})();
