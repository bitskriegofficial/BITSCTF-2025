const http = require('http');
const crypto = require('crypto');

const FLAG = process.env.FLAG || "BITSCTF{Quantumn_Got_Spilled_2203AA23}";
const JWT_SECRET = crypto.randomBytes(32);
const ECC_KEY = crypto.generateKeyPairSync('ec', { namedCurve: 'secp384r1' });

const server = http.createServer((req, res) => {
  const { url, method, headers } = req;
  let body = [];

  // Quantum Handshake Protocol
  if (url === '/qchannel' && method === 'POST') {
    req.on('data', chunk => body.push(chunk));
    req.on('end', () => {
      const phase = headers['x-quantum-phase'];
      const entanglement = Buffer.concat(body).toString('hex');
      
      if (phase === 'superposition' && entanglement.startsWith('deadbeef')) {
        res.setHeader('x-quantum-state', 'entangled');
        res.end('Quantum channel established');
      } else {
        res.writeHead(418).end('Invalid quantum state');
      }
    });
    return;
  }

  // Temporal Authentication
  if (url === '/entangle' && method === 'GET') {
    const token = crypto.createHmac('sha384', JWT_SECRET)
      .update(Date.now().toString())
      .digest('hex');
    res.end(JSON.stringify({ token }));
    return;
  }

  // Quantum Vault
  if (url === '/vault/Quantum_decoherence_22323' && method === 'GET') {
    try {
      const auth = headers.authorization.split(' ') || [];
      if (auth[0] === 'Quantum' && auth[1]) {
        const payload = JSON.parse(
          Buffer.from(auth[1].split('.')[1], 'base64').toString()
        );
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        if (payload.qrole === 'operator' && payload.exp > currentTimeInSeconds) {
          res.end(FLAG);
          return;
        }
      }
    } catch {}
    res.writeHead(418).end('Temporal validation failed');
    return;
  }

  // Qubit Processor
  if (url === '/qproc' && method === 'POST') {
    req.on('data', chunk => body.push(chunk));
    req.on('end', async () => {
      try {
        const wasmBuffer = Buffer.concat(body);
        if (wasmBuffer.length > 8192) {
          const buf = Buffer.alloc(128);
          wasmBuffer.copy(buf);
        }
        await WebAssembly.compile(wasmBuffer);
        res.end('Qubit processing complete');
      } catch {
        res.writeHead(418).end('Quantum_decoherence_22323');
      }
    });
    return;
  }

  res.writeHead(404).end('404 - Reality not found');
});

server.listen(3000, () => {
  console.log('Quantum Paradox active: http://localhost:3000');
});