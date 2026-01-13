'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchEvaluations } from '@/lib/api';
import { FiCalendar, FiMapPin, FiHome, FiMail, FiPhone } from 'react-icons/fi';

interface Evaluation {
  id: number;
  name: string;
  email: string;
  phone: string;
  property_type: string;
  location: string;
  details: string;
  created_at: string;
}

export default function AvaliacoesPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluations();
  }, []);

  async function loadEvaluations() {
    try {
      const data = await fetchEvaluations();
      setEvaluations(data.results || data || []);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Pedidos de Avaliação</h1>
          <p className="text-gray-600">Solicitações de avaliação recebidas dos clientes</p>
        </div>

        {/* Evaluations List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2">{evaluation.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiMail size={16} />
                        {evaluation.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiPhone size={16} />
                        {evaluation.phone}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <FiCalendar size={16} />
                    {new Date(evaluation.created_at).toLocaleDateString('pt-MZ')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FiHome className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Tipo de Propriedade</p>
                      <p className="font-semibold text-secondary capitalize">{evaluation.property_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-primary" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Localização</p>
                      <p className="font-semibold text-secondary">{evaluation.location}</p>
                    </div>
                  </div>
                </div>

                {evaluation.details && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Detalhes:</p>
                    <p className="text-gray-700">{evaluation.details}</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <a
                    href={`mailto:${evaluation.email}`}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Responder por Email
                  </a>
                  <a
                    href={`tel:${evaluation.phone}`}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors"
                  >
                    Ligar
                  </a>
                </div>
              </div>
            ))}

            {evaluations.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                Nenhum pedido de avaliação recebido
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
