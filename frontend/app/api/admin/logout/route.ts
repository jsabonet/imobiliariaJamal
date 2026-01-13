import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Remover cookies de autenticação
  response.cookies.delete('ijps_admin_auth');
  response.cookies.delete('ijps_admin_token');
  
  return response;
}
