import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('🔍 API Route Debug:');
    console.log('- Username:', username);
    console.log('- Has password:', !!password);
    console.log('- API_URL:', API_URL);
    console.log('- Full URL:', `${API_URL}/api/admin/auth/`);

    // Tentar autenticar no backend Django
    const response = await fetch(`${API_URL}/api/admin/auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    
    console.log('- Django response status:', response.status);
    const data = await response.json();
    console.log('- Django response data:', data);

    if (response.ok) {
      
      // Criar resposta com cookie de autenticação
      const res = NextResponse.json({ success: true });
      
      res.cookies.set('ijps_admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8, // 8 horas
        path: '/',
      });

      // Se houver token no backend, armazena também
      if (data.token) {
        res.cookies.set('ijps_admin_token', data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 8,
          path: '/',
        });
      }

      return res;
    } else {
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return NextResponse.json(
      { success: false, message: 'Erro no servidor' },
      { status: 500 }
    );
  }
}
