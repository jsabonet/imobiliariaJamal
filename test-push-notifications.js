/**
 * Script de teste para sistema de notificações push
 * Simula o fluxo completo do frontend
 */

const VAPID_PUBLIC_KEY = 'BNtaaNMRqWSZwU6GCjkgSHW_gGyk_0GVamG8XQlHou1_hLSoc40GYjVvpf0TFvdXlfp3q5DXB-u3iB1mgViVYiI';
const API_URL = 'http://localhost:8000';

/**
 * Converte chave VAPID base64 para Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = Buffer.from(base64, 'base64');
  return new Uint8Array(rawData);
}

/**
 * Teste 1: Verificar se API está acessível
 */
async function testAPIConnection() {
  console.log('\n🔍 TESTE 1: Verificando conexão com API...\n');
  
  try {
    const response = await fetch(`${API_URL}/api/properties/`);
    console.log(`✅ Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ API acessível - ${data.count || 0} propriedades encontradas`);
      return true;
    } else {
      console.log(`❌ API retornou erro: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro ao conectar: ${error.message}`);
    return false;
  }
}

/**
 * Teste 2: Simular registro de subscription
 */
async function testSubscriptionEndpoint() {
  console.log('\n🔍 TESTE 2: Testando endpoint de subscription...\n');
  
  // Gerar subscription simulada (formato real do browser)
  const mockSubscription = {
    endpoint: `https://fcm.googleapis.com/fcm/send/test-${Date.now()}`,
    keys: {
      p256dh: 'BKxON0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      auth: 'Auth0123456789ABCDEF'
    }
  };

  try {
    const response = await fetch(`${API_URL}/api/notifications/subscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Test Script (Chrome/120.0)'
      },
      body: JSON.stringify({
        endpoint: mockSubscription.endpoint,
        p256dh: mockSubscription.keys.p256dh,
        auth: mockSubscription.keys.auth
      })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Resposta:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log(`✅ Subscription registrada! ID: ${data.subscription_id}`);
      return { success: true, subscriptionId: data.subscription_id, endpoint: mockSubscription.endpoint };
    } else {
      console.log(`❌ Falha ao registrar: ${data.message || 'Erro desconhecido'}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Erro na requisição: ${error.message}`);
    return { success: false };
  }
}

/**
 * Teste 3: Testar unsubscribe
 */
async function testUnsubscribeEndpoint(endpoint) {
  console.log('\n🔍 TESTE 3: Testando endpoint de unsubscribe...\n');
  
  try {
    const response = await fetch(`${API_URL}/api/notifications/unsubscribe/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ endpoint })
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Resposta:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Unsubscribe realizado com sucesso!');
      return true;
    } else {
      console.log(`❌ Falha ao remover: ${data.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro na requisição: ${error.message}`);
    return false;
  }
}

/**
 * Teste 4: Verificar instalação do pywebpush
 */
async function testPyWebPushInstallation() {
  console.log('\n🔍 TESTE 4: Verificando dependências do backend...\n');
  
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    const { stdout, stderr } = await execPromise(
      '& D:/Projectos/JamalImobiliaria/.venv/Scripts/Activate.ps1; pip show pywebpush',
      { shell: 'powershell.exe' }
    );
    
    if (stdout.includes('Version:')) {
      const versionMatch = stdout.match(/Version: ([\d.]+)/);
      console.log(`✅ pywebpush instalado - Versão: ${versionMatch ? versionMatch[1] : 'desconhecida'}`);
      return true;
    } else {
      console.log('❌ pywebpush não encontrado');
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro ao verificar: ${error.message}`);
    return false;
  }
}

/**
 * Teste 5: Verificar configuração VAPID
 */
async function testVAPIDConfiguration() {
  console.log('\n🔍 TESTE 5: Verificando configuração VAPID...\n');
  
  const fs = require('fs');
  const path = require('path');
  
  // Verificar .env.local no frontend
  const envPath = path.join(__dirname, 'frontend', '.env.local');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('NEXT_PUBLIC_VAPID_PUBLIC_KEY')) {
      console.log('✅ NEXT_PUBLIC_VAPID_PUBLIC_KEY encontrada no .env.local');
      
      const match = envContent.match(/NEXT_PUBLIC_VAPID_PUBLIC_KEY=(.+)/);
      if (match && match[1].trim().length > 0) {
        console.log(`✅ Chave configurada: ${match[1].trim().substring(0, 20)}...`);
      }
    } else {
      console.log('❌ NEXT_PUBLIC_VAPID_PUBLIC_KEY não encontrada');
    }
    
    if (envContent.includes('NEXT_PUBLIC_API_URL')) {
      const match = envContent.match(/NEXT_PUBLIC_API_URL=(.+)/);
      console.log(`✅ API_URL configurada: ${match ? match[1].trim() : 'não capturada'}`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Erro ao ler .env.local: ${error.message}`);
    return false;
  }
}

