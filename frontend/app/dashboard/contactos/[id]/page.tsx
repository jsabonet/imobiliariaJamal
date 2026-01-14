'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchContact, deleteContact } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  FiCalendar,
  FiMail,
  FiPhone,
  FiTrash2,
  FiArrowLeft,
  FiMessageSquare,
  FiHome,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  property: number | null;
  created_at: string;
}

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContact();
  }, [contactId]);

  async function loadContact() {
    try {
      setLoading(true);
      const data = await fetchContact(Number(contactId));
      setContact(data);
    } catch (err: any) {
      console.error('Erro ao carregar contacto:', err);
      setError(err.message || 'Erro ao carregar contacto');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!contact) return;

    if (!confirm(`Tem certeza que deseja deletar a mensagem de ${contact.name}?`)) {
      return;
    }

    try {
      await deleteContact(contact.id);
      router.push('/dashboard/contactos');
    } catch (error) {
      console.error('Erro ao deletar contacto:', error);
      alert('Erro ao deletar contacto');
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-screen">
          <LoadingSpinner size="xl" text="Carregando contacto..." centered />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !contact) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">
              {error || 'Contacto não encontrado'}
            </p>
            <button
              onClick={() => router.push('/dashboard/contactos')}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Voltar para Lista
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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

          <div className="bg-secondary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              💬 Detalhes da Mensagem
            </h1>
            <p className="text-gray-100 text-sm md:text-base">
              Mensagem #{contact.id} - Recebida em{' '}
              {new Date(contact.created_at).toLocaleDateString('pt-MZ', {
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
                    <p className="text-lg font-semibold text-secondary mt-1">{contact.name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Data da Mensagem</label>
                    <p className="text-lg font-semibold text-secondary mt-1 flex items-center gap-2">
                      <FiCalendar className="text-primary" />
                      {new Date(contact.created_at).toLocaleDateString('pt-MZ', {
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
                  {contact.email && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-lg text-secondary mt-1 flex items-center gap-2">
                        <FiMail className="text-primary flex-shrink-0" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-primary hover:underline truncate"
                        >
                          {contact.email}
                        </a>
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Telefone</label>
                    <p className="text-lg text-secondary mt-1 flex items-center gap-2">
                      <FiPhone className="text-primary" />
                      <a href={`tel:${contact.phone}`} className="hover:text-primary hover:underline">
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                </div>

                {contact.property && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Propriedade Relacionada</label>
                    <div className="mt-2">
                      <button
                        onClick={() => router.push(`/dashboard/propriedades/${contact.property}/editar`)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <FiHome size={16} />
                        Ver Propriedade #{contact.property}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mensagem */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">
                Mensagem Completa
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {contact.message}
                </p>
              </div>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="space-y-6">
            {/* Card de Ações */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-secondary mb-4">Ações Rápidas</h2>

              <div className="space-y-3">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}?subject=Re: Sua mensagem&body=Olá ${contact.name},%0D%0A%0D%0A`}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <FiMail size={20} />
                    Enviar Email
                  </a>
                )}

                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors"
                >
                  <FiPhone size={20} />
                  Ligar
                </a>

                <a
                  href={`https://wa.me/${contact.phone.replace(/\s/g, '')}?text=Olá ${
                    contact.name
                  }, recebemos a sua mensagem.`}
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
                  Deletar Mensagem
                </button>
              </div>
            </div>

            {/* Card de Informações */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-800 mb-3">💡 Dica</h3>
              <p className="text-sm text-blue-700">
                Responda rapidamente para garantir um bom atendimento ao cliente. Mensagens recebidas há mais de 24 horas devem ser priorizadas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
