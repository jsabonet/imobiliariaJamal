import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function POST(
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

    const response = await fetch(`${API_URL}/admin/agents/${params.id}/reset-password/`, {
      method: 'POST',
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
        { error: data.error || 'Erro ao resetar senha' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Erro ao resetar senha:', error);
    return NextResponse.json(
      { error: 'Erro ao conectar com o servidor' },
      { status: 500 }
    );
  }
}
