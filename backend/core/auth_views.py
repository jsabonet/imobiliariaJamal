from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from django.db.models import Q

@api_view(['POST'])
@permission_classes([AllowAny])
def admin_auth(request):
    """
    Endpoint de autenticação administrativa
    """
    import logging
    logger = logging.getLogger(__name__)
    
    username_or_email = (request.data.get('username') or '').strip()
    password = (request.data.get('password') or '').strip()
    
    logger.info(f"Login attempt - username_or_email: {username_or_email}, has_password: {bool(password)}")
    logger.info(f"Request data: {request.data}")
    logger.info(f"Request headers: {dict(request.headers)}")
    
    if not username_or_email or not password:
        return Response(
            {'success': False, 'message': 'Username e password são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Localizar usuário por username OU email
    User = get_user_model()
    user_obj = (
        User.objects.filter(
            Q(username__iexact=username_or_email) | Q(email__iexact=username_or_email)
        )
        .only('id', 'username', 'is_staff', 'is_superuser', 'email')
        .first()
    )

    # Autenticar usuário (usando username real)
    user = authenticate(username=user_obj.username if user_obj else None, password=password)
    
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
            {'success': False, 'message': 'Credenciais inválidas ou usuário sem permissão administrativa'},
            status=status.HTTP_401_UNAUTHORIZED
        )
