/**
 * Configuração centralizada da API
 * Usa variável de ambiente em produção e localhost em desenvolvimento
 */
export const API_BASE_URL = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
  : (process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api');

export const API_ENDPOINTS = {
  properties: `${API_BASE_URL}/properties/`,
  agents: `${API_BASE_URL}/agents/`,
  evaluations: `${API_BASE_URL}/evaluations/`,
  contacts: `${API_BASE_URL}/contacts/`,
  adminAuth: `${API_BASE_URL}/admin/auth/`,
} as const;

/**
 * Helper para construir URLs de API
 */
export function apiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, ''); // Remove trailing slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
