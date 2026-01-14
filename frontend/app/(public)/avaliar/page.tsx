'use client';

import React, { useState } from 'react';
import { FiUpload, FiHome, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import DynamicSEO from '@/components/seo/DynamicSEO';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { submitEvaluation } from '@/lib/api';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function AvaliarPage() {
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    property_type: '',
    location: '',
    details: '',
  });

  const propertyTypes = [
    { value: '', label: 'Selecione o tipo' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'condominio', label: 'Condomínio' },
  ];

  const locations = [
    { value: '', label: 'Selecione a província' },
    { value: 'Maputo Cidade', label: 'Maputo Cidade' },
    { value: 'Maputo Província', label: 'Maputo Província' },
    { value: 'Gaza', label: 'Gaza' },
    { value: 'Inhambane', label: 'Inhambane' },
    { value: 'Sofala', label: 'Sofala' },
    { value: 'Manica', label: 'Manica' },
    { value: 'Tete', label: 'Tete' },
    { value: 'Zambézia', label: 'Zambézia' },
    { value: 'Nampula', label: 'Nampula' },
    { value: 'Cabo Delgado', label: 'Cabo Delgado' },
    { value: 'Niassa', label: 'Niassa' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await submitEvaluation(formData);
      setSuccess(true);
      setStep(4); // Ir para página de sucesso
    } catch (err) {
      setError('Erro ao enviar pedido de avaliação. Por favor, tente novamente.');
      console.error('Erro ao enviar avaliação:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO */}
      <DynamicSEO
        title="Avaliação de Propriedades"
        description="Solicite avaliação profissional do seu imóvel em Moçambique. Avaliação gratuita, rápida e sem compromisso. Conheça o valor real da sua propriedade no mercado."
        keywords={['avaliação imóveis Moçambique', 'avaliar propriedade', 'valor imóvel Maputo', 'avaliação gratuita', 'quanto vale meu imóvel', 'avaliação profissional']}
        canonical="https://ijps.co.mz/avaliar"
      />
      <BreadcrumbSchema items={[
        { name: 'Início', url: '/' },
        { name: 'Avaliar Propriedade', url: '/avaliar' },
      ]} />
      
      <LoadingOverlay isOpen={loading} message="Enviando pedido de avaliação" type="property" />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary to-primary-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Avaliação de Imóveis
          </h1>
          <p className="text-lg text-primary-100">
            Obtenha uma avaliação profissional do valor do seu imóvel no mercado atual
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {success && (
            <Card>
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheckCircle size={40} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-secondary mb-4">
                  Pedido Enviado com Sucesso!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Recebemos o seu pedido de avaliação. A nossa equipa entrará em contacto em breve.
                </p>
                <Button onClick={() => window.location.href = '/'}>
                  Voltar à Página Inicial
                </Button>
              </div>
            </Card>
          )}

          {/* Error Message */}
          {error && !success && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Progress Steps */}
          {!success && (
            <>
              <div className="mb-12">
                <div className="flex justify-between items-center">
                  {[1, 2, 3].map((stepNumber) => (
                    <div key={stepNumber} className="flex items-center flex-1">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center font-bold
                          ${step >= stepNumber
                            ? 'bg-primary text-white'
                            : 'bg-gray-200 text-gray-500'
                          }
                        `}
                      >
                        {stepNumber}
                      </div>
                      {stepNumber < 3 && (
                        <div
                          className={`
                            flex-1 h-1 mx-4
                            ${step > stepNumber ? 'bg-primary' : 'bg-gray-200'}
                          `}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <span className="text-sm font-medium">Dados do Imóvel</span>
                  <span className="text-sm font-medium">Detalhes</span>
                  <span className="text-sm font-medium">Contacto</span>
                </div>
              </div>

          {/* Form Card */}
          <Card>
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-secondary mb-6">
                        Informações Básicas
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                          label="Tipo de Propriedade"
                          options={propertyTypes}
                          value={formData.property_type}
                          onChange={(e) => handleInputChange('property_type', e.target.value)}
                          required
                        />
                        <Select
                          label="Província"
                          options={locations}
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-secondary mb-6">
                        Detalhes do Imóvel
                      </h2>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Observações Adicionais
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                          rows={6}
                          placeholder="Descreva características especiais do imóvel, comodidades, estado de conservação, etc..."
                          value={formData.details}
                          onChange={(e) => handleInputChange('details', e.target.value)}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Contact Info */}
                {step === 3 && (
                  <>
                    <div>
                      <h2 className="text-2xl font-bold text-secondary mb-6">
                        Informações de Contacto
                      </h2>
                      <div className="space-y-6">
                        <Input
                          label="Nome Completo"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                        />
                        <Input
                          label="Telefone / WhatsApp"
                          type="tel"
                          placeholder="+258 XX XXX XXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                        />

                        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                          <h3 className="font-bold text-primary mb-3">
                            Como Funciona?
                          </h3>
                          <ol className="space-y-2 text-sm text-gray-700">
                            <li className="flex gap-2">
                              <span className="font-bold text-primary">1.</span>
                              <span>Enviamos um agente para avaliar o imóvel presencialmente</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold text-primary">2.</span>
                              <span>Análise detalhada do mercado e comparação com propriedades similares</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold text-primary">3.</span>
                              <span>Recebe um relatório completo em 3-5 dias úteis</span>
                            </li>
                            <li className="flex gap-2">
                              <span className="font-bold text-primary">4.</span>
                              <span>Consultoria gratuita sobre próximos passos</span>
                            </li>
                          </ol>
                        </div>

                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary mt-1"
                            required
                          />
                          <span className="text-sm text-gray-700">
                            Aceito os{' '}
                            <a href="/termos" className="text-primary hover:underline">
                              Termos de Uso
                            </a>{' '}
                            e{' '}
                            <a href="/privacidade" className="text-primary hover:underline">
                              Política de Privacidade
                            </a>
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1"
                      disabled={loading}
                    >
                      Voltar
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="flex-1"
                      disabled={loading}
                    >
                      Continuar
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={loading}
                    >
                      {loading ? 'Enviando...' : 'Solicitar Avaliação'}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </Card>

          {/* Info Section */}
          {!success && (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHome size={28} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-secondary mb-2">Gratuito</h3>
                  <p className="text-sm text-gray-600">
                    Avaliação inicial sem custos
                  </p>
                </div>
              </Card>

            <Card>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMapPin size={28} className="text-primary" />
                </div>
                <h3 className="font-bold text-secondary mb-2">Presencial</h3>
                <p className="text-sm text-gray-600">
                  Visita ao local por especialista
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3-5</span>
                </div>
                <h3 className="font-bold text-secondary mb-2">Dias Úteis</h3>
                <p className="text-sm text-gray-600">
                  Relatório completo entregue
                </p>
              </div>
            </Card>
            </div>
          )}
          </>
          )}
        </div>
      </div>
    </div>
  );
}
