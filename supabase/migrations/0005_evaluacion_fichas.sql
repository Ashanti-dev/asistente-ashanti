-- Modo de prueba: evaluación de fichas por criterios (se muestra al final de la hoja mientras mostrar_criterios = true)
alter table consultas add column if not exists evaluacion_fichas jsonb;
insert into configuracion(clave, valor) values ('mostrar_criterios', 'true'::jsonb) on conflict (clave) do update set valor = 'true'::jsonb;
-- Las instrucciones con la sección "Evaluación de las fichas" están en prompt/instrucciones_asistente.md y en configuracion.instrucciones
