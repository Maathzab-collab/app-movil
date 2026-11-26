/* =====================================================
   NÚCLEO · Interfaz: navegación, toast, errores de campo,
   decoraciones, hoja inferior y mensaje de éxito
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, el, NS, ICONS, screen, KEYS } = App;

  /* ---------- Navegación con animación ---------- */
  App.go = (url, dir = 'forward') => {
    try { sessionStorage.setItem(KEYS.dir, dir); } catch {}
    screen.classList.add('leaving-' + dir);
    setTimeout(() => { location.href = url; }, 170);
  };

  /* ---------- Toast ---------- */
  let toastTimer;
  App.toast = msg => {
    const host = screen || document.body;
    let t = $('.toast', host);
    if (!t) { t = el('div', 'toast'); host.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  /* ---------- Errores de campo ---------- */
  const shake = node => {
    if (!node) return;
    node.classList.remove('shake'); void node.offsetWidth; node.classList.add('shake');
  };
  const boxOf = input => input.closest('.input-wrap, .chip-box, .upload') || input;

  App.flag = (input, msg) => {
    const box = boxOf(input);
    box.classList.add('invalid');
    shake(box);
    App.toast(msg);
    input.focus && input.focus();
  };
  App.unflag = input => boxOf(input).classList.remove('invalid');

  /* ---------- Decoración (blobs) ---------- */
  const BLOB = `
    <svg viewBox="0 0 250 250" xmlns="${NS}" aria-hidden="true">
      <path class="b-fill" d="M0 0H236C228 42 196 76 152 78C100 80 132 122 126 162C120 198 62 192 0 246Z"/>
      <path class="b-line" d="M248 0C240 40 200 58 150 56C62 54 60 102 86 150C98 176 70 206 0 242"/>
    </svg>`;

  App.addBlobs = () => {
    const hero = $('.hero');
    if (hero) {
      const d = el('div', 'blob tl'); d.innerHTML = BLOB; hero.prepend(d);
      return;
    }
    ['tl', 'br'].forEach(pos => { const d = el('div', 'blob ' + pos); d.innerHTML = BLOB; screen.appendChild(d); });
  };

  /* ---------- Hoja inferior reutilizable ---------- */
  App.openSheet = ({ title, fields, saveText = 'Guardar', onSave }) => {
    const back = el('div', 'sheet-backdrop');
    const sheet = el('div', 'sheet');
    sheet.setAttribute('role', 'dialog');
    sheet.innerHTML = `<h2></h2><div class="fields"></div>
      <div class="sheet-actions">
        <button type="button" class="cancel">Cancelar</button>
        <button type="button" class="ok"></button>
      </div>`;
    $('h2', sheet).textContent = title;
    $('.ok', sheet).textContent = saveText;
    const box = $('.fields', sheet);
    const inputs = {};

    fields.forEach(f => {
      const wrap = el('div', 'field');
      const lab = el('span', 'label');
      lab.textContent = f.label;
      wrap.appendChild(lab);
      if (f.type === 'file') {
        const fp = el('div', 'upload' + (f.value ? ' has-file' : ''));
        fp.innerHTML = ICONS.upload + '<span class="file-name"></span>';
        $('.file-name', fp).textContent = f.value || 'Subir archivo';
        const inp = el('input'); inp.type = 'file'; inp.hidden = true;
        fp.appendChild(inp);
        fp.addEventListener('click', () => inp.click());
        inp.addEventListener('change', () => {
          if (!inp.files[0]) return;
          $('.file-name', fp).textContent = inp.files[0].name;
          fp.classList.add('has-file');
          inputs[f.key].value = inp.files[0].name;
        });
        inputs[f.key] = { value: f.value || '' };
        wrap.appendChild(fp);
      } else {
        const w = el('div', 'input-wrap');
        const inp = el('input');
        inp.type = f.type || 'text';
        inp.placeholder = f.placeholder || '';
        inp.value = f.value || '';
        w.appendChild(inp);
        wrap.appendChild(w);
        inputs[f.key] = inp;
      }
      box.appendChild(wrap);
    });

    const close = () => back.remove();
    $('.cancel', sheet).addEventListener('click', close);
    back.addEventListener('click', e => { if (e.target === back) close(); });
    $('.ok', sheet).addEventListener('click', async () => {
      const values = {};
      Object.entries(inputs).forEach(([k, n]) => { values[k] = typeof n.value === 'string' ? n.value.trim() : n.value; });
      if (await onSave(values) !== false) close();
    });
    back.appendChild(sheet);
    screen.appendChild(back);
    const first = $('input:not([type=file])', sheet);
    if (first) first.focus();
  };

  /* ---------- Mensaje de perfil completo ---------- */
  App.openSuccess = () => {
    const back = el('div', 'sheet-backdrop');
    const sheet = el('div', 'sheet center');
    sheet.innerHTML = `<div class="success-ico">${ICONS.check}</div>
      <h2>¡Portafolio completo!</h2>
      <p class="sheet-text">Guardamos tu información en este dispositivo.</p>
      <div class="sheet-actions"><button type="button" class="ok">Ver mi portafolio</button></div>`;
    $('.ok', sheet).addEventListener('click', () => App.go('portafolio.html'));
    back.appendChild(sheet);
    screen.appendChild(back);
  };
})();
