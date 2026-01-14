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

export default function EditarAgentePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [agent, setAgent] = useState<Agent | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    is_staff: false,
    is_active: true,
  });

  useEffect(() => {
    fetchAgent();
  }, [params.id]);

  const fetchAgent = async () => {
    try {
      const res = await fetch(`/api/admin/agents/${params.id}`);
      const data = await res.json();

      if (res.ok) {
        setAgent(data);
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          is_staff: data.user?.is_staff || false,
          is_active: data.user?.is_active || true,
        });
      } else {
        setError(data.error || 'Erro ao carregar agente');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/agents/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Agente atualizado com sucesso!');
        router.push('/admin/agentes');
      } else {
        setError(data.error || 'Erro ao atualizar agente');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/admin/agents/${params.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Senha resetada com sucesso!');
        setShowResetPassword(false);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Erro ao resetar senha');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Agente não encontrado</p>
          <Link href="/admin/agentes" className="text-amber-600 hover:text-amber-700 mt-4 inline-block">
            Voltar para lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/agentes"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Agente</h1>
              <p className="mt-1 text-sm text-gray-500">
                Atualizar dados e permissões de {agent.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Formulário principal */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-medium text-gray-900">Dados do Agente</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {agent.user && (
            <>
              <div className="border-b border-gray-200 pb-4 pt-6">
                <h2 className="text-lg font-medium text-gray-900">Credenciais</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Username</p>
                    <p className="text-sm text-gray-600">@{agent.user.username}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                  >
                    {showResetPassword ? 'Cancelar' : 'Resetar Senha'}
                  </button>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4 pt-6">
                <h2 className="text-lg font-medium text-gray-900">Permissões</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_staff"
                      name="is_staff"
                      type="checkbox"
                      checked={formData.is_staff}
                      onChange={handleChange}
                      disabled={agent.user.is_superuser}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded disabled:bg-gray-100"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_staff" className="font-medium text-gray-700">
                      Acesso Administrativo
                    </label>
                    <p className="text-gray-500">
                      Permitir acesso ao painel administrativo
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_active" className="font-medium text-gray-700">
                      Conta Ativa
                    </label>
                    <p className="text-gray-500">
                      Desmarcar para desativar temporariamente o acesso
                    </p>
                  </div>
                </div>

                {agent.user.is_superuser && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-800">
                      <strong>Superusuário:</strong> Este agente é um superusuário e não pode ter suas permissões administrativas removidas.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <Link
              href="/admin/agentes"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>

        {/* Formulário de reset de senha */}
        {showResetPassword && agent.user && (
          <form onSubmit={handleResetPassword} className="bg-white shadow rounded-lg p-6 space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-lg font-medium text-gray-900">Resetar Senha</h2>
              <p className="mt-1 text-sm text-gray-500">
                Definir nova senha para @{agent.user.username}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nova Senha *
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowResetPassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Resetando...' : 'Resetar Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
