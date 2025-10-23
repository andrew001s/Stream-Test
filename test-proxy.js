/**
 * Script de prueba para el proxy
 * Ejecuta: node test-proxy.js
 */

const handler = require('./api/proxy.js').default;

// Simular una request
const mockReq = {
  method: 'GET',
  query: {
    path: 'stream.m3u8'
  }
};

// Simular una response
const mockRes = {
  headers: {},
  statusCode: 200,
  setHeader(name, value) {
    this.headers[name] = value;
    console.log(`Header set: ${name} = ${value}`);
  },
  status(code) {
    this.statusCode = code;
    console.log(`Status: ${code}`);
    return this;
  },
  json(data) {
    console.log('Response JSON:', JSON.stringify(data, null, 2));
  },
  send(data) {
    console.log(`Response sent (${data.length} bytes)`);
  },
  end() {
    console.log('Response ended');
  }
};

// Ejecutar el handler
console.log('Testing proxy with path: stream.m3u8');
console.log('Target URL: https://superchivalrous-susana-unfaithfully.ngrok-free.dev/stream.m3u8\n');

handler(mockReq, mockRes)
  .then(() => {
    console.log('\n✅ Proxy test completed successfully!');
  })
  .catch(err => {
    console.error('\n❌ Proxy test failed:', err.message);
  });
