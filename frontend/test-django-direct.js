const http = require('http');

// Teste EXATO da URL que a API Route chama
const loginData = JSON.stringify({
  username: 'apitester',
  password: 'Passw0rd!123'
});

const API_URL = 'http://localhost:8000/api';
const fullUrl = `${API_URL}/admin/auth/`;

console.log('🎯 Testando URL EXATA que a API Route do Next.js chama:');
console.log('URL:', fullUrl);
console.log('Body:', loginData);
console.log('');

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/admin/auth/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ Django respondeu OK!');
      console.log('O problema está na API Route do Next.js, não no Django');
    } else {
      console.log('\n❌ Django também retorna', res.statusCode);
      console.log('O problema está no Django ou nas credenciais');
    }
  });
});

req.on('error', (err) => {
  console.error('Erro:', err.message);
});

req.write(loginData);
req.end();
