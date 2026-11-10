// Prueba el procesamiento real contra la API de Claude, igual que la función generar-hoja.
// Uso:  node pruebas/probar_prompt.mjs [caso]      (caso = autoridades | sociedad_civil | todos)
// Lee la clave de un archivo .env en la raíz del repo:  ANTHROPIC_API_KEY=sk-ant-...
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const leer = (p) => readFileSync(new URL(p, raiz), "utf8");
if (existsSync(new URL(".env", raiz))) for (const l of leer(".env").split(/\r?\n/)) { const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ""); }
const KEY = process.env.ANTHROPIC_API_KEY; if (!KEY) { console.error("Falta ANTHROPIC_API_KEY (ponla en .env en la raíz del repo)."); process.exit(1); }
const MODELO = process.env.MODELO_IA ?? "claude-sonnet-5-5";
const SELECCION = process.env.SELECCION ?? "estricta"; // estricta | ampliada

const fichas = JSON.parse(leer("data/fichas.json"));
const ejes = JSON.parse(leer("data/ejes.json"));
const instrucciones = leer("prompt/instrucciones_asistente.md");
const nombreEje = (id) => ejes.find((e) => e.id === id)?.nombre ?? id;
const idEje = (nombre) => ejes.find((e) => e.nombre === nombre)?.id ?? nombre;
const PERFIL = { autoridades: "Autoridades y funcionarios municipales", sociedad_civil: "Sociedad civil" };

const fichaTexto = (f) => [
  `### Ficha ${f.numero}: ${f.nombre_corto}`, `Nombre de la acción: ${f.nombre_accion}`, `Lugar: ${f.lugar}`, `Reconocimiento: ${f.reconocimiento}`,
  `Ejes temáticos: ${f.ejes.map(nombreEje).join("; ")}`, `Periodo: ${f.periodo}`, `Desafío inicial: ${f.desafio_inicial}`, `Descripción: ${f.descripcion}`, `Población: ${f.poblacion}`,
  `Resultados alcanzados: ${f.resultados_alcanzados}`, `Factores de éxito: ${f.factores_exito}`, `Dificultades: ${f.dificultades}`, `Aprendizajes: ${f.aprendizajes}`,
  `Elementos adaptables: ${f.elementos_adaptables}`, `Condiciones de adaptación: ${f.condiciones_adaptacion}`, `Acción sugerida: ${f.accion_sugerida}`, `Instrumentos: ${f.instrumentos}`,
  `Fuentes de verificación:\n${f.fuentes_verificacion.join("\n")}`,
].join("\n");

async function correr(nombreCaso) {
  const c = JSON.parse(leer(`pruebas/caso_${nombreCaso}.json`));
  const temasId = c.tema.map(idEje);
  const principales = fichas.filter((f) => f.ejes.some((e) => temasId.includes(e)));
  const secundarias = SELECCION === "ampliada" ? fichas.filter((f) => !principales.includes(f)) : [];
  const contexto = ["# Fichas que responden a los ejes marcados", ...principales.map(fichaTexto),
    secundarias.length ? "# Otras fichas de la Caja de Herramientas (referencia secundaria)\n" + secundarias.map(fichaTexto).join("\n\n") : ""].join("\n\n");
  const perfilId = c.perfil === PERFIL.autoridades ? "autoridades" : "sociedad_civil";
  const consulta = [`Perfil: ${c.perfil}`, `Institución u organización: ${c.registro.institucion}`, `Cargo o rol: ${c.registro.cargo ?? ""}`, `Departamento: ${c.registro.departamento ?? "no indicado"}`,
    `Fecha: ${new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })}`, `Tema o temas: ${c.tema.join("; ")}`, `Población: ${c.poblacion}`,
    `Lo que quiere lograr: ${c.logro}`, `Prioridades: ${c.prioridades}`, `Condiciones: ${c.condiciones}`, `Texto propio: ${c.texto_propio || "(sin texto propio)"}`].join("\n");

  const t0 = Date.now();
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODELO, max_tokens: 6000, thinking: { type: "between_tools" },
      system: [{ type: "text", text: instrucciones }, { type: "text", text: contexto, cache_control: { type: "ephemeral" } }],
      messages: [{ role: "user", content: `Redacta la hoja de recomendaciones para esta consulta del formulario guía:\n\n${consulta}` }] }),
  });
  if (!r.ok) throw new Error(`API ${r.status}: ${await r.text()}`);
  const data = await r.json();
  const hoja = data.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
  const u = data.usage ?? {};
  const costo = ((u.input_tokens ?? 0) * 3 + (u.cache_creation_input_tokens ?? 0) * 3.75 + (u.cache_read_input_tokens ?? 0) * 0.3 + (u.output_tokens ?? 0) * 15) / 1e6;

  // Controles automáticos
  const secciones = ["## 1. Su consulta", "## 2. Buenas prácticas que aplican", "## 3. Recomendaciones aplicables", "## 4. Por dónde empezar", "## 5. Próximo paso", "## 6. Referencias"];
  const faltan = secciones.filter((s) => !hoja.includes(s));
  const citadas = [...new Set([...hoja.matchAll(/\[Ficha (\d+)/g)].map((m) => +m[1]))];
  const recibidas = [...principales, ...secundarias].map((f) => f.numero);
  const fueraDeContexto = citadas.filter((n) => !recibidas.includes(n));
  const palabras = hoja.split(/\s+/).length;
  const controles = [
    faltan.length ? `FALTAN secciones: ${faltan.join(", ")}` : "Seis secciones: ok",
    citadas.length ? `Fichas citadas: ${citadas.join(", ")}` : "NO cita ninguna ficha",
    fueraDeContexto.length ? `CITA fichas que no recibió: ${fueraDeContexto.join(", ")}` : "Solo cita fichas recibidas: ok",
    `Extensión: ${palabras} palabras ${palabras < 700 || palabras > 1100 ? "(FUERA del rango 700 a 1 100)" : "(ok)"}`,
    `Nota final: ${hoja.includes("Esta hoja se basa únicamente") ? "ok" : "FALTA"}`,
  ];
  const sello = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
  const salida = `pruebas/salidas/${sello}_${nombreCaso}_${SELECCION}.md`;
  const cabecera = `<!-- ${MODELO} · selección ${SELECCION} · ${((Date.now() - t0) / 1000).toFixed(1)} s · entrada ${u.input_tokens ?? 0} (+caché ${u.cache_creation_input_tokens ?? 0}/${u.cache_read_input_tokens ?? 0}) · salida ${u.output_tokens ?? 0} · US$ ${costo.toFixed(4)}\n${controles.join("\n")} -->\n\n`;
  writeFileSync(new URL(salida, raiz), cabecera + hoja);
  console.log(`\n== ${nombreCaso} (${SELECCION}) → ${salida}`); console.log(cabecera.trim());
}

const cual = process.argv[2] ?? "todos";
for (const n of cual === "todos" ? ["autoridades", "sociedad_civil"] : [cual]) await correr(n);
