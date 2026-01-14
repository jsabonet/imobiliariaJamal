'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchProperties, Property, PaginatedResponse } from '@/lib/api';
import { FiEdit, FiTrash2, FiPlus, FiEye, FiHome } from 'react-icons/fi';
import Link from 'next/link';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Pagination from '@/components/ui/Pagination';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function PropriedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [paginationData, setPaginationData] = useState<PaginatedResponse<Property> | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    loadProperties();
  }, [filter, currentPage, itemsPerPage]);

  async function loadProperties() {
    try {
      setLoading(true);
      const params: any = {
        page: currentPage.toString(),
        page_size: itemsPerPage.toString(),
      };
      if (filter === 'featured') params.is_featured = 'true';
      if (filter === 'verified') params.is_verified = 'true';
      
      const data = await fetchProperties(params);
      setProperties(data.results || []);
      setPaginationData(data);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta propriedade?')) return;
    
    try {
      const response = await fetch(`${API_URL}/properties/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProperties(properties.filter(p => p.id !== id));
      } else {
        alert('Erro ao deletar propriedade');
      }
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error);
      alert('Erro ao deletar propriedade');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header - Mobile First */}
        <div className="mb-6 md:mb-8">
          <div className="bg-primary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">🏠 Propriedades</h1>
                <p className="text-primary-50 text-sm md:text-base">Gerenciar propriedades da plataforma</p>
              </div>
              <Link
                href="/dashboard/propriedades/nova"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary rounded-lg hover:bg-primary-50 transition-colors font-semibold shadow-lg min-h-[48px] md:min-h-[44px]"
              >
                <FiPlus size={20} />
                <span>Nova Propriedade</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters - Mobile Scrollable */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => { setFilter('all'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
          >
            Todas
          </button>
          <button
            onClick={() => { setFilter('featured'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'featured' ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
          >
            Em Destaque
          </button>
          <button
            onClick={() => { setFilter('verified'); setCurrentPage(1); }}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${filter === 'verified' ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
          >
            Verificadas
          </button>
        </div>

        {/* Properties List - Mobile First */}
        {loading ? (
          <LoadingSpinner size="lg" text="Carregando propriedades..." centered />
        ) : (
          <>
            {/* Desktop Table - Hidden on Mobile */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propriedade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {property.images[0] ? (
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={property.images[0].image}
                              alt={property.title}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {parseFloat(property.price).toLocaleString('pt-MZ')} MZN
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {property.is_featured && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary">
                            Destaque
                          </span>
                        )}
                        {property.is_verified && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Verificada
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <Link
                          href={`/propriedades/${property.id}`}
                          target="_blank"
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver no site"
                        >
                          <FiEye size={18} />
                        </Link>
                        <Link
                          href={`/dashboard/propriedades/${property.id}/editar`}
                          className="text-primary hover:text-primary-600"
                          title="Editar"
                        >
                          <FiEdit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Deletar"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {properties.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Nenhuma propriedade encontrada
              </div>
            )}
          </div>
          
          {/* Mobile Cards - Shown only on Mobile */}
          <div className="lg:hidden space-y-4">
            {properties.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500">Nenhuma propriedade encontrada</p>
              </div>
            ) : (
              properties.map((property) => (
                <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  <div className="flex gap-4 p-4">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      {property.images[0] ? (
                        <img
                          className="h-20 w-20 rounded-lg object-cover"
                          src={property.images[0].image}
                          alt={property.title}
                        />
                      ) : (
                        <div className="h-20 w-20 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FiHome className="text-gray-400" size={32} />
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-secondary truncate">{property.title}</h3>
                      <p className="text-sm text-gray-600 truncate">{property.location}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {parseFloat(property.price).toLocaleString('pt-MZ')} MZN
                      </p>
                      
                      {/* Badges */}
                      <div className="flex gap-2 mt-2">
                        {property.is_featured && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary">
                            Destaque
                          </span>
                        )}
                        {property.is_verified && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Verificada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex gap-2">
                    <Link
                      href={`/propriedades/${property.id}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <FiEye size={18} />
                      <span>Ver</span>
                    </Link>
                    <Link
                      href={`/dashboard/propriedades/${property.id}/editar`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <FiEdit size={18} />
                      <span>Editar</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <FiTrash2 size={18} />
                      <span>Deletar</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {paginationData && paginationData.count > itemsPerPage && !loading && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(paginationData.count / itemsPerPage)}
                totalItems={paginationData.count}
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
