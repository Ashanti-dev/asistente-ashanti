// Capa de acceso a datos. Dos modos:
//  - real: Supabase (función generar-hoja, tablas personas y consultas)
//  - prueba: sin Supabase; devuelve las hojas de ejemplo y no guarda nada
window.API = (function () {
  const cfg = window.CONFIG || {};
  const real = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
  const sb = real ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;

  async function cargarJSON(ruta) { const r = await fetch(ruta); if (!r.ok) throw new Error('No se pudo cargar ' + ruta); return r.json(); }

  async function catalogo() {
    const [ejes, guia] = await Promise.all([cargarJSON('data/ejes.json'), cargarJSON('data/formulario_guia.json')]);
    return { ejes, guia };
  }

  // Registra a la persona. Devuelve su id.
  async function registrar(persona) {
    if (!real) return 'prueba-' + Date.now();
    const id = crypto.randomUUID();
    const { error } = await sb.from('personas').insert({
      id, nombres: persona.nombres, correo: persona.correo, perfil: persona.perfil,
      institucion: persona.institucion, cargo: persona.cargo || null, departamento: persona.departamento || null,
      consentimiento: true, consentimiento_fecha: new Date().toISOString()
    });
    if (error) throw error;
    return id;
  }

  // Pide la hoja. Devuelve { consulta_id, hoja_markdown, modo }
  async function generarHoja(consulta, onEstado) {
    if (!real) {
      const archivo = consulta.perfil === 'autoridades' ? 'demo/hoja_prueba_autoridades.md' : 'demo/hoja_prueba_sociedad_civil.md';
      const pasos = ['Leyendo su consulta…', 'Buscando las fichas de ' + consulta.temas_nombres.join(', ') + '…', 'Revisando elementos adaptables y condiciones de adaptación…', 'Redactando las recomendaciones…', 'Preparando las referencias…'];
      for (let i = 0; i < pasos.length; i++) { onEstado && onEstado(pasos[i], (i + 1) / (pasos.length + 1)); await new Promise(r => setTimeout(r, 1400)); }
      const md = await (await fetch(archivo)).text();
      return { consulta_id: null, hoja_markdown: md, modo: 'prueba' };
    }
    onEstado && onEstado('Leyendo su consulta…', 0.1);
    const t = setInterval(() => onEstado && onEstado('Redactando las recomendaciones…', 0.6), 6000);
    try {
      const { data, error } = await sb.functions.invoke('generar-hoja', { body: consulta });
      if (error) { let msg = ''; try { msg = (await error.context.json()).error; } catch (e) {} throw new Error(msg || error.message); }
      return { consulta_id: data.consulta_id, hoja_markdown: data.hoja_markdown, modo: 'real' };
    } finally { clearInterval(t); }
  }

  async function marcarDescarga(consulta_id, tipo) {
    if (!real || !consulta_id) return;
    await sb.from('descargas').insert({ consulta_id, tipo });
  }

  return { real, catalogo, registrar, generarHoja, marcarDescarga, sb };
})();
