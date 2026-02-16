'use client';

import { useState, useEffect } from 'react';
import { isPushNotificationSupported, isSubscribed, getNotificationPermission } from '@/lib/notifications';

interface UseNotificationPromptOptions {
  /** Número de propriedades visualizadas antes de mostrar o prompt */
  viewsThreshold?: number;
  /** Tempo em milissegundos antes de mostrar após atingir o threshold */
  delayAfterThreshold?: number;
  /** Tempo em ms que o usuário deve estar em uma página antes de contar como visualização */
  minTimeOnPage?: number;
  /** Quantos dias esperar após "Mais Tarde" antes de mostrar novamente */
  postponeDays?: number;
}

interface UseNotificationPromptReturn {
  shouldShowPrompt: boolean;
  hidePrompt: () => void;
  trackPropertyView: () => void;
  resetTracking: () => void;
}

const STORAGE_KEYS = {
  VIEWS: 'notification_prompt_views',
  DISMISSED: 'notification_prompt_dismissed',
  POSTPONED: 'notification_prompt_postponed',
  LAST_SHOWN: 'notification_prompt_last_shown',
  ACTIVATED: 'notification_preferences_set',
} as const;

export function useNotificationPrompt(
  options: UseNotificationPromptOptions = {}
): UseNotificationPromptReturn {
  const {
    viewsThreshold = 3,
    delayAfterThreshold = 2000,
    minTimeOnPage = 3000,
    postponeDays = 2,
  } = options;

  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);

  // Verificar se deve mostrar o prompt
  useEffect(() => {
    const checkShouldShow = async () => {
      // 1. Verificar se notificações são suportadas
      if (!isPushNotificationSupported()) {
        return false;
      }

      // 2. Verificar se já está subscrito
      const alreadySubscribed = await isSubscribed();
      if (alreadySubscribed) {
        return false;
      }

      // 3. Verificar se permissão já foi negada
      const permission = getNotificationPermission();
      if (permission === 'denied') {
        return false;
      }

      // 4. Verificar se já foi ativado antes
      if (localStorage.getItem(STORAGE_KEYS.ACTIVATED)) {
        return false;
      }

      // 5. Verificar se foi permanentemente dismissed
      if (localStorage.getItem(STORAGE_KEYS.DISMISSED) === 'true') {
        return false;
      }

      // 6. Verificar se foi adiado recentemente
      const postponedStr = localStorage.getItem(STORAGE_KEYS.POSTPONED);
      if (postponedStr) {
        const postponedTime = parseInt(postponedStr, 10);
        const daysSincePostponed = (Date.now() - postponedTime) / (1000 * 60 * 60 * 24);
        if (daysSincePostponed < postponeDays) {
          return false;
        }
      }

      // 7. Verificar número de visualizações
      const viewsStr = localStorage.getItem(STORAGE_KEYS.VIEWS);
      const views = viewsStr ? parseInt(viewsStr, 10) : 0;
      setViewCount(views);

      if (views < viewsThreshold) {
        return false;
      }

      // 8. Evitar mostrar muito frequentemente (cooldown de 1 hora)
      const lastShownStr = localStorage.getItem(STORAGE_KEYS.LAST_SHOWN);
      if (lastShownStr) {
        const lastShown = parseInt(lastShownStr, 10);
        const hoursSinceLastShown = (Date.now() - lastShown) / (1000 * 60 * 60);
        if (hoursSinceLastShown < 1) {
          return false;
        }
      }

      return true;
    };

    checkShouldShow().then((should) => {
      if (should) {
        // Aguardar delay antes de mostrar
        const timer = setTimeout(() => {
          setShouldShowPrompt(true);
          localStorage.setItem(STORAGE_KEYS.LAST_SHOWN, Date.now().toString());
        }, delayAfterThreshold);

        return () => clearTimeout(timer);
      }
    });
  }, [viewsThreshold, delayAfterThreshold, postponeDays]);

  // Rastrear tempo na página
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Rastrear visualização de propriedade
  const trackPropertyView = () => {
    // Só contar se passou tempo mínimo na página
    if (timeOnPage < minTimeOnPage) {
      return;
    }

    const currentViews = parseInt(localStorage.getItem(STORAGE_KEYS.VIEWS) || '0', 10);
    const newViews = currentViews + 1;
    localStorage.setItem(STORAGE_KEYS.VIEWS, newViews.toString());
    setViewCount(newViews);

    console.log(`📊 [NotificationPrompt] Visualização registrada: ${newViews}/${viewsThreshold}`);
  };

  // Esconder prompt
  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  // Resetar tracking (útil para testes)
  const resetTracking = () => {
    localStorage.removeItem(STORAGE_KEYS.VIEWS);
    localStorage.removeItem(STORAGE_KEYS.DISMISSED);
    localStorage.removeItem(STORAGE_KEYS.POSTPONED);
    localStorage.removeItem(STORAGE_KEYS.LAST_SHOWN);
    setViewCount(0);
    setShouldShowPrompt(false);
  };

  return {
    shouldShowPrompt,
    hidePrompt,
    trackPropertyView,
    resetTracking,
  };
}
