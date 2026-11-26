/* =====================================================
   VENTANA: Mi portafolio (portafolio.html)
   Reúne todo lo capturado en las demás ventanas en una vista
   tipo currículum, con avance y exportación a PDF (imprimir).
   ===================================================== */
(() => {
  'use strict';
  if (App.halt) return;
  const { $, el, profile, session, go } = App;

  /* ---------- Utilidades ---------- */
  const ico = p => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
  const I = {
    user: ico('<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    edit: ico('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
    file: ico('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>'),
    check: ico('<path d="M20 6L9 17l-5-5"/>'),
    clock: ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>')
  };

  const txt = (tag, cls, s) => { const n = el(tag, cls); n.textContent = s; return n; };
  const str = v => (typeof v === 'string' ? v.trim() : '');
  const arr = v => (Array.isArray(v) ? v : (str(v) ? [str(v)] : [])).filter(Boolean);

  const tags = (items, cls = '') => {
    const box = el('div', 'tags');
    items.forEach(t => {
      const s = el('span', 'tag ' + cls);
      if (cls === 'file') s.innerHTML = I.file;
      s.append(t);
      box.appendChild(s);
    });
    return box;
  };

  const entry = (title, sub, meta, desc, files) => {
    const e = el('div', 'entry');
    if (title) e.appendChild(txt('strong', '', title));
    if (sub) e.appendChild(txt('span', 'sub', sub));
    if (meta) e.appendChild(txt('span', 'meta', meta));
    if (desc) e.appendChild(txt('p', 'desc', desc));
    if (files && files.length) e.appendChild(tags(files, 'file'));
    return e;
  };

  const kv = (label, value) => {
    const r = el('div', 'kv');
    r.appendChild(txt('b', '', label));
    r.appendChild(txt('span', '', value));
    return r;
  };

  /* ---------- Secciones del currículum ---------- */
  const sections = [
    {
      title: 'Perfil profesional', page: 'intereses.html',
      build() {
        const s = str(profile.especialidad);
        return s ? [txt('p', 'cv-text', s)] : null;
      }
    },
    {
      title: 'Formación académica', page: 'formacion-academica.html',
      build() {
        const data = profile.academica || {};
        const out = [];
        [['ingenieria', 'Ingeniería'], ['tsu', 'TSU'], ['preparatoria', 'Preparatoria']].forEach(([id, label]) => {
          const d = data[id];
          if (!d || !(str(d.instituto) || str(d.fechas) || str(d.documento))) return;
          out.push(entry(label, str(d.instituto), str(d.fechas), '', str(d.documento) ? [str(d.documento)] : []));
        });
        return out.length ? out : null;
      }
    },
    {
      title: 'Formación extracurricular', page: 'formacion-extracurricular.html',
      build() {
        const out = [];
        [['Cursos', 'cursos'], ['Congresos', 'congresos'], ['Conferencias', 'conferencias'], ['Certificado', 'certificado']]
          .forEach(([label, key]) => { if (str(profile[key])) out.push(kv(label, str(profile[key]))); });
        return out.length ? out : null;
      }
    },
    {
      title: 'Experiencia laboral', page: 'experiencia-laboral.html',
      build() {
        const puesto = str(profile.puesto), empresa = str(profile.empresa), periodo = str(profile.periodo);
        if (!puesto && !empresa && !periodo) return null;
        return [entry(puesto || empresa, puesto ? empresa : '', periodo)];
      }
    },
    {
      title: 'Proyectos y prácticas', page: 'proyectos.html',
      build() {
        const nombre = str(profile.practicas), desc = str(profile.descripcion), ev = arr(profile.evidencias);
        if (!nombre && !desc && !ev.length) return null;
        return [entry(nombre || 'Evidencias', '', '', desc, ev)];
      }
    },
    {
      title: 'Habilidades', page: 'habilidades.html',
      build() {
        const t = arr(profile.tecnicas), b = arr(profile.blandas);
        if (!t.length && !b.length) return null;
        const out = [];
        if (t.length) { out.push(txt('p', 'group-label', 'Técnicas')); out.push(tags(t)); }
        if (b.length) { out.push(txt('p', 'group-label', 'Blandas')); out.push(tags(b)); }
        return out;
      }
    },
    {
      title: 'Intereses', page: 'intereses.html',
      build() {
        const i = arr(profile.intereses);
        return i.length ? [tags(i)] : null;
      }
    }
  ];

  /* ---------- Construcción de la página ---------- */
  App.pages.portafolio = () => {
    const nombre = str(profile.nombre) || str(session && session.name) || 'Tu nombre';
    const correo = session && session.email ? session.email : '';
    document.title = 'CV - ' + nombre;

    /* Encabezado del CV */
    const cv = $('#cv');
    const head = el('div', 'cv-head');
    const photo = el('div', 'cv-photo');
    if (profile.foto) {
      const img = el('img'); img.src = profile.foto; img.alt = 'Foto de ' + nombre; photo.appendChild(img);
    } else photo.innerHTML = I.user;
    const id = el('div', 'cv-id');
    id.appendChild(txt('h2', 'cv-name', nombre));
    if (correo) id.appendChild(txt('p', 'cv-sub', correo));
    head.append(photo, id);
    cv.appendChild(head);

    /* Secciones */
    const missing = [];
    let filled = str(profile.nombre) ? 1 : 0;
    if (!str(profile.nombre)) missing.push({ title: 'Datos personales', page: 'perfil.html' });

    sections.forEach(s => {
      const content = s.build();
      const sec = el('section', 'cv-sec' + (content ? '' : ' empty'));
      const top = el('div', 'cv-sec-head');
      top.appendChild(txt('h2', '', s.title));
      const edit = el('button', 'edit no-print');
      edit.type = 'button'; edit.setAttribute('aria-label', 'Editar ' + s.title); edit.innerHTML = I.edit;
      edit.addEventListener('click', () => go(s.page));
      top.appendChild(edit);
      sec.appendChild(top);

      if (content) { filled++; content.forEach(n => sec.appendChild(n)); }
      else {
        missing.push(s);
        const box = el('div', 'empty-box');
        box.appendChild(txt('span', '', 'Aún sin completar'));
        const b = el('button'); b.type = 'button'; b.textContent = 'Completar';
        b.addEventListener('click', () => go(s.page));
        box.appendChild(b);
        sec.appendChild(box);
      }
      cv.appendChild(sec);
    });

    /* Avance */
    const total = sections.length + 1;
    const pct = Math.round((filled / total) * 100);
    const prog = $('#progress');
    const top = el('div', 'top');
    top.append(txt('strong', '', 'Avance de tu portafolio'), txt('span', '', pct + '%'));
    const bar = el('div', 'bar'); const fill = el('i'); bar.appendChild(fill);
    prog.append(top, bar);
    if (missing.length) {
      prog.appendChild(txt('p', 'missing-title', 'Te falta completar:'));
      const sug = el('div', 'suggest');
      missing.forEach(m => {
        const b = el('button'); b.type = 'button'; b.textContent = '+ ' + m.title;
        b.addEventListener('click', () => go(m.page));
        sug.appendChild(b);
      });
      prog.appendChild(sug);
    } else {
      prog.appendChild(txt('p', 'done-msg', '¡Tu portafolio está completo!'));
    }
    requestAnimationFrame(() => requestAnimationFrame(() => { fill.style.width = pct + '%'; }));

    /* Documentos personales (no se imprimen) */
    const docs = $('#docs');
    docs.appendChild(txt('h2', '', 'Documentos personales'));
    docs.appendChild(txt('p', 'hint-text', 'Solo para ti: no aparecen en el PDF del currículum.'));
    [
      ['CURP', str(profile.curp)],
      ['Acta de nacimiento', str(profile.acta)],
      ['INE', str(profile.ine)]
    ].forEach(([label, value]) => {
      const row = el('div', 'doc-row' + (value ? ' ok' : ''));
      const ic = el('span', 'doc-ico'); ic.innerHTML = value ? I.check : I.clock;
      const t = el('div', 't');
      t.append(txt('b', '', label), txt('span', '', value || 'Pendiente'));
      row.append(ic, t);
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => go('perfil.html'));
      docs.appendChild(row);
    });

    /* Acciones */
    $('#editar').addEventListener('click', () => go('perfil.html', 'back'));
    $('#pdf').addEventListener('click', () => {
      if (filled <= 1) { App.toast('Completa al menos una sección para generar tu CV'); return; }
      window.print();
    });
  };
})();
