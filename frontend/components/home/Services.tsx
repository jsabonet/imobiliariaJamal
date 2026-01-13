import React from 'react';
import Link from 'next/link';
import { FiHome, FiTrendingUp, FiKey, FiFileText } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

const Services = () => {
  const services = [
    {
      icon: <FiFileText size={40} />,
      title: 'Avaliação de Imóveis',
      description: 'Avaliação profissional do valor real do seu imóvel no mercado atual, com relatório detalhado.',
      features: [
        'Avaliação presencial',
        'Relatório detalhado',
        'Análise de mercado',
        'Certificado de avaliação',
      ],
      link: '/servicos/avaliacao',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: <FiHome size={40} />,
      title: 'Venda de Propriedades',
      description: 'Anuncie o seu imóvel e alcance milhares de potenciais compradores em toda Moçambique.',
      features: [
        'Fotografia profissional',
        'Marketing digital',
        'Negociação especializada',
        'Apoio jurídico',
      ],
      link: '/servicos/venda',
      color: 'bg-primary-50 text-primary',
    },
    {
      icon: <FiKey size={40} />,
      title: 'Arrendamento',
      description: 'Encontre inquilinos qualificados ou o imóvel perfeito para arrendar com segurança.',
      features: [
        'Verificação de inquilinos',
        'Contratos legais',
        'Gestão de propriedades',
        'Cobrança de rendas',
      ],
      link: '/servicos/arrendamento',
      color: 'bg-accent-50 text-accent-600',
    },
    {
      icon: <FiTrendingUp size={40} />,
      title: 'Consultoria de Investimento',
      description: 'Orientação especializada para investir no mercado imobiliário moçambicano.',
      features: [
        'Análise de ROI',
        'Oportunidades de mercado',
        'Due diligence',
        'Estratégia de investimento',
      ],
      link: '/servicos/consultoria',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluções completas para todas as suas necessidades imobiliárias
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card key={index} hover className="h-full">
              <div className="p-6 flex flex-col h-full">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl ${service.color} flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-secondary mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 flex-grow">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-accent-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={service.link}>
                  <Button variant="outline" fullWidth>
                    Saber Mais
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Precisa de um serviço específico?
          </p>
          <Link href="/contacto">
            <Button size="lg">
              Contacte-nos Agora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
