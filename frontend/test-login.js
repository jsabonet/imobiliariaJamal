const http = require('http');

const loginData = JSON.stringify({
  username: 'apitester',
  password: 'Passw0rd!123'
});

// Test 1: Direct backend test
console.log('=== Test 1: Direct Backend (Django) ===');
const backendOptions = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/admin/auth/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const backendReq = http.request(backendOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
    console.log('');
    
    // Test 2: Next.js proxy test
    console.log('=== Test 2: Next.js Proxy ===');
    const nextOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/admin/auth/',
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
        console.log('');
        console.log('✅ Login test completed!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Open http://localhost:3001/admin/login in your browser');
        console.log('2. Use credentials: apitester / Passw0rd!123');
        console.log('3. Should redirect to /dashboard on success');
      });
    });

    nextReq.on('error', (err) => {
      console.error('❌ Next.js proxy error:', err.message);
      console.log('Make sure Next.js is running on port 3001');
    });

    nextReq.write(loginData);
    nextReq.end();
  });
});

backendReq.on('error', (err) => {
  console.error('❌ Backend error:', err.message);
  console.log('Make sure Django is running on port 8000');
});

backendReq.write(loginData);
backendReq.end();
