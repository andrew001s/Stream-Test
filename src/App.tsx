import { StreamPlayer } from './components/StreamPlayer';
import './App.css';

function App() {
  // En desarrollo usa el proxy de Vite, en producción usa la URL directa de ngrok
  const streamUrl = import.meta.env.DEV
    ? '/stream/stream.m3u8'  // Proxy local en desarrollo
    : import.meta.env.VITE_STREAM_URL || 'https://superchivalrous-susana-unfaithfully.ngrok-free.dev/stream.m3u8';

  return (
    <div className="app">
      <header className="app-header">
        <h1>📡 Stream Viewer</h1>
        <p className="subtitle">Streaming en vivo desde ngrok</p>
      </header>

      <main className="app-main">
        <StreamPlayer streamUrl={streamUrl} />
      </main>

      <footer className="app-footer">
        <p>Powered by HLS.js & React</p>
      </footer>
    </div>
  );
}

export default App;
