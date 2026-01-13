from django.contrib import admin
from .models import Agent, Property, PropertyImage, PropertyDocument, EvaluationRequest, ContactMessage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyDocumentInline(admin.TabularInline):
    model = PropertyDocument
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'type', 'status', 'is_featured', 'is_verified')
    list_filter = ('type', 'status', 'location', 'is_featured', 'is_verified')
    search_fields = ('title', 'location', 'description')
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
