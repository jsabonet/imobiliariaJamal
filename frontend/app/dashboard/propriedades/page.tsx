'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { fetchProperties, Property } from '@/lib/api';
import { FiEdit, FiTrash2, FiPlus, FiEye } from 'react-icons/fi';
import Link from 'next/link';


  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export default function PropriedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProperties();
  }, [filter]);

  async function loadProperties() {
    try {
      setLoading(true);
      const params: any = {};
      if (filter === 'featured') params.is_featured = 'true';
      if (filter === 'verified') params.is_verified = 'true';
      
      const data = await fetchProperties(params);
      setProperties(data.results || []);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar esta propriedade?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/properties/${id}/`, {
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
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-secondary mb-2">Propriedades</h1>
            <p className="text-gray-600">Gerenciar propriedades da plataforma</p>
          </div>
          <Link
            href="/dashboard/propriedades/nova"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <FiPlus size={20} />
            Adicionar Propriedade
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-4 py-2 rounded-lg ${filter === 'featured' ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
          >
            Em Destaque
          </button>
          <button
            onClick={() => setFilter('verified')}
            className={`px-4 py-2 rounded-lg ${filter === 'verified' ? 'bg-primary text-white' : 'bg-white text-gray-700 border'}`}
          >
            Verificadas
          </button>
        </div>

        {/* Properties Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
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
        )}
      </div>
    </DashboardLayout>
  );
}
