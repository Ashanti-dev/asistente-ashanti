# Supabase · cómo aplicar

1. Crear el proyecto `asistente-ashanti` en la organización de asistenteinteligenteashanti@gmail.com (región us-east-2).
2. SQL Editor: correr `migrations/0001_esquema.sql` y luego `migrations/0002_semilla.sql`.
3. Edge Functions → Secrets: `ANTHROPIC_API_KEY` (y opcional `MODELO_IA`).
4. Desplegar la función: `supabase functions deploy generar-hoja --no-verify-jwt` (o desde el panel, pegando `index.ts` e `instrucciones.md`).
5. Authentication → Users: crear el usuario del equipo de Ashanti Perú para el panel (correo y contraseña).
6. Copiar `Project URL` y `anon public key` en `web/config.js`.
