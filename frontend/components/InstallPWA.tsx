'use client';

import { useEffect, useState } from 'react';
import { FiX, FiDownload, FiSmartphone } from 'react-icons/fi';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [pageViews, setPageViews] = useState(0);

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
    const dismissedTime = localStorage.getItem('pwa-install-dismissed-time');
    
    // If dismissed, only show again after 7 days
    if (dismissed && dismissedTime) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    // Track page views
    const views = parseInt(localStorage.getItem('pwa-page-views') || '0');
    setPageViews(views + 1);
    localStorage.setItem('pwa-page-views', String(views + 1));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show banner only after:
      // - User has viewed 3+ pages OR
      // - User has been on site for 30+ seconds
      const timeOnSite = setTimeout(() => {
        if (views >= 2) {
          setShowBanner(true);
        }
      }, 30000); // 30 seconds
      
      // Or show after 3 page views immediately
      if (views >= 2) {
        setTimeout(() => setShowBanner(true), 3000);
      }

      return () => clearTimeout(timeOnSite);
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
    
    if (outcome === 'accepted') {
      localStorage.setItem('pwa-installed', 'true');
    } else {
      localStorage.setItem('pwa-install-dismissed', 'true');
      localStorage.setItem('pwa-install-dismissed-time', String(Date.now()));
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    localStorage.setItem('pwa-install-dismissed-time', String(Date.now()));
  };

  if (!showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-primary to-primary-600 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FiSmartphone className="text-white" size={28} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white mb-2">
                Instalar App IJPS
              </h3>
              <p className="text-sm text-primary-100 mb-4 leading-relaxed">
                Acesso rápido, notificações e funciona sem internet. Instale agora!
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleInstall}
                  className="flex-1 bg-white hover:bg-gray-100 text-primary font-bold py-3 px-5 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    <FiDownload size={18} />
                    Instalar
                  </span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 text-white/90 hover:text-white font-medium transition-colors"
                >
                  Mais tarde
                </button>
              </div>
            </div>
            
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Fechar"
            >
              <FiX size={22} />
            </button>
          </div>
        </div>
        
        <div className="h-1 bg-gradient-to-r from-primary to-primary-600"></div>
      </div>
    </div>
  );
}
