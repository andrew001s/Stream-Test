/**
 * Vercel Serverless Function - Proxy para stream con CORS
 * Este proxy agrega los headers CORS necesarios para acceder al stream desde el navegador
 */

export default async function handler(req, res) {
  // Configurar headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');

  // Manejar preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Obtener la URL del stream desde variables de entorno
  const streamBaseUrl = process.env.VITE_STREAM_URL?.replace('/stream.m3u8', '') ||
                        'https://superchivalrous-susana-unfaithfully.ngrok-free.dev';

  // Obtener el path solicitado (ej: /stream.m3u8 o /segment0.ts)
  const { path } = req.query;

  if (!path) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  const targetUrl = `${streamBaseUrl}/${path}`;

  try {
    // Hacer la petición al servidor ngrok
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'Vercel-Proxy/1.0',
      },
    });

    if (!response.ok) {
      res.status(response.status).json({
        error: `Failed to fetch: ${response.statusText}`
      });
      return;
    }

    // Copiar headers relevantes
    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }

    // Transmitir la respuesta
    const data = await response.arrayBuffer();
    res.status(200).send(Buffer.from(data));

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Proxy request failed',
      message: error.message
    });
  }
}
