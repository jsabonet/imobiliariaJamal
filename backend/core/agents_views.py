"""
Views para gerenciamento de agentes
Apenas superusuários podem acessar estas funcionalidades
"""

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.db import transaction
from .models import Agent
from .serializers import AgentSerializer


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])  # Temporariamente sem autenticação para teste
def agents_list(request):
    """
    GET: Lista todos os agentes com suas credenciais de usuário
    POST: Cria um novo agente com credenciais de acesso
    """
    if request.method == 'GET':
        agents = Agent.objects.all()
        agents_data = []
        
        for agent in agents:
            # Buscar usuário associado ao agente pelo email
            user = None
            if agent.email:
                try:
                    user = User.objects.get(email=agent.email)
                except User.DoesNotExist:
                    pass
            
            agent_data = AgentSerializer(agent).data
            if user:
                agent_data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'is_active': user.is_active,
                }
            else:
                agent_data['user'] = None
            
            agents_data.append(agent_data)
        
        return Response(agents_data)
    
    elif request.method == 'POST':
        # Dados do agente
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        whatsapp = request.data.get('whatsapp', '')
        
        # Dados de credenciais
        username = request.data.get('username')
        password = request.data.get('password')
        is_staff = request.data.get('is_staff', False)
        
        # Validações
        if not name or not email or not phone:
            return Response(
                {'error': 'Nome, email e telefone são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not username or not password:
            return Response(
                {'error': 'Username e password são obrigatórios'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verificar se email ou username já existem
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Já existe um usuário com este email'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Já existe um usuário com este username'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                # Criar agente
                agent = Agent.objects.create(
                    name=name,
                    email=email,
                    phone=phone,
                    whatsapp=whatsapp or phone
                )
                
                # Criar usuário
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=name.split()[0] if name else '',
                    last_name=' '.join(name.split()[1:]) if len(name.split()) > 1 else '',
                    is_staff=is_staff,
                    is_active=True
                )
                
                # Retornar dados completos
                agent_data = AgentSerializer(agent).data
                agent_data['user'] = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                    'is_active': user.is_active,
                }
                
                return Response(agent_data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response(
                {'error': f'Erro ao criar agente: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([AllowAny])  # Temporariamente sem autenticação para teste
def agent_detail(request, agent_id):
    """
    GET: Retorna detalhes de um agente específico
    PUT: Atualiza dados do agente e suas credenciais
    DELETE: Remove agente e seu usuário
    """
    try:
        agent = Agent.objects.get(id=agent_id)
    except Agent.DoesNotExist:
        return Response(
            {'error': 'Agente não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Buscar usuário associado
    user = None
    if agent.email:
        try:
            user = User.objects.get(email=agent.email)
        except User.DoesNotExist:
            pass
    
    if request.method == 'GET':
        agent_data = AgentSerializer(agent).data
        if user:
            agent_data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active,
            }
        else:
            agent_data['user'] = None
        
        return Response(agent_data)
    
    elif request.method == 'PUT':
        # Atualizar dados do agente
        agent.name = request.data.get('name', agent.name)
        agent.phone = request.data.get('phone', agent.phone)
        agent.whatsapp = request.data.get('whatsapp', agent.whatsapp)
        
        # Se o email mudar, precisa atualizar o usuário também
        new_email = request.data.get('email')
        if new_email and new_email != agent.email:
            # Verificar se o novo email já está em uso
            if User.objects.filter(email=new_email).exclude(id=user.id if user else None).exists():
                return Response(
                    {'error': 'Já existe um usuário com este email'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            agent.email = new_email
            if user:
                user.email = new_email
        
        # Atualizar permissões do usuário
        if user:
            user.is_staff = request.data.get('is_staff', user.is_staff)
            user.is_active = request.data.get('is_active', user.is_active)
            
            # Atualizar nome
            if agent.name:
                user.first_name = agent.name.split()[0]
                user.last_name = ' '.join(agent.name.split()[1:]) if len(agent.name.split()) > 1 else ''
            
            user.save()
        
        agent.save()
        
        agent_data = AgentSerializer(agent).data
        if user:
            agent_data['user'] = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active,
            }
        
        return Response(agent_data)
    
    elif request.method == 'DELETE':
        try:
            with transaction.atomic():
                # Deletar usuário se existir
                if user:
                    user.delete()
                
                # Deletar agente
                agent.delete()
                
                return Response(
                    {'message': 'Agente removido com sucesso'},
                    status=status.HTTP_204_NO_CONTENT
                )
        except Exception as e:
            return Response(
                {'error': f'Erro ao remover agente: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(['POST'])
@permission_classes([AllowAny])  # Temporariamente sem autenticação para teste
def agent_reset_password(request, agent_id):
    """
    POST: Reseta a senha de um agente
    """
    try:
        agent = Agent.objects.get(id=agent_id)
    except Agent.DoesNotExist:
        return Response(
            {'error': 'Agente não encontrado'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Buscar usuário
    user = None
    if agent.email:
        try:
            user = User.objects.get(email=agent.email)
        except User.DoesNotExist:
            return Response(
                {'error': 'Usuário não encontrado para este agente'},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        return Response(
            {'error': 'Agente não possui email associado'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    new_password = request.data.get('new_password')
    if not new_password:
        return Response(
            {'error': 'Nova senha é obrigatória'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Resetar senha
    user.set_password(new_password)
    user.save()
    
    return Response({'message': 'Senha resetada com sucesso'})
