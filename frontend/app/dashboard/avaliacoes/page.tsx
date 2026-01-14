'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchEvaluations, deleteEvaluation } from '@/lib/api';
import { FiCalendar, FiMapPin, FiHome, FiMail, FiPhone, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SkeletonCard from '@/components/ui/SkeletonCard';

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
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    loadEvaluations();
  }, []);

  useEffect(() => {
    filterEvaluations();
  }, [searchTerm, filterType, filterLocation, evaluations]);

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

  function filterEvaluations() {
    let filtered = [...evaluations];

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(term) ||
          e.email.toLowerCase().includes(term) ||
          e.phone.includes(term) ||
          e.location.toLowerCase().includes(term)
      );
    }

    // Filtrar por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter((e) => e.property_type === filterType);
    }

    // Filtrar por localização
    if (filterLocation !== 'all') {
      filtered = filtered.filter((e) => e.location === filterLocation);
    }

    setFilteredEvaluations(filtered);
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Tem certeza que deseja deletar a avaliação de ${name}?`)) {
      return;
    }

    try {
      await deleteEvaluation(id);
      setEvaluations((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      alert('Erro ao deletar avaliação');
    }
  }

  const uniqueTypes = Array.from(new Set(evaluations.map((e) => e.property_type)));
  const uniqueLocations = Array.from(new Set(evaluations.map((e) => e.location)));

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-primary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              📋 Pedidos de Avaliação
            </h1>
            <p className="text-primary-50 text-sm md:text-base">
              Gerencie as solicitações de avaliação recebidas
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Nome, email, telefone, localização..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Propriedade
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos</option>
                {uniqueTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              >
                <option value="all">Todas</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Mostrando <span className="font-bold text-primary">{filteredEvaluations.length}</span> de{' '}
              <span className="font-bold">{evaluations.length}</span> avaliações
            </span>
            {(searchTerm || filterType !== 'all' || filterLocation !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setFilterLocation('all');
                }}
                className="text-primary hover:text-primary-600 font-medium"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Evaluations List */}
        {loading ? (
          <div className="grid gap-4 md:gap-6">
            <SkeletonCard type="evaluation" count={3} />
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {filteredEvaluations.map((evaluation) => (
              <div key={evaluation.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-secondary mb-2">{evaluation.name}</h3>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiMail size={16} className="flex-shrink-0" />
                        <span className="truncate">{evaluation.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <FiPhone size={16} className="flex-shrink-0" />
                        {evaluation.phone}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <FiCalendar size={16} />
                      {new Date(evaluation.created_at).toLocaleDateString('pt-MZ')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FiHome className="text-primary flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Tipo de Propriedade</p>
                      <p className="font-semibold text-secondary capitalize">{evaluation.property_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-primary flex-shrink-0" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Localização</p>
                      <p className="font-semibold text-secondary">{evaluation.location}</p>
                    </div>
                  </div>
                </div>

                {evaluation.details && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1 font-medium">Detalhes:</p>
                    <p className="text-gray-700 text-sm">{evaluation.details}</p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/avaliacoes/${evaluation.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    <FiEye size={16} />
                    Ver Detalhes
                  </button>
                  <a
                    href={`mailto:${evaluation.email}`}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors text-sm"
                  >
                    <FiMail size={16} />
                    Email
                  </a>
                  <a
                    href={`tel:${evaluation.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors text-sm"
                  >
                    <FiPhone size={16} />
                    Ligar
                  </a>
                  <button
                    onClick={() => handleDelete(evaluation.id, evaluation.name)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm ml-auto"
                  >
                    <FiTrash2 size={16} />
                    Deletar
                  </button>
                </div>
              </div>
            ))}

            {filteredEvaluations.length === 0 && !loading && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                {searchTerm || filterType !== 'all' || filterLocation !== 'all'
                  ? 'Nenhuma avaliação encontrada com os filtros aplicados'
                  : 'Nenhum pedido de avaliação recebido'}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
