"""
URL configuration for ijps_api project - IJPS Imobiliária

Plataforma de gestão imobiliária para Moçambique
Desenvolvido por Zawadi Digital
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    # Admin Django comentado - usando /admin/login do Next.js frontend
    # path('admin/', admin.site.urls),
    path('api/', include('core.api_urls')),  # API REST endpoints
    
    # Servir media files em produção
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]

# Static files são servidos por WhiteNoise via middleware
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
