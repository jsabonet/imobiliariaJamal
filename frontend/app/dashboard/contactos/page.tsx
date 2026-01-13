'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchContacts } from '@/lib/api';
import { FiCalendar, FiMail, FiPhone, FiMessageSquare } from 'react-icons/fi';

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  property: number | null;
  created_at: string;
}

export default function ContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      const data = await fetchContacts();
      setContacts(data.results || data || []);
    } catch (error) {
      console.error('Erro ao carregar contactos:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Mensagens de Contacto</h1>
          <p className="text-gray-600">Mensagens recebidas dos visitantes do site</p>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-secondary mb-2">{contact.name}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      {contact.email && (
                        <span className="flex items-center gap-1">
                          <FiMail size={16} />
                          {contact.email}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FiPhone size={16} />
                        {contact.phone}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <FiCalendar size={16} />
                    {new Date(contact.created_at).toLocaleDateString('pt-MZ', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {contact.property && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      Referente à Propriedade #{contact.property}
                    </span>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <FiMessageSquare className="text-primary mt-1" size={20} />
                    <p className="text-sm text-gray-500">Mensagem:</p>
                  </div>
                  <p className="text-gray-700 ml-7">{contact.message}</p>
                </div>

                <div className="flex gap-2">
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Responder por Email
                    </a>
                  )}
                  <a
                    href={`tel:${contact.phone}`}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors"
                  >
                    Ligar
                  </a>
                  {contact.property && (
                    <a
                      href={`/propriedades/${contact.property}`}
                      target="_blank"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Ver Propriedade
                    </a>
                  )}
                </div>
              </div>
            ))}

            {contacts.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                Nenhuma mensagem de contacto recebida
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
