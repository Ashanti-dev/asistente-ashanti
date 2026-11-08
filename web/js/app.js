(async function () {
  const $ = s => document.querySelector(s);
  const vistas = [...document.querySelectorAll('[data-vista]')];
  const estado = { perfil: null, persona_id: null, registro: {}, consulta: null, hoja: null, consulta_id: null };
  const DEPARTAMENTOS = ['Amazonas','Áncash','Apurímac','Arequipa','Ayacucho','Cajamarca','Callao','Cusco','Huancavelica','Huánuco','Ica','Junín','La Libertad','Lambayeque','Lima','Loreto','Madre de Dios','Moquegua','Pasco','Piura','Puno','San Martín','Tacna','Tumbes','Ucayali'];
  const { ejes, guia } = await API.catalogo();
  const nombrePerfil = id => guia.perfiles.find(p => p.id === id).nombre;

  function mostrar(id) {
    vistas.forEach(v => v.classList.toggle('oculto', v.id !== 'v-' + id));
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id);
  }
  function ir(id) {
    // No se puede saltar pantallas sin lo anterior
    if ((id === 'registro' || id === 'formulario') && !estado.perfil) id = 'perfil';
    if (id === 'formulario' && !estado.persona_id) id = 'registro';
    if ((id === 'hoja' || id === 'espera') && !estado.hoja) id = estado.perfil ? 'registro' : 'perfil';
    mostrar(id);
  }
  window.addEventListener('popstate', () => ir((location.hash || '#perfil').slice(1)));

  // Departamentos
  const sel = $('#departamento');
  DEPARTAMENTOS.forEach(d => { const o = document.createElement('option'); o.value = d; o.textContent = d; sel.appendChild(o); });

  // Pantalla 1
  document.querySelectorAll('.perfil').forEach(b => b.addEventListener('click', () => {
    estado.perfil = b.dataset.perfil;
    const n = nombrePerfil(estado.perfil);
    $('#r-perfil').textContent = n; $('#g-perfil').textContent = n;
    const esAut = estado.perfil === 'autoridades';
    $('#l-institucion').textContent = esAut ? 'Municipalidad' : 'Organización';
    $('#a-institucion').textContent = esAut ? 'Nombre de la municipalidad en la que trabaja.' : 'Nombre de su organización o colectivo. Si no pertenece a ninguna, escriba "independiente".';
    pintarPreguntas();
    mostrar('registro');
  }));

  // Pantalla 2
  function validar(form) {
    let ok = true;
    form.querySelectorAll('.campo').forEach(c => {
      const inp = c.querySelector('input,select,textarea'); if (!inp) return;
      let v = true;
      if (inp.required) {
        if (inp.type === 'checkbox') v = inp.checked;
        else if (inp.type === 'email') v = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
        else v = inp.value.trim().length > 0;
      }
      if (c.id === 'c-tema') v = c.querySelectorAll('input:checked').length > 0;
      c.classList.toggle('invalido', !v); if (!v) ok = false;
    });
    if (!ok) form.querySelector('.invalido input,.invalido select,.invalido textarea')?.focus();
    return ok;
  }
  $('#f-registro').addEventListener('submit', async e => {
    e.preventDefault(); if (!validar(e.target)) return;
    const f = new FormData(e.target);
    estado.registro = { nombres: f.get('nombres').trim(), correo: f.get('correo').trim(), perfil: estado.perfil, institucion: f.get('institucion').trim(), cargo: f.get('cargo').trim(), departamento: f.get('departamento') };
    const btn = e.target.querySelector('button'); btn.disabled = true;
    try { estado.persona_id = await API.registrar(estado.registro); mostrar('formulario'); }
    catch (err) { alertar('No pudimos guardar su registro. Revise su conexión e intente de nuevo.'); console.error(err); }
    finally { btn.disabled = false; }
  });

  // Pantalla 3
  function pintarPreguntas() {
    guia.preguntas.forEach(p => { const el = $('#q-' + p.id); if (el) el.textContent = p[estado.perfil]; });
    const cont = $('#temas'); cont.innerHTML = '';
    ejes.forEach(ej => {
      const l = document.createElement('label'); l.className = 'casilla';
      l.innerHTML = `<input type="checkbox" name="tema" value="${ej.id}"><span>${ej.nombre}<small>${ej.fichas.length === 1 ? '1 buena práctica' : ej.fichas.length + ' buenas prácticas'}</small></span>`;
      cont.appendChild(l);
    });
  }
  const ta = $('#texto_propio'), contador = $('#contador');
  ta.addEventListener('input', () => { const n = ta.value.length; contador.textContent = n.toLocaleString('es-PE') + ' de 1 500 caracteres'; contador.classList.toggle('limite', n >= 1500); });

  $('#f-guia').addEventListener('submit', async e => {
    e.preventDefault(); if (!validar(e.target)) return;
    const temas = [...document.querySelectorAll('input[name=tema]:checked')].map(i => i.value);
    estado.consulta = {
      persona_id: estado.persona_id, perfil: estado.perfil,
      temas, temas_nombres: temas.map(t => ejes.find(x => x.id === t).nombre),
      poblacion: $('#poblacion').value.trim(), logro: $('#logro').value.trim(), prioridades: $('#prioridades').value.trim(), condiciones: $('#condiciones').value.trim(),
      texto_propio: ta.value.trim().slice(0, 1500),
      registro: { institucion: estado.registro.institucion, cargo: estado.registro.cargo, departamento: estado.registro.departamento }
    };
    mostrar('espera');
    try {
      const r = await API.generarHoja(estado.consulta, (txt, pct) => { $('#estado-espera').textContent = txt; $('#barra').style.width = Math.round(pct * 100) + '%'; });
      estado.hoja = r.hoja_markdown; estado.consulta_id = r.consulta_id;
      pintarHoja(r);
      mostrar('hoja');
    } catch (err) {
      console.error(err); mostrar('formulario');
      alertar('No pudimos generar la hoja. Intente de nuevo en un momento. Si persiste, escriba a Ashanti Perú.');
    }
  });

  // Pantalla 5
  function pintarHoja(r) {
    let html = marked.parse(estado.hoja, { mangle: false, headerIds: false });
    // Citas [Ficha N, ...] como etiquetas
    html = html.replace(/\[(Ficha \d+)(?:,\s*([^\]]+))?\]/g, (m, f, n) => `<span class="cita" title="${n ? n.replace(/"/g, '&quot;') : ''}">${f}</span>`);
    // Numerar visualmente las secciones
    html = html.replace(/<h2>(\d)\.\s*/g, '<h2><span class="n">$1.</span>');
    // Línea de meta (primer párrafo tras el h1) y nota final
    html = html.replace(/<\/h1>\s*<p>/, '</h1><p class="meta">');
    html = html.replace(/<p>(Esta hoja se basa únicamente[^<]*)<\/p>\s*$/, '<p class="nota">$1</p>');
    $('#hoja').innerHTML = html;
    const av = $('#aviso-hoja');
    if (r.modo === 'prueba') { av.textContent = 'Modo de prueba: esta es una hoja de ejemplo. Cuando la herramienta esté conectada, la hoja se redacta a partir de su consulta.'; av.classList.remove('oculto'); }
    else av.classList.add('oculto');
  }
  $('#b-word').addEventListener('click', async () => {
    const b = $('#b-word'); b.disabled = true; b.textContent = 'Preparando el archivo…';
    try { await HojaDocx.descargar(estado.hoja, { nombre: estado.registro.nombres, perfil: nombrePerfil(estado.perfil) }); API.marcarDescarga(estado.consulta_id, 'word'); }
    catch (e) { console.error(e); alertar('No se pudo generar el Word. Use "Copiar el texto".'); }
    finally { b.disabled = false; b.textContent = 'Descargar en Word'; }
  });
  $('#b-copiar').addEventListener('click', async () => {
    const texto = estado.hoja.replace(/^#+\s*/gm, '').replace(/\*\*/g, '');
    try { await navigator.clipboard.writeText(texto); $('#b-copiar').textContent = 'Texto copiado'; setTimeout(() => $('#b-copiar').textContent = 'Copiar el texto', 2000); API.marcarDescarga(estado.consulta_id, 'copia'); }
    catch (e) { window.prompt('Copie el texto:', texto); }
  });
  $('#b-nueva').addEventListener('click', () => { estado.hoja = null; estado.consulta_id = null; $('#f-guia').reset(); ta.dispatchEvent(new Event('input')); mostrar('formulario'); });

  function alertar(msg) { let a = $('#alerta'); if (!a) { a = document.createElement('div'); a.id = 'alerta'; a.className = 'aviso error'; document.querySelector('main').prepend(a); } a.textContent = msg; a.scrollIntoView({ block: 'start' }); setTimeout(() => a.remove(), 8000); }

  ir((location.hash || '#perfil').slice(1));
})();
