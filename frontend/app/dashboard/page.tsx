'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { FiHome, FiFileText, FiMail, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { fetchProperties, fetchEvaluations, fetchContacts } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    properties: 0,
    evaluations: 0,
    contacts: 0,
    featured: 0,
    agents: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [propertiesData, evaluationsData, contactsData, agentsResponse] = await Promise.all([
          fetchProperties({}),
          fetchEvaluations(),
          fetchContacts(),
          fetch('http://localhost:8000/api/agents/'),
        ]);

        const agentsData = await agentsResponse.json();

        setStats({
          properties: propertiesData.count || propertiesData.results?.length || 0,
          evaluations: evaluationsData.count || evaluationsData.results?.length || 0,
          contacts: contactsData.count || contactsData.results?.length || 0,
          featured: propertiesData.results?.filter((p: any) => p.is_featured).length || 0,
          agents: agentsData.count || agentsData.results?.length || agentsData.length || 0,
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">📊 Dashboard</h1>
            <p className="text-primary-50 text-sm md:text-base">
              Visão geral da plataforma IJPS Imobiliária
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total de Propriedades"
              value={stats.properties}
              icon={FiHome}
              color="primary"
            />
            <StatsCard
              title="Propriedades em Destaque"
              value={stats.featured}
              icon={FiTrendingUp}
              color="green"
            />
            <StatsCard
              title="Agentes Cadastrados"
              value={stats.agents}
              icon={FiUsers}
              color="purple"
            />
            <StatsCard
              title="Pedidos de Avaliação"
              value={stats.evaluations}
              icon={FiFileText}
              color="blue"
            />
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Acesso Rápido</h2>
            <div className="space-y-3">
              <a
                href="/dashboard/propriedades"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiHome className="text-primary" size={24} />
                  <div>
                    <h3 className="font-semibold text-secondary">Gerenciar Propriedades</h3>
                    <p className="text-sm text-gray-600">Adicionar, editar ou remover propriedades</p>
                  </div>
                </div>
              </a>
              <a
                href="/dashboard/agentes"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiUsers className="text-primary" size={24} />
                  <div>
                    <h3 className="font-semibold text-secondary">Gerenciar Agentes</h3>
                    <p className="text-sm text-gray-600">Adicionar, editar ou remover agentes</p>
                  </div>
                </div>
              </a>
              <a
                href="/dashboard/avaliacoes"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiFileText className="text-primary" size={24} />
                  <div>
                    <h3 className="font-semibold text-secondary">Ver Avaliações</h3>
                    <p className="text-sm text-gray-600">Pedidos de avaliação recebidos</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Gestão de Contactos</h2>
            <div className="space-y-3">
              <a
                href="/dashboard/contactos"
                className="block p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiMail className="text-primary" size={24} />
                  <div>
                    <h3 className="font-semibold text-secondary">Ver Contactos</h3>
                    <p className="text-sm text-gray-600">{stats.contacts} mensagens de clientes</p>
                  </div>
                </div>
              </a>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-1">✓ Dashboard Completo</h3>
                <p className="text-sm text-green-700">
                  Todas as operações administrativas estão disponíveis neste painel.
                  Django Admin não é mais necessário!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
