from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework import status

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_auth(request):
    """
    Endpoint de autenticação administrativa
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username e password são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Autenticar usuário
    user = authenticate(username=username, password=password)
    
    if user is not None and user.is_staff:
        return Response({
            'success': True,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })
    else:
        return Response(
            {'error': 'Credenciais inválidas ou usuário sem permissão administrativa'},
            status=status.HTTP_401_UNAUTHORIZED
        )
