import React from 'react';
import Link from 'next/link';
import { FiPhone, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Button from '@/components/ui/Button';

const CallToAction = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Vamos Encontrar o Imóvel Perfeito para Você
            </h2>
            <p className="text-xl md:text-2xl text-primary-100">
              Fale agora com nossos especialistas e descubra as melhores oportunidades do mercado
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Phone */}
            <a
              href="tel:+258820061863"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-xl p-6 text-center group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FiPhone size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Telefone</h3>
              <p className="text-primary-100">+258 82 006 1863</p>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/258841339593"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-xl p-6 text-center group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FaWhatsapp size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">WhatsApp</h3>
              <p className="text-primary-100">Chat Direto</p>
            </a>

            {/* Email */}
            <a
              href="mailto:anilton.jm13@gmail.com"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 rounded-xl p-6 text-center group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FiMail size={28} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-primary-100">anilton.jm13@gmail.com</p>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/propriedades">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Ver Propriedades
              </Button>
            </Link>
            <Link href="/avaliar">
              <Button 
                size="lg" 
                className="min-w-[200px] text-primary hover:bg-gray-100"
              >
                Avaliar Imóvel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
