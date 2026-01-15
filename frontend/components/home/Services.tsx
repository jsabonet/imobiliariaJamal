'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiHome, FiTrendingUp, FiKey, FiFileText, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      icon: <FiHome size={32} />,
      title: 'Venda de Propriedades',
      description: 'Comercialização de propriedades premium com valores entre 1.5M e 40M MZN.',
      features: [
        'Fotografia profissional',
        'Marketing digital completo',
        'Apoio jurídico',
      ],
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&q=80',
      link: '/propriedades',
      stats: '500+ Clientes'
    },
    {
      icon: <FiKey size={32} />,
      title: 'Arrendamento',
      description: 'Gestão completa de arrendamentos com 10-20 contratos mensais.',
      features: [
        'Verificação de inquilinos',
        'Contratos legais',
        'Gestão de propriedades',
      ],
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&q=80',
      link: '/propriedades',
      stats: '300+ Contratos'
    },
    {
      icon: <FiFileText size={32} />,
      title: 'Legalização',
      description: 'Regularização completa de documentação imobiliária e DUAT.',
      features: [
        'Regularização de DUAT',
        'Obtenção de escrituras',
        'Assessoria jurídica',
      ],
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop&q=80',
      link: '/servicos',
      stats: '200+ Processos'
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Consultoria Internacional',
      description: 'Assessoria especializada para investidores de Holanda, Portugal e Itália.',
      features: [
        'Análise de investimentos',
        'Due diligence completa',
        'Suporte multilíngue',
      ],
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop&q=80',
      link: '/servicos',
      stats: '150+ Investidores'
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % services.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + services.length) % services.length);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div 
          className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Como Podemos Ajudá-lo?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Serviços especializados com 15 anos de experiência no mercado moçambicano
          </p>
        </div>

        {/* Services Grid - Desktop/Tablet */}
        <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {services.map((service, index) => (
            <div 
              key={index}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Link href={service.link}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 h-full border border-gray-100">
                  {/* Image Section */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-200">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Icon Overlay */}
                    <div className="absolute bottom-4 left-4">
                      <div className="w-14 h-14 rounded-xl bg-white/95 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg group-hover:scale-110 transition-transform">
                        {service.icon}
                      </div>
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-secondary shadow-lg">
                      {service.stats}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-primary mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                      <span>Saber Mais</span>
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Services Carousel - Mobile */}
        <div className="md:hidden mb-12">
          <div className="relative px-8">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {services.map((service, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <Link href={service.link}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 mx-2">
                        {/* Image Section */}
                        <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-200">
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          
                          {/* Icon Overlay */}
                          <div className="absolute bottom-3 left-3">
                            <div className="w-12 h-12 rounded-lg bg-white/95 backdrop-blur-sm flex items-center justify-center text-primary shadow-lg">
                              {React.cloneElement(service.icon, { size: 24 })}
                            </div>
                          </div>

                          {/* Stats Badge */}
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-secondary shadow-lg">
                            {service.stats}
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-secondary mb-2">
                            {service.title}
                          </h3>

                          <p className="text-gray-600 mb-4 text-sm">
                            {service.description}
                          </p>

                          {/* Features */}
                          <ul className="space-y-2 mb-4">
                            {service.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                                <span className="text-primary mt-0.5">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* CTA */}
                          <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                            <span>Saber Mais</span>
                            <FiArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all z-10"
              aria-label="Serviço anterior"
            >
              <FiChevronLeft size={20} className="text-secondary" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2.5 hover:bg-gray-50 transition-all z-10"
              aria-label="Próximo serviço"
            >
              <FiChevronRight size={20} className="text-secondary" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-primary w-8' : 'bg-gray-300 w-2'
                  }`}
                  aria-label={`Ir para serviço ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
