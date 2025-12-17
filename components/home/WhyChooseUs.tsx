import React from 'react';
import { FiCheckCircle, FiShield, FiClock, FiUsers, FiAward, FiTrendingUp } from 'react-icons/fi';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: <FiShield size={32} />,
      title: 'Transparência Total',
      description: 'Preços claros, documentação verificada e processos transparentes em todas as transações.',
    },
    {
      icon: <FiCheckCircle size={32} />,
      title: 'Propriedades Verificadas',
      description: 'Todas as propriedades passam por rigorosa verificação de documentação e estado.',
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Equipa Profissional',
      description: 'Agentes experientes e qualificados prontos para ajudar em cada etapa do processo.',
    },
    {
      icon: <FiClock size={32} />,
      title: 'Atendimento Rápido',
      description: 'Resposta em menos de 2 horas via WhatsApp, telefone ou email.',
    },
    {
      icon: <FiAward size={32} />,
      title: '10+ Anos de Experiência',
      description: 'Conhecimento profundo do mercado imobiliário moçambicano.',
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Tecnologia Avançada',
      description: 'Plataforma digital moderna para facilitar a busca e gestão de propriedades.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-secondary-50 to-primary-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Por Que Escolher a IJPS?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Somos mais do que uma imobiliária - somos seus parceiros de confiança
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary mb-4">
                {reason.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-secondary mb-3">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '500+', label: 'Propriedades Listadas' },
            { number: '300+', label: 'Clientes Felizes' },
            { number: '98%', label: 'Taxa de Satisfação' },
            { number: '24/7', label: 'Suporte Disponível' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm md:text-base text-secondary font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
