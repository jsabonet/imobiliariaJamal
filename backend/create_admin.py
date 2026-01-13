#!/usr/bin/env python
"""Script para criar usuário admin em produção"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = 'admin'
email = 'admin@imobiliariajamal.com'
password = 'Admin@2026!'

if User.objects.filter(username=username).exists():
    print(f'✓ Usuário {username} já existe')
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print(f'✓ Senha atualizada para {username}')
else:
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    print(f'✓ Usuário {username} criado com sucesso')

print(f'✓ Email: {email}')
print(f'✓ Senha: {password}')
print(f'✓ is_staff: {user.is_staff}')
print(f'✓ is_superuser: {user.is_superuser}')
