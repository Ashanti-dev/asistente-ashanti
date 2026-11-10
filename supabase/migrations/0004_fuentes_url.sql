-- Enlaces de las fuentes de verificación, tomados de la sistematización (PDF)
alter table fichas add column if not exists fuentes_url text[] not null default '{}';
-- Los valores se cargaron desde data/fichas.json (campo fuentes_url).
