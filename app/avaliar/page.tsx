'use client';

import React, { useState } from 'react';
import { FiUpload, FiHome, FiMapPin } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';

export default function AvaliarPage() {
  const [step, setStep] = useState(1);

  const propertyTypes = [
    { value: '', label: 'Selecione o tipo' },
    { value: 'apartamento', label: 'Apartamento' },
    { value: 'casa', label: 'Casa' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'comercial', label: 'Comercial' },
    { value: 'condominio', label: 'Condomínio' },
  ];

  const locations = [
    { value: '', label: 'Selecione a localização' },
    { value: 'maputo', label: 'Maputo' },
    { value: 'matola', label: 'Matola' },
    { value: 'beira', label: 'Beira' },
    { value: 'nampula', label: 'Nampula' },
    { value: 'tete', label: 'Tete' },
    { value: 'outros', label: 'Outros' },
  ];

  const conditions = [
    { value: '', label: 'Selecione o estado' },
    { value: 'novo', label: 'Novo / Excelente' },
    { value: 'bom', label: 'Bom Estado' },
    { value: 'razoavel', label: 'Razoável' },
    { value: 'renovar', label: 'A Renovar' },
    { value: 'construcao', label: 'Em Construção' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
          {/* Progress Steps */}
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
              <form className="space-y-6">
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
                        />
                        <Select
                          label="Localização"
                          options={locations}
                        />
                        <Input
                          label="Área Total (m²)"
                          type="number"
                          placeholder="Ex: 180"
                        />
                        <Input
                          label="Área Construída (m²)"
                          type="number"
                          placeholder="Ex: 150"
                        />
                        <Input
                          label="Número de Quartos"
                          type="number"
                          placeholder="Ex: 3"
                        />
                        <Input
                          label="Número de Casas de Banho"
                          type="number"
                          placeholder="Ex: 2"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select
                          label="Estado de Conservação"
                          options={conditions}
                        />
                        <Input
                          label="Ano de Construção"
                          type="number"
                          placeholder="Ex: 2018"
                        />
                        <Input
                          label="Número de Estacionamentos"
                          type="number"
                          placeholder="Ex: 2"
                        />
                        <Input
                          label="Andar (se aplicável)"
                          placeholder="Ex: 5º Andar"
                        />
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Características Adicionais
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            'Piscina',
                            'Ginásio',
                            'Gerador',
                            'Ar Condicionado',
                            'Segurança 24h',
                            'Elevador',
                          ].map((feature) => (
                            <label key={feature} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                              />
                              <span className="text-sm">{feature}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Fotos do Imóvel (opcional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
                          <FiUpload size={40} className="mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600 mb-2">
                            Clique para fazer upload ou arraste as fotos
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG até 5MB (máximo 10 fotos)
                          </p>
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Observações Adicionais
                        </label>
                        <textarea
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                          rows={4}
                          placeholder="Descreva características especiais do imóvel..."
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
                          required
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="seu@email.com"
                          required
                        />
                        <Input
                          label="Telefone / WhatsApp"
                          type="tel"
                          placeholder="+258 XX XXX XXXX"
                          required
                        />
                        <Input
                          label="Endereço do Imóvel"
                          placeholder="Endereço completo"
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
                    >
                      Voltar
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => setStep(step + 1)}
                      className="flex-1"
                    >
                      Continuar
                    </Button>
                  ) : (
                    <Button type="submit" className="flex-1">
                      Solicitar Avaliação
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </Card>

          {/* Info Section */}
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
        </div>
      </div>
    </div>
  );
}
