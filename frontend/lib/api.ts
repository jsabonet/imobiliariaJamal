/**
 * API Client - IJPS Imobiliária
 * 
 * Funções para comunicação com o backend Django REST API
 * Desenvolvido por Zawadi Digital
 */

// Garantir que a URL SEMPRE termine com /api
const getApiUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  // Se já termina com /api, retornar como está
  if (baseUrl.endsWith('/api')) return baseUrl;
  // Se termina com /, adicionar api
  if (baseUrl.endsWith('/')) return `${baseUrl}api`;
  // Caso contrário, adicionar /api
  return `${baseUrl}/api`;
};

const API_URL = getApiUrl();

/**
 * Buscar lista de propriedades com filtros opcionais
 * @param params - Filtros: type, status, location, bedrooms, bathrooms, is_featured, search, ordering
 * @returns Lista paginada de propriedades
 */
export async function fetchProperties(params?: Record<string, string | number>) {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : '';
  const res = await fetch(`${API_URL}/properties/${queryString}`, { 
    next: { revalidate: 60 } 
  });
  if (!res.ok) throw new Error('Falha ao buscar propriedades');
  return res.json();
}

/**
 * Buscar detalhes de uma propriedade específica
 * @param id - ID da propriedade
 * @returns Dados completos da propriedade incluindo imagens e agente
 */
export async function fetchPropertyById(id: string) {
  const res = await fetch(`${API_URL}/properties/${id}/`, { 
    next: { revalidate: 60 } 
  });
  if (!res.ok) throw new Error('Falha ao buscar propriedade');
  return res.json();
}

/**
 * Buscar lista de agentes imobiliários
 * @returns Lista de agentes
 */
export async function fetchAgents() {
  const res = await fetch(`${API_URL}/agents/`, { 
    next: { revalidate: 300 } 
  });
  if (!res.ok) throw new Error('Falha ao buscar agentes');
  return res.json();
}

/**
 * Enviar pedido de avaliação de propriedade
 * @param data - Dados do pedido: name, email, phone, property_type, location, details
 * @returns Confirmação do pedido
 */
export async function submitEvaluation(data: any) {
  const res = await fetch(`${API_URL}/evaluations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao enviar avaliação');
  return res.json();
}

/**
 * Enviar mensagem de contacto
 * @param data - Dados da mensagem: name, email, phone, message, property (opcional)
 * @returns Confirmação do envio
 */
export async function submitContact(data: any) {
  const res = await fetch(`${API_URL}/contacts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao enviar contacto');
  return res.json();
}

/**
 * ADMIN FUNCTIONS
 */

/**
 * Buscar todas as avaliações (Admin)
 * @returns Lista de avaliações
 */
export async function fetchEvaluations() {
  const res = await fetch(`${API_URL}/evaluations/`, {
    next: { revalidate: 10 }
  });
  if (!res.ok) throw new Error('Falha ao buscar avaliações');
  return res.json();
}

/**
 * Buscar todas as mensagens de contacto (Admin)
 * @returns Lista de contactos
 */
export async function fetchContacts() {
  const res = await fetch(`${API_URL}/contacts/`, {
    next: { revalidate: 10 }
  });
  if (!res.ok) throw new Error('Falha ao buscar contactos');
  return res.json();
}

/**
 * Deletar propriedade (Admin)
 * @param id - ID da propriedade
 */
export async function deleteProperty(id: number) {
  const res = await fetch(`${API_URL}/properties/${id}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Falha ao deletar propriedade');
  return true;
}

/**
 * Criar propriedade (Admin)
 * @param data - Dados da propriedade
 */
export async function createProperty(data: any) {
  const res = await fetch(`${API_URL}/properties/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao criar propriedade');
  return res.json();
}

/**
 * Atualizar propriedade (Admin)
 * @param id - ID da propriedade
 * @param data - Dados atualizados
 */
export async function updateProperty(id: number, data: any) {
  const res = await fetch(`${API_URL}/properties/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar propriedade');
  return res.json();
}

/**
 * Deletar imagem de propriedade (Admin)
 * @param imageId - ID da imagem
 */
export async function deletePropertyImage(imageId: number) {
  const res = await fetch(`${API_URL}/property-images/${imageId}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Falha ao deletar imagem');
  return true;
}

/**
 * Deletar documento de propriedade (Admin)
 * @param documentId - ID do documento
 */
export async function deletePropertyDocument(documentId: number) {
  const res = await fetch(`${API_URL}/property-documents/${documentId}/`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Falha ao deletar documento');
  return true;
}

/**
 * Definir imagem principal de propriedade (Admin)
 * @param propertyId - ID da propriedade
 * @param imageId - ID da imagem
 */
export async function setPrimaryImage(propertyId: number, imageId: number): Promise<any> {
  const res = await fetch(`${API_URL}/properties/${propertyId}/set-primary-image/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_id: imageId }),
  });
  if (!res.ok) throw new Error('Falha ao definir imagem principal');
  return res.json();
}

/**
 * Tipos TypeScript para a API
 */

export interface Agent {
  id: number;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  photo?: string;
}

export interface PropertyImage {
  id: number;
  image: string;
  order: number;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  location: string;
  price: string;
  type: 'apartamento' | 'casa' | 'terreno' | 'comercial' | 'condominio';
  status: 'venda' | 'arrendamento';
  bedrooms: number;
  bathrooms: number;
  area: number;
  is_featured: boolean;
  is_verified: boolean;
  amenities: string[];
  agent: Agent | null;
  images: PropertyImage[];
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
