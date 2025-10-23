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

Para cambiar la URL del stream, edita el archivo `src/App.tsx`:

```typescript
const streamUrl = 'TU_URL_AQUI.m3u8';
```

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

Si ves errores de CORS, asegúrate de que tu servidor ngrok tenga los headers correctos configurados:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: *
```
