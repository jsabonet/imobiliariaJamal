import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from django.contrib.auth.models import User

# Procurar por qualquer usuário
users = User.objects.all()

if users.exists():
    for user in users:
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"is_staff: {user.is_staff}")
        print(f"is_superuser: {user.is_superuser}")
        print(f"is_active: {user.is_active}")
        print("-" * 40)
else:
    print("Nenhum usuário encontrado no banco local!")
    print("Crie um superusuário com: python manage.py createsuperuser")
