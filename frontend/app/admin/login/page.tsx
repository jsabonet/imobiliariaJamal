'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FiLock, FiUser } from 'react-icons/fi';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        try {
          document.cookie = 'ijps_admin_auth=true; path=/; max-age=86400; samesite=lax';
          if (data.username) {
            document.cookie = `ijps_admin_user=${encodeURIComponent(data.username)}; path=/; max-age=86400; samesite=lax`;
          }
        } catch {}
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(data.message || `Falha no login (status ${res.status})`);
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-4">
            <FiLock size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            Área Administrativa
          </h1>
          <p className="text-gray-600">IJPS Imobiliária</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiUser className="inline mr-2" />
                Usuário ou Email
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                <FiLock className="inline mr-2" />
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ← Voltar ao site
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>© 2026 IJPS - Desenvolvido por Zawadi Digital</p>
        </div>
      </div>
    </div>
  );
}
