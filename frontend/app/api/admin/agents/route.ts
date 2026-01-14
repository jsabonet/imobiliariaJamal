import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const authCookie = request.cookies.get('ijps_admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    // Buscar agentes no backend
    console.log('🔍 GET Agents - API_URL:', API_URL);
    console.log('🔍 GET Agents - Full URL:', `${API_URL}/admin/agents/`);
    const response = await fetch(`${API_URL}/admin/agents/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || 'Erro ao buscar agentes' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao buscar agentes:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authCookie = request.cookies.get('ijps_admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Criar agente no backend
    console.log('🔍 POST Agent - API_URL:', API_URL);
    console.log('🔍 POST Agent - Full URL:', `${API_URL}/admin/agents/`);
    const response = await fetch(`${API_URL}/admin/agents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data, { status: 201 });
    } else {
      return NextResponse.json(
        { error: data.error || 'Erro ao criar agente' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao criar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}
