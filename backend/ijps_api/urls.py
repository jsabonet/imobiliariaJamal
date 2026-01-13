"""
URL configuration for ijps_api project - IJPS Imobiliária

Plataforma de gestão imobiliária para Moçambique
Desenvolvido por Zawadi Digital
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.api_urls')),  # API REST endpoints
]

# Servir arquivos de media e estáticos (em produção inicial via Django)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
