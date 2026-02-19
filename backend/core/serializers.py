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
    
    # Campos adicionais para coordenadas aproximadas
    approximate_latitude = serializers.SerializerMethodField()
    approximate_longitude = serializers.SerializerMethodField()
    is_approximate_location = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._coords_cache = {}

    def _get_cached_coords(self, obj):
        """Cache para evitar múltiplas chamadas de geocoding por objeto"""
        obj_id = id(obj)
        if obj_id not in self._coords_cache:
            self._coords_cache[obj_id] = obj.get_approximate_coordinates()
        return self._coords_cache[obj_id]

    class Meta:
        model = Property
        fields = [
            'id', 'title', 'description', 'location', 
            'address', 'city', 'neighborhood', 'province', 'district', 'country', 'zip_code', 
            'latitude', 'longitude', 'approximate_latitude', 'approximate_longitude', 'is_approximate_location',
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
    
    def get_approximate_latitude(self, obj):
        """Retorna latitude aproximada se não houver coordenadas exatas"""
        lat, lon, is_approx = self._get_cached_coords(obj)
        return lat if is_approx else None
    
    def get_approximate_longitude(self, obj):
        """Retorna longitude aproximada se não houver coordenadas exatas"""
        lat, lon, is_approx = self._get_cached_coords(obj)
        return lon if is_approx else None
    
    def get_is_approximate_location(self, obj):
        """Indica se as coordenadas são aproximadas (baseadas em geocodificação)"""
        lat, lon, is_approx = self._get_cached_coords(obj)
        return is_approx

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
