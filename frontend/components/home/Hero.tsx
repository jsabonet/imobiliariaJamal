'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldStart) return;
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [shouldStart, end, duration]);
  
  return count;
};

const Hero = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Counter hooks at component level
  const anos = useCountUp(15, 2000, isVisible);
  const propriedades = useCountUp(75, 2000, isVisible);
  const arrendamentos = useCountUp(15, 2000, isVisible);
  const paises = useCountUp(3, 2000, isVisible);

  return (
    <section className="relative bg-gradient-to-br from-secondary via-secondary-600 to-secondary-700 text-white min-h-[85vh] md:min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/95 via-secondary-600/90 to-secondary-700/95" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Hero Content */}
        <div 
          className={`max-w-4xl mx-auto text-center mb-12 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Propriedades{' '}
            <span className="text-primary drop-shadow-lg">Premium</span>
            {' '}em Moçambique
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10">
            15 anos conectando você aos melhores imóveis de Maputo e arredores
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => router.push('/propriedades')}
              className="transform transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-xl min-w-[240px]"
            >
              Ver Propriedades Premium
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => router.push('/contacto')}
              className="transform transition-all duration-200 hover:scale-105 active:scale-95 border-2 border-white text-white hover:bg-white hover:text-secondary min-w-[240px]"
            >
              Falar com Especialista
            </Button>
          </div>
        </div>

        {/* Quick Stats with Counter Animation */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {[
            { number: anos, label: 'Anos de Experiência', suffix: '' },
            { number: propriedades, label: 'Propriedades Premium', suffix: '+' },
            { number: arrendamentos, label: 'Arrendamentos/Mês', suffix: '' },
            { number: paises, label: 'Países Atendidos', suffix: '+' },
          ].map((stat, index) => (
            <div 
              key={index} 
              className="text-center transform transition-all duration-300 hover:scale-110"
              style={{ 
                animation: `fade-in 0.6s ease-out ${index * 0.1 + 0.5}s both` 
              }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.number}{stat.suffix}
              </div>
              <div className="text-sm md:text-base text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Hero;
