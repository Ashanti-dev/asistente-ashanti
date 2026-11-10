// Función generar-hoja · Asistente Inteligente para la Innovación Pública Local
// Recibe el formulario guía, arma el contexto con las fichas de los ejes marcados
// (y los documentos de contexto activos), llama a Claude y guarda la consulta.
import { createClient } from "jsr:@supabase/supabase-js@2";

const MODELO = Deno.env.get("MODELO_IA") ?? "claude-sonnet-5-5";
const PRECIO_ENTRADA = 3 / 1_000_000;   // US$ por token (referencial, ajustar al precio vigente)
const PRECIO_SALIDA = 15 / 1_000_000;
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const PERFIL: Record<string, string> = { autoridades: "Autoridades y funcionarios municipales", sociedad_civil: "Sociedad civil" };

import { INSTRUCCIONES } from "./instrucciones.ts";

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

    // Solo personas registradas, con los límites que fija el equipo en el panel (tabla configuracion)
    if (!c.persona_id) return json({ error: "Falta el registro." }, 400);
    const { data: persona } = await sb.from("personas").select("id").eq("id", c.persona_id).maybeSingle();
    if (!persona) return json({ error: "Registro no encontrado." }, 403);
    const { data: conf } = await sb.from("configuracion").select("clave, valor");
    const cfg = (k: string, def: number) => Number(conf?.find((x) => x.clave === k)?.valor ?? def);
    const desde = new Date(Date.now() - 864e5).toISOString();
    const limPersona = cfg("limite_diario_por_persona", 10), limTotal = cfg("limite_diario_total", 200);
    const { count: nPersona } = await sb.from("consultas").select("id", { count: "exact", head: true }).eq("persona_id", c.persona_id).gte("creado", desde);
    if ((nPersona ?? 0) >= limPersona) return json({ error: `Alcanzó el límite de ${limPersona} consultas por día. Puede volver a consultar mañana.` }, 429);
    const { count: nTotal } = await sb.from("consultas").select("id", { count: "exact", head: true }).gte("creado", desde);
    if ((nTotal ?? 0) >= limTotal) return json({ error: "La herramienta alcanzó el límite de consultas de hoy. Intente de nuevo mañana." }, 429);

    // Fichas de los ejes marcados (y las demás como referencia secundaria)
    const { data: fichas, error: eF } = await sb.from("fichas").select("*").eq("activa", true).order("numero");
    if (eF) throw eF;
    const { data: ejes } = await sb.from("ejes").select("*").order("orden");
    const nombreEje = (id: string) => ejes?.find((e) => e.id === id)?.nombre ?? id;
    const principales = fichas!.filter((f) => f.ejes.some((e: string) => c.temas.includes(e)));
    const { data: docs } = await sb.from("documentos_contexto").select("nombre, eje, contenido").eq("activo", true).in("eje", c.temas);

    // Registrar la consulta antes de llamar a la IA (si falla, queda el error)
    const { data: ins, error: eI } = await sb.from("consultas").insert({
      persona_id: c.persona_id ?? null, perfil: c.perfil, temas: c.temas,
      poblacion: c.poblacion, logro: c.logro, prioridades: c.prioridades, condiciones: c.condiciones, texto_propio, modelo: MODELO,
    }).select("id").single();
    if (eI) throw eI;
    consultaId = ins.id;

    const fichaTexto = (f: any) => [
      `### Ficha ${f.numero}: ${f.nombre_corto}`,
      `Nombre de la acción: ${f.nombre_accion}`, `Lugar: ${f.lugar}`, `Reconocimiento: ${f.reconocimiento}`,
      `Ejes temáticos: ${f.ejes.map(nombreEje).join("; ")}`, `Periodo: ${f.periodo}`, `Desafío inicial: ${f.desafio_inicial}`,
      `Descripción: ${f.descripcion}`, `Población: ${f.poblacion}`, `Resultados alcanzados: ${f.resultados_alcanzados}`,
      `Factores de éxito: ${f.factores_exito}`, `Dificultades: ${f.dificultades}`, `Aprendizajes: ${f.aprendizajes}`,
      `Elementos adaptables: ${f.elementos_adaptables}`, `Condiciones de adaptación: ${f.condiciones_adaptacion}`,
      `Acción sugerida: ${f.accion_sugerida}`, `Instrumentos: ${f.instrumentos}`, `Fuentes de verificación:\n${f.fuentes_verificacion.join("\n")}`,
    ].join("\n");

    const contexto = [
      "# Fichas que responden a los ejes marcados", ...principales.map(fichaTexto),
      docs?.length ? "# Documentos de contexto (selección de Ashanti Perú)\n" + docs.map((d) => `## ${d.nombre} (${nombreEje(d.eje)})\n${d.contenido}`).join("\n\n") : "",
    ].join("\n\n");

    const consulta = [
      `Perfil: ${PERFIL[c.perfil]}`,
      `Institución u organización: ${c.registro?.institucion ?? ""}`, `Cargo o rol: ${c.registro?.cargo ?? ""}`, `Departamento: ${c.registro?.departamento ?? "no indicado"}`,
      `Fecha: ${new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Lima" })}`,
      `Tema o temas: ${c.temas.map(nombreEje).join("; ")}`, `Población: ${c.poblacion}`, `Lo que quiere lograr: ${c.logro}`,
      `Prioridades: ${c.prioridades}`, `Condiciones: ${c.condiciones}`, `Texto propio: ${texto_propio || "(sin texto propio)"}`,
    ].join("\n");

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODELO, max_tokens: 3000, temperature: 0.4,
        system: [{ type: "text", text: INSTRUCCIONES }, { type: "text", text: contexto, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: `Redacta la hoja de recomendaciones para esta consulta del formulario guía:\n\n${consulta}` }],
      }),
    });
    if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
    const data = await r.json();
    const hoja: string = data.content.map((b: any) => b.text ?? "").join("");
    const citadas = [...new Set([...hoja.matchAll(/\[Ficha (\d+)/g)].map((m) => Number(m[1])))];
    const te = data.usage?.input_tokens ?? 0, ts = data.usage?.output_tokens ?? 0;
    await sb.from("consultas").update({
      hoja_markdown: hoja, fichas_citadas: citadas, tokens_entrada: te, tokens_salida: ts,
      costo_usd: te * PRECIO_ENTRADA + ts * PRECIO_SALIDA, duracion_ms: Date.now() - inicio,
    }).eq("id", consultaId);
    return json({ consulta_id: consultaId, hoja_markdown: hoja, fichas_citadas: citadas, tokens: { entrada: te, salida: ts } });
  } catch (e) {
    console.error(e);
    if (consultaId) await sb.from("consultas").update({ error: String(e).slice(0, 500), duracion_ms: Date.now() - inicio }).eq("id", consultaId);
    return json({ error: "No se pudo generar la hoja." }, 500);
  }
});

function json(b: unknown, status = 200) { return new Response(JSON.stringify(b), { status, headers: { ...CORS, "content-type": "application/json" } }); }
