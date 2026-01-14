'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchContacts, deleteContact } from '@/lib/api';
import { FiCalendar, FiMail, FiPhone, FiMessageSquare, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SkeletonCard from '@/components/ui/SkeletonCard';
import Pagination from '@/components/ui/Pagination';

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
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [paginatedContacts, setPaginatedContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProperty, setFilterProperty] = useState<'all' | 'with' | 'without'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContactsData();
  }, [searchTerm, filterProperty, contacts]);

  useEffect(() => {
    // Paginate filtered contacts
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedContacts(filteredContacts.slice(startIndex, endIndex));
  }, [filteredContacts, currentPage, itemsPerPage]);

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

  function filterContactsData() {
    let filtered = [...contacts];

    // Filtrar por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          (c.email && c.email.toLowerCase().includes(term)) ||
          c.phone.includes(term) ||
          c.message.toLowerCase().includes(term)
      );
    }

    // Filtrar por propriedade
    if (filterProperty === 'with') {
      filtered = filtered.filter((c) => c.property !== null);
    } else if (filterProperty === 'without') {
      filtered = filtered.filter((c) => c.property === null);
    }

    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Tem certeza que deseja deletar a mensagem de ${name}?`)) {
      return;
    }

    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Erro ao deletar contacto:', error);
      alert('Erro ao deletar contacto');
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-secondary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
              💬 Mensagens de Contacto
            </h1>
            <p className="text-gray-100 text-sm md:text-base">
              Gerencie as mensagens recebidas dos visitantes
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Nome, email, telefone, mensagem..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtro por Propriedade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por Propriedade
              </label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value as any)}
              >
                <option value="all">Todas</option>
                <option value="with">Com Propriedade</option>
                <option value="without">Sem Propriedade</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Mostrando <span className="font-bold text-primary">{filteredContacts.length}</span> de{' '}
              <span className="font-bold">{contacts.length}</span> mensagens
            </span>
            {(searchTerm || filterProperty !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterProperty('all');
                }}
                className="text-primary hover:text-primary-600 font-medium"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="grid gap-4 md:gap-6">
            <SkeletonCard type="contact" count={3} />
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {paginatedContacts.map((contact) => (
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

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/contactos/${contact.id}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    <FiEye size={16} />
                    Ver Detalhes
                  </button>
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors text-sm"
                    >
                      <FiMail size={16} />
                      Email
                    </a>
                  )}
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors text-sm"
                  >
                    <FiPhone size={16} />
                    Ligar
                  </a>
                  {contact.property && (
                    <button
                      onClick={() => router.push(`/dashboard/propriedades/${contact.property}/editar`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      Ver Propriedade
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(contact.id, contact.name)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm ml-auto"
                  >
                    <FiTrash2 size={16} />
                    Deletar
                  </button>
                </div>
              </div>
            ))}

            {filteredContacts.length === 0 && (
              <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow">
                {searchTerm || filterProperty !== 'all'
                  ? 'Nenhuma mensagem encontrada com os filtros aplicados'
                  : 'Nenhuma mensagem de contacto recebida'}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredContacts.length > itemsPerPage && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredContacts.length / itemsPerPage)}
                totalItems={filteredContacts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onItemsPerPageChange={(items) => {
                  setItemsPerPage(items);
                  setCurrentPage(1);
                }}
                showItemsPerPage={true}
              />
            </div>
          )}
        </>
        )}
      </div>
    </DashboardLayout>
  );
}
