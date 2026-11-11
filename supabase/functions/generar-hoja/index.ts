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
const NOTA = "Esta hoja se basa únicamente en el contenido de la Caja de Herramientas para Municipios del proyecto Municipios que Incluyen. No es un plan de los primeros 100 días.";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const inicio = Date.now();
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  let consultaId: string | null = null;
  try {
    const c = await req.json();
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
    const { count: nMes } = await sb.from("consultas").select("id", { count: "exact", head: true }).gte("creado", inicioMes).not("hoja_markdown", "is", null);
    if ((nMes ?? 0) >= limMes) return json({ error: "La herramienta alcanzó el límite de consultas de este mes. Intente de nuevo el próximo mes o escriba a Ashanti Perú." }, 429);

    // 3. Fichas activas de los ejes marcados y documentos de contexto de esos ejes
    const { data: fichas, error: eF } = await sb.from("fichas").select("*").eq("activa", true).order("numero");
    if (eF) throw eF;
    const { data: ejes } = await sb.from("ejes").select("*").order("orden");
    const nombreEje = (id: string) => ejes?.find((e) => e.id === id)?.nombre ?? id;
    const principales = fichas!.filter((f) => f.ejes.some((e: string) => c.temas.includes(e)));
    const { data: docs } = await sb.from("documentos_contexto").select("nombre, eje, contenido").eq("activo", true).in("eje", c.temas);

    // 4. Registrar la consulta antes de llamar a la IA (si falla, queda el error)
    const { data: ins, error: eI } = await sb.from("consultas").insert({
      persona_id: c.persona_id, perfil: c.perfil, temas: c.temas,
      poblacion: c.poblacion, logro: c.logro, prioridades: c.prioridades, condiciones: c.condiciones, texto_propio, modelo: MODELO,
    }).select("id").single();
    if (eI) throw eI;
    consultaId = ins.id;

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
      docs?.length ? "# Documentos de contexto (selección de Ashanti Perú)\n" + docs.map((d) => `## ${d.nombre} (${nombreEje(d.eje)})\n${d.contenido}`).join("\n\n") : "",
    ].join("\n\n");

    // 6. La consulta de la persona, tal como la respondió en el formulario guía
    const consulta = [
      `Perfil: ${PERFIL[c.perfil]}`,
      `Institución u organización: ${c.registro?.institucion ?? ""}`, `Cargo o rol: ${c.registro?.cargo ?? ""}`, `Departamento: ${c.registro?.departamento ?? "no indicado"}`,
      `Fecha: ${new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" })}`,
      `Tema o temas: ${c.temas.map(nombreEje).join("; ")}`, `Población: ${c.poblacion}`, `Lo que quiere lograr: ${c.logro}`,
      `Prioridades: ${c.prioridades}`, `Condiciones: ${c.condiciones}`, `Texto propio: ${texto_propio || "(sin texto propio)"}`,
    ].join("\n");

    // 7. Llamada al modelo
    if (!CLAVE_API) throw new Error("Falta el secreto ANTHROPIC_API_KEY en Supabase");
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": CLAVE_API, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODELO, ...parametros,
        system: [{ type: "text", text: instrucciones }, { type: "text", text: contexto }],
        messages: [{ role: "user", content: `Redacta la hoja de recomendaciones para esta consulta del formulario guía:\n\n${consulta}` }],
      }),
    });
    if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
    const data = await r.json();
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
    let hoja = `${cuerpo}\n\n## 6. Referencias\n\n${referencias}\n\n${NOTA}`;

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
    }).eq("id", consultaId);
    return json({ consulta_id: consultaId, hoja_markdown: hoja, fichas_citadas: citadas, tokens: { entrada: te, salida: ts }, costo_usd: costo });
  } catch (e) {
    console.error(e);
    if (consultaId) await sb.from("consultas").update({ error: String(e).slice(0, 500), duracion_ms: Date.now() - inicio }).eq("id", consultaId);
    return json({ error: "No se pudo generar la hoja." }, 500);
  }
});

function json(b: unknown, status = 200) { return new Response(JSON.stringify(b), { status, headers: { ...CORS, "content-type": "application/json" } }); }
