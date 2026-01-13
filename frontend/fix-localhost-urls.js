const fs = require('fs');
const path = require('path');

const files = [
  'app/dashboard/page.tsx',
  'app/dashboard/propriedades/page.tsx',
  'app/dashboard/propriedades/nova/page.tsx',
  'app/dashboard/propriedades/[id]/editar/page.tsx',
  'app/dashboard/agentes/page.tsx',
  'app/dashboard/agentes/novo/page.tsx',
  'app/dashboard/agentes/[id]/editar/page.tsx',
];

const frontendDir = __dirname;

files.forEach(file => {
  const filePath = path.join(frontendDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Substituir http://localhost:8000/api/ por ${API_URL}/api/
    const replaced = content.replace(/http:\/\/localhost:8000\/api\//g, '${API_URL}/api/');
    
    // Adicionar import se não existir
    if (replaced.includes('${API_URL}') && !content.includes('API_URL')) {
      // Encontrar a primeira linha após os imports
      const lines = replaced.split('\n');
      let insertIndex = 0;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('export default')) {
          insertIndex = i;
          break;
        }
      }
      
      // Inserir constante API_URL
      lines.splice(insertIndex, 0, "  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';");
      lines.splice(insertIndex, 0, '');
      
      const finalContent = lines.join('\n');
      fs.writeFileSync(filePath, finalContent, 'utf8');
      console.log(`✓ Atualizado: ${file}`);
    } else if (replaced !== content) {
      fs.writeFileSync(filePath, replaced, 'utf8');
      console.log(`✓ Atualizado (sem adicionar constante): ${file}`);
    } else {
      console.log(`- Sem mudanças: ${file}`);
    }
  } else {
    console.log(`✗ Não encontrado: ${file}`);
  }
});

console.log('\n✅ Atualização concluída!');
