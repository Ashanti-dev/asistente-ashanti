// Función generar-hoja · Asistente Inteligente para la Innovación Pública Local
// Recibe el formulario guía, arma el contexto con las fichas activas de los ejes marcados
// (y los documentos de contexto activos), llama a Claude, agrega las referencias y guarda la consulta.
import { createClient } from "jsr:@supabase/supabase-js@2";
import { INSTRUCCIONES } from "./instrucciones.ts";

const MODELO = Deno.env.get("MODELO_IA") ?? "claude-sonnet-5-5";
const PRECIO_ENTRADA = 3 / 1_000_000;   // US$ por token (referencial, ajustar al precio vigente)
const PRECIO_SALIDA = 15 / 1_000_000;
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
// Clave de la API: acepta el nombre estándar y el que se usó al crear el secreto en el panel de Supabase
const CLAVE_API = Deno.env.get("ANTHROPIC_API_KEY") ?? Deno.env.get("Anthropic-API-Key-Ashanti") ?? Deno.env.get("ANTHROPIC_API_KEY_ASHANTI") ?? "";
const PERFIL: Record<string, string> = { autoridades: "Autoridades y personal municipal", sociedad_civil: "Sociedad civil" };
const API_URL = "https://api.anthropic.com/v1/messages";
declare const EdgeRuntime: { waitUntil(p: Promise<unknown>): void };
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));
const REINTENTAR = new Set([408, 409, 429, 500, 502, 503, 504, 529]);

// Cola: espera mientras haya demasiadas consultas anteriores todavía en proceso (máx. max_paralelo a la vez).
// Las que llevan más de 6 minutos sin terminar no cuentan (se consideran caídas).
async function esperarTurno(sb: any, id: string, creado: string, deadline: number, maxParalelo: number) {
  while (Date.now() < deadline - 90_000) {
    const desde = new Date(Date.now() - 6 * 60_000).toISOString();
    const { count, error } = await sb.from("consultas").select("id", { count: "exact", head: true })
      .lt("creado", creado).gt("creado", desde).is("hoja_markdown", null).is("error", null).neq("id", id);
    if (error || (count ?? 0) < maxParalelo) return;
    await dormir(2000 + Math.random() * 1500);
  }
}

// Llamada a la IA con reintentos: si Anthropic responde límite (429), saturado (529) o falla temporal,
// espera lo que indica retry-after (o un tiempo creciente) y vuelve a intentar hasta el plazo.
async function llamarIA(cuerpo: unknown, deadline: number) {
  for (let intento = 0; ; intento++) {
    let status = 0, detalle = "", espera = 0;
    try {
      const r = await fetch(API_URL, {
        method: "POST",
        headers: { "x-api-key": CLAVE_API, "anthropic-version": "2023-06-01", "content-type": "application/json" },
        body: JSON.stringify(cuerpo),
      });
      if (r.ok) return await r.json();
      status = r.status; detalle = await r.text();
      if (!REINTENTAR.has(status)) throw new Error(`API ${status}: ${detalle}`);
      espera = Number(r.headers.get("retry-after") ?? 0) * 1000;
    } catch (e) {
      if (status && !REINTENTAR.has(status)) throw e;
      if (!status) detalle = String(e);
    }
    if (!espera) espera = Math.min(30_000, 2000 * 2 ** intento);
    espera = Math.min(espera, 30_000) + Math.random() * 1500;
    if (Date.now() + espera > deadline) throw new Error(`API ${status || "red"} tras ${intento + 1} intentos: ${detalle.slice(0, 300)}`);
    console.log(`Reintento ${intento + 1} en ${Math.round(espera)} ms (API ${status || "red"})`);
    await dormir(espera);
  }
}

