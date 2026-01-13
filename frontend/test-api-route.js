const http = require('http');

const loginData = JSON.stringify({
  username: 'apitester',
  password: 'Passw0rd!123'
});

console.log('🧪 Testando a API Route do Next.js: POST /api/admin/auth/\n');
console.log('Dados enviados:', loginData);
console.log('');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/auth/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
  }
};

const req = http.request(options, (res) => {
  console.log('📥 Resposta da API Route:');
  console.log('Status:', res.statusCode);
  console.log('Headers:', res.headers);
  console.log('');
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Body:', data);
    
    try {
      const json = JSON.parse(data);
      console.log('\nParsed:', JSON.stringify(json, null, 2));
      
      if (json.success) {
        console.log('\n✅ LOGIN FUNCIONOU!');
      } else {
        console.log('\n❌ Login falhou:', json.message);
        console.log('\n🔍 Debugging:');
        console.log('- API Route está em: frontend/app/api/admin/auth/route.ts');
        console.log('- Chamando: ${API_URL}/admin/auth/');
        console.log('- NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');
      }
    } catch (e) {
      console.log('Não é JSON válido');
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Erro:', err.message);
});

req.write(loginData);
req.end();
