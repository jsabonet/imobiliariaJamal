'use client';

import { useEffect, useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone ||
                       document.referrer.includes('android-app://');
    
    if (isInstalled) {
      return;
    }

    // Check if user dismissed banner before
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 5 seconds
      setTimeout(() => setShowBanner(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <FiDownload className="text-white" size={24} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-secondary mb-1">
                Instalar IJPS
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Adicione à tela inicial para acesso rápido e experiência offline.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
                >
                  Instalar
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Agora não
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
        
        <div className="h-1 bg-gradient-to-r from-primary to-primary-600"></div>
      </div>
    </div>
  );
}
