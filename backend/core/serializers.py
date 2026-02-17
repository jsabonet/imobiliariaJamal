from rest_framework import serializers
from .models import Property, PropertyImage, PropertyDocument, Agent, EvaluationRequest, ContactMessage, PushSubscription

class AgentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Agent
        fields = ['id', 'name', 'email', 'phone', 'whatsapp', 'photo']

class PropertyImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'order', 'is_primary']

class PropertyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropertyDocument
        fields = ['id', 'document', 'name', 'document_type', 'uploaded_at']

class PropertySerializer(serializers.ModelSerializer):
    images = PropertyImageSerializer(many=True, read_only=True)
    documents = PropertyDocumentSerializer(many=True, read_only=True)
    agent = AgentSerializer(read_only=True)
    agent_id = serializers.PrimaryKeyRelatedField(
        queryset=Agent.objects.all(), 
        source='agent', 
        write_only=True, 
        required=False,
        allow_null=True
    )

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'location', 
            'address', 'city', 'neighborhood', 'province', 'district', 'country', 'zip_code', 'latitude', 'longitude',
            'price', 'currency', 'condominium_fee', 'ipra', 'iptu', 'monthly_expenses',
            'type', 'status', 'legal_status',
            'bedrooms', 'suites', 'bathrooms', 'toilets', 
            'area', 'useful_area', 'land_area', 'parking_spaces',
            'year_built', 'floor_number', 'total_floors',
            'property_condition', 'orientation', 'energy_class', 'heating_type',
            'furnished', 'accepts_pets', 'accepts_financing',
            'is_featured', 'is_verified', 'view_count',
            'availability_date', 'internal_notes',
            'amenities', 'agent', 'agent_id', 'images', 'documents', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'view_count']

class EvaluationRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = EvaluationRequest
        fields = ['id', 'name', 'email', 'phone', 'property_type', 'location', 'details', 'created_at']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'message', 'property', 'created_at']


class PushSubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushSubscription
        fields = ['id', 'endpoint', 'p256dh', 'auth', 'user_agent', 'created_at', 'is_active']
        read_only_fields = ['id', 'created_at']
