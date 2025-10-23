# 📡 Stream Viewer

Aplicación React para visualizar streams HLS en vivo desde ngrok.

## ✨ Características

- ✅ Reproductor HLS con HLS.js
- ✅ Detección automática de soporte HLS
- ✅ Manejo robusto de errores y reconexión automática
- ✅ Interfaz moderna y responsive
- ✅ Controles de reproducción personalizados
- ✅ Barra de estado en tiempo real
- ✅ Compatible con Safari (reproductor nativo)
- ✅ Sin errores de source maps en la consola

## 🚀 Instalación

```bash
npm install
```

## 💻 Desarrollo

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## 📦 Build para producción

```bash
npm run build
npm run preview  # Para previsualizar el build
```

Los archivos se generarán en la carpeta `dist/`

## ⚙️ Configuración

### Variables de entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y configura tu URL de ngrok:
```bash
VITE_STREAM_URL=https://tu-url-ngrok.ngrok-free.dev/stream.m3u8
```

### Configuración en Vercel

Para desplegar en Vercel, agrega la variable de entorno en el dashboard:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `VITE_STREAM_URL` con tu URL de ngrok
4. Redeploy el proyecto

**Nota:** La app detecta automáticamente el entorno:
- **Desarrollo:** Usa el proxy de Vite (`/stream/stream.m3u8`) para evitar CORS
- **Producción:** Usa la URL directa de ngrok desde `VITE_STREAM_URL`

## 🛠️ Tecnologías

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra-rápido
- **HLS.js** - Reproductor HLS para navegadores
- **CSS3** - Estilos modernos con gradientes

## 📁 Estructura del proyecto

```
stream-viewer/
├── src/
│   ├── components/
│   │   ├── StreamPlayer.tsx    # Componente principal del reproductor
│   │   └── StreamPlayer.css    # Estilos del reproductor
│   ├── App.tsx                  # Componente raíz
│   ├── App.css                  # Estilos de la app
│   ├── index.css                # Estilos globales
│   └── main.tsx                 # Punto de entrada
├── package.json
└── README.md
```

## 📝 Notas importantes

- El header `ngrok-skip-browser-warning: true` está configurado automáticamente para evitar warnings de ngrok
- Los errores de source maps están filtrados para una mejor experiencia de desarrollo
- La reconexión automática se activa tras errores de red (cada 3 segundos)
- El reproductor detecta automáticamente si el navegador soporta HLS nativamente (Safari) o requiere HLS.js

## 🐛 Solución de problemas

### El stream no carga

1. Verifica que tu túnel ngrok esté activo
2. Verifica que la URL del stream sea correcta
3. Abre la consola del navegador (F12) y busca errores específicos
4. Asegúrate de que el archivo `.m3u8` sea accesible desde tu navegador

### CORS errors

Esta aplicación incluye un **proxy serverless en Vercel** (`/api/proxy.js`) que maneja automáticamente los problemas de CORS. El proxy:

- Agrega los headers CORS necesarios
- Reenvía las peticiones al servidor ngrok
- Funciona tanto para el manifest `.m3u8` como para los segmentos `.ts`

Si necesitas cambiar el servidor backend, actualiza la variable `VITE_STREAM_URL` en Vercel o en tu archivo `.env`.
