from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyViewSet, PropertyImageViewSet, PropertyDocumentViewSet,
    AgentViewSet, EvaluationRequestViewSet, ContactMessageViewSet
)
from .auth_views import admin_auth

router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'property-images', PropertyImageViewSet, basename='property-image')
router.register(r'property-documents', PropertyDocumentViewSet, basename='property-document')
router.register(r'agents', AgentViewSet, basename='agent')
router.register(r'evaluations', EvaluationRequestViewSet, basename='evaluation')
router.register(r'contacts', ContactMessageViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/auth/', admin_auth, name='admin-auth'),
]
