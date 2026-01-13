const http = require('http');

const loginData = JSON.stringify({
  username: 'apitester',
  password: 'Passw0rd!123'
});

console.log('=== Testing Next.js Proxy (without trailing slash) ===');
const nextOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/auth',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const nextReq = http.request(nextOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    
    if (res.statusCode === 200) {
      console.log('\n✅ SUCCESS! Login endpoint is working through Next.js proxy!');
      console.log('\nYou can now test in browser:');
      console.log('1. Open: http://localhost:3001/admin/login');
      console.log('2. Username: apitester');
      console.log('3. Password: Passw0rd!123');
    } else {
      console.log(`\n❌ Got status ${res.statusCode} instead of 200`);
    }
  });
});

nextReq.on('error', (err) => {
  console.error('❌ Error:', err.message);
});

nextReq.write(loginData);
nextReq.end();
