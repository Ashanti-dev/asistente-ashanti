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
    // Modo cola: la función registra la consulta y responde al instante; la hoja se redacta en segundo plano.
    // La web pregunta cada 3 segundos cómo va, hasta 8 minutos. Así, con mucha gente a la vez, nadie se cae: espera su turno.
    const invocar = async (body) => {
      const { data, error } = await sb.functions.invoke('generar-hoja', { body });
      if (error) { let msg = ''; try { msg = (await error.context.json()).error; } catch (e) {} throw new Error(msg || error.message); }
      return data;
    };
    const dormir = ms => new Promise(r => setTimeout(r, ms));
    onEstado && onEstado('Leyendo su consulta…', 0.1);
    const inicio = Date.now();
    let d0 = await invocar({ ...consulta, modo: 'cola' });
    if (d0.hoja_markdown) return { consulta_id: d0.consulta_id, hoja_markdown: d0.hoja_markdown, modo: 'real' };
    // Si la consulta queda primera en la fila más de 2 minutos sin avanzar, su proceso se cayó: se reenvía una vez
    let fallosRed = 0, primeraDesde = null, reenvios = 0;
    while (Date.now() - inicio < 8 * 60 * 1000) {
      await dormir(3000);
      let d;
      try { d = await invocar({ accion: 'estado', consulta_id: d0.consulta_id }); fallosRed = 0; }
      catch (e) { if (/límite/i.test(e.message) || ++fallosRed > 5) throw e; continue; }
      if (d.hoja_markdown) return { consulta_id: d.consulta_id, hoja_markdown: d.hoja_markdown, modo: 'real' };
      if (d.fallo && reenvios >= 1) throw new Error(d.error || 'No se pudo generar la hoja.');
      if (!d.antes) primeraDesde = primeraDesde || Date.now(); else primeraDesde = null;
      if (d.fallo || (primeraDesde && Date.now() - primeraDesde > 120000 && reenvios < 1)) {
        reenvios++; primeraDesde = null;
        try { await invocar({ accion: 'abandonar', consulta_id: d0.consulta_id }); } catch (e) {}
        d0 = await invocar({ ...consulta, modo: 'cola' });
        if (d0.hoja_markdown) return { consulta_id: d0.consulta_id, hoja_markdown: d0.hoja_markdown, modo: 'real' };
        continue;
      }
      const seg = (Date.now() - inicio) / 1000;
      const avance = Math.min(0.92, 0.15 + seg / 90);
      if (d.antes > 0) onEstado && onEstado('Hay mucha gente consultando. Su consulta está en cola, ' + (d.antes === 1 ? 'hay 1 antes que la suya' : 'hay ' + d.antes + ' antes que la suya') + '. No cierre esta página.', avance);
      else onEstado && onEstado(seg < 8 ? 'Buscando las buenas prácticas de sus temas…' : 'Redactando las recomendaciones…', avance);
    }
    throw new Error('No se pudo generar la hoja.');
  }

  async function marcarDescarga(consulta_id, tipo) {
    if (!real || !consulta_id) return;
    await sb.from('descargas').insert({ consulta_id, tipo });
  }

  return { real, catalogo, registrar, generarHoja, marcarDescarga, sb };
})();
