'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMaximize2, FiMapPin, FiPhone, FiMail, FiShare2, FiHeart, FiCheckCircle } from 'react-icons/fi';
import { IoBed, IoWater } from 'react-icons/io5';
import { FaWhatsapp, FaCheckCircle } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import MapPlaceholder from '@/components/ui/MapPlaceholder';
import PropertySchema from '@/components/seo/PropertySchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import DynamicSEO from '@/components/seo/DynamicSEO';
import { fetchPropertyById, submitContact } from '@/lib/api';
import { useFavorites } from '@/lib/useFavorites';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [property, setProperty] = useState<any | null>(null);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api').replace(/\/?api\/?$/, '');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchPropertyById(params.id);

        const images: string[] = (data.images || []).map((img: any) => {
          const url: string = img.image;
          return url.startsWith('http') ? url : `${API_BASE}${url}`;
        });

        const agent = data.agent ? {
          name: data.agent.name,
          phone: data.agent.phone,
          email: data.agent.email,
          photo: data.agent.photo ? (String(data.agent.photo).startsWith('http') ? data.agent.photo : `${API_BASE}${data.agent.photo}`) : ''
        } : null;

        const mapped = {
          id: data.id,
          title: data.title,
          referenceCode: data.reference_code || '',
          location: data.location || [data.neighborhood, data.city].filter(Boolean).join(', '),
          address: data.address || '',
          neighborhood: data.neighborhood || '',
          city: data.city || '',
          province: data.province || '',
          district: data.district || '',
          zipCode: data.zip_code || '',
          country: data.country || 'Moçambique',
          price: Number(data.price || 0),
          currency: data.currency || 'MZN',
          condominiumFee: data.condominium_fee || 0,
          ipra: data.ipra || 0,
          monthlyExpenses: data.monthly_expenses || 0,
          type: data.type,
          status: data.status,
          bedrooms: data.bedrooms || 0,
          suites: data.suites || 0,
          bathrooms: data.bathrooms || 0,
          toilets: data.toilets || 0,
          area: data.area || 0,
          usefulArea: data.useful_area || 0,
          landArea: data.land_area || 0,
          parkingSpaces: data.parking_spaces || 0,
          images: images.length > 0 ? images : [
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop'
          ],
          verified: !!data.is_verified,
          featured: !!data.is_featured,
          description: data.description || '',
          features: Array.isArray(data.amenities) ? data.amenities : [],
          details: {
            yearBuilt: data.year_built || '—',
            condition: data.property_condition || '—',
            parking: data.parking_spaces || 0,
            floor: data.floor_number ? `${data.floor_number}º Andar` : '—',
            totalFloors: data.total_floors || '—',
            documentation: data.legal_status || '—',
            availability: data.availability_date || '—',
            orientation: data.orientation || '—',
            energyClass: data.energy_class || '—',
            heatingType: data.heating_type || '—',
            furnished: !!data.furnished,
            acceptsPets: !!data.accepts_pets,
            acceptsFinancing: !!data.accepts_financing,
          },
          agent,
          latitude: data.latitude ? Number(data.latitude) : null,
          longitude: data.longitude ? Number(data.longitude) : null,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };

        if (isMounted) {
          setProperty(mapped);
        }
      } catch (e: any) {
        if (isMounted) setError(e.message || 'Falha ao carregar propriedade');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [params.id, API_BASE]);

  function formatPrice(price: number): string {
    const currencyCode = property?.currency || 'MZN';
    const formatted = new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
    }).format(price);
    return formatted.replace(/MT/g, 'MZN');
  }

  // Funções de formatação para valores legíveis
  function formatCondition(condition: string): string {
    const conditions: Record<string, string> = {
      'novo': 'Novo',
      'excelente': 'Excelente',
      'bom': 'Bom',
      'para_renovar': 'Para Renovar',
      'em_construcao': 'Em Construção',
    };
    return conditions[condition] || condition;
  }

  function formatLegalStatus(status: string): string {
    const statuses: Record<string, string> = {
      'escritura': 'Escritura',
      'direito_uso': 'Direito de Uso (DUAT)',
      'contrato_promessa': 'Contrato Promessa',
      'posse': 'Posse',
      'em_regularizacao': 'Em Regularização',
    };
    return statuses[status] || status;
  }

  function formatOrientation(orientation: string): string {
    const orientations: Record<string, string> = {
      'norte': 'Norte',
      'sul': 'Sul',
      'este': 'Este',
      'oeste': 'Oeste',
      'nordeste': 'Nordeste',
      'noroeste': 'Noroeste',
      'sudeste': 'Sudeste',
      'sudoeste': 'Sudoeste',
    };
    return orientations[orientation] || orientation;
  }

  function formatHeatingType(heating: string): string {
    const types: Record<string, string> = {
      'ar_condicionado': 'Ar Condicionado',
      'aquecimento_central': 'Aquecimento Central',
      'lareira': 'Lareira',
      'piso_radiante': 'Piso Radiante',
      'bomba_calor': 'Bomba de Calor',
      'paineis_solares': 'Painéis Solares',
      'nao_aplicavel': 'Não Aplicável',
    };
    return types[heating] || heating;
  }

  function formatDate(dateString: string): string {
    if (!dateString || dateString === '—') return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  function handleFavoriteClick(): void {
    if (property) {
      toggleFavorite({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        type: property.type,
        image: property.images[0] || '',
        addedAt: new Date().toISOString(),
      });
    }
  }

  const favorited = property ? isFavorite(property.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Carregando propriedade...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card>
          <div className="p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Link href="/propriedades">
              <Button>Voltar às Propriedades</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const propertyKeywords = [
    property.type,
    property.location,
    property.city,
    property.province,
    'propriedade Moçambique',
    property.status === 'sale' ? 'venda' : 'arrendamento',
    `${property.bedrooms} quartos`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO */}
      <DynamicSEO
        title={property.title}
        description={`${property.type} em ${property.location} - ${property.bedrooms} quartos, ${property.area}m². ${property.description.substring(0, 100)}...`}
        keywords={propertyKeywords}
        canonical={`https://ijps.co.mz/propriedades/${property.id}`}
        ogImage={property.images[0]}
      />
      <PropertySchema property={property} />
      <BreadcrumbSchema items={[
        { name: 'Início', url: '/' },
        { name: 'Propriedades', url: '/propriedades' },
        { name: property.title, url: `/propriedades/${property.id}` },
      ]} />
      
      {/* Image Gallery */}
      <div className="bg-black">
        <div className="container mx-auto px-4 py-4">
          {/* Main Image */}
          <div className="relative h-[300px] md:h-[500px] rounded-xl overflow-hidden mb-4">
            <Image
              src={property.images[currentImageIndex] as string}
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
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {property.images.map((image: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative h-20 md:h-24 w-32 md:w-36 flex-shrink-0 rounded-lg overflow-hidden ${
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
                    <div className="flex gap-2 mb-3 flex-wrap">
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
                      <Badge variant="info">{property.status === 'venda' ? 'Venda' : 'Arrendamento'}</Badge>
                      {property.referenceCode && (
                        <Badge variant="info">Ref: {property.referenceCode}</Badge>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-3">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin size={20} />
                      <span className="text-lg">{property.location}</span>
                    </div>
                    {property.address && (
                      <p className="text-sm text-gray-500 mt-2">
                        {[property.address, property.neighborhood, property.city, property.province, property.zipCode, property.country]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        if (typeof navigator !== 'undefined' && navigator.share) {
                          navigator.share({
                            title: property.title,
                            text: `${property.title} - ${formatPrice(property.price)}`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copiado!');
                        }
                      }}
                      className="p-3 bg-gray-100 hover:bg-primary hover:text-white rounded-lg transition"
                      title="Compartilhar"
                    >
                      <FiShare2 size={20} />
                    </button>
                    <button 
                      onClick={handleFavoriteClick}
                      className={`p-3 rounded-lg transition-all ${
                        favorited 
                          ? 'bg-red-500 text-white hover:bg-red-600' 
                          : 'bg-gray-100 hover:bg-primary hover:text-white'
                      }`}
                      title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <FiHeart size={20} fill={favorited ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <div className="text-4xl font-bold text-primary mb-6">
                  {formatPrice(property.price)}
                </div>

                {/* Custos Adicionais */}
                {(property.condominiumFee > 0 || property.ipra > 0 || property.monthlyExpenses > 0) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Custos Adicionais:</p>
                    {property.condominiumFee > 0 && (
                      <p className="text-sm text-gray-600">Condomínio: {formatPrice(property.condominiumFee)}/mês</p>
                    )}
                    {property.ipra > 0 && (
                      <p className="text-sm text-gray-600">IPRA: {formatPrice(property.ipra)}/ano</p>
                    )}
                    {property.monthlyExpenses > 0 && (
                      <p className="text-sm text-gray-600">Despesas: {formatPrice(property.monthlyExpenses)}/mês</p>
                    )}
                  </div>
                )}

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
                  {property.bedrooms > 0 && (
                    <div className="text-center">
                      <IoBed size={28} className="mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{property.bedrooms}</p>
                      <p className="text-sm text-gray-600">Quartos</p>
                      {property.suites > 0 && (
                        <p className="text-xs text-gray-500">({property.suites} suítes)</p>
                      )}
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="text-center">
                      <IoWater size={28} className="mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{property.bathrooms}</p>
                      <p className="text-sm text-gray-600">Casas de Banho</p>
                      {property.toilets > 0 && (
                        <p className="text-xs text-gray-500">(+{property.toilets} WC)</p>
                      )}
                    </div>
                  )}
                  {property.area > 0 && (
                    <div className="text-center">
                      <FiMaximize2 size={28} className="mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">{property.area}</p>
                      <p className="text-sm text-gray-600">m² Total</p>
                      {property.usefulArea > 0 && (
                        <p className="text-xs text-gray-500">({property.usefulArea}m² útil)</p>
                      )}
                    </div>
                  )}
                  {property.parkingSpaces > 0 && (
                    <div className="text-center">
                      <svg className="mx-auto mb-2 text-primary" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                      </svg>
                      <p className="text-2xl font-bold">{property.parkingSpaces}</p>
                      <p className="text-sm text-gray-600">Vagas</p>
                    </div>
                  )}
                  {property.landArea > 0 && (
                    <div className="text-center">
                      <svg className="mx-auto mb-2 text-primary" width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3h18v2H3V3z"/>
                      </svg>
                      <p className="text-2xl font-bold">{property.landArea}</p>
                      <p className="text-sm text-gray-600">m² Terreno</p>
                    </div>
                  )}
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
                  {property.features.map((feature: string, index: number) => (
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
                <h2 className="text-2xl font-bold text-secondary mb-4">Detalhes do Imóvel</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ano de Construção</p>
                    <p className="font-semibold">{property.details.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Estado de Conservação</p>
                    <p className="font-semibold">{formatCondition(property.details.condition)}</p>
                  </div>
                  {property.details.floor !== '—' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Andar</p>
                      <p className="font-semibold">{property.details.floor}</p>
                      {property.details.totalFloors !== '—' && (
                        <p className="text-xs text-gray-500">de {property.details.totalFloors} andares</p>
                      )}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Documentação</p>
                    <p className="font-semibold">{formatLegalStatus(property.details.documentation)}</p>
                  </div>
                  {property.details.orientation !== '—' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Orientação Solar</p>
                      <p className="font-semibold">{formatOrientation(property.details.orientation)}</p>
                    </div>
                  )}
                  {property.details.energyClass !== '—' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Classe Energética</p>
                      <p className="font-semibold">{property.details.energyClass}</p>
                    </div>
                  )}
                  {property.details.heatingType !== '—' && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Climatização</p>
                      <p className="font-semibold">{formatHeatingType(property.details.heatingType)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Disponibilidade</p>
                    <p className="font-semibold">{formatDate(property.details.availability)}</p>
                  </div>
                </div>
                
                {/* Características Booleanas */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Características Adicionais:</p>
                  <div className="flex flex-wrap gap-3">
                    {property.details.furnished && (
                      <div className="flex items-center gap-2 bg-accent-50 text-accent-700 px-3 py-2 rounded-lg">
                        <span>✓</span>
                        <span className="text-sm font-medium">Mobilado</span>
                      </div>
                    )}
                    {property.details.acceptsPets && (
                      <div className="flex items-center gap-2 bg-accent-50 text-accent-700 px-3 py-2 rounded-lg">
                        <span>✓</span>
                        <span className="text-sm font-medium">Aceita Animais</span>
                      </div>
                    )}
                    {property.details.acceptsFinancing && (
                      <div className="flex items-center gap-2 bg-accent-50 text-accent-700 px-3 py-2 rounded-lg">
                        <span>✓</span>
                        <span className="text-sm font-medium">Aceita Financiamento</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações de Publicação */}
                {(property.createdAt || property.updatedAt) && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Informações de Publicação:</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {property.createdAt && (
                        <div>
                          <span className="font-medium">Publicado em:</span>{' '}
                          {new Date(property.createdAt).toLocaleDateString('pt-PT', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                      {property.updatedAt && property.updatedAt !== property.createdAt && (
                        <div>
                          <span className="font-medium">Atualizado em:</span>{' '}
                          {new Date(property.updatedAt).toLocaleDateString('pt-PT', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Map */}
            <Card>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-secondary mb-4">Localização</h2>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <MapPlaceholder latitude={property.latitude} longitude={property.longitude} height={400} />
              </div>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Agent Card */}
              <Card>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-4">Entre em Contacto</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden">
                      {property.agent?.photo && (
                        <Image
                          src={property.agent.photo}
                          alt={property.agent.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-secondary">{property.agent?.name || 'Agente IJPS'}</p>
                      <p className="text-sm text-gray-600">Agente IJPS</p>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <form 
                    className="space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setContactLoading(true);
                      setContactError('');
                      
                      try {
                        await submitContact({
                          ...contactForm,
                          property: property.id,
                        });
                        setContactSuccess(true);
                        setContactForm({
                          name: '',
                          email: '',
                          phone: '',
                          message: '',
                        });
                        
                        // Reset success message after 5 seconds
                        setTimeout(() => setContactSuccess(false), 5000);
                      } catch (err: any) {
                        setContactError('Erro ao enviar mensagem. Por favor, tente novamente.');
                        console.error('Erro ao enviar contacto:', err);
                      } finally {
                        setContactLoading(false);
                      }
                    }}
                  >
                    {/* Success Message */}
                    {contactSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 animate-fade-in">
                        <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                        <div>
                          <p className="text-sm font-semibold text-green-800">Mensagem Enviada!</p>
                          <p className="text-xs text-green-700 mt-0.5">Entraremos em contacto em breve.</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Error Message */}
                    {contactError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{contactError}</p>
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        id="contact-name"
                        placeholder="Digite seu nome" 
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input 
                        id="contact-email"
                        type="email" 
                        placeholder="seu@email.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone <span className="text-red-500">*</span>
                      </label>
                      <Input 
                        id="contact-phone"
                        type="tel" 
                        placeholder="+258 XX XXX XXXX"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-100"
                        rows={4}
                        placeholder="Digite sua mensagem ou dúvida sobre o imóvel"
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      ></textarea>
                    </div>
                    <Button fullWidth type="submit" disabled={contactLoading}>
                      {contactLoading ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>

                  <div className="mt-6 pt-6 border-t space-y-3">
                    <a
                      href={`tel:${property.agent?.phone || ''}`}
                      className="flex items-center justify-center gap-2 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition"
                    >
                      <FiPhone size={20} />
                      Ligar Agora
                    </a>
                    <a
                      href={`https://wa.me/${(property.agent?.phone || '').replace(/\s/g, '')}`}
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
                  <a
                    href={`https://wa.me/${(property.agent?.phone || '+258841339593').replace(/\s/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de agendar uma visita para a propriedade: ${property.title} (Ref: ${property.referenceCode || property.id})`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" fullWidth>
                      Agendar Agora
                    </Button>
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
