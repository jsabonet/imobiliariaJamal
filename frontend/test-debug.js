const http = require('http');

// Test with detailed request inspection
const loginData = JSON.stringify({
  username: 'apitester',
  password: 'Passw0rd!123'
});

console.log('Request body:', loginData);
console.log('Content-Length:', loginData.length);
console.log('');

const nextOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/admin/auth/',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(loginData),
    'Accept': 'application/json'
  }
};

console.log('Making request to Next.js proxy...');
const req = http.request(nextOptions, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Response headers:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response body:', data);
    try {
      const json = JSON.parse(data);
      console.log('Parsed response:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.log('Could not parse as JSON');
    }
  });
});

req.on('error', (err) => {
  console.error('Request error:', err);
});

req.write(loginData);
req.end();
