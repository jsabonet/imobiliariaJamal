const fs = require('fs');
const path = require('path');

// Simple PNG generator using Canvas API (install with: npm install canvas)
// If canvas is not available, use the HTML file in browser instead

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('Para gerar os ícones PWA:');
console.log('1. Abra o arquivo generate-icons.html no navegador');
console.log('2. Clique em "Gerar Todos os Ícones"');
console.log('3. Baixe todos os arquivos gerados');
console.log('4. Coloque-os na pasta public/');
console.log('');
console.log('Ou use uma ferramenta online como:');
console.log('- https://realfavicongenerator.net/');
console.log('- https://www.pwabuilder.com/imageGenerator');
console.log('');
console.log('Tamanhos necessários:', sizes.join(', '));
