'use client';

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    console.log('[PWARegister] Component mounted');
    console.log('[PWARegister] Service Worker supported:', 'serviceWorker' in navigator);
    
    if ('serviceWorker' in navigator) {
      // Primeiro, verificar se já existe um SW registrado
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        console.log('[PWARegister] Service Workers existentes:', registrations.length);
        registrations.forEach((reg, index) => {
          console.log(`   [${index}] Scope: ${reg.scope}, Active: ${reg.active?.state}`);
        });
      });
      
      window.addEventListener('load', () => {
        console.log('[PWARegister] Evento load disparado, iniciando registro do SW...');
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ [PWARegister] Service Worker registrado com sucesso!');
            console.log('   - Scope:', registration.scope);
            console.log('   - Estado:', registration.active?.state);
            console.log('   - Installing:', registration.installing?.state);
            console.log('   - Waiting:', registration.waiting?.state);
            
            // Monitor state changes
            if (registration.installing) {
              const sw = registration.installing;
              console.log('[PWARegister] SW está instalando...');
              sw.addEventListener('statechange', () => {
                console.log('[PWARegister] SW state changed to:', sw.state);
              });
            }
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New service worker available, prompt user to reload
                    if (confirm('Nova versão disponível! Deseja atualizar?')) {
                      newWorker.postMessage({ type: 'SKIP_WAITING' });
                      window.location.reload();
                    }
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('❌ [PWARegister] ERRO ao registrar Service Worker:');
            console.error('   - Mensagem:', error.message);
            console.error('   - Stack:', error.stack);
          });

        // Handle service worker updates
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }

    // Handle install prompt
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('💡 PWA pode ser instalado');
    });

    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA instalado com sucesso');
      deferredPrompt = null;
    });
  }, []);

  return null;
}
