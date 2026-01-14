'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NovoAgentePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    username: '',
    password: '',
    confirmPassword: '',
    is_staff: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Nome, email e telefone são obrigatórios');
      return;
    }

    if (!formData.username || !formData.password) {
      setError('Username e password são obrigatórios');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          username: formData.username,
          password: formData.password,
          is_staff: formData.is_staff,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Agente criado com sucesso!');
        router.push('/admin/agentes');
      } else {
        setError(data.error || 'Erro ao criar agente');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Novo Agente</h1>
              <p className="mt-1 text-sm text-gray-500">
                Criar novo agente com credenciais de acesso
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-medium text-gray-900">Dados do Agente</h2>
            <p className="mt-1 text-sm text-gray-500">
              Informações pessoais do agente imobiliário
            </p>
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
                  placeholder="+258 84 123 4567"
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
                  placeholder="+258 84 123 4567"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Se vazio, usa o telefone principal
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4 pt-6">
            <h2 className="text-lg font-medium text-gray-900">Credenciais de Acesso</h2>
            <p className="mt-1 text-sm text-gray-500">
              Dados para login no sistema
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="nome.sobrenome"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Usado para login no sistema
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mínimo 6 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4 pt-6">
            <h2 className="text-lg font-medium text-gray-900">Permissões</h2>
            <p className="mt-1 text-sm text-gray-500">
              Definir nível de acesso do agente
            </p>
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
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="is_staff" className="font-medium text-gray-700">
                  Acesso Administrativo
                </label>
                <p className="text-gray-500">
                  Permitir que este agente acesse o painel administrativo
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    Apenas Superusuários
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      Apenas superusuários podem criar agentes com permissões administrativas.
                      Agentes com acesso admin podem gerenciar propriedades, mas não podem criar outros agentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <Link
              href="/admin/agentes"
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Agente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
