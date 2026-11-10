(async function () {
  const $ = s => document.querySelector(s);
  const cfg = window.CONFIG || {};
  const real = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  const sb = real ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
  const PERFIL = { autoridades: 'Autoridades y funcionarios municipales', sociedad_civil: 'Sociedad civil' };
  const fichas = await (await fetch('data/fichas.json')).json();
  const ejes = await (await fetch('data/ejes.json')).json();
  const nombreEje = id => (ejes.find(e => e.id === id) || {}).nombre || id;
  const fecha = s => s ? new Date(s).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }) : '';

  // ---- Datos (reales o de muestra) ----
  async function datos() {
    if (real) {
      const [p, c, d, doc] = await Promise.all([
        sb.from('personas').select('*').order('creado', { ascending: false }),
        sb.from('consultas').select('*, personas(nombres, correo, perfil, institucion, departamento)').order('creado', { ascending: false }),
        sb.from('descargas').select('consulta_id, tipo'),
        sb.from('documentos_contexto').select('*'),
        sb.from('configuracion').select('*')
      ]);
      const cf = arguments.length, conf = (await Promise.resolve()).valueOf;
      for (const r of [p, c, d, doc]) if (r.error) throw r.error;
      return { personas: p.data, consultas: c.data.map(x => ({ ...x, persona: x.personas })), descargas: d.data, documentos: doc.data, configuracion: (arguments, null) };
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
    return { personas, consultas, descargas: [{ consulta_id: 101, tipo: 'word' }, { consulta_id: 102, tipo: 'word' }, { consulta_id: 102, tipo: 'copia' }], documentos: [] };
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
    document.querySelectorAll('[data-tab]').forEach(t => t.classList.toggle('oculto', t.id !== 't-' + b.dataset.tab));
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

    // Contenido
    const colsF = [{ t: 'N.°', v: f => f.numero }, { t: 'Nombre de la acción', v: f => f.nombre_accion, recorte: true }, { t: 'Lugar', v: f => f.lugar, recorte: true }, { t: 'Ejes temáticos', v: f => f.ejes.map(nombreEje).join('; '), recorte: true }, { t: 'Reconocimiento', v: f => f.reconocimiento, recorte: true }, { t: 'Fuentes', v: f => f.fuentes_verificacion.length }];
    $('#t-contenido').innerHTML = `<p class="aviso">Las 8 fichas de buenas prácticas de la Caja de Herramientas. La carga de fichas y documentos nuevos desde este panel entra con el Producto 3.</p>` + tabla(colsF, fichas, 'Fichas') +
      `<h2>Documentos de contexto</h2>` + tabla([{ t: 'Documento', v: x => x.nombre }, { t: 'Eje', v: x => nombreEje(x.eje) }, { t: 'Fecha de carga', v: x => fecha(x.creado) }], d.documentos, 'Documentos');
  }
  arrancar();
})();
