# 🚀 Guía de Despliegue en Vercel

## Problema de CORS Resuelto

Esta aplicación usa un **proxy serverless** en Vercel para resolver los problemas de CORS cuando accedes al stream de ngrok desde producción.

## Pasos para Desplegar

### 1. Hacer commit y push de los cambios

```bash
git add .
git commit -m "Add Vercel serverless proxy to fix CORS"
git push origin main
```

### 2. Configurar la variable de entorno en Vercel

Ve a tu proyecto en Vercel: https://vercel.com/dashboard

1. Selecciona tu proyecto `stream-test-9jd3`
2. Ve a **Settings** → **Environment Variables**
3. Agrega:
   - **Name:** `VITE_STREAM_URL`
   - **Value:** `https://superchivalrous-susana-unfaithfully.ngrok-free.dev/stream.m3u8`
   - **Environment:** Production, Preview, Development
4. Click **Save**

### 3. Redeploy

1. Ve a **Deployments**
2. Click en los 3 puntos del último deployment
3. Click en **Redeploy**

## Cómo Funciona

### Desarrollo (localhost:5173)
- Usa el proxy de Vite configurado en `vite.config.ts`
- Las peticiones a `/stream/*` se redirigen a ngrok
- No hay problemas de CORS

### Producción (Vercel)
- Usa el proxy serverless en `/api/proxy.js`
- El proxy agrega los headers CORS automáticamente
- Las URLs se reescriben: `/api/proxy?path=stream.m3u8`

## Arquitectura del Proxy

```
Browser (Vercel)
     ↓
/api/proxy?path=stream.m3u8
     ↓
Vercel Serverless Function
     ↓ (agrega headers CORS)
https://ngrok-free.dev/stream.m3u8
     ↓
Tu servidor local
```

## Verificar que Funciona

Después del despliegue, abre la consola del navegador (F12) y verifica:

✅ No debe haber errores de CORS
✅ Deberías ver: `[SUCCESS] Stream cargado! X calidad(es) disponible(s)`
✅ El video debería reproducirse

## Troubleshooting

### El proxy devuelve 400
- Verifica que la variable `VITE_STREAM_URL` esté configurada en Vercel

### El proxy devuelve 500
- Verifica que tu túnel ngrok esté activo
- Verifica que la URL sea accesible desde internet

### Aún hay errores de CORS
- Limpia el cache del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Verifica que el deployment se haya completado correctamente
