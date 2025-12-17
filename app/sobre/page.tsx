import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiAward, FiUsers, FiTrendingUp, FiShield, FiCheckCircle, FiTarget } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Sobre Nós | IJPS - Imobiliária Jamal & Prestação de Serviços',
  description: 'Conheça a IJPS, sua parceira de confiança no mercado imobiliário moçambicano há mais de 10 anos.',
};

export default function SobrePage() {
  const values = [
    {
      icon: <FiShield size={32} />,
      title: 'Transparência',
      description: 'Trabalhamos com total transparência em todas as transações, garantindo confiança e segurança.',
    },
    {
      icon: <FiCheckCircle size={32} />,
      title: 'Profissionalismo',
      description: 'Equipa qualificada e experiente, comprometida com a excelência no atendimento.',
    },
    {
      icon: <FiUsers size={32} />,
      title: 'Foco no Cliente',
      description: 'Cada cliente é único. Oferecemos soluções personalizadas para suas necessidades.',
    },
    {
      icon: <FiTrendingUp size={32} />,
      title: 'Inovação',
      description: 'Utilizamos tecnologia de ponta para facilitar a busca e gestão de propriedades.',
    },
  ];

  const team = [
    {
      name: 'Jamal Ahmed',
      role: 'Fundador & CEO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      description: 'Mais de 15 anos de experiência no mercado imobiliário moçambicano.',
    },
    {
      name: 'Maria Santos',
      role: 'Diretora de Vendas',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      description: 'Especialista em propriedades de luxo e investimentos estratégicos.',
    },
    {
      name: 'Carlos Mendes',
      role: 'Gerente de Avaliações',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      description: 'Avaliador certificado com expertise em todo tipo de propriedades.',
    },
    {
      name: 'Ana Costa',
      role: 'Consultora de Arrendamento',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      description: 'Dedicada a encontrar a propriedade perfeita para cada cliente.',
    },
  ];

  const milestones = [
    { year: '2014', event: 'Fundação da IJPS em Maputo' },
    { year: '2016', event: 'Expansão para Matola e Beira' },
    { year: '2018', event: '100+ Propriedades Vendidas' },
    { year: '2020', event: 'Lançamento de Serviços de Consultoria' },
    { year: '2023', event: '500+ Clientes Satisfeitos' },
    { year: '2025', event: 'Plataforma Digital Lançada' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a IJPS
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Mais de 10 anos conectando pessoas aos imóveis dos seus sonhos em Moçambique
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
                Nossa História
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A <strong>IJPS - Imobiliária Jamal & Prestação de Serviços</strong> foi fundada em 2014 
                  com uma missão clara: transformar o mercado imobiliário moçambicano através de 
                  transparência, profissionalismo e tecnologia.
                </p>
                <p>
                  O que começou como um pequeno escritório em Maputo, hoje é uma das imobiliárias 
                  mais confiáveis de Moçambique, com centenas de clientes satisfeitos e milhares de 
                  transações bem-sucedidas.
                </p>
                <p>
                  Nossa equipa de especialistas trabalha incansavelmente para garantir que cada cliente 
                  encontre a propriedade perfeita, seja para viver, investir ou arrendar.
                </p>
                <p>
                  Em 2025, demos um passo importante ao lançar nossa plataforma digital em parceria com 
                  a <strong>Zawadi Digital</strong>, tornando a busca por imóveis mais fácil, rápida e 
                  acessível para todos os moçambicanos.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop"
                alt="IJPS Office"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10+', label: 'Anos de Experiência' },
              { number: '500+', label: 'Propriedades Vendidas' },
              { number: '300+', label: 'Clientes Satisfeitos' },
              { number: '98%', label: 'Taxa de Satisfação' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nosso trabalho diariamente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} hover>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {value.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Nossa Equipa
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Profissionais dedicados e experientes ao seu serviço
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} hover>
                <div className="p-6">
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600">
                    {member.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Nossa Jornada
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Marcos importantes da nossa história
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200 md:left-1/2 md:-translate-x-1/2"></div>

              {/* Timeline Items */}
              {milestones.map((milestone, index) => (
                <div key={index} className="relative mb-8 md:mb-12">
                  <div className={`md:grid md:grid-cols-2 md:gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    <div className={`${index % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}`}>
                      <Card className="ml-16 md:ml-0">
                        <div className="p-6">
                          <div className="text-2xl font-bold text-primary mb-2">
                            {milestone.year}
                          </div>
                          <p className="text-gray-700">
                            {milestone.event}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-4 border-white md:left-1/2 md:-translate-x-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto Para Trabalhar Connosco?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de clientes satisfeitos e encontre o imóvel perfeito
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/propriedades">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 min-w-[200px]">
                Ver Propriedades
              </Button>
            </Link>
            <Link href="/contacto">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Contacte-nos
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
