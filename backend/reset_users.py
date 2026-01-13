#!/usr/bin/env python
"""Script para limpar todos os usuários e criar um novo admin"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Deletar todos os usuários
deleted_count = User.objects.all().count()
User.objects.all().delete()
print(f'✓ {deleted_count} usuários deletados')

# Criar novo superusuário
username = 'aniltonjamal'
email = 'jamalanilton@gmail.com'
password = '1Jamal2026@'

user = User.objects.create_superuser(
    username=username,
    email=email,
    password=password
)
print(f'\n✓ Novo usuário criado:')
print(f'  Username: {username}')
print(f'  Email: {email}')
print(f'  Senha: {password}')
print(f'  is_staff: {user.is_staff}')
print(f'  is_superuser: {user.is_superuser}')
