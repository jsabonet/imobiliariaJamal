import React from 'react';
import Link from 'next/link';
import { FiFileText, FiHome, FiKey, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ServicosPage() {
  const services = [
    {
      id: 'avaliacao',
      icon: <FiFileText size={48} />,
      title: 'Avaliação de Imóveis',
      description: 'Avaliação profissional e detalhada do valor real do seu imóvel no mercado atual.',
      features: [
        'Avaliação presencial por especialistas certificados',
        'Relatório técnico detalhado',
        'Análise comparativa de mercado',
        'Certificado de avaliação',
        'Validade de 6 meses',
        'Consultoria incluída',
      ],
      pricing: 'A partir de 5.000 MZN',
      link: '/avaliar',
      color: 'bg-blue-500',
    },
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
        'Apoio jurídico',
      ],
      pricing: 'Comissão de 5% sobre venda',
      link: '/servicos/venda',
      color: 'bg-primary',
    },
    {
      id: 'arrendamento',
      icon: <FiKey size={48} />,
      title: 'Arrendamento',
      description: 'Gestão completa de arrendamento, desde a busca de inquilinos até à gestão do contrato.',
      features: [
        'Verificação de inquilinos',
        'Contratos legalmente validados',
        'Gestão de propriedades (opcional)',
        'Cobrança de rendas',
        'Manutenção e assistência',
        'Relatórios mensais',
      ],
      pricing: '100% da primeira renda',
      link: '/servicos/arrendamento',
      color: 'bg-accent',
    },
    {
      id: 'consultoria',
      icon: <FiTrendingUp size={48} />,
      title: 'Consultoria de Investimento',
      description: 'Orientação especializada para investir de forma inteligente no mercado imobiliário.',
      features: [
        'Análise de oportunidades',
        'Cálculo de ROI e rentabilidade',
        'Due diligence completa',
        'Estratégia de investimento',
        'Análise de risco',
        'Acompanhamento personalizado',
      ],
      pricing: 'Consulte-nos',
      link: '/servicos/consultoria',
      color: 'bg-purple-500',
    },
  ];

  const specialServices = [
    'Avaliação para divórcio e partilhas',
    'Avaliação de quarteirões habitados',
    'Avaliação de edifícios e condomínios',
    'Avaliação de resorts, hotéis e lodges',
    'Consultoria para reassentamento',
    'Gestão de ativos imobiliários',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
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
                className="bg-white text-primary hover:bg-gray-100"
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
