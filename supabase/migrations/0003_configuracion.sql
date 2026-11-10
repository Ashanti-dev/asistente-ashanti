create table if not exists configuracion (clave text primary key, valor jsonb not null, descripcion text, actualizado timestamptz not null default now());
alter table configuracion enable row level security;
create policy "configuracion: equipo lee" on configuracion for select to authenticated using (true);
create policy "configuracion: equipo edita" on configuracion for update to authenticated using (true) with check (true);
insert into configuracion (clave, valor, descripcion) values
 ('limite_diario_por_persona', '10', 'Consultas que una misma persona puede hacer en 24 horas'),
 ('limite_diario_total', '200', 'Consultas totales por día en toda la herramienta (protege el saldo de la API)')
on conflict (clave) do nothing;
