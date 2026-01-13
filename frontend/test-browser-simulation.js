// Simula exatamente como o browser faz a requisição
const http = require('http');

const loginData = JSON.stringify({
  username: 'apitester',
  password: 'Passw0rd!123'
});

console.log('=== Simulando requisição do BROWSER ===\n');

// Teste 1: Direto no Django (como deveria funcionar)
console.log('1️⃣ Testando DIRETO no Django: http://127.0.0.1:8000/api/admin/auth/\n');

const directOptions = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/admin/auth/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(loginData),
    'Origin': 'http://localhost:3000',
    'Accept': 'application/json, text/plain, */*',
    'User-Agent': 'Mozilla/5.0 (test)',
  }
};

const directReq = http.request(directOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('✅ Status:', res.statusCode);
    console.log('📦 Response:', data);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // Teste 2: Através do Next.js rewrite
    console.log('2️⃣ Testando através do NEXT.JS PROXY: http://localhost:3000/api/admin/auth/\n');
    
    const nextOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/admin/auth/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData),
        'Origin': 'http://localhost:3000',
        'Accept': 'application/json, text/plain, */*',
        'User-Agent': 'Mozilla/5.0 (test)',
        'Referer': 'http://localhost:3000/admin/login',
      }
    };

    const nextReq = http.request(nextOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        console.log('Response:', data);
        
        if (res.statusCode === 200) {
          console.log('\n🎉 SUCESSO! O proxy está funcionando!');
        } else if (res.statusCode === 401) {
          console.log('\n❌ FALHA: Credenciais inválidas (mas o proxy funcionou!)');
          console.log('💡 Verifique os logs do Django para ver o que foi recebido');
        } else {
          console.log(`\n⚠️ Status inesperado: ${res.statusCode}`);
        }
      });
    });

    nextReq.on('error', (err) => {
      console.error('❌ Erro no Next.js:', err.message);
      console.log('\n💡 Certifique-se que Next.js está rodando em http://localhost:3000');
    });

    nextReq.write(loginData);
    nextReq.end();
  });
});

directReq.on('error', (err) => {
  console.error('❌ Erro no Django:', err.message);
  console.log('\n💡 Certifique-se que Django está rodando em http://127.0.0.1:8000');
});

directReq.write(loginData);
directReq.end();
