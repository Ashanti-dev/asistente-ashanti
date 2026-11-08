-- Asistente Inteligente para la Innovación Pública Local · esquema inicial
create extension if not exists pgcrypto;

create table if not exists ejes (
  id text primary key,
  nombre text not null,
  orden int not null default 0
);

create table if not exists fichas (
  numero int primary key,
  nombre_accion text not null,
  nombre_corto text not null,
  lugar text not null,
  pais text,
  reconocimiento text,
  eje_principal text references ejes(id),
  ejes text[] not null default '{}',
  periodo text,
  desafio_inicial text,
  descripcion text,
  poblacion text,
  resultados_alcanzados text not null,
  factores_exito text not null,
  dificultades text not null,
  aprendizajes text not null,
  elementos_adaptables text not null,
  condiciones_adaptacion text not null,
  accion_sugerida text not null,
  instrumentos text not null,
  fuentes_verificacion text[] not null default '{}',
  activa boolean not null default true,
  creado timestamptz not null default now()
);

create table if not exists documentos_contexto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  eje text references ejes(id),
  contenido text not null,
  activo boolean not null default true,
  creado timestamptz not null default now()
);

create table if not exists personas (
  id uuid primary key default gen_random_uuid(),
  nombres text not null,
  correo text not null,
  perfil text not null check (perfil in ('autoridades','sociedad_civil')),
  institucion text not null,
  cargo text,
  departamento text,
  consentimiento boolean not null default false,
  consentimiento_fecha timestamptz,
  creado timestamptz not null default now()
);

create table if not exists consultas (
  id uuid primary key default gen_random_uuid(),
  persona_id uuid references personas(id) on delete set null,
  perfil text not null,
  temas text[] not null default '{}',
  poblacion text, logro text, prioridades text, condiciones text, texto_propio text,
  fichas_citadas int[] not null default '{}',
  hoja_markdown text,
  modelo text,
  tokens_entrada int, tokens_salida int, costo_usd numeric(10,5),
  duracion_ms int,
  error text,
  creado timestamptz not null default now()
);

create table if not exists descargas (
  id bigserial primary key,
  consulta_id uuid references consultas(id) on delete cascade,
  tipo text not null check (tipo in ('word','copia')),
  creado timestamptz not null default now()
);

-- Seguridad: el público solo inserta su registro y sus descargas; la función (service role) escribe consultas;
-- el equipo de Ashanti Perú (usuarios autenticados) lee todo.
alter table ejes enable row level security;
alter table fichas enable row level security;
alter table documentos_contexto enable row level security;
alter table personas enable row level security;
alter table consultas enable row level security;
alter table descargas enable row level security;

create policy "ejes publicos" on ejes for select using (true);
create policy "fichas: equipo lee" on fichas for select to authenticated using (true);
create policy "fichas: equipo edita" on fichas for all to authenticated using (true) with check (true);
create policy "documentos: equipo" on documentos_contexto for all to authenticated using (true) with check (true);
create policy "personas: publico registra" on personas for insert to anon, authenticated with check (consentimiento = true);
create policy "personas: equipo lee" on personas for select to authenticated using (true);
create policy "consultas: equipo lee" on consultas for select to authenticated using (true);
create policy "descargas: publico registra" on descargas for insert to anon, authenticated with check (true);
create policy "descargas: equipo lee" on descargas for select to authenticated using (true);
