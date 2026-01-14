'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchEvaluation, deleteEvaluation } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  FiCalendar,
  FiMapPin,
  FiHome,
  FiMail,
  FiPhone,
  FiTrash2,
  FiArrowLeft,
  FiMessageSquare,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

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

export default function EvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const evaluationId = params.id as string;

  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvaluation();
  }, [evaluationId]);

  async function loadEvaluation() {
    try {
      setLoading(true);
      const data = await fetchEvaluation(Number(evaluationId));
      setEvaluation(data);
    } catch (err: any) {
      console.error('Erro ao carregar avaliação:', err);
      setError(err.message || 'Erro ao carregar avaliação');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!evaluation) return;

    if (!confirm(`Tem certeza que deseja deletar a avaliação de ${evaluation.name}?`)) {
      return;
    }

    try {
      await deleteEvaluation(evaluation.id);
      router.push('/dashboard/avaliacoes');
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      alert('Erro ao deletar avaliação');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Carregando avaliação..." centered />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !evaluation) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">
              {error || 'Avaliação não encontrada'}
            </p>
            <button
              onClick={() => router.push('/dashboard/avaliacoes')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Voltar para Lista
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const propertyTypeLabels: Record<string, string> = {
    apartamento: 'Apartamento',
    casa: 'Casa',
    terreno: 'Terreno',
    comercial: 'Comercial',
    condominio: 'Condomínio',
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-4 transition-colors"
          >
            <FiArrowLeft size={20} />
            Voltar
          </button>

          <div className="bg-primary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              📋 Detalhes da Avaliação
            </h1>
            <p className="text-primary-50 text-sm md:text-base">
              Pedido #{evaluation.id} - Recebido em{' '}
              {new Date(evaluation.created_at).toLocaleDateString('pt-MZ', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dados do Cliente */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <FiMessageSquare className="text-primary" />
                Dados do Cliente
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nome Completo</label>
                    <p className="text-lg font-semibold text-secondary mt-1">{evaluation.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Data do Pedido</label>
                    <p className="text-lg font-semibold text-secondary mt-1 flex items-center gap-2">
                      <FiCalendar className="text-primary" />
                      {new Date(evaluation.created_at).toLocaleDateString('pt-MZ', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg text-secondary mt-1 flex items-center gap-2">
                      <FiMail className="text-primary flex-shrink-0" />
                      <a
                        href={`mailto:${evaluation.email}`}
                        className="hover:text-primary hover:underline truncate"
                      >
                        {evaluation.email}
                      </a>
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-lg text-secondary mt-1 flex items-center gap-2">
                      <FiPhone className="text-primary" />
                      <a href={`tel:${evaluation.phone}`} className="hover:text-primary hover:underline">
                        {evaluation.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Imóvel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                <FiHome className="text-primary" />
                Dados do Imóvel
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Propriedade</label>
                  <p className="text-lg font-semibold text-secondary mt-1 capitalize">
                    {propertyTypeLabels[evaluation.property_type] || evaluation.property_type}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Localização</label>
                  <p className="text-lg font-semibold text-secondary mt-1 flex items-center gap-2">
                    <FiMapPin className="text-primary" />
                    {evaluation.location}
                  </p>
                </div>
              </div>

              {evaluation.details && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500 mb-2 block">
                    Observações e Detalhes Adicionais
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{evaluation.details}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-6">
            {/* Card de Ações */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-secondary mb-4">Ações Rápidas</h2>

              <div className="space-y-3">
                <a
                  href={`mailto:${evaluation.email}?subject=Pedido de Avaliação - ${evaluation.name}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <FiMail size={20} />
                  Enviar Email
                </a>

                <a
                  href={`tel:${evaluation.phone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  <FiPhone size={20} />
                  Ligar
                </a>

                <a
                  href={`https://wa.me/${evaluation.phone.replace(/\s/g, '')}?text=Olá ${
                    evaluation.name
                  }, recebemos o seu pedido de avaliação de imóvel.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors"
                >
                  <FaWhatsapp size={20} />
                  WhatsApp
                </a>

                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mt-6"
                >
                  <FiTrash2 size={20} />
                  Deletar Avaliação
                </button>
              </div>
            </div>

            {/* Card de Informações */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-800 mb-3">💡 Próximos Passos</h3>
              <ol className="space-y-2 text-sm text-blue-700">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>Entre em contacto com o cliente</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>Agende uma visita ao imóvel</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>Realize a avaliação presencial</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>Envie o relatório em 3-5 dias</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
