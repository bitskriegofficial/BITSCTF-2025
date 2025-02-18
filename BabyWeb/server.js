const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
if (!fs.existsSync('private.pem') || !fs.existsSync('public.pem')) {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
  });
  fs.writeFileSync('private.pem', privateKey);
  fs.writeFileSync('public.pem', publicKey);
}

const getVerificationKey = (header, callback) => {
  try {
    const publicKey = fs.readFileSync('public.pem', 'utf8');
    
    const symmetricKey = header.alg === 'HS256' 
      ? Buffer.from(publicKey.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----/g, '').trim(), 'base64')
      : publicKey;

    callback(null, symmetricKey);
  } catch (err) {
    callback(err);
  }
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, getVerificationKey, { 
    algorithms: ['RS256', 'HS256'],
    clockTolerance: 30
  }, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username } = req.body;
  const privateKey = fs.readFileSync('private.pem', 'utf8');
  const token = jwt.sign({ username, role: 'user' }, privateKey, { 
    algorithm: 'RS256' 
  });
  res.json({ token });
});

app.get('/admin', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  res.json({ flag: 'BITSCTF{jwt_k3y_c0nfus10n_ma5tery}' });
});

app.get('/public-key', (req, res) => {
  res.sendFile(__dirname + '/public.pem');
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
app.listen(3001, () => console.log('Server running on port 3001'));
