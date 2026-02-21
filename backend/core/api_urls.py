from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PropertyViewSet, PropertyImageViewSet, PropertyDocumentViewSet,
    AgentViewSet, EvaluationRequestViewSet, ContactMessageViewSet,
    subscribe_push, unsubscribe_push, get_notification_preferences, update_notification_preferences,
    upload_watermark_image, list_watermark_images, delete_watermark_image
)
from .auth_views import admin_auth
from .agents_views import agents_list, agent_detail, agent_reset_password

# The DefaultRouter and all paths use trailing slashes.
# Next.js is configured with skipTrailingSlashRedirect: true so it never strips
# trailing slashes before proxying, avoiding the redirect loop with APPEND_SLASH.
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
    path('admin/agents/', agents_list, name='agents-list'),
    path('admin/agents/<int:agent_id>/', agent_detail, name='agent-detail'),
    path('admin/agents/<int:agent_id>/reset-password/', agent_reset_password, name='agent-reset-password'),
    path('notifications/subscribe/', subscribe_push, name='subscribe-push'),
    path('notifications/unsubscribe/', unsubscribe_push, name='unsubscribe-push'),
    path('notifications/preferences/', get_notification_preferences, name='get-notification-preferences'),
    path('notifications/preferences/update/', update_notification_preferences, name='update-notification-preferences'),
    path('admin/watermark/upload/', upload_watermark_image, name='upload-watermark'),
    path('admin/watermark/list/', list_watermark_images, name='list-watermark'),
    path('admin/watermark/<int:image_id>/delete/', delete_watermark_image, name='delete-watermark'),
]
