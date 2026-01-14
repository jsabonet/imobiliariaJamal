import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const authCookie = request.cookies.get('ijps_admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/admin/agents/${params.id}/`, {
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
        { error: data.error || 'Erro ao buscar agente' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao buscar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const response = await fetch(`${API_URL}/admin/agents/${params.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (response.ok) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: data.error || 'Erro ao atualizar agente' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao atualizar agente:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const authCookie = request.cookies.get('ijps_admin_auth');
    if (!authCookie) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/admin/agents/${params.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok || response.status === 204) {
      return NextResponse.json({ message: 'Agente removido com sucesso' });
    } else {
      const data = await response.json();
      return NextResponse.json(
        { error: data.error || 'Erro ao remover agente' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao remover agente:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}
