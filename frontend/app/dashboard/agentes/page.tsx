'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { FiEdit2, FiTrash2, FiPlus, FiPhone, FiMail, FiMessageCircle, FiUser } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  photo: string | null;
}

export default function AgentesPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      const response = await fetch(`${API_URL}/api/agents/`);
      const data = await response.json();
      setAgents(data.results || data || []);
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await fetch(`${API_URL}/api/agents/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAgents(agents.filter(a => a.id !== id));
        setShowDeleteModal(false);
        setAgentToDelete(null);
      } else {
        alert('Erro ao deletar agente');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar agente');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando agentes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">👥 Agentes</h1>
                <p className="text-primary-50 text-sm md:text-base">
                  {agents.length} agente{agents.length !== 1 ? 's' : ''} cadastrado{agents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button
                onClick={() => router.push('/dashboard/agentes/novo')}
                className="flex items-center justify-center gap-2 bg-white text-primary hover:bg-primary-50 min-h-[48px] md:min-h-[44px] shadow-lg"
              >
                <FiPlus size={20} />
                <span className="font-semibold">Novo Agente</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Lista de Agentes */}
        {agents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FiUser className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum agente cadastrado</h3>
            <p className="text-gray-500 mb-6">Adicione o primeiro agente para começar</p>
            <Button
              onClick={() => router.push('/dashboard/agentes/novo')}
              className="inline-flex items-center gap-2"
            >
              <FiPlus size={20} />
              Adicionar Primeiro Agente
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Card Header com Foto */}
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 p-6 text-center">
                  {agent.photo ? (
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full mx-auto bg-white flex items-center justify-center border-4 border-white shadow-lg">
                      <FiUser className="text-primary" size={48} />
                    </div>
                  )}
                  <h3 className="mt-4 text-xl font-bold text-secondary">{agent.name}</h3>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  {agent.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <FiMail className="text-primary flex-shrink-0" size={18} />
                      <a
                        href={`mailto:${agent.email}`}
                        className="text-gray-600 hover:text-primary transition-colors truncate"
                      >
                        {agent.email}
                      </a>
                    </div>
                  )}
                  {agent.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <FiPhone className="text-primary flex-shrink-0" size={18} />
                      <a
                        href={`tel:${agent.phone}`}
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {agent.phone}
                      </a>
                    </div>
                  )}
                  {agent.whatsapp && (
                    <div className="flex items-center gap-3 text-sm">
                      <FiMessageCircle className="text-green-600 flex-shrink-0" size={18} />
                      <a
                        href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-green-600 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 flex gap-3">
                  <button
                    onClick={() => router.push(`/dashboard/agentes/${agent.id}/editar`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-all duration-200 touch-manipulation active:scale-95"
                  >
                    <FiEdit2 size={18} />
                    <span className="font-medium">Editar</span>
                  </button>
                  <button
                    onClick={() => {
                      setAgentToDelete(agent);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 touch-manipulation active:scale-95"
                  >
                    <FiTrash2 size={18} />
                    <span className="font-medium">Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && agentToDelete && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-slideDown">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Exclusão</h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja excluir o agente <strong>{agentToDelete.name}</strong>?
                Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAgentToDelete(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleDelete(agentToDelete.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
