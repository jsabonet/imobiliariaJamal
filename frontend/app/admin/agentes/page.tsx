'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
  is_active: boolean;
}

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  user: User | null;
}

export default function AgentesPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    fetchAgents();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/check-auth');
    if (!res.ok) {
      router.push('/admin/login');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/admin/agents');
      const data = await res.json();
      
      if (res.ok) {
        setAgents(data);
      } else {
        setError(data.error || 'Erro ao carregar agentes');
        if (res.status === 403) {
          setError('Apenas superusuários podem gerenciar agentes');
        }
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (agentId: number) => {
    if (!confirm('Tem certeza que deseja remover este agente? Isso também removerá suas credenciais de acesso.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/agents/${agentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setAgents(agents.filter(a => a.id !== agentId));
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao remover agente');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  };

  const toggleStatus = async (agent: Agent) => {
    if (!agent.user) return;

    try {
      const res = await fetch(`/api/admin/agents/${agent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          whatsapp: agent.whatsapp,
          is_active: !agent.user.is_active,
          is_staff: agent.user.is_staff,
        }),
      });

      if (res.ok) {
        fetchAgents();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao atualizar status');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestão de Agentes</h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerir agentes e suas credenciais de acesso
              </p>
            </div>
            <Link
              href="/admin/agentes/novo"
              className="bg-amber-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
            >
              + Novo Agente
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {agents.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">Nenhum agente cadastrado</p>
            <Link
              href="/admin/agentes/novo"
              className="inline-block mt-4 text-amber-600 hover:text-amber-700 font-medium"
            >
              Cadastrar primeiro agente
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credenciais
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissões
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {agents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                      <div className="text-sm text-gray-500">ID: {agent.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.email}</div>
                      <div className="text-sm text-gray-500">{agent.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agent.user ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            @{agent.user.username}
                          </div>
                          <div className="text-sm text-gray-500">
                            User ID: {agent.user.id}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sem credenciais</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {agent.user?.is_superuser && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Superusuário
                          </span>
                        )}
                        {agent.user?.is_staff && !agent.user?.is_superuser && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Admin
                          </span>
                        )}
                        {!agent.user?.is_staff && agent.user && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Agente
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {agent.user && (
                        <button
                          onClick={() => toggleStatus(agent)}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            agent.user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {agent.user.is_active ? 'Ativo' : 'Inativo'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/agentes/${agent.id}`}
                          className="text-amber-600 hover:text-amber-900"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(agent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
