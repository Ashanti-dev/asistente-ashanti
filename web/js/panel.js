(async function () {
  const $ = s => document.querySelector(s);
  const cfg = window.CONFIG || {};
  const real = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  const sb = real ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  const PERFIL = { autoridades: 'Autoridades y personal municipal', sociedad_civil: 'Sociedad civil' };
  let fichas = await (await fetch('data/fichas.json')).json();
  const ejes = await (await fetch('data/ejes.json')).json();
  const nombreEje = id => (ejes.find(e => e.id === id) || {}).nombre || id;
  const fecha = s => s ? new Date(s).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }) : '';

  // ---- Datos (reales o de muestra) ----
  async function datos() {
    if (real) {
      const [p, c, d, doc, cfg] = await Promise.all([
        sb.from('personas').select('*').order('creado', { ascending: false }),
        sb.from('consultas').select('*, personas(nombres, correo, perfil, institucion, departamento)').order('creado', { ascending: false }),
        sb.from('descargas').select('consulta_id, tipo'),
        sb.from('documentos_contexto').select('*'),
        sb.from('configuracion').select('*')
      ]);
      for (const r of [p, c, d, doc, cfg]) if (r.error) throw r.error;
      return { personas: p.data, consultas: c.data.map(x => ({ ...x, persona: x.personas })), descargas: d.data, documentos: doc.data, configuracion: cfg.data };
    }
    const hoy = Date.now(), dia = 864e5;
    const personas = [
      { id: 1, creado: new Date(hoy - 2 * dia).toISOString(), nombres: 'Caso de prueba 1', correo: 'prueba1@ejemplo.pe', perfil: 'autoridades', institucion: 'Municipalidad Provincial de Huamanga', cargo: 'Subgerente de Participación Vecinal', departamento: 'Ayacucho', consentimiento_fecha: new Date(hoy - 2 * dia).toISOString() },
      { id: 2, creado: new Date(hoy - dia).toISOString(), nombres: 'Caso de prueba 2', correo: 'prueba2@ejemplo.pe', perfil: 'sociedad_civil', institucion: 'Colectivo de jóvenes afroperuanas (independiente)', cargo: 'Coordinadora', departamento: 'Lima', consentimiento_fecha: new Date(hoy - dia).toISOString() },
      { id: 3, creado: new Date(hoy - dia).toISOString(), nombres: 'Caso de prueba 3', correo: 'prueba3@ejemplo.pe', perfil: 'autoridades', institucion: 'Municipalidad Distrital de El Agustino', cargo: 'Regidor', departamento: 'Lima', consentimiento_fecha: new Date(hoy - dia).toISOString() }
    ];
    const consultas = [
      { id: 101, creado: personas[0].creado, persona: personas[0], perfil: 'autoridades', temas: ['participacion_juvenil', 'interculturalidad'], poblacion: 'Jóvenes de comunidades quechuahablantes', logro: 'Que decidan parte del presupuesto participativo 2027', prioridades: 'Presupuesto participativo', condiciones: 'Equipo de tres, sin partida', texto_propio: 'Las convocatorias salen en castellano y por Facebook.', fichas_citadas: [1, 3], hoja_markdown: null, tokens_entrada: 11840, tokens_salida: 2310, costo_usd: 0.07 },
      { id: 102, creado: personas[1].creado, persona: personas[1], perfil: 'sociedad_civil', temas: ['lucha_contra_discriminacion', 'enfoque_genero'], poblacion: 'Mujeres jóvenes afroperuanas', logro: 'Atención sin discriminación y derivación correcta', prioridades: 'Gerencia de Desarrollo Social', condiciones: '15 integrantes, sin presupuesto', texto_propio: 'Queremos llevar una propuesta concreta.', fichas_citadas: [8, 5, 6], hoja_markdown: null, tokens_entrada: 13020, tokens_salida: 2590, costo_usd: 0.08 },
      { id: 103, creado: personas[2].creado, persona: personas[2], perfil: 'autoridades', temas: ['participacion_ciudadana'], poblacion: 'Juntas vecinales', logro: 'Reactivar las juntas', prioridades: 'Seguridad y limpieza', condiciones: 'Sin presupuesto adicional', texto_propio: '', fichas_citadas: [7, 4], hoja_markdown: null, tokens_entrada: 10110, tokens_salida: 1980, costo_usd: 0.06 }
    ];
    return { personas, consultas, descargas: [{ consulta_id: 101, tipo: 'word' }, { consulta_id: 102, tipo: 'word' }, { consulta_id: 102, tipo: 'copia' }], documentos: [], configuracion: [{ clave: 'presupuesto_mensual_usd', valor: 20 }, { clave: 'limite_mensual_total', valor: 450 }, { clave: 'tipo_cambio', valor: 3.418 }] };
  }

  // ---- Sesión ----
  async function sesion() {
    if (!real) return { email: 'modo de prueba' };
    const { data } = await sb.auth.getSession(); return data.session?.user || null;
  }
  $('#f-login').addEventListener('submit', async e => {
    e.preventDefault(); $('#l-error').classList.add('oculto');
    const { error } = await sb.auth.signInWithPassword({ email: $('#l-correo').value.trim(), password: $('#l-clave').value });
    if (error) { $('#l-error').textContent = 'Correo o contraseña incorrectos.'; $('#l-error').classList.remove('oculto'); return; }
    arrancar();
  });
  $('#b-salir').addEventListener('click', async () => { if (real) await sb.auth.signOut(); location.reload(); });

  // ---- Pestañas ----
  document.querySelectorAll('.pestanas button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.pestanas button').forEach(x => x.classList.toggle('activa', x === b));
    document.querySelectorAll('div[data-tab]').forEach(t => t.classList.toggle('oculto', t.id !== 't-' + b.dataset.tab));
  }));

  function tabla(cols, filas, nombreExcel) {
    const id = 'x' + Math.random().toString(36).slice(2);
    const th = cols.map(c => `<th>${c.t}</th>`).join('');
    const tr = filas.map(f => '<tr>' + cols.map(c => `<td class="${c.recorte ? 'recorte' : ''}">${c.html ? c.html(f) : (c.v(f) ?? '')}</td>`).join('') + '</tr>').join('');
    setTimeout(() => $('#' + id).addEventListener('click', () => {
      const ws = XLSX.utils.json_to_sheet(filas.map(f => Object.fromEntries(cols.map(c => [c.t, c.v(f) ?? '']))));
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, nombreExcel.slice(0, 30));
      XLSX.writeFile(wb, `${nombreExcel}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }));
    return `<div class="barra-tabla"><span>${filas.length} registros <span class="previsual">Previsualización · el detalle completo está en el Excel</span></span><button class="boton secundario" id="${id}">Descargar Excel</button></div><div class="tabla-wrap"><table><thead><tr>${th}</tr></thead><tbody>${tr || '<tr><td colspan="' + cols.length + '">Sin registros todavía.</td></tr>'}</tbody></table></div>`;
  }
  function conteo(arr, f) { const m = {}; arr.forEach(x => { const k = f(x); if (k == null) return; (Array.isArray(k) ? k : [k]).forEach(kk => m[kk] = (m[kk] || 0) + 1); }); return Object.entries(m).sort((a, b) => b[1] - a[1]); }
  const graficas = [];
  function grafica(pares, titulo, color) {
    const id = 'g' + Math.random().toString(36).slice(2);
    graficas.push({ id, pares, titulo, color });
    return `<div class="grafica"><div class="cab"><span>${titulo}</span><span><button data-png="${id}">Descargar imagen</button> <button data-xls="${id}">Descargar Excel</button></span></div><div class="lienzo" style="position:relative;height:${Math.max(240, pares.length > 3 ? pares.length * 38 + 40 : 240)}px"><canvas id="${id}"></canvas></div></div>`;
  }
  function pintarGraficas() {
    Chart.defaults.font.family = "'Barlow', system-ui, sans-serif"; Chart.defaults.font.size = 13; Chart.defaults.color = '#333333';
    for (const g of graficas) {
      const horizontal = g.pares.length > 3;
      const cv = document.getElementById(g.id);
      const corto = v => { const t = String(v); return t.length > 34 ? t.slice(0, 32) + '…' : t; };
      new Chart(cv, {
        type: 'bar',
        data: { labels: g.pares.map(p => p[0]), datasets: [{ data: g.pares.map(p => p[1]), backgroundColor: g.color, borderRadius: 3, maxBarThickness: 36 }] },
        options: { indexAxis: horizontal ? 'y' : 'x', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ' ' + c.raw } } },
          scales: { x: { grid: { display: !horizontal, color: '#EEEEEC' }, ticks: { precision: 0 } }, y: { grid: { display: horizontal, color: '#EEEEEC' }, ticks: { precision: 0, autoSkip: false, callback: function (v) { return horizontal ? corto(this.getLabelForValue(v)) : v; } } } } }
      });
    }
    document.querySelectorAll('[data-png]').forEach(b => b.addEventListener('click', () => {
      const g = graficas.find(x => x.id === b.dataset.png); const cv = document.getElementById(g.id);
      const out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height; const cx = out.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, out.width, out.height); cx.drawImage(cv, 0, 0);
      const a = document.createElement('a'); a.download = g.titulo.replace(/\s+/g, '_') + '.png'; a.href = out.toDataURL('image/png'); a.click();
    }));
    document.querySelectorAll('[data-xls]').forEach(b => b.addEventListener('click', () => {
      const g = graficas.find(x => x.id === b.dataset.xls);
      const ws = XLSX.utils.json_to_sheet(g.pares.map(([k, n]) => ({ Categoría: k, Cantidad: n })));
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Datos'); XLSX.writeFile(wb, g.titulo.replace(/\s+/g, '_') + '.xlsx');
    }));
  }

  async function arrancar() {
    const u = await sesion();
    if (!u) { $('#v-login').classList.remove('oculto'); $('#v-panel').classList.add('oculto'); return; }
    $('#v-login').classList.add('oculto'); $('#v-panel').classList.remove('oculto'); $('#quien').textContent = u.email;
    if (!real) $('#aviso-prueba').classList.remove('oculto');
    const d = await datos();
    const descPorConsulta = {}; d.descargas.forEach(x => descPorConsulta[x.consulta_id] = (descPorConsulta[x.consulta_id] || 0) + 1);

    // Indicadores
    const porPerfil = conteo(d.personas, p => PERFIL[p.perfil]);
    const porDep = conteo(d.personas, p => p.departamento || 'Sin indicar');
    const temas = conteo(d.consultas, c => (c.temas || []).map(nombreEje));
    const citadas = conteo(d.consultas, c => (c.fichas_citadas || []).map(n => n + '. ' + (fichas[n - 1] || {}).nombre_corto));
    const costo = d.consultas.reduce((s, c) => s + (+c.costo_usd || 0), 0);
    $('#t-indicadores').innerHTML = `
      <div class="kpis">
        <div class="kpi"><b>${d.personas.length}</b><span>Personas registradas</span></div>
        <div class="kpi"><b>${d.consultas.length}</b><span>Consultas realizadas</span></div>
        <div class="kpi"><b>${d.descargas.filter(x => x.tipo === 'word').length}</b><span>Hojas descargadas en Word</span></div>
        <div class="kpi"><b>${d.consultas.length ? 'US$ ' + (costo / d.consultas.length).toFixed(3) : '–'}</b><span>Costo medio por consulta (API)</span></div>
      </div>
      <div class="dos">${grafica(porPerfil, 'Personas registradas por perfil', '#6E2F80')}${grafica(porDep, 'Personas registradas por departamento', '#58A068')}${grafica(temas, 'Temas más consultados', '#C8161C')}${grafica(citadas, 'Buenas prácticas más citadas', '#F0A020')}</div>
      <div class="barra-tabla" style="margin-top:16px"><span class="previsual">Previsualización</span><button class="boton secundario" id="x-todo">Descargar todos los datos en Excel</button></div>`;
    pintarGraficas();
    $('#x-todo').addEventListener('click', () => {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Indicador: 'Personas registradas', Valor: d.personas.length }, { Indicador: 'Consultas realizadas', Valor: d.consultas.length }, { Indicador: 'Hojas descargadas en Word', Valor: d.descargas.filter(x => x.tipo === 'word').length }, { Indicador: 'Costo medio por consulta (US$)', Valor: d.consultas.length ? +(costo / d.consultas.length).toFixed(4) : 0 }]), 'Indicadores');
      for (const g of graficas) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(g.pares.map(([k, n]) => ({ Categoría: k, Cantidad: n }))), g.titulo.slice(0, 30));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(d.consultas.map(c => ({ Fecha: fecha(c.creado), Persona: c.persona?.nombres, Perfil: PERFIL[c.perfil], Institución: c.persona?.institucion, Departamento: c.persona?.departamento, Temas: (c.temas || []).map(nombreEje).join('; '), Población: c.poblacion, 'Lo que quiere lograr': c.logro, Prioridades: c.prioridades, Condiciones: c.condiciones, 'Texto propio': c.texto_propio, 'Buenas prácticas citadas': (c.fichas_citadas || []).join(', '), Descargas: descPorConsulta[c.id] || 0 }))), 'Consultas');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(d.personas.map(p => ({ 'Fecha de registro': fecha(p.creado), 'Nombres y apellidos': p.nombres, Correo: p.correo, Perfil: PERFIL[p.perfil], 'Municipalidad u organización': p.institucion, 'Cargo o rol': p.cargo, Departamento: p.departamento, Consentimiento: fecha(p.consentimiento_fecha) }))), 'Usuarios');
      XLSX.writeFile(wb, `Asistente_Inteligente_datos_${new Date().toISOString().slice(0, 10)}.xlsx`);
    });

    // Consultas
    const colsC = [
      { t: 'Fecha', v: c => fecha(c.creado) }, { t: 'Persona', v: c => c.persona?.nombres }, { t: 'Perfil', v: c => PERFIL[c.perfil] },
      { t: 'Institución', v: c => c.persona?.institucion, recorte: true }, { t: 'Temas', v: c => (c.temas || []).map(nombreEje).join('; '), recorte: true },
      { t: 'Población', v: c => c.poblacion, recorte: true }, { t: 'Lo que quiere lograr', v: c => c.logro, recorte: true }, { t: 'Prioridades', v: c => c.prioridades, recorte: true }, { t: 'Condiciones', v: c => c.condiciones, recorte: true }, { t: 'Texto propio', v: c => c.texto_propio, recorte: true },
      { t: 'Buenas prácticas citadas', v: c => (c.fichas_citadas || []).join(', ') }, { t: 'Descargas', v: c => descPorConsulta[c.id] || 0 },
      { t: 'Hoja', v: c => c.hoja_markdown || '', html: c => c.hoja_markdown ? `<button class="ver" data-id="${c.id}">Ver hoja</button>` : '<span style="color:var(--gris)">(no guardada)</span>' }
    ];
    $('#t-consultas').innerHTML = tabla(colsC, d.consultas, 'Consultas');
    $('#t-consultas').addEventListener('click', e => { const b = e.target.closest('.ver'); if (!b) return; const c = d.consultas.find(x => String(x.id) === b.dataset.id); $('#dlg-hoja').innerHTML = marked.parse(c.hoja_markdown); dlg.showModal(); });

    // Usuarios
    const colsU = [{ t: 'Fecha de registro', v: p => fecha(p.creado) }, { t: 'Nombres y apellidos', v: p => p.nombres }, { t: 'Correo', v: p => p.correo }, { t: 'Perfil', v: p => PERFIL[p.perfil] }, { t: 'Municipalidad u organización', v: p => p.institucion }, { t: 'Cargo o rol', v: p => p.cargo }, { t: 'Departamento', v: p => p.departamento }, { t: 'Consentimiento', v: p => fecha(p.consentimiento_fecha) }];
    $('#t-usuarios').innerHTML = tabla(colsU, d.personas, 'Usuarios');

    // ===== Contenido: fichas y documentos de contexto =====
    if (real) { const rf = await sb.from('fichas').select('*').order('numero'); if (!rf.error) fichas = rf.data; }
    else fichas = fichas.map(f => ({ activa: true, ...f }));
    const esc = t => String(t ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const CAMPOS = [['nombre_accion', 'Nombre de la acción'], ['lugar', 'Lugar'], ['reconocimiento', 'Reconocimiento'], ['periodo', 'Periodo'], ['desafio_inicial', 'Desafío inicial'], ['descripcion', 'Descripción de la intervención'], ['poblacion', 'Población destinataria'], ['resultados_alcanzados', 'Resultados alcanzados'], ['factores_exito', 'Factores de éxito'], ['dificultades', 'Dificultades'], ['aprendizajes', 'Aprendizajes'], ['elementos_adaptables', 'Elementos adaptables'], ['condiciones_adaptacion', 'Condiciones de adaptación'], ['accion_sugerida', 'Acción sugerida'], ['instrumentos', 'Instrumentos y fuentes de verificación']];
    function verFicha(f) {
      const fuentes = (f.fuentes_verificacion || []).map((t, i) => `<li>${esc(t)}${f.fuentes_url?.[i] ? ` <a href="${esc(f.fuentes_url[i])}" target="_blank" rel="noopener">Ver fuente</a>` : ''}</li>`).join('');
      $('#dlg-hoja').innerHTML = `<h1>Ficha ${f.numero}. ${esc(f.nombre_corto)}</h1><p class="meta">${esc(f.pais || '')} · ${(f.ejes || []).map(nombreEje).join('; ')} · ${f.activa === false ? 'Inactiva' : 'Activa'}</p>` +
        CAMPOS.map(([k, t]) => f[k] ? `<h2>${t}</h2><p>${esc(f[k])}</p>` : '').join('') + `<h2>Fuentes de verificación</h2><ul>${fuentes}</ul>`;
      dlg.showModal();
    }
    function pintarContenido() {
      const filas = fichas.map(f => `<tr><td>${f.numero}</td><td>${esc(f.nombre_corto)}</td><td>${esc(f.pais || '')}</td><td>${(f.ejes || []).map(nombreEje).join('; ')}</td>
        <td><label class="interruptor"><input type="checkbox" data-activa="${f.numero}" ${f.activa === false ? '' : 'checked'}><span>${f.activa === false ? 'Inactiva' : 'Activa'}</span></label></td>
        <td><button class="ver" data-ficha="${f.numero}">Ver ficha</button></td></tr>`).join('');
      $('#t-contenido').innerHTML = `
        <div class="barra-tabla"><h2 style="margin:0">Fichas de buenas prácticas</h2><button class="boton" id="b-nueva-ficha">Agregar ficha</button></div>
        <p class="ayuda-panel">Las fichas activas son las que usa el asistente. Una ficha inactiva deja de usarse en las consultas nuevas, pero no se borra.</p>
        <div class="tabla-wrap"><table><thead><tr><th>N.°</th><th>Ficha</th><th>País</th><th>Ejes temáticos</th><th>Estado</th><th></th></tr></thead><tbody>${filas}</tbody></table></div>
        <div id="form-ficha" class="oculto"></div>
        <div class="barra-tabla" style="margin-top:40px"><h2 style="margin:0">Documentos de contexto</h2><button class="boton" id="b-nuevo-doc">Agregar documento</button></div>
        <p class="ayuda-panel">Textos de apoyo por eje temático (por ejemplo, las preguntas seleccionadas de los manuales). El asistente los lee en cada consulta del eje, por lo que cada documento aumenta el costo por consulta.</p>
        <div id="form-doc" class="oculto"></div>
        <div class="tabla-wrap"><table><thead><tr><th>Documento</th><th>Eje</th><th>Palabras</th><th>Fecha de carga</th><th>Estado</th><th></th></tr></thead><tbody>${d.documentos.map(x => `<tr><td>${esc(x.nombre)}</td><td>${nombreEje(x.eje)}</td><td>${(x.contenido || '').split(/\s+/).filter(Boolean).length}</td><td>${fecha(x.creado)}</td>
          <td><label class="interruptor"><input type="checkbox" data-doc-activo="${x.id}" ${x.activo === false ? '' : 'checked'}><span>${x.activo === false ? 'Inactivo' : 'Activo'}</span></label></td>
          <td><button class="ver" data-doc="${x.id}">Ver</button> · <button class="ver" data-doc-borrar="${x.id}">Eliminar</button></td></tr>`).join('') || '<tr><td colspan="6">Todavía no hay documentos de contexto.</td></tr>'}</tbody></table></div>`;
    }
    pintarContenido();
    $('#t-contenido').addEventListener('click', async e => {
      const t = e.target;
      if (t.dataset.ficha) return verFicha(fichas.find(f => String(f.numero) === t.dataset.ficha));
      if (t.dataset.doc) { const x = d.documentos.find(y => y.id === t.dataset.doc); $('#dlg-hoja').innerHTML = `<h1>${esc(x.nombre)}</h1><p class="meta">${nombreEje(x.eje)}</p><p style="white-space:pre-wrap">${esc(x.contenido)}</p>`; return dlg.showModal(); }
      if (t.dataset.docBorrar) {
        if (!confirm('¿Eliminar este documento de contexto? No se puede deshacer.')) return;
        if (real) { const r = await sb.from('documentos_contexto').delete().eq('id', t.dataset.docBorrar); if (r.error) return alert('No se pudo eliminar.'); }
        d.documentos = d.documentos.filter(y => y.id !== t.dataset.docBorrar); return pintarContenido();
      }
      if (t.id === 'b-nueva-ficha') {
        const f = $('#form-ficha'); f.classList.toggle('oculto');
        f.innerHTML = `<div class="kpi conf"><h3>Nueva ficha</h3><p class="ayuda">Los campos son los de la sistematización. El asistente la usará desde la siguiente consulta.</p>
          <div class="campo"><label>Nombre corto (como se citará)</label><input type="text" id="nf-nombre_corto" placeholder="Por ejemplo: Presupuesto participativo juvenil en Huanta"></div>
          <div class="campo"><label>País</label><input type="text" id="nf-pais"></div>
          <div class="campo"><span class="etiqueta">Ejes temáticos</span><div class="casillas">${ejes.map(x => `<label class="casilla"><input type="checkbox" name="nf-eje" value="${x.id}"><span>${x.nombre}</span></label>`).join('')}</div></div>
          ${CAMPOS.map(([k, t]) => `<div class="campo"><label>${t}</label><textarea id="nf-${k}" rows="3"></textarea></div>`).join('')}
          <div class="campo"><label>Fuentes de verificación (una por línea; puede añadir el enlace al final de cada línea)</label><textarea id="nf-fuentes" rows="4"></textarea></div>
          <button class="boton" id="b-guardar-ficha">Guardar ficha</button> <span id="nf-estado" class="ayuda"></span></div>`;
        return;
      }
      if (t.id === 'b-guardar-ficha') {
        const v = k => $('#nf-' + k).value.trim();
        const ejesSel = [...document.querySelectorAll('input[name=nf-eje]:checked')].map(i => i.value);
        if (!v('nombre_corto') || !v('nombre_accion') || !ejesSel.length) { $('#nf-estado').textContent = 'Complete al menos el nombre corto, el nombre de la acción y un eje.'; return; }
        const lineas = v('fuentes').split('\n').map(x => x.trim()).filter(Boolean);
        const nueva = { numero: Math.max(0, ...fichas.map(f => f.numero)) + 1, nombre_corto: v('nombre_corto'), pais: v('pais'), ejes: ejesSel, eje_principal: ejesSel[0], activa: true,
          fuentes_verificacion: lineas.map(l => l.replace(/\s*https?:\/\/\S+$/, '')), fuentes_url: lineas.map(l => (l.match(/https?:\/\/\S+$/) || [''])[0]) };
        CAMPOS.forEach(([k]) => nueva[k] = v(k) || 'No consigna información.');
        if (real) { const r = await sb.from('fichas').insert(nueva); if (r.error) { $('#nf-estado').textContent = 'No se pudo guardar: ' + r.error.message; return; } }
        fichas.push(nueva); pintarContenido(); return;
      }
      if (t.id === 'b-nuevo-doc') {
        const f = $('#form-doc'); f.classList.toggle('oculto');
        f.innerHTML = `<div class="kpi conf"><h3>Nuevo documento de contexto</h3>
          <div class="campo"><label>Nombre del documento</label><input type="text" id="nd-nombre" placeholder="Por ejemplo: Manual de género, preguntas seleccionadas"></div>
          <div class="campo"><label>Eje temático</label><select id="nd-eje">${ejes.map(x => `<option value="${x.id}">${x.nombre}</option>`).join('')}</select></div>
          <div class="campo"><label>Cargar desde un archivo Word (.docx) o de texto (.txt)</label><input type="file" id="nd-archivo" accept=".docx,.txt"></div>
          <div class="campo"><label>Contenido</label><textarea id="nd-contenido" rows="10" placeholder="Pegue aquí el texto, o cárguelo desde un archivo."></textarea><div class="contador" id="nd-palabras">0 palabras</div></div>
          <button class="boton" id="b-guardar-doc">Guardar documento</button> <span id="nd-estado" class="ayuda"></span></div>`;
        const cuenta = () => $('#nd-palabras').textContent = $('#nd-contenido').value.split(/\s+/).filter(Boolean).length.toLocaleString('es-PE') + ' palabras (unos US$ ' + ($('#nd-contenido').value.split(/\s+/).filter(Boolean).length * 1.4 * 3 / 1e6).toFixed(4).replace('.', ',') + ' más por consulta del eje)';
        $('#nd-contenido').addEventListener('input', cuenta);
        $('#nd-archivo').addEventListener('change', async ev => {
          const file = ev.target.files[0]; if (!file) return;
          if (/\.txt$/i.test(file.name)) $('#nd-contenido').value = await file.text();
          else { const r = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() }); $('#nd-contenido').value = r.value.trim(); }
          if (!$('#nd-nombre').value) $('#nd-nombre').value = file.name.replace(/\.(docx|txt)$/i, '');
          cuenta();
        });
        return;
      }
      if (t.id === 'b-guardar-doc') {
        const nuevo = { nombre: $('#nd-nombre').value.trim(), eje: $('#nd-eje').value, contenido: $('#nd-contenido').value.trim(), activo: true };
        if (!nuevo.nombre || !nuevo.contenido) { $('#nd-estado').textContent = 'Complete el nombre y el contenido.'; return; }
        if (real) { const r = await sb.from('documentos_contexto').insert(nuevo).select().single(); if (r.error) { $('#nd-estado').textContent = 'No se pudo guardar: ' + r.error.message; return; } d.documentos.push(r.data); }
        else d.documentos.push({ ...nuevo, id: 'p' + Date.now(), creado: new Date().toISOString() });
        pintarContenido(); return;
      }
    });
    $('#t-contenido').addEventListener('change', async e => {
      const t = e.target;
      if (t.dataset.activa) {
        const f = fichas.find(x => String(x.numero) === t.dataset.activa); f.activa = t.checked;
        if (real) { const r = await sb.from('fichas').update({ activa: t.checked }).eq('numero', f.numero); if (r.error) { alert('No se pudo cambiar el estado.'); f.activa = !t.checked; } }
        pintarContenido();
      }
      if (t.dataset.docActivo) {
        const x = d.documentos.find(y => y.id === t.dataset.docActivo); x.activo = t.checked;
        if (real) await sb.from('documentos_contexto').update({ activo: t.checked }).eq('id', x.id);
        pintarContenido();
      }
    });

    // ===== Configuración: presupuesto y límite mensual =====
    const valor = k => Number((d.configuracion.find(x => x.clave === k) || {}).valor ?? 0);
    const conCosto = d.consultas.filter(c => +c.costo_usd > 0);
    const costoMedio = conCosto.length ? conCosto.reduce((a, c) => a + +c.costo_usd, 0) / conCosto.length : 0.045;
    const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0, 0, 0, 0);
    const delMes = d.consultas.filter(c => new Date(c.creado) >= inicioMes && c.hoja_markdown !== undefined);
    const gastoMes = delMes.reduce((a, c) => a + (+c.costo_usd || 0), 0);
    const usd = n => 'US$ ' + n.toFixed(2).replace('.', ',');
    const sol = n => 'S/ ' + n.toFixed(2).replace('.', ',');
    const fmtMil = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const presupuesto = valor('presupuesto_mensual_usd') || 20, limite = valor('limite_mensual_total') || 400;
    const tcInicial = valor('tipo_cambio') || 3.418;
    $('#t-configuracion').innerHTML = `
      <div class="kpis">
        <div class="kpi"><b>${usd(costoMedio).replace('US$ ', 'US$ ')}</b><span>Costo promedio por consulta${conCosto.length ? ' (real, ' + conCosto.length + ' consultas)' : ' (estimado)'}</span></div>
        <div class="kpi"><b>${Math.floor(presupuesto / costoMedio)}</b><span>Consultas al mes que alcanzan con ${usd(presupuesto)}</span></div>
        <div class="kpi"><b>${delMes.length} de ${limite}</b><span>Consultas usadas este mes</span></div>
        <div class="kpi"><b>${usd(gastoMes)}</b><span>Gasto en la API este mes</span></div>
      </div>
      <div class="dos">
        <div class="kpi conf">
          <h3>Presupuesto y límite del mes</h3>
          <p class="ayuda">Cuando se llega al límite, la herramienta deja de generar hojas hasta el primer día del mes siguiente. Así el gasto nunca pasa del presupuesto. El botón Guardar también guarda el tipo de cambio.</p>
          <div class="campo"><label for="c-presupuesto">Presupuesto mensual para la API (US$)</label><input type="number" min="1" step="1" id="c-presupuesto" value="${presupuesto}"></div>
          <div class="campo"><label for="c-limite">Límite de consultas al mes</label><input type="number" min="1" id="c-limite" value="${limite}"><p class="ayuda" id="c-sugerido"></p></div>
          <button class="boton" id="c-guardar">Guardar</button>
          <p class="ayuda" id="c-estado"></p>
        </div>
        <div class="kpi conf simulador">
          <h3>¿Cuánto cuesta al mes?</h3>
          <p class="ayuda">Calculado con el costo promedio por consulta (${usd(costoMedio)}). Escriba el tipo de cambio del día y la tabla se recalcula.</p>
          <div class="campo"><label for="s-tc">Tipo de cambio (soles por dólar)</label><input type="number" min="0" step="0.001" id="s-tc" value="${tcInicial}"></div>
          <div class="tabla-wrap"><table><thead><tr><th>Consultas al mes</th><th>Costo en dólares</th><th>Costo en soles</th></tr></thead><tbody id="s-tabla"></tbody></table></div>
          <div class="campo" style="margin-top:16px"><label for="s-mes">Otra cantidad de consultas al mes</label><input type="number" min="0" id="s-mes" value="100"></div>
          <div class="resultado"><span>Costo estimado al mes</span><b id="s-total">–</b></div>
        </div>
      </div>`;
    const sugerir = () => { const p = +$('#c-presupuesto').value || 0; $('#c-sugerido').textContent = `Con ${usd(p)} alcanzan unas ${Math.floor(p / costoMedio)} consultas al mes. Se sugiere un límite un poco menor, por ejemplo ${Math.floor(p / costoMedio * 0.9)}.`; };
    $('#c-presupuesto').addEventListener('input', sugerir); sugerir();
    const simular = () => {
      const tc = +$('#s-tc').value || 0, n = +$('#s-mes').value || 0;
      $('#s-tabla').innerHTML = [50, 100, 200, 300, 400, 500].map(k => `<tr><td>${k}</td><td>${usd(k * costoMedio)}</td><td>${sol(k * costoMedio * tc)}</td></tr>`).join('');
      $('#s-total').textContent = usd(n * costoMedio) + ' (' + sol(n * costoMedio * tc) + ')';
    };
    ['#s-mes', '#s-tc'].forEach(x => $(x).addEventListener('input', simular)); simular();
    $('#c-guardar').addEventListener('click', async () => {
      const p = Math.max(1, +$('#c-presupuesto').value || 1), l = Math.max(1, +$('#c-limite').value || 1);
      if (!real) { $('#c-estado').textContent = 'Modo de prueba: no se guarda.'; return; }
      const r1 = await sb.from('configuracion').update({ valor: p, actualizado: new Date().toISOString() }).eq('clave', 'presupuesto_mensual_usd');
      const r2 = await sb.from('configuracion').update({ valor: l, actualizado: new Date().toISOString() }).eq('clave', 'limite_mensual_total');
      const tc = +$('#s-tc').value; if (tc > 0) await sb.from('configuracion').update({ valor: tc, actualizado: new Date().toISOString() }).eq('clave', 'tipo_cambio');
      $('#c-estado').textContent = (r1.error || r2.error) ? 'No se pudo guardar. Revise su conexión.' : 'Guardado. Rige desde la siguiente consulta.';
    });
  }
  arrancar();
})();
