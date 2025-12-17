'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMaximize2, FiMapPin, FiPhone, FiMail, FiShare2, FiHeart } from 'react-icons/fi';
import { IoBed, IoWater } from 'react-icons/io5';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data - Will be replaced with API call to Django backend
  const property = {
    id: params.id,
    title: 'Apartamento T3 Sommerschield',
    location: 'Sommerschield, Maputo',
    price: 12500000,
    type: 'Apartamento',
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    ],
    verified: true,
    featured: true,
    description: `
      Magnífico apartamento T3 localizado no prestigiado bairro de Sommerschield, uma das áreas mais procuradas de Maputo. 
      Este imóvel oferece uma combinação perfeita de conforto, elegância e localização privilegiada.
      
      O apartamento encontra-se em excelente estado de conservação e está pronto para ser habitado.
      Acabamentos de primeira qualidade em todos os espaços.
    `,
    features: [
      'Cozinha equipada',
      'Ar condicionado',
      'Varanda ampla',
      'Estacionamento privado',
      'Segurança 24h',
      'Piscina',
      'Ginásio',
      'Elevador',
      'Gerador',
      'Água 24h',
    ],
    details: {
      yearBuilt: 2018,
      condition: 'Excelente',
      parking: 2,
      floor: '5º Andar',
      documentation: 'Escritura + DUAT',
      availability: 'Imediata',
    },
    agent: {
      name: 'João Silva',
      phone: '+258 84 000 0000',
      email: 'joao@ijps.co.mz',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="bg-black">
        <div className="container mx-auto px-4 py-4">
          {/* Main Image */}
          <div className="relative h-[300px] md:h-[500px] rounded-xl overflow-hidden mb-4">
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
            />
            
            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition"
            >
              →
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
              {currentImageIndex + 1} / {property.images.length}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-20 md:h-24 rounded-lg overflow-hidden ${
                  currentImageIndex === index ? 'ring-4 ring-primary' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${property.title} - ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex gap-2 mb-3">
                      {property.featured && (
                        <Badge variant="warning">Destaque</Badge>
                      )}
                      {property.verified && (
                        <Badge variant="success">
                          <FaCheckCircle className="mr-1" />
                          Verificado
                        </Badge>
                      )}
                      <Badge>{property.type}</Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin size={20} />
                      <span className="text-lg">{property.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-3 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition">
                      <FiShare2 size={20} />
                    </button>
                    <button className="p-3 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition">
                      <FiHeart size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-4xl font-bold text-primary mb-6">
                  {formatPrice(property.price)}
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y">
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <IoBed size={28} className="mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Quartos</p>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center">
                      <IoWater size={28} className="mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Casas de Banho</p>
                    </div>
                  )}
                  <div className="text-center">
                    <FiMaximize2 size={28} className="mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.area}</p>
                    <p className="text-sm text-gray-600">m²</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary mb-4">Descrição</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </Card>

            {/* Features */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary mb-4">Características</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-accent-500">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Details */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary mb-4">Detalhes</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ano de Construção</p>
                    <p className="font-semibold">{property.details.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado</p>
                    <p className="font-semibold">{property.details.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estacionamento</p>
                    <p className="font-semibold">{property.details.parking} lugares</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Andar</p>
                    <p className="font-semibold">{property.details.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Documentação</p>
                    <p className="font-semibold">{property.details.documentation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Disponibilidade</p>
                    <p className="font-semibold">{property.details.availability}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary mb-4">Localização</h2>
                <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Mapa será integrado aqui</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              {/* Agent Card */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-4">Entre em Contacto</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      <Image
                        src={property.agent.photo}
                        alt={property.agent.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-secondary">{property.agent.name}</p>
                      <p className="text-sm text-gray-600">Agente IJPS</p>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form className="space-y-4">
                    <Input placeholder="Seu Nome" />
                    <Input type="email" placeholder="Seu Email" />
                    <Input type="tel" placeholder="Seu Telefone" />
                    <textarea
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                      rows={4}
                      placeholder="Sua Mensagem"
                    ></textarea>
                    <Button fullWidth>Enviar Mensagem</Button>
                  </form>

                  <div className="mt-6 pt-6 border-t space-y-3">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition"
                    >
                      <FiPhone size={20} />
                      Ligar Agora
                    </a>
                    <a
                      href={`https://wa.me/${property.agent.phone.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-lg hover:bg-accent-600 transition"
                    >
                      <FaWhatsapp size={20} />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </Card>

              {/* Schedule Visit */}
              <Card>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-bold text-secondary mb-3">
                    Agendar Visita
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Visite esta propriedade pessoalmente
                  </p>
                  <Link href="/agendar-visita">
                    <Button variant="outline" fullWidth>
                      Agendar Agora
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