const NOTA = "Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const inicio = Date.now();
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  let consultaId: string | null = null;
  try {
    const c = await req.json();

    // 0. Consulta del estado de una hoja en cola (la web pregunta cada pocos segundos)
    if (c?.accion === "abandonar") {
      // La web avisa que una consulta quedó trabada (su proceso se reinició): se libera su lugar en la cola
      if (c.consulta_id) await sb.from("consultas").update({ error: "Abandonada por la web: se reenvió la consulta" }).eq("id", c.consulta_id).is("hoja_markdown", null);
      return json({ ok: true });
    }
    if (c?.accion === "estado") {
      if (!c.consulta_id) return json({ error: "Falta la consulta." }, 400);
      const { data: q } = await sb.from("consultas").select("id, creado, hoja_markdown, fichas_citadas, error").eq("id", c.consulta_id).maybeSingle();
      if (!q) return json({ error: "Consulta no encontrada." }, 404);
      if (q.hoja_markdown) return json({ consulta_id: q.id, hoja_markdown: q.hoja_markdown, fichas_citadas: q.fichas_citadas });
      if (q.error) return json({ error: "No se pudo generar la hoja.", fallo: true });
      if (Date.now() - new Date(q.creado).getTime() > 6 * 60_000) return json({ error: "No se pudo generar la hoja.", fallo: true });
      const desde = new Date(Date.now() - 6 * 60_000).toISOString();
      const { count } = await sb.from("consultas").select("id", { count: "exact", head: true })
        .lt("creado", q.creado).gt("creado", desde).is("hoja_markdown", null).is("error", null);
      return json({ consulta_id: q.id, en_cola: true, antes: count ?? 0 });
    }
    if (!c?.perfil || !Array.isArray(c.temas) || c.temas.length === 0) return json({ error: "Faltan datos del formulario guía." }, 400);
    const texto_propio = String(c.texto_propio ?? "").slice(0, 1500);
    for (const k of ["poblacion", "logro", "prioridades", "condiciones"]) c[k] = String(c[k] ?? "").slice(0, 500);

    // 1. Solo personas registradas
    if (!c.persona_id) return json({ error: "Falta el registro." }, 400);
    const { data: persona } = await sb.from("personas").select("id").eq("id", c.persona_id).maybeSingle();
    if (!persona) return json({ error: "Registro no encontrado." }, 403);

    // 2. Configuración vigente: instrucciones, parámetros del modelo y límite mensual (tabla configuracion)
    const { data: conf } = await sb.from("configuracion").select("clave, valor");
    const cfg = (k: string, def: number) => Number(conf?.find((x) => x.clave === k)?.valor ?? def);
    const instrucciones = String(conf?.find((x) => x.clave === "instrucciones")?.valor ?? INSTRUCCIONES);
    const parametros = (conf?.find((x) => x.clave === "parametros_modelo")?.valor ?? { max_tokens: 2500, thinking: { type: "between_tools" } }) as Record<string, unknown>;
    const ahoraLima = new Date(Date.now() - 5 * 3600e3);
    const inicioMes = new Date(Date.UTC(ahoraLima.getUTCFullYear(), ahoraLima.getUTCMonth(), 1, 5)).toISOString();
    const limMes = cfg("limite_mensual_total", 400);
    const { count: nMes } = await sb.from("consultas").select("id", { count: "exact", head: true }).gte("creado", inicioMes)
      .not("hoja_markdown", "is", null).is("error", null).gt("tokens_salida", 0); // solo consultas terminadas con la IA
    if ((nMes ?? 0) >= limMes) return json({ error: "La herramienta alcanzó el límite de consultas de este mes. Intente de nuevo el próximo mes o escriba a Ashanti Perú." }, 429);

    // 3. Fichas activas de los ejes marcados y documentos de contexto de esos ejes
    const { data: fichas, error: eF } = await sb.from("fichas").select("*").eq("activa", true).order("numero");
    if (eF) throw eF;
    const { data: ejes } = await sb.from("ejes").select("*").order("orden");
    const nombreEje = (id: string) => ejes?.find((e) => e.id === id)?.nombre ?? id;
    const principales = fichas!.filter((f) => f.ejes.some((e: string) => c.temas.includes(e)));
    const { data: docsEje } = await sb.from("documentos_contexto").select("nombre, eje, contenido").eq("activo", true).in("eje", c.temas);
    // Un mismo documento puede estar asignado a varios ejes: se envía una sola vez
    const docs = Object.values((docsEje ?? []).reduce((a: Record<string, any>, d: any) => {
      a[d.nombre] ??= { ...d, ejes: [] as string[] }; a[d.nombre].ejes.push(d.eje); return a;
    }, {})) as any[];

    // 4. Registrar la consulta antes de llamar a la IA (si falla, queda el error)
    const { data: ins, error: eI } = await sb.from("consultas").insert({
      persona_id: c.persona_id, perfil: c.perfil, temas: c.temas,
      poblacion: c.poblacion, logro: c.logro, prioridades: c.prioridades, condiciones: c.condiciones, texto_propio, modelo: MODELO,
    }).select("id, creado").single();
    if (eI) throw eI;
    consultaId = ins.id;
    const creado: string = ins.creado;
    const maxParalelo = cfg("max_paralelo", 3);

    // 5. Contexto: lo que el modelo necesita de cada ficha para recomendar (las fuentes las agrega la herramienta al final)
    const fichaTexto = (f: any) => [
      `### Ficha ${f.numero}: ${f.nombre_corto}`,
      `Nombre de la acción: ${f.nombre_accion}`, `Lugar: ${f.lugar}`,
      `Ejes temáticos: ${f.ejes.map(nombreEje).join("; ")}`, `Periodo: ${f.periodo}`,
      `Descripción: ${f.descripcion}`, `Población: ${f.poblacion}`, `Resultados alcanzados: ${f.resultados_alcanzados}`,
      `Factores de éxito: ${f.factores_exito}`, `Dificultades: ${f.dificultades}`, `Aprendizajes: ${f.aprendizajes}`,
      `Elementos adaptables: ${f.elementos_adaptables}`, `Condiciones de adaptación: ${f.condiciones_adaptacion}`,
      `Acción sugerida: ${f.accion_sugerida}`, `Instrumentos: ${f.instrumentos}`,
    ].join("\n");
    const contexto = [
      "# Fichas que responden a los ejes marcados", ...principales.map(fichaTexto),
      docs?.length ? "# Documentos de contexto (selección de Ashanti Perú)\n" + docs.map((d) => `## ${d.nombre} (${d.ejes.map(nombreEje).join("; ")})\n${d.contenido}`).join("\n\n") : "",
    ].join("\n\n");

    // 6. La consulta de la persona, tal como la respondió en el formulario guía
    const consulta = [
      `Perfil: ${PERFIL[c.perfil]}`,
      `Institución u organización: ${c.registro?.institucion ?? ""}`, `Cargo o rol: ${c.registro?.cargo ?? ""}`, `Departamento: ${c.registro?.departamento ?? "no indicado"}`,
      `Fecha: ${new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" })}`,
      `Tema o temas: ${c.temas.map(nombreEje).join("; ")}`, `Población: ${c.poblacion}`, `Lo que quiere lograr: ${c.logro}`,
      `Prioridades: ${c.prioridades}`, `Condiciones: ${c.condiciones}`, `Texto propio: ${texto_propio || "(sin texto propio)"}`,
    ].join("\n");

    // 7. Llamada al modelo (en cola y con reintentos). Instrucciones y fichas van marcadas para caché:
    //    son iguales entre consultas de los mismos temas, se cobran a una décima parte al reutilizarse.
    if (!CLAVE_API) throw new Error("Falta el secreto ANTHROPIC_API_KEY en Supabase");
    const id: string = consultaId!;
    const procesar = async (deadline: number) => {
    await esperarTurno(sb, id, creado, deadline, maxParalelo);
    const data = await llamarIA({
      model: MODELO, ...parametros,
      system: [{ type: "text", text: instrucciones, cache_control: { type: "ephemeral" } }, { type: "text", text: contexto, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Redacta la hoja de recomendaciones para esta consulta del formulario guía:\n\n${consulta}` }],
    }, deadline);
    let cuerpo: string = data.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("").trim();
    if (!cuerpo) throw new Error(`Respuesta sin texto (stop_reason ${data.stop_reason}; bloques ${data.content.map((b: any) => b.type).join(",")})`);

    // 7b. Evaluación de las fichas: el modelo la escribe en una línea EVALUACION: [...] que no va a la hoja
    let evaluacion: any[] | null = null;
    const mEv = cuerpo.match(/^\s*`*\s*EVALUACION:\s*(\[[\s\S]*?\])\s*`*\s*$/m);
    if (mEv) { try { evaluacion = JSON.parse(mEv[1]); } catch { evaluacion = null; } cuerpo = cuerpo.replace(mEv[0], "").trim(); }
    if (cuerpo.indexOf("# Hoja") > 0) cuerpo = cuerpo.slice(cuerpo.indexOf("# Hoja"));

    // 8. Revisión de la salida: se quita lo que el modelo no debe escribir, se normalizan las citas
    //    y se agregan las referencias con sus enlaces desde la base, para que salgan exactas
    cuerpo = cuerpo.replace(/\n## 6\.[\s\S]*$/, "").replace(/\n*Esta hoja se basa únicamente[\s\S]*$/, "").trim();
    cuerpo = cuerpo.replace(/\[Ficha (\d+)(?:,[^\]]*)?\]/g, (m, n) => { const f = fichas!.find((x) => x.numero === Number(n)); return f ? `[Ficha ${f.numero}, ${f.nombre_corto}]` : m; });
    const citadas = [...new Set([...cuerpo.matchAll(/\[Ficha (\d+)/g)].map((m) => Number(m[1])))].filter((n) => fichas!.some((f) => f.numero === n));
    const referencias = citadas.map((n) => {
      const f = fichas!.find((x) => x.numero === n)!;
      const fuentes = f.fuentes_verificacion.map((t: string, i: number) => f.fuentes_url?.[i] ? `${t} [Ver fuente](${f.fuentes_url[i]})` : t);
      return `**Ficha ${f.numero}. ${f.nombre_corto} (${f.pais})**\n\n${fuentes.join("\n\n")}`;
    }).join("\n\n");
    // Documentos de contexto citados como [Manual N.º X]: se listan en las referencias
    const manualesCitados = [...new Set([...cuerpo.matchAll(/\[Manual N\.?\s*º?\s*(\d+)[^\]]*\]/g)].map((m) => Number(m[1])))];
    const refManuales = manualesCitados.map((n) => docs.find((d) => new RegExp(`Manual N\\.?\\s*º?\\s*${n}\\b`).test(d.nombre))).filter(Boolean)
      .map((d: any) => `**${d.nombre}**\n\nAshanti Perú. Guía de bolsillo para la incidencia juvenil afroperuana. Preguntas y respuestas seleccionadas para la Caja de Herramientas.`).join("\n\n");
    let hoja = `${cuerpo}\n\n## 6. Referencias\n\n${referencias}${refManuales ? "\n\n" + refManuales : ""}\n\n${NOTA}`;

    // 8b. Modo de prueba: muestra al final cómo se eligieron las fichas (se apaga con mostrar_criterios = false)
    const PUNTOS: Record<string, number> = { si: 2, "sí": 2, parcial: 1, no: 0 };
    const val = (x: unknown) => String(x ?? "").toLowerCase().trim();
    if (Array.isArray(evaluacion)) {
      evaluacion = evaluacion.filter((e) => fichas!.some((f) => f.numero === Number(e.ficha))).map((e) => {
        const crit = ["poblacion", "logro", "condiciones", "contexto"].map((k) => val(e[k]));
        const puntaje = crit.reduce((a, v) => a + (PUNTOS[v] ?? 0), 0);
        return { ...e, ficha: Number(e.ficha), puntaje, elegida: citadas.includes(Number(e.ficha)) };
      }).sort((a, b) => Number(b.elegida) - Number(a.elegida) || b.puntaje - a.puntaje || a.ficha - b.ficha);
    }
    const mostrar = conf?.find((x) => x.clave === "mostrar_criterios")?.valor;
    if (mostrar !== false && Array.isArray(evaluacion) && evaluacion.length) {
      const sino = (v: string) => (v === "si" || v === "sí") ? "sí" : v === "parcial" ? "parcial" : "no";
      const lineas = evaluacion.map((e) => {
        const f = fichas!.find((x) => x.numero === e.ficha)!;
        return [
          `**Ficha ${f.numero}. ${f.nombre_corto}: ${e.elegida ? "elegida" : "no elegida"} (${e.puntaje} de 8 puntos)**`,
          `- Población: ${sino(val(e.poblacion))}. Lo que quiere lograr: ${sino(val(e.logro))}. Condiciones: ${sino(val(e.condiciones))}. Contexto: ${sino(val(e.contexto))}.`,
          e.motivo ? `- Motivo: ${String(e.motivo).trim()}` : "",
        ].filter(Boolean).join("\n");
      }).join("\n\n");
      hoja += `\n\n## Cómo se eligieron las fichas (modo de prueba)\n\nEl asistente recibió ${evaluacion.length} fichas de los temas marcados y calificó cada una con cuatro criterios. Cada «sí» vale 2 puntos, cada «parcial» 1 y cada «no» 0. Una ficha puede entrar a la hoja si suma 5 puntos o más y no tiene «no» en población ni en lo que quiere lograr.\n\n${lineas}`;
    }

    // 9. Costo y registro
    const u = data.usage ?? {};
    const cc = u.cache_creation_input_tokens ?? 0, cr = u.cache_read_input_tokens ?? 0;
    const te = (u.input_tokens ?? 0) + cc + cr, ts = u.output_tokens ?? 0;
    const costo = ((u.input_tokens ?? 0) + cc * 1.25 + cr * 0.1) * PRECIO_ENTRADA + ts * PRECIO_SALIDA;
    await sb.from("consultas").update({
      hoja_markdown: hoja, fichas_citadas: citadas, evaluacion_fichas: evaluacion, tokens_entrada: te, tokens_salida: ts,
      costo_usd: costo, duracion_ms: Date.now() - inicio,
    }).eq("id", id);
    return { consulta_id: id, hoja_markdown: hoja, fichas_citadas: citadas, tokens: { entrada: te, salida: ts }, costo_usd: costo };
    };

    // Modo cola (web nueva): responde al instante y la hoja se redacta en segundo plano (hasta unos 5 minutos).
    // Modo directo (web anterior): espera la hoja en la misma llamada (hasta unos 2 minutos).
    const modoCola = c.modo === "cola";
    const tarea = procesar(inicio + (modoCola ? 330_000 : 120_000)).catch(async (e) => {
      console.error(e);
      await sb.from("consultas").update({ error: String(e).slice(0, 500), duracion_ms: Date.now() - inicio }).eq("id", id);
      throw e;
    });
    if (modoCola) { EdgeRuntime.waitUntil(tarea.catch(() => {})); return json({ consulta_id: id, en_cola: true }, 202); }
    return json(await tarea);
  } catch (e) {
    console.error(e);
    if (consultaId) await sb.from("consultas").update({ error: String(e).slice(0, 500), duracion_ms: Date.now() - inicio }).eq("id", consultaId);
    return json({ error: "No se pudo generar la hoja." }, 500);
  }
});

function json(b: unknown, status = 200) { return new Response(JSON.stringify(b), { status, headers: { ...CORS, "content-type": "application/json" } }); }