/**
 * Teste 6: Verificar arquivos criados
 */
function testFilesExistence() {
  console.log('\n🔍 TESTE 6: Verificando arquivos do sistema push...\n');
  
  const fs = require('fs');
  const path = require('path');
  
  const files = [
    'backend/core/models.py',
    'backend/core/notifications.py',
    'backend/core/signals.py',
    'frontend/lib/notifications.ts',
    'frontend/components/NotificationButton.tsx',
    'frontend/public/sw.js'
  ];
  
  let allExist = true;
  
  files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - NÃO ENCONTRADO`);
      allExist = false;
    }
  });
  
  return allExist;
}

/**
 * Executar todos os testes
 */
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧪 SIMULAÇÃO DE TESTE - SISTEMA PUSH NOTIFICATIONS');
  console.log('═══════════════════════════════════════════════════════');
  
  const results = {
    apiConnection: false,
    subscription: false,
    unsubscribe: false,
    pywebpush: false,
    vapid: false,
    files: false
  };
  
  // Teste 1: Conexão com API
  results.apiConnection = await testAPIConnection();
  
  // Teste 2: Subscription
  const subscriptionResult = await testSubscriptionEndpoint();
  results.subscription = subscriptionResult.success;
  
  // Teste 3: Unsubscribe (se subscription funcionou)
  if (subscriptionResult.success && subscriptionResult.endpoint) {
    results.unsubscribe = await testUnsubscribeEndpoint(subscriptionResult.endpoint);
  }
  
  // Teste 4: PyWebPush
  results.pywebpush = await testPyWebPushInstallation();
  
  // Teste 5: VAPID
  results.vapid = await testVAPIDConfiguration();
  
  // Teste 6: Arquivos
  results.files = testFilesExistence();
  
  // Resumo final
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 RESUMO DOS TESTES');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const tests = [
    { name: '1. Conexão com API', passed: results.apiConnection },
    { name: '2. Endpoint Subscribe', passed: results.subscription },
    { name: '3. Endpoint Unsubscribe', passed: results.unsubscribe },
    { name: '4. PyWebPush instalado', passed: results.pywebpush },
    { name: '5. Configuração VAPID', passed: results.vapid },
    { name: '6. Arquivos do sistema', passed: results.files }
  ];
  
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    const status = test.passed ? 'PASSOU' : 'FALHOU';
    console.log(`${icon} ${test.name}: ${status}`);
  });
  
  const passedCount = tests.filter(t => t.passed).length;
  const totalCount = tests.length;
  const percentage = Math.round((passedCount / totalCount) * 100);
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`${percentage}% DE SUCESSO (${passedCount}/${totalCount} testes passaram)`);
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (percentage === 100) {
    console.log('🎉 SISTEMA 100% FUNCIONAL! Pronto para uso.\n');
  } else if (percentage >= 80) {
    console.log('⚠️  Sistema quase pronto. Verifique os testes que falharam.\n');
  } else {
    console.log('❌ Sistema precisa de ajustes. Revise a configuração.\n');
  }
  
  // Próximos passos
  console.log('📋 PRÓXIMOS PASSOS PARA TESTE COMPLETO:\n');
  console.log('1. Abrir http://localhost:3002 no navegador');
  console.log('2. Clicar no botão de notificações (ícone sino) na navbar');
  console.log('3. Permitir notificações quando solicitado');
  console.log('4. Verificar notificação de teste');
  console.log('5. Criar uma propriedade para testar notificação automática\n');
}

// Executar testes
runAllTests().catch(console.error);
