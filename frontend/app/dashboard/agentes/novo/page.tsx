'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { FiUpload, FiX, FiUser } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function NovoAgentePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      if (formData.email) data.append('email', formData.email);
      data.append('phone', formData.phone);
      if (formData.whatsapp) data.append('whatsapp', formData.whatsapp);
      if (photoFile) data.append('photo', photoFile);

      const response = await fetch(`${API_URL}/agents/`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        router.push('/dashboard/agentes');
      } else {
        const error = await response.json();
        alert('Erro ao criar agente: ' + JSON.stringify(error));
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar agente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-primary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">👤 Novo Agente</h1>
            <p className="text-primary-50 text-sm md:text-base">
              Preencha os dados do novo agente imobiliário
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto do Agente */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
              <FiUser className="text-primary" />
              Foto do Agente
            </h3>
            
            <div className="flex flex-col items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-md"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                  <FiUser className="text-gray-400" size={48} />
                </div>
              )}

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-6 py-3 bg-primary-50 text-primary rounded-lg hover:bg-primary-100 transition-colors">
                  <FiUpload size={18} />
                  <span className="font-medium">
                    {photoPreview ? 'Alterar Foto' : 'Carregar Foto'}
                  </span>
                </div>
              </label>
              <p className="text-xs text-gray-500 text-center">
                Formatos: JPG, PNG, WEBP • Máx: 5MB
              </p>
            </div>
          </div>

          {/* Dados Pessoais */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4">
            <h3 className="text-lg font-bold text-secondary mb-4">
              📋 Dados Pessoais
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Ex: João Manuel da Silva"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="joao.silva@exemplo.com"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+258 84 123 4567"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <Input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+258 84 123 4567"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Incluindo código do país
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="sticky bottom-0 bg-white rounded-xl shadow-lg p-4 border border-gray-200 flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              className="flex-1 min-h-[48px]"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 min-h-[48px] bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Salvando...' : '✓ Criar Agente'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
