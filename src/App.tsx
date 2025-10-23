import { StreamPlayer } from './components/StreamPlayer';
import './App.css';

function App() {
  // Usa el proxy local de Vite para evitar problemas de CORS
  const streamUrl = '/stream/stream.m3u8';

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
