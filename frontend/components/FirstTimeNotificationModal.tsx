'use client';

import { useState } from 'react';
import { FiBell, FiX, FiHome, FiDollarSign, FiTrendingDown, FiStar, FiCheck } from 'react-icons/fi';

interface FirstTimeNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (selectedCategories: string[]) => void;
}

const NOTIFICATION_CATEGORIES = [
  {
    id: 'notify_new_properties',
    icon: FiHome,
    title: 'Novas Propriedades',
    description: 'Alertas quando novas propriedades aparecerem',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    recommended: true,
  },
  {
    id: 'notify_price_changes',
    icon: FiDollarSign,
    title: 'Reduções de Preço',
    description: 'Notificações de mudanças de preço',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    recommended: true,
  },
  {
    id: 'notify_status_changes',
    icon: FiTrendingDown,
    title: 'Mudanças de Status',
    description: 'Atualizações de disponibilidade',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    recommended: true,
  },
  {
    id: 'notify_recommendations',
    icon: FiStar,
    title: 'Recomendações',
    description: 'Sugestões personalizadas',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    recommended: false,
  },
];

export default function FirstTimeNotificationModal({ 
  isOpen, 
  onClose, 
  onComplete 
}: FirstTimeNotificationModalProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'notify_new_properties',
    'notify_price_changes',
    'notify_status_changes',
  ]);

  if (!isOpen) return null;

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = () => {
    onComplete(selectedCategories);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FiBell className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configure suas Notificações</h2>
              <p className="text-sm text-gray-600">Escolha o que deseja receber</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700">
              Personalize suas notificações para receber apenas o que é relevante para você.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            {NOTIFICATION_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);

              return (
                <div
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all
                    ${isSelected
                      ? `${category.bgColor} border-current ${category.color} shadow-md`
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${isSelected ? category.color : 'text-gray-400'}`}>
                      <Icon size={22} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {category.title}
                            {category.recommended && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                Recomendado
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 mt-0.5">{category.description}</p>
                        </div>
                        <div
                          className={`
                            flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                            ${isSelected
                              ? `${category.color} border-current`
                              : 'border-gray-300'
                            }
                          `}
                        >
                          {isSelected && <FiCheck size={16} className="text-current" strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <div className="text-blue-600 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Dica</p>
                <p className="text-sm text-blue-700 mt-1">
                  Você pode alterar essas preferências a qualquer momento nas configurações.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-white transition-colors"
          >
            Pular por Agora
          </button>
          <button
            onClick={handleComplete}
            className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
