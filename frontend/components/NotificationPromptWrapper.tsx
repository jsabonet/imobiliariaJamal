'use client';

import { useEffect } from 'react';
import { useNotificationPrompt } from '@/hooks/useNotificationPrompt';
import NotificationPrompt from './NotificationPrompt';

interface NotificationPromptWrapperProps {
  /** Se deve rastrear visualização automaticamente ao montar */
  trackOnMount?: boolean;
  /** Variante do prompt */
  variant?: 'modal' | 'toast';
  /** Configurações personalizadas */
  options?: {
    viewsThreshold?: number;
    delayAfterThreshold?: number;
    minTimeOnPage?: number;
    postponeDays?: number;
  };
}

export default function NotificationPromptWrapper({
  trackOnMount = false,
  variant = 'modal',
  options,
}: NotificationPromptWrapperProps) {
  const { shouldShowPrompt, hidePrompt, trackPropertyView } = useNotificationPrompt(options);

  useEffect(() => {
    if (trackOnMount) {
      // Aguardar um pouco antes de rastrear para garantir que usuário está engajado
      const timer = setTimeout(() => {
        trackPropertyView();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trackOnMount, trackPropertyView]);

  const handleActivate = () => {
    console.log('✅ Notificações ativadas via prompt automático');
    hidePrompt();
  };

  const handleDismiss = () => {
    console.log('❌ Prompt de notificação dismissed');
    hidePrompt();
  };

  if (!shouldShowPrompt) {
    return null;
  }

  return (
    <NotificationPrompt
      variant={variant}
      onActivate={handleActivate}
      onDismiss={handleDismiss}
    />
  );
}
