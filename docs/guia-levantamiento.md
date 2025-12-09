# Guía rápida para levantar el proyecto desde este repositorio

Esta guía resume los pasos mínimos para ver la aplicación en tu entorno local y validar la conexión a Supabase desde la pantalla de inicio.

## Requisitos
- Node.js 20+ y npm (instala con [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).
- Acceso a internet para descargar dependencias.

## Pasos básicos
1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Levantar el servidor de desarrollo** (exponiendo host y puerto, útil para Codespaces/containers)
   ```bash
   npm run dev -- --host 0.0.0.0 --port 4173
   ```
   Luego abre `http://localhost:4173` en tu navegador.
3. **Validar datos en la landing**
   - La pantalla inicial intenta contar `ventas`, `productos` y `clientes` desde Supabase.
   - Si hay conexión correcta, verás métricas reales; si no, se mostrarán valores demo y un mensaje de revisión.

## Configuración de Supabase
- Las credenciales públicas actuales viven en `src/integrations/supabase/client.ts`.
- Si necesitas usar otro proyecto:
  1. Sustituye `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` por los de tu proyecto.
  2. Opcional: reinicia el servidor de desarrollo para aplicar los cambios.

## Problemas comunes
- **Métricas en cero o estado "Sin conexión"**: verifica tus tablas en Supabase o la red del entorno.
- **Errores de lint preexistentes**: hay advertencias en otros archivos; la funcionalidad de la landing no depende de ellas, pero puedes ejecutar `npm run lint` para revisar el estado global.
