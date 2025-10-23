import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import './StreamPlayer.css';

interface StreamPlayerProps {
  streamUrl: string;
}

export const StreamPlayer = ({ streamUrl }: StreamPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [status, setStatus] = useState<string>('Cargando...');
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error' | 'warning'>('info');
  const [isPlaying, setIsPlaying] = useState(false);

  const updateStatus = (message: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setStatus(message);
    setStatusType(type);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Suprimir errores de source maps
    const originalError = console.error;
    console.error = function(...args) {
      const msg = args[0]?.toString() || '';
      if (msg.includes('source map') || msg.includes('mapa de origen') || msg.includes('sourceMappingURL')) {
        return;
      }
      originalError.apply(console, args);
    };

    if (Hls.isSupported()) {
      updateStatus('Inicializando HLS.js...', 'info');

      // Configurar HLS con loader personalizado
      const hlsConfig: Partial<Hls['config']> = {
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
      };

      // En producción, interceptar las peticiones para reescribir las URLs
      if (!import.meta.env.DEV) {
        hlsConfig.xhrSetup = (xhr: XMLHttpRequest, url: string) => {
          // Si ya incluye /api/proxy, no hacer nada
          if (url.includes('/api/proxy')) {
            return;
          }

          // Extraer solo el nombre del archivo de la URL
          let targetPath = url;

          // Si es una URL absoluta (http://localhost:4173/api/stream123.ts)
          if (url.startsWith('http')) {
            const urlObj = new URL(url);
            targetPath = urlObj.pathname.replace(/^\/api\//, '').replace(/^\//, '');
          }
          // Si es relativa pero empieza con /api/ (/api/stream123.ts)
          else if (url.startsWith('/api/')) {
            targetPath = url.replace(/^\/api\//, '');
          }
          // Si es solo el nombre del archivo (stream123.ts)
          else if (!url.startsWith('/')) {
            targetPath = url;
          }

          // Reescribir la URL para usar el proxy
          const proxyUrl = `/api/proxy?path=${encodeURIComponent(targetPath)}`;
          xhr.open('GET', proxyUrl, true);
        };
      }

      const hls = new Hls(hlsConfig);

      hlsRef.current = hls;

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        updateStatus('Video adjuntado, cargando stream...', 'warning');
      });

      hls.on(Hls.Events.MANIFEST_LOADING, () => {
        updateStatus('Descargando manifest (.m3u8)...', 'warning');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        updateStatus(`Stream cargado! ${data.levels.length} calidad(es) disponible(s)`, 'success');
        video.play().catch(() => {
          updateStatus('Listo para reproducir - Click en play', 'warning');
        });
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        if (status.includes('Descargando') || status.includes('Cargando')) {
          updateStatus('Reproduciendo stream...', 'success');
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        console.error('HLS Error:', data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              updateStatus(`Error de red: ${data.details}. Intentando reconectar...`, 'error');
              setTimeout(() => {
                hls.loadSource(streamUrl);
              }, 3000);
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              updateStatus('Error de medios, recuperando...', 'warning');
              hls.recoverMediaError();
              break;
            default:
              updateStatus(`Error fatal: ${data.details}`, 'error');
              break;
          }
        }
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      // Cleanup
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      updateStatus('Usando reproductor nativo (Safari)', 'success');
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        updateStatus('Stream cargado', 'success');
        video.play();
      });
    } else {
      updateStatus('Tu navegador no soporta HLS', 'error');
    }

    // Event listeners del video
    const handlePlay = () => {
      setIsPlaying(true);
      updateStatus('Reproduciendo...', 'success');
    };

    const handlePause = () => {
      setIsPlaying(false);
      updateStatus('Pausado', 'warning');
    };

    const handleWaiting = () => updateStatus('Buffering...', 'warning');
    const handleStalled = () => updateStatus('Conexión lenta...', 'warning');
    const handleError = () => updateStatus('Error al cargar el video', 'error');

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleStalled);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleStalled);
      video.removeEventListener('error', handleError);
    };
  }, [streamUrl]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleReload = () => {
    const video = videoRef.current;
    if (!video) return;

    updateStatus('Recargando stream...', 'warning');

    if (hlsRef.current) {
      hlsRef.current.loadSource(streamUrl);
    } else {
      video.load();
      video.play();
    }
  };

  return (
    <div className="stream-player">
      <div className="video-container">
        <video
          ref={videoRef}
          controls
          muted
          className="video-element"
          playsInline
        />
      </div>

      <div className={`status-bar status-${statusType}`}>
        <span className="status-icon">
          {statusType === 'success' && '✓'}
          {statusType === 'error' && '✕'}
          {statusType === 'warning' && '⚠'}
          {statusType === 'info' && 'ℹ'}
        </span>
        <span className="status-text">{status}</span>
      </div>

      <div className="controls">
        <button onClick={handlePlayPause} className="control-button">
          {isPlaying ? '⏸ Pausar' : '▶ Reproducir'}
        </button>
        <button onClick={handleReload} className="control-button">
          🔄 Recargar
        </button>
      </div>
    </div>
  );
};
