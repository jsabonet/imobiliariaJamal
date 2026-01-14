'use client';

import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import DynamicSEO from '@/components/seo/DynamicSEO';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { submitContact } from '@/lib/api';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      // Resetar sucesso após 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar mensagem. Por favor, tente novamente.');
      console.error('Erro ao enviar contacto:', err);
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FiPhone size={28} />,
      title: 'Telefone',
      content: '+258 84 000 0000',
      link: 'tel:+258840000000',
      color: 'bg-blue-500',
    },
    {
      icon: <FaWhatsapp size={28} />,
      title: 'WhatsApp',
      content: '+258 84 000 0000',
      link: 'https://wa.me/258840000000',
      color: 'bg-accent',
    },
    {
      icon: <FiMail size={28} />,
      title: 'Email',
      content: 'info@ijps.co.mz',
      link: 'mailto:info@ijps.co.mz',
      color: 'bg-red-500',
    },
    {
      icon: <FiMapPin size={28} />,
      title: 'Endereço',
      content: 'Av. Julius Nyerere, Maputo',
      link: 'https://maps.google.com',
      color: 'bg-primary',
    },
  ];

  const officeHours = [
    { day: 'Segunda - Sexta', hours: '08:00 - 18:00' },
    { day: 'Sábado', hours: '09:00 - 14:00' },
    { day: 'Domingo', hours: 'Fechado' },
  ];

  const departments = [
    {
      name: 'Vendas',
      email: 'vendas@ijps.co.mz',
      phone: '+258 84 000 0001',
    },
    {
      name: 'Arrendamento',
      email: 'arrendamento@ijps.co.mz',
      phone: '+258 84 000 0002',
    },
    {
      name: 'Avaliações',
      email: 'avaliacoes@ijps.co.mz',
      phone: '+258 84 000 0003',
    },
    {
      name: 'Consultoria',
      email: 'consultoria@ijps.co.mz',
      phone: '+258 84 000 0004',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO */}
      <DynamicSEO
        title="Contacto"
        description="Entre em contacto com a IJPS. Estamos em Maputo, Moçambique. Telefone: +258 84 000 0000 | Email: info@ijps.co.mz | WhatsApp disponível."
        keywords={['contacto IJPS', 'imobiliária Maputo contacto', 'telefone IJPS', 'email IJPS', 'WhatsApp imobiliária', 'endereço IJPS Maputo']}
        canonical="https://ijps.co.mz/contacto"
      />
      <BreadcrumbSchema items={[
        { name: 'Início', url: '/' },
        { name: 'Contacto', url: '/contacto' },
      ]} />
      
      <LoadingOverlay isOpen={loading} message="Enviando mensagem" type="form" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary to-secondary-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contacto
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Estamos aqui para ajudar. Fale connosco através de qualquer um dos nossos canais
            </p>
          </div>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-10">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                target={info.link.startsWith('http') ? '_blank' : undefined}
                rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                <Card hover className="h-full">
                  <div className="p-6 text-center">
                    <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                      {info.icon}
                    </div>
                    <h3 className="font-bold text-secondary mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {info.content}
                    </p>
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-secondary mb-6">
                    Envie-nos uma Mensagem
                  </h2>
                  
                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-fade-in">
                      <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-green-800">Mensagem Enviada com Sucesso!</p>
                        <p className="text-sm text-green-700 mt-1">Entraremos em contacto em breve.</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nome Completo"
                        placeholder="Seu nome"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        label="Email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <Input
                      label="Telefone / WhatsApp"
                      type="tel"
                      placeholder="+258 XX XXX XXXX"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />

                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-2">
                        Mensagem
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100 transition-colors duration-200"
                        rows={6}
                        placeholder="Escreva sua mensagem aqui..."
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      ></textarea>
                    </div>

                    <Button type="submit" size="lg" fullWidth disabled={loading}>
                      <FiSend className="mr-2" />
                      {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Office Hours */}
              <Card>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary">
                      <FiClock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-secondary">
                      Horário de Atendimento
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700 font-medium">{schedule.day}</span>
                        <span className="text-secondary font-semibold">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Departments */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-4">
                    Departamentos
                  </h3>
                  <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                        <h4 className="font-semibold text-secondary mb-2">{dept.name}</h4>
                        <p className="text-sm text-gray-600 mb-1">
                          <a href={`mailto:${dept.email}`} className="hover:text-primary">
                            {dept.email}
                          </a>
                        </p>
                        <p className="text-sm text-gray-600">
                          <a href={`tel:${dept.phone.replace(/\s/g, '')}`} className="hover:text-primary">
                            {dept.phone}
                          </a>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Social Media */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-4">
                    Redes Sociais
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Siga-nos nas redes sociais para novidades e propriedades exclusivas
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                    >
                      <FaFacebook size={20} />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition"
                    >
                      <FaInstagram size={20} />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center hover:bg-blue-800 transition"
                    >
                      <FaLinkedin size={20} />
                    </a>
                    <a
                      href="https://wa.me/258840000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center hover:bg-accent-600 transition"
                    >
                      <FaWhatsapp size={20} />
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">
                Nossa Localização
              </h2>
              <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FiMapPin size={48} className="mx-auto mb-4" />
                  <p>Mapa do Google será integrado aqui</p>
                  <p className="text-sm mt-2">Av. Julius Nyerere, Maputo, Moçambique</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Precisa de Atendimento Urgente?
          </h2>
          <p className="text-xl text-primary-100 mb-6">
            Estamos disponíveis 24/7 via WhatsApp para emergências
          </p>
          <a
            href="https://wa.me/258840000000"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className=" text-primary hover:bg-gray-100">
              <FaWhatsapp size={20} className="mr-2" />
              Contactar Agora
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
