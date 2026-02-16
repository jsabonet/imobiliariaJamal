from django.contrib import admin
from .models import Agent, Property, PropertyImage, PropertyDocument, EvaluationRequest, ContactMessage, PushSubscription

admin.site.site_header = "Imobiliária Jamal Administração"
admin.site.site_title = "Imobiliária Jamal"
admin.site.index_title = "Painel de Gestão"

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyDocumentInline(admin.TabularInline):
    model = PropertyDocument
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'type', 'status', 'view_count', 'is_featured', 'is_verified')
    list_filter = ('type', 'status', 'location', 'is_featured', 'is_verified')
    search_fields = ('title', 'location', 'description')
    readonly_fields = ('view_count', 'created_at', 'updated_at')
    inlines = [PropertyImageInline, PropertyDocumentInline]

@admin.register(Agent)
class AgentAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email')
    search_fields = ('name',)

@admin.register(EvaluationRequest)
class EvaluationAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'property_type', 'location', 'created_at')
    search_fields = ('name', 'email', 'location')

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'property', 'created_at')
    search_fields = ('name', 'phone')


@admin.register(PushSubscription)
class PushSubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'created_at', 'is_active', 'get_browser',
        'notify_new_properties', 'notify_price_changes',
        'quiet_hours_enabled'
    )
    list_filter = (
        'is_active', 'created_at',
        'notify_new_properties', 'notify_price_changes',
        'notify_status_changes', 'notify_recommendations',
        'quiet_hours_enabled'
    )
    search_fields = ('endpoint', 'user_agent')
    readonly_fields = ('endpoint', 'p256dh', 'auth', 'user_agent', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Informações da Subscription', {
            'fields': ('endpoint', 'p256dh', 'auth', 'user_agent', 'is_active', 'created_at', 'updated_at')
        }),
        ('Preferências de Notificação', {
            'fields': (
                'notify_new_properties',
                'notify_price_changes',
                'notify_status_changes',
                'notify_recommendations'
            )
        }),
        ('Filtros de Interesse', {
            'fields': (
                'location_filters',
                'property_types',
                'price_min',
                'price_max',
                'bedrooms_min'
            ),
            'classes': ('collapse',)
        }),
        ('Horário Silencioso', {
            'fields': (
                'quiet_hours_enabled',
                'quiet_hours_start',
                'quiet_hours_end'
            ),
            'classes': ('collapse',)
        }),
    )
    
    def get_browser(self, obj):
        """Extrair nome do browser do user agent"""
        if not obj.user_agent:
            return "Desconhecido"
        
        ua = obj.user_agent.lower()
        if 'chrome' in ua:
            return 'Chrome'
        elif 'firefox' in ua:
            return 'Firefox'
        elif 'safari' in ua:
            return 'Safari'
        elif 'edge' in ua:
            return 'Edge'
        else:
            return 'Outro'
    
    get_browser.short_description = 'Navegador'
