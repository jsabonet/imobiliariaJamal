'use client';

import { useState, useEffect } from 'react';
import { FiBell, FiClock, FiDollarSign, FiHome, FiStar, FiTrendingDown } from 'react-icons/fi';

interface NotificationPreferences {
  notify_new_properties: boolean;
  notify_price_changes: boolean;
  notify_status_changes: boolean;
  notify_recommendations: boolean;
  location_filters: string[];
  property_types: string[];
  price_min: number | null;
  price_max: number | null;
  bedrooms_min: number | null;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

interface NotificationPreferencesProps {
  endpoint: string;
  onClose?: () => void;
  onSave?: (preferences: NotificationPreferences) => void;
}

const NOTIFICATION_CATEGORIES = [
  {
    id: 'notify_new_properties',
    icon: FiHome,
    title: 'Novas Propriedades',
    description: 'Receba alertas quando novas propriedades corresponderem aos seus critérios',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'notify_price_changes',
    icon: FiDollarSign,
    title: 'Mudanças de Preço',
    description: 'Seja notificado quando houver reduções de preço em propriedades de interesse',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    id: 'notify_status_changes',
    icon: FiTrendingDown,
    title: 'Mudanças de Status',
    description: 'Atualizações sobre disponibilidade de propriedades que você acompanha',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    id: 'notify_recommendations',
    icon: FiStar,
    title: 'Recomendações',
    description: 'Sugestões personalizadas de propriedades similares',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
];

const PROPERTY_TYPES = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'apartamento_em_condominio', label: 'Apartamento em Condomínio' },
  { value: 'casa', label: 'Casa' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
];

export default function NotificationPreferences({ endpoint, onClose, onSave }: NotificationPreferencesProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    notify_new_properties: true,
    notify_price_changes: true,
    notify_status_changes: true,
    notify_recommendations: false,
    location_filters: [],
    property_types: [],
    price_min: null,
    price_max: null,
    bedrooms_min: null,
    quiet_hours_enabled: false,
    quiet_hours_start: '22:00',
    quiet_hours_end: '08:00',
  });

  useEffect(() => {
    loadPreferences();
  }, [endpoint]);

  const loadPreferences = async () => {
    if (!endpoint) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/notifications/preferences/?endpoint=${encodeURIComponent(endpoint)}`
      );
      const data = await response.json();

      if (data.success && data.preferences) {
        setPreferences({
          notify_new_properties: data.preferences.notify_new_properties,
          notify_price_changes: data.preferences.notify_price_changes,
          notify_status_changes: data.preferences.notify_status_changes,
          notify_recommendations: data.preferences.notify_recommendations,
          location_filters: data.preferences.location_filters || [],
          property_types: data.preferences.property_types || [],
          price_min: data.preferences.price_min,
          price_max: data.preferences.price_max,
          bedrooms_min: data.preferences.bedrooms_min,
          quiet_hours_enabled: data.preferences.quiet_hours_enabled,
          quiet_hours_start: data.preferences.quiet_hours_start || '22:00',
          quiet_hours_end: data.preferences.quiet_hours_end || '08:00',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:8000/api/notifications/preferences/update/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint,
          ...preferences,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSave?.(preferences);
        onClose?.();
      } else {
        alert('Erro ao salvar preferências: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      alert('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setPreferences(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId as keyof NotificationPreferences],
    }));
  };

  const togglePropertyType = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      property_types: prev.property_types.includes(type)
        ? prev.property_types.filter(t => t !== type)
        : [...prev.property_types, type],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Categorias de Notificação */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FiBell className="text-primary" />
          Tipos de Notificação
        </h3>
        <div className="space-y-3">
          {NOTIFICATION_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isEnabled = preferences[category.id as keyof NotificationPreferences] as boolean;

            return (
              <div
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isEnabled 
                    ? `${category.bgColor} border-current ${category.color}` 
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${isEnabled ? category.color : 'text-gray-400'}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{category.title}</h4>
                      <div className={`
                        w-11 h-6 rounded-full transition-colors relative
                        ${isEnabled ? 'bg-current' : 'bg-gray-300'}
                      `}>
                        <div className={`
                          absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                          ${isEnabled ? 'translate-x-6' : 'translate-x-1'}
                        `} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filtros de Propriedade */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Filtros de Interesse</h3>
        
        {/* Tipos de Propriedade */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipos de Propriedade
          </label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => togglePropertyType(type.value)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${preferences.property_types.includes(type.value)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Faixa de Preço */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Mínimo (MZN)
            </label>
            <input
              type="number"
              value={preferences.price_min || ''}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                price_min: e.target.value ? Number(e.target.value) : null,
              }))}
              placeholder="Ex: 1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preço Máximo (MZN)
            </label>
            <input
              type="number"
              value={preferences.price_max || ''}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                price_max: e.target.value ? Number(e.target.value) : null,
              }))}
              placeholder="Ex: 5000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Quartos Mínimos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quartos Mínimos
          </label>
          <select
            value={preferences.bedrooms_min || ''}
            onChange={(e) => setPreferences(prev => ({
              ...prev,
              bedrooms_min: e.target.value ? Number(e.target.value) : null,
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Qualquer</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>
      </div>

      {/* Horário Silencioso */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FiClock className="text-primary" />
            <h3 className="text-lg font-semibold">Horário Silencioso</h3>
          </div>
          <button
            onClick={() => setPreferences(prev => ({
              ...prev,
              quiet_hours_enabled: !prev.quiet_hours_enabled,
            }))}
            className={`
              w-11 h-6 rounded-full transition-colors relative
              ${preferences.quiet_hours_enabled ? 'bg-primary' : 'bg-gray-300'}
            `}
          >
            <div className={`
              absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
              ${preferences.quiet_hours_enabled ? 'translate-x-6' : 'translate-x-1'}
            `} />
          </button>
        </div>

        {preferences.quiet_hours_enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Início
              </label>
              <input
                type="time"
                value={preferences.quiet_hours_start}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  quiet_hours_start: e.target.value,
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fim
              </label>
              <input
                type="time"
                value={preferences.quiet_hours_end}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  quiet_hours_end: e.target.value,
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Não receberá notificações durante este período
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 pt-4 border-t">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Preferências'}
        </button>
      </div>
    </div>
  );
}
