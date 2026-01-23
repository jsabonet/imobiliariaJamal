'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { createProperty } from '@/lib/api';
import { FiSave, FiX, FiChevronDown, FiChevronUp, FiHome, FiMapPin, FiDollarSign, FiGrid, FiStar, FiSettings, FiImage, FiLock } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function NovaPropriedadePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);
  const [documents, setDocuments] = useState<File[]>([]);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    location: true,
    financial: false,
    characteristics: false,
    amenities: false,
    technical: false,
    media: false,
    documents: false,
    admin: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reference_code: '',
    address: '',
    city: '',
    neighborhood: '',
    province: '',
    district: '',
    country: 'Moçambique',
    zip_code: '',
    latitude: '',
    longitude: '',
    price: '',
    currency: 'MZN',
    condominium_fee: '',
    ipra: '',
    type: '',
    status: '',
    legal_status: '',
    bedrooms: 0,
    bathrooms: 0,
    suites: 0,
    toilets: 0,
    area: 0,
    useful_area: '',
    land_area: '',
    parking_spaces: 0,
    year_built: '',
    floor_number: '',
    total_floors: '',
    furnished: false,
    accepts_pets: false,
    accepts_financing: false,
    energy_class: '',
    property_condition: '',
    orientation: '',
    heating_type: '',
    availability_date: '',
    monthly_expenses: '',
    agent: '',
    is_featured: false,
    is_verified: false,
    amenities: [] as string[],
    internal_notes: '',
  });

  const availableAmenities = [
    'Piscina',
    'Ginásio',
    'Jardim',
    'Terraço',
    'Varanda',
    'Garagem',
    'Estacionamento',
    'Elevador',
    'Portaria 24h',
    'Segurança',
    'Ar Condicionado',
    'Gerador',
    'Cozinha Equipada',
    'Despensa',
    'Suite',
    'Roupeiro Embutido',
    'Vista Mar',
    'Vista Cidade',
    'Perto de Escola',
    'Perto de Hospital',
    'Área de Lazer',
    'Churrasqueira',
    'Quintal',
  ];

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await fetch(`${API_URL}/agents/`);
        const data = await response.json();
        setAgents(data.results || data || []);
      } catch (err) {
        console.error('Erro ao carregar agentes:', err);
      }
    }
    loadAgents();
  }, []);

  const propertyTypes = [
    { value: '', label: 'Selecione o tipo' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'apartamento_em_condominio', label: 'Apartamento em Condomínio' },
    { value: 'casa', label: 'Casa' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'empreendimento', label: 'Empreendimento' },
  ];

  const statusOptions = [
    { value: '', label: 'Selecione o status' },
    { value: 'venda', label: 'Venda' },
    { value: 'arrendamento', label: 'Arrendamento' },
  ];

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      const updated = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];
      handleChange('amenities', updated);
      return updated;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const errors: string[] = [];
      const validImages: File[] = [];
      
      // Validar cada imagem
      newImages.forEach((file, index) => {
        // Verificar tipo
        if (!file.type.startsWith('image/')) {
          errors.push(`Arquivo "${file.name}" não é uma imagem válida`);
          return;
        }
        
        // Verificar tamanho (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          errors.push(`Imagem "${file.name}" excede o tamanho máximo de 10MB`);
          return;
        }
        
        validImages.push(file);
      });
      
      // Verificar limite total de imagens (máximo 20)
      if (images.length + validImages.length > 20) {
        errors.push(`Máximo de 20 imagens permitido. Você já tem ${images.length} imagens`);
        setValidationErrors(errors);
        return;
      }
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        setTimeout(() => setValidationErrors([]), 5000);
      }
      
      if (validImages.length > 0) {
        setImages(prevImages => [...prevImages, ...validImages]);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (primaryImageIndex === index) {
      setPrimaryImageIndex(0);
    } else if (primaryImageIndex > index) {
      setPrimaryImageIndex(prev => prev - 1);
    }
  };

  const setPrimaryImage = (index: number) => {
    setPrimaryImageIndex(index);
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setValidationErrors([]);
    
    // Validar campos obrigatórios
    const errors: string[] = [];
    
    if (!formData.title || formData.title.trim() === '') {
      errors.push('Título é obrigatório');
    }
    if (!formData.type || formData.type === '') {
      errors.push('Tipo de imóvel é obrigatório');
    }
    if (!formData.status || formData.status === '') {
      errors.push('Status é obrigatório');
    }
    if (!formData.address || formData.address.trim() === '') {
      errors.push('Endereço é obrigatório');
    }
    if (!formData.city || formData.city.trim() === '') {
      errors.push('Cidade é obrigatória');
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.push('Preço é obrigatório e deve ser maior que zero');
    }
    if (!formData.area || parseFloat(String(formData.area)) <= 0) {
      errors.push('Área é obrigatória e deve ser maior que zero');
    }
    if (images.length === 0) {
      errors.push('Adicione pelo menos 1 imagem da propriedade');
    }
    
    if (errors.length > 0) {
      setValidationErrors(errors);
      setError('Por favor, corrija os erros abaixo antes de salvar');
      // Scroll para o topo para ver os erros
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);

    try {
      // Criar FormData para enviar arquivos
      setUploadStatus('Preparando dados...');
      setUploadProgress(10);
      
      const formDataToSend = new FormData();
      
      // Adicionar campos de texto (evitar enviar amenities aqui)
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') return;
        const value = formData[key as keyof typeof formData];
        if (value !== null && value !== undefined && value !== '') {
          // Converter agent para agent_id
          const fieldName = key === 'agent' ? 'agent_id' : key;
          formDataToSend.append(fieldName, String(value));
        }
      });
      
      setUploadProgress(20);
      
      // Adicionar location (fallback)
      formDataToSend.set('location', formData.neighborhood || formData.address || '');
      
      // Adicionar amenities como JSON válido
      formDataToSend.set('amenities', JSON.stringify(selectedAmenities));
      
      setUploadProgress(30);
      
      // Adicionar imagens
      setUploadStatus(`Processando ${images.length} imagem(ns)...`);
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
        // Marcar qual é a imagem principal
        if (index === primaryImageIndex) {
          formDataToSend.append('primary_image_index', String(index));
        }
      });
      
      setUploadProgress(50);
      
      // Adicionar documentos
      if (documents.length > 0) {
        setUploadStatus(`Adicionando ${documents.length} documento(s)...`);
        documents.forEach(doc => {
          formDataToSend.append('documents', doc);
        });
      }
      
      setUploadProgress(60);
      setUploadStatus('Enviando para o servidor...');
      
      // Enviar para API
      const response = await fetch(`${API_URL}/properties/`, {
        method: 'POST',
        body: formDataToSend,
        // NÃO definir Content-Type - o browser faz isso automaticamente com boundary correto
      });
      
      setUploadProgress(90);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || errorData.message || 'Erro ao criar propriedade';
        
        // Tratar erros específicos
        if (response.status === 400) {
          throw new Error(`Dados inválidos: ${errorMessage}`);
        } else if (response.status === 413) {
          throw new Error('Arquivos muito grandes. Reduza o tamanho das imagens e tente novamente');
        } else if (response.status === 500) {
          throw new Error('Erro no servidor. Tente novamente em alguns minutos');
        }
        
        throw new Error(errorMessage);
      }
      
      setUploadProgress(100);
      setUploadStatus('Propriedade salva com sucesso!');
      
      // Pequeno delay para mostrar o sucesso
      setTimeout(() => {
        router.push('/dashboard/propriedades');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar propriedade');
      console.error('Erro:', err);
      setUploadProgress(0);
      setUploadStatus('');
      // Scroll para o topo para ver o erro
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="bg-primary text-white rounded-xl p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">✨ Nova Propriedade</h1>
            <p className="text-primary-50 text-sm md:text-base">Preencha os campos obrigatórios marcados com * e expanda as seções para adicionar mais detalhes</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alertas de Erro */}
          {error && (
            <div className="animate-shake p-4 md:p-5 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-red-800 text-sm md:text-base mb-1">Erro ao salvar propriedade</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Erros de Validação */}
          {validationErrors.length > 0 && (
            <div className="animate-shake p-4 md:p-5 bg-orange-50 border-l-4 border-orange-500 rounded-lg shadow-md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📋</span>
                <div className="flex-1">
                  <p className="font-semibold text-orange-800 text-sm md:text-base mb-2">Campos obrigatórios não preenchidos:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((err, index) => (
                      <li key={index} className="text-orange-700 text-sm">{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {/* Progress Bar de Upload */}
          {loading && (
            <div className="p-4 md:p-5 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-md">
              <div className="flex items-start gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <p className="font-semibold text-blue-800 text-sm md:text-base mb-2">Salvando propriedade...</p>
                  <p className="text-blue-600 text-sm mb-2">{uploadStatus}</p>
                  <div className="w-full bg-blue-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">{uploadProgress}% completo</p>
                  {images.length > 5 && (
                    <p className="text-xs text-blue-500 mt-2">⏱️ Processando {images.length} imagens... Isso pode levar alguns segundos.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO 1: Informações Básicas */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('basic')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiHome className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-base md:text-lg text-secondary flex items-center gap-2">
                    Informações Básicas
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Obrigatório</span>
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Título, tipo e status</p>
                </div>
              </div>
              {expandedSections.basic ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.basic && (
              <div className="p-4 md:p-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-fadeIn">
                <div className="md:col-span-2">
                  <Input
                    label="Título da Propriedade *"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ex: Apartamento T3 na Polana"
                    required
                  />
                </div>

                <Input
                  label="Código de Referência"
                  value={formData.reference_code}
                  onChange={(e) => handleChange('reference_code', e.target.value)}
                  placeholder="Ex: IJPS-2026-001"
                />

                <Select
                  label="Tipo de Propriedade *"
                  options={propertyTypes}
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                />

                <Select
                  label="Status *"
                  options={statusOptions}
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Situação Legal do Imóvel *
                  </label>
                  <select
                    value={formData.legal_status}
                    onChange={(e) => handleChange('legal_status', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="">Selecione a situação legal</option>
                    <option value="duat">DUAT (Direito de Uso e Aproveitamento da Terra)</option>
                    <option value="direito_uso">Direito de Uso</option>
                    <option value="escritura">Escritura Pública</option>
                    <option value="regularizacao">Em Regularização</option>
                    <option value="concessao">Concessão</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Essencial para transparência e confiança</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Agente Responsável
                  </label>
                  <select
                    value={formData.agent}
                    onChange={(e) => handleChange('agent', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Selecione um agente</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Descreva a propriedade em detalhes..."
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 2: Localização */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('location')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiMapPin className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Localização</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Endereço e coordenadas</p>
                </div>
              </div>
              {expandedSections.location ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.location && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Endereço Completo *"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Ex: Av. Julius Nyerere, 123"
                    required
                  />
                </div>

                <Input
                  label="Bairro *"
                  value={formData.neighborhood}
                  onChange={(e) => handleChange('neighborhood', e.target.value)}
                  placeholder="Ex: Polana Cimento"
                  required
                />

                <Input
                  label="Cidade *"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Ex: Maputo"
                  required
                />

                <Input
                  label="Província *"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  placeholder="Ex: Maputo"
                  required
                />

                <Input
                  label="Distrito"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="Ex: KaMpfumo"
                />

                <Input
                  label="País"
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  placeholder="Moçambique"
                />

                <Input
                  label="Código Postal"
                  value={formData.zip_code}
                  onChange={(e) => handleChange('zip_code', e.target.value)}
                  placeholder="Ex: 1100"
                />

                <Input
                  label="Latitude (GPS)"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="Ex: -25.9692"
                />

                <Input
                  label="Longitude (GPS)"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="Ex: 32.5732"
                />
              </div>
            )}
          </div>

          {/* SEÇÃO 3: Valores Financeiros */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('financial')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiDollarSign className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Valores Financeiros</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Preço e despesas</p>
                </div>
              </div>
              {expandedSections.financial ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.financial && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Preço *"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="Ex: 15000000"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Moeda *
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                    required
                  >
                    <option value="MZN">MZN (Metical Moçambicano)</option>
                    <option value="USD">USD (Dólar Americano)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="ZAR">ZAR (Rand Sul-Africano)</option>
                  </select>
                </div>

                <Input
                  label="Taxa de Condomínio (por mês)"
                  type="number"
                  value={formData.condominium_fee}
                  onChange={(e) => handleChange('condominium_fee', e.target.value)}
                  placeholder="Ex: 5000"
                />

                <Input
                  label="IPRA (Imposto Predial Anual)"
                  type="number"
                  value={formData.ipra}
                  onChange={(e) => handleChange('ipra', e.target.value)}
                  placeholder="Ex: 10000"
                />

                <Input
                  label="Despesas Mensais Estimadas (MZN)"
                  type="number"
                  value={formData.monthly_expenses}
                  onChange={(e) => handleChange('monthly_expenses', e.target.value)}
                  placeholder="Ex: 8000"
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Data de Disponibilidade
                  </label>
                  <input
                    type="date"
                    value={formData.availability_date}
                    onChange={(e) => handleChange('availability_date', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Deixe vazio para disponibilidade imediata</p>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 4: Características */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('characteristics')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiGrid className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Características</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Quartos, área e detalhes</p>
                </div>
              </div>
              {expandedSections.characteristics ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.characteristics && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Quartos"
                  type="number"
                  value={formData.bedrooms}
                  onChange={(e) => handleChange('bedrooms', parseInt(e.target.value) || 0)}
                  min="0"
                />

                <Input
                  label="Suítes"
                  type="number"
                  value={formData.suites}
                  onChange={(e) => handleChange('suites', parseInt(e.target.value) || 0)}
                  min="0"
                />

                <Input
                  label="Quartos de Banho"
                  type="number"
                  value={formData.bathrooms}
                  onChange={(e) => handleChange('bathrooms', parseInt(e.target.value) || 0)}
                  min="0"
                />

                <Input
                  label="Casas de Banho Sociais"
                  type="number"
                  value={formData.toilets}
                  onChange={(e) => handleChange('toilets', parseInt(e.target.value) || 0)}
                  min="0"
                />

                <Input
                  label="Área Total (m²) *"
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleChange('area', parseInt(e.target.value) || 0)}
                  placeholder="Ex: 250"
                  required
                />

                <Input
                  label="Área Útil (m²)"
                  type="number"
                  value={formData.useful_area}
                  onChange={(e) => handleChange('useful_area', e.target.value)}
                  placeholder="Ex: 200"
                />

                <Input
                  label="Área do Terreno (m²)"
                  type="number"
                  value={formData.land_area}
                  onChange={(e) => handleChange('land_area', e.target.value)}
                  placeholder="Ex: 500"
                />
                <p className="text-xs text-gray-500 -mt-4 md:col-span-2">Essencial para casas e terrenos</p>

                <Input
                  label="Vagas de Estacionamento"
                  type="number"
                  value={formData.parking_spaces}
                  onChange={(e) => handleChange('parking_spaces', parseInt(e.target.value) || 0)}
                  min="0"
                />

                <Input
                  label="Ano de Construção"
                  type="number"
                  value={formData.year_built}
                  onChange={(e) => handleChange('year_built', e.target.value)}
                  placeholder="Ex: 2020"
                  min="1900"
                  max={new Date().getFullYear()}
                />

                <Input
                  label="Piso"
                  type="number"
                  value={formData.floor_number}
                  onChange={(e) => handleChange('floor_number', e.target.value)}
                  placeholder="Ex: 5"
                />

                <Input
                  label="Total de Pisos no Edifício"
                  type="number"
                  value={formData.total_floors}
                  onChange={(e) => handleChange('total_floors', e.target.value)}
                  placeholder="Ex: 10"
                />
              </div>
            )}
          </div>

          {/* SEÇÃO 5: Comodidades */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('amenities')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiStar className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Comodidades</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">{selectedAmenities.length} selecionadas</p>
                </div>
              </div>
              {expandedSections.amenities ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.amenities && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {availableAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 6: Detalhes Técnicos */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('technical')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiSettings className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Detalhes Técnicos</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Estado, orientação, energia</p>
                </div>
              </div>
              {expandedSections.technical ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.technical && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Estado de Conservação
                  </label>
                  <select
                    value={formData.property_condition}
                    onChange={(e) => handleChange('property_condition', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Selecione o estado</option>
                    <option value="novo">Novo</option>
                    <option value="como_novo">Como Novo</option>
                    <option value="bom">Bom Estado</option>
                    <option value="para_renovar">Para Renovar</option>
                    <option value="em_construcao">Em Construção</option>
                    <option value="em_planta">Em Planta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Orientação Solar
                  </label>
                  <select
                    value={formData.orientation}
                    onChange={(e) => handleChange('orientation', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Selecione a orientação</option>
                    <option value="norte">Norte</option>
                    <option value="sul">Sul</option>
                    <option value="este">Este</option>
                    <option value="oeste">Oeste</option>
                    <option value="nordeste">Nordeste</option>
                    <option value="noroeste">Noroeste</option>
                    <option value="sudeste">Sudeste</option>
                    <option value="sudoeste">Sudoeste</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Classe Energética
                  </label>
                  <select
                    value={formData.energy_class}
                    onChange={(e) => handleChange('energy_class', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Selecione a classe</option>
                    <option value="A+">A+ (Mais Eficiente)</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G (Menos Eficiente)</option>
                    <option value="isento">Isento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Sistema de Climatização
                  </label>
                  <select
                    value={formData.heating_type}
                    onChange={(e) => handleChange('heating_type', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="">Selecione o sistema</option>
                    <option value="ar_condicionado">Ar Condicionado</option>
                    <option value="split">Split</option>
                    <option value="ventiladores">Ventiladores de Tecto</option>
                    <option value="painel_solar">Painéis Solares</option>
                    <option value="central">Sistema Central</option>
                    <option value="sem_sistema">Sem Sistema</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.furnished}
                        onChange={(e) => handleChange('furnished', e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-secondary-700">
                        Imóvel Mobiliado
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.accepts_pets}
                        onChange={(e) => handleChange('accepts_pets', e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-secondary-700">
                        Aceita Animais
                      </span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.accepts_financing}
                        onChange={(e) => handleChange('accepts_financing', e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-secondary-700">
                        Aceita Financiamento
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 7: Mídia */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('media')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiImage className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Imagens</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">{images.length} imagens selecionadas</p>
                </div>
              </div>
              {expandedSections.media ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.media && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-yellow-800">
                    <strong>📸 Dica:</strong> A primeira imagem (marcada como principal) será exibida nos cards de listagem. As demais aparecem na página de detalhes.
                  </p>
                  <p className="text-xs text-yellow-700">
                    • Máximo: 20 imagens por propriedade<br/>
                    • Tamanho máximo: 10MB por imagem<br/>
                    • Formatos aceitos: JPG, PNG, WEBP, GIF
                  </p>
                </div>

                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Adicionar Imagens *
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-primary focus:outline-none cursor-pointer hover:border-primary transition-colors"
                />
                
                {images.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      {images.length} imagem(ns) selecionada(s)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {images.map((file, index) => (
                        <div 
                          key={index} 
                          className={`relative group rounded-lg overflow-hidden border-2 ${
                            index === primaryImageIndex 
                              ? 'border-primary shadow-lg' 
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          
                          {index === primaryImageIndex && (
                            <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                              ⭐ Principal
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                            {index !== primaryImageIndex && (
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(index)}
                                className="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-dark"
                                title="Definir como principal"
                              >
                                ⭐ Principal
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                              title="Remover imagem"
                            >
                              🗑️ Remover
                            </button>
                          </div>
                          
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEÇÃO 8: Documentos Legais */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('documents')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiLock className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Documentos Legais</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">{documents.length} documento(s) - Opcional</p>
                </div>
              </div>
              {expandedSections.documents ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.documents && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    <strong>🔒 CONFIDENCIAL - USO INTERNO APENAS</strong>
                  </p>
                  <p className="text-xs text-red-700 mt-2">
                    Estes documentos são armazenados de forma segura e <strong>NÃO serão exibidos publicamente</strong>. 
                    Acesso restrito apenas à equipe administrativa e agentes autorizados.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>📄 Documentos para verificação interna:</strong> DUAT, Escritura, Planta Aprovada, Licença de Construção, Certidão Predial, etc.
                  </p>
                </div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Upload de Documentos (PDF, JPG, PNG) - Apenas para Arquivo Interno
                </label>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-primary focus:outline-none cursor-pointer hover:border-primary transition-colors"
                />
                {documents.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-sm font-medium text-gray-700">✓ {documents.length} documento(s) selecionado(s):</p>
                    {documents.map((doc, idx) => (
                      <p key={idx} className="text-xs text-gray-600 pl-4">• {doc.name}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SEÇÃO 9: Administração */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
            <button
              type="button"
              onClick={() => toggleSection('admin')}
              className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent transition-all duration-200 rounded-t-xl touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 p-2 md:p-3 rounded-lg">
                  <FiLock className="text-primary text-xl md:text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base md:text-lg text-secondary">Administração</h3>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">Notas internas e configurações</p>
                </div>
              </div>
              {expandedSections.admin ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {expandedSections.admin && (
              <div className="p-4 md:p-6 border-t border-gray-100 animate-fadeIn space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Observações Internas
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                    rows={3}
                    value={formData.internal_notes}
                    onChange={(e) => handleChange('internal_notes', e.target.value)}
                    placeholder="Notas internas, negociações, detalhes adicionais (não visível ao público)..."
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => handleChange('is_featured', e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      ⭐ Propriedade em Destaque
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_verified}
                      onChange={(e) => handleChange('is_verified', e.target.checked)}
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-secondary-700">
                      ✓ Propriedade Verificada
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-6 lg:-mx-8 mt-8 shadow-lg md:shadow-none md:static md:border-0 md:p-0 md:m-0">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <Button 
                type="submit" 
                disabled={loading} 
                className="flex-1 md:flex-none min-h-[48px] md:min-h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation active:scale-[0.98]"
              >
                <FiSave size={20} />
                <span className="font-semibold">{loading ? 'Salvando...' : 'Salvar Propriedade'}</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/propriedades')}
                disabled={loading}
                className="flex-1 md:flex-none min-h-[48px] md:min-h-[44px] flex items-center justify-center gap-2 border-2 hover:bg-gray-50 transition-all duration-200 touch-manipulation active:scale-[0.98]"
              >
                <FiX size={20} />
                <span className="font-semibold">Cancelar</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
