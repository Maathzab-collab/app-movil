/* =====================================================
   VENTANA: Formación académica (formacion-academica.html)
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, el, ICONS, profile, saveProfile, openSheet, toast } = App;

  App.pages['formacion-academica'] = () => {
    const levels = [
      { id: 'preparatoria', label: 'Preparatoria', icon: ICONS.book },
      { id: 'tsu', label: 'TSU', icon: ICONS.award },
      { id: 'ingenieria', label: 'Ingeniería', icon: ICONS.cap }
    ];
    const data = profile.academica || (profile.academica = {});
    const list = $('#levels');

    const render = () => {
      list.innerHTML = '';
      levels.forEach(l => {
        const d = data[l.id] || {};
        const parts = [d.instituto, d.fechas, d.documento].filter(Boolean);
        const done = parts.length > 0;
        const b = el('button', 'level' + (done ? ' done' : ''));
        b.type = 'button';
        b.innerHTML = `<span class="ico">${done ? ICONS.check : l.icon}</span>
          <span class="txt"><span class="name"></span><span class="sub"></span></span>
          <span class="chev">${ICONS.chevron}</span>`;
        $('.name', b).textContent = l.label;
        $('.sub', b).textContent = done ? parts.join(' · ') : 'Toca para agregar tus datos';
        b.addEventListener('click', () => openSheet({
          title: l.label,
          fields: [
            { key: 'fechas', label: 'Fechas', placeholder: 'Ej. 2019 - 2022', value: d.fechas },
            { key: 'instituto', label: 'Instituto', placeholder: 'Nombre de la escuela', value: d.instituto },
            { key: 'documento', label: 'Documento', type: 'file', value: d.documento }
          ],
          onSave: v => { data[l.id] = v; saveProfile(); render(); toast('Guardado'); }
        }));
        list.appendChild(b);
      });
    };
    render();
  };
})();
