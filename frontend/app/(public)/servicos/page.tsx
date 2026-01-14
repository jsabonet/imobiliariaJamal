import React from 'react';
import Link from 'next/link';
import { FiFileText, FiHome, FiKey, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Metadata } from 'next';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'Serviços Imobiliários em Moçambique | IJPS - Venda, Arrendamento, Avaliação',
  description: 'Serviços imobiliários profissionais em Moçambique: venda de propriedades, arrendamento, avaliação, consultoria jurídica e gestão de patrimónios. Equipa especializada ao seu dispor.',
  keywords: ['serviços imobiliários Moçambique', 'venda propriedades', 'arrendamento Maputo', 'avaliação imóveis', 'consultoria imobiliária', 'gestão patrimónios', 'IJPS serviços'],
  openGraph: {
    title: 'Serviços Imobiliários Profissionais | IJPS Moçambique',
    description: 'Venda, arrendamento, avaliação e gestão de propriedades em Moçambique. Serviços completos com equipa especializada.',
    type: 'website',
    locale: 'pt_MZ',
    url: 'https://ijps.co.mz/servicos',
    siteName: 'IJPS - Imobiliária Jamal & Prestação de Serviços',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serviços Imobiliários Profissionais | IJPS',
    description: 'Venda, arrendamento, avaliação e gestão de propriedades em Moçambique.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ijps.co.mz/servicos',
  },
};

export default function ServicosPage() {
  const services = [
    {
      id: 'venda',
      icon: <FiHome size={48} />,
      title: 'Venda de Propriedades',
      description: 'Vendemos o seu imóvel com estratégia profissional de marketing e negociação especializada.',
      features: [
        'Fotografia profissional inclusa',
        'Marketing digital completo',
        'Publicação em múltiplas plataformas',
        'Agente dedicado',
        'Negociação especializada',
        'Apoio jurídico completo',
      ],
      pricing: 'Comissão competitiva',
      link: '/propriedades',
      color: 'bg-primary',
    },
    {
      id: 'arrendamento',
      icon: <FiKey size={48} />,
      title: 'Arrendamento',
      description: 'Gestão completa de arrendamento com 10-20 transações mensais. Desde a busca de inquilinos até à gestão do contrato.',
      features: [
        'Verificação rigorosa de inquilinos',
        'Contratos legalmente validados',
        'Gestão de propriedades incluída',
        'Cobrança de rendas',
        'Manutenção e assistência',
        'Relatórios mensais detalhados',
      ],
      pricing: 'Consulte-nos',
      link: '/propriedades',
      color: 'bg-accent',
    },
    {
      id: 'legalizacao',
      icon: <FiFileText size={48} />,
      title: 'Legalização de Propriedades',
      description: 'Serviço especializado de legalização e regularização de documentação imobiliária.',
      features: [
        'Regularização de DUAT',
        'Obtenção de escrituras',
        'Licenças de construção',
        'Certidões e alvarás',
        'Assessoria jurídica completa',
        'Acompanhamento em cartórios',
      ],
      pricing: 'Orçamento personalizado',
      link: '/contacto',
      color: 'bg-blue-500',
    },
    {
      id: 'consultoria',
      icon: <FiTrendingUp size={48} />,
      title: 'Consultoria Especializada',
      description: 'Orientação especializada para clientes locais e internacionais. Atendemos clientes de Holanda, Portugal e Itália.',
      features: [
        'Análise de oportunidades premium (1.5M - 40M MZN)',
        'Assessoria para investidores estrangeiros',
        'Due diligence completa',
        'Estratégia de investimento',
        'Análise de mercado local',
        'Suporte multilíngue',
      ],
      pricing: 'Consulte-nos',
      link: '/contacto',
      color: 'bg-purple-500',
    },
  ];

  const specialServices = [
    'Legalização de propriedades e terrenos',
    'Regularização de DUAT',
    'Assessoria para clientes internacionais',
    'Gestão de carteira premium (1.5M - 40M MZN)',
    'Consultoria para investidores estrangeiros',
    'Serviços personalizados para classe alta',
  ];

  const faqs = [
    {
      question: 'Quanto custa vender uma propriedade com a IJPS?',
      answer: 'Nossa comissão é competitiva e baseada no valor final de venda. Entre em contato para uma proposta personalizada sem compromisso.',
    },
    {
      question: 'Como funciona o processo de arrendamento?',
      answer: 'Cuidamos de todo o processo: marketing, triagem de inquilinos, negociação, contrato e gestão contínua. Você recebe as rendas diretamente.',
    },
    {
      question: 'Quanto tempo demora para vender um imóvel?',
      answer: 'O tempo varia conforme o mercado e o tipo de propriedade. Em média, propriedades bem posicionadas vendem entre 30 a 90 dias.',
    },
    {
      question: 'A IJPS atende investidores estrangeiros?',
      answer: 'Sim! Atendemos clientes de Holanda, Portugal, Itália e outros países. Oferecemos suporte multilíngue e assessoria completa para investidores internacionais.',
    },
    {
      question: 'Que documentos preciso para legalizar minha propriedade?',
      answer: 'Depende do tipo de propriedade. Nossa equipa jurídica analisa seu caso gratuitamente e fornece lista completa de documentos necessários.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Schemas */}
      <FAQSchema faqs={faqs} />
      <BreadcrumbSchema items={[
        { name: 'Início', url: '/' },
        { name: 'Serviços', url: '/servicos' },
      ]} />
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Nossos Serviços
          </h1>
          <p className="text-lg text-gray-200">
            Soluções completas para todas as suas necessidades imobiliárias
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} hover>
              <div className="p-8">
                <div className={`w-20 h-20 ${service.color} rounded-xl flex items-center justify-center text-white mb-6`}>
                  {service.icon}
                </div>
                
                <h2 className="text-2xl font-bold text-secondary mb-4">
                  {service.title}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold text-secondary mb-3">O que está incluído:</h3>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <FiCheckCircle className="text-accent-500 mt-0.5 flex-shrink-0" size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Preço</p>
                    <p className="text-lg font-bold text-primary">{service.pricing}</p>
                  </div>
                </div>

                <Link href={service.link}>
                  <Button fullWidth size="lg">
                    Solicitar Serviço
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Special Services Section */}
        <div className="mb-16">
          <Card>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
                Serviços Especializados
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Oferecemos também serviços especializados para situações específicas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specialServices.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-primary-50 transition"
                  >
                    <FiCheckCircle className="text-primary flex-shrink-0" size={20} />
                    <span className="text-sm font-medium text-secondary">{service}</span>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link href="/contacto">
                  <Button variant="outline" size="lg">
                    Falar com Especialista
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Por Que Escolher a IJPS?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold mb-2">10+</div>
                <div className="text-primary-100">Anos de Experiência</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">300+</div>
                <div className="text-primary-100">Clientes Satisfeitos</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-primary-100">Taxa de Satisfação</div>
              </div>
            </div>
            <Link href="/contacto">
              <Button
                size="lg"
                className="text-primary hover:bg-gray-100"
              >
                Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
