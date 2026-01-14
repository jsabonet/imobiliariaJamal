#!/usr/bin/env python
"""Script para listar todos os usuários"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print('\n=== USUÁRIOS EM PRODUÇÃO ===\n')
users = User.objects.all()
for u in users:
    print(f'ID: {u.id}')
    print(f'Username: {u.username}')
    print(f'Email: {u.email}')
    print(f'Staff: {u.is_staff}')
    print(f'Superuser: {u.is_superuser}')
    print(f'Ativo: {u.is_active}')
    print('-' * 40)

print(f'\nTotal: {users.count()} usuário(s)\n')
