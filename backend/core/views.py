from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Property, PropertyImage, PropertyDocument, Agent, EvaluationRequest, ContactMessage
from .serializers import (
    PropertySerializer, AgentSerializer,
    EvaluationRequestSerializer, ContactMessageSerializer
)

class PropertyViewSet(viewsets.ModelViewSet):
    """
    ViewSet para propriedades - CRUD completo para admin
    GET (list/detail) público, POST/PUT/PATCH/DELETE para admin
    """
    queryset = Property.objects.select_related('agent').prefetch_related('images', 'documents').order_by('-created_at')
    serializer_class = PropertySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status', 'location', 'bedrooms', 'bathrooms', 'is_featured', 'is_verified']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['price', 'area', 'created_at']
    
    def create(self, request, *args, **kwargs):
        """Criar propriedade com suporte a múltiplas imagens e documentos"""
        # Extrair arquivos do request
        images = request.FILES.getlist('images')
        documents = request.FILES.getlist('documents')
        primary_image_index = request.data.get('primary_image_index', 0)
        
        # Criar a propriedade
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        property_instance = serializer.save()
        
        # Adicionar imagens se existirem
        if images:
            for index, image in enumerate(images):
                PropertyImage.objects.create(
                    property=property_instance,
                    image=image,
                    order=index,
                    is_primary=(index == int(primary_image_index))
                )
        
        # Adicionar documentos se existirem
        if documents:
            for document in documents:
                PropertyDocument.objects.create(
                    property=property_instance,
                    document=document,
                    name=document.name
                )
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        """Atualizar propriedade com suporte a múltiplas imagens e documentos"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Extrair arquivos do request se existirem
        images = request.FILES.getlist('images')
        documents = request.FILES.getlist('documents')
        primary_image_index = request.data.get('primary_image_index', None)
        
        # Atualizar a propriedade
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        property_instance = serializer.save()
        
        # Adicionar novas imagens se existirem
        if images:
            # Obter o maior order atual
            max_order = PropertyImage.objects.filter(property=property_instance).count()
            
            for index, image in enumerate(images):
                PropertyImage.objects.create(
                    property=property_instance,
                    image=image,
                    order=max_order + index,
                    is_primary=(primary_image_index is not None and index == int(primary_image_index))
                )
        
        # Adicionar novos documentos se existirem
        if documents:
            for document in documents:
                PropertyDocument.objects.create(
                    property=property_instance,
                    document=document,
                    name=document.name
                )
        
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Atualização parcial - usa o mesmo método update"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'], url_path='set-primary-image')
    def set_primary_image(self, request, pk=None):
        """Define a imagem primária de uma propriedade"""
        property_instance = self.get_object()
        image_id = request.data.get('image_id')
        
        if not image_id:
            return Response({'error': 'image_id é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Remove is_primary de todas as imagens
            PropertyImage.objects.filter(property=property_instance).update(is_primary=False)
            # Define a nova imagem primária
            image = PropertyImage.objects.get(id=image_id, property=property_instance)
            image.is_primary = True
            image.save()
            return Response({'success': True, 'message': 'Imagem primária definida'})
        except PropertyImage.DoesNotExist:
            return Response({'error': 'Imagem não encontrada'}, status=status.HTTP_404_NOT_FOUND)

class PropertyImageViewSet(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    """ViewSet para gerenciar imagens de propriedades"""
    queryset = PropertyImage.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        """Deletar uma imagem"""
        return super().destroy(request, *args, **kwargs)

class PropertyDocumentViewSet(viewsets.GenericViewSet, mixins.DestroyModelMixin):
    """ViewSet para gerenciar documentos de propriedades"""
    queryset = PropertyDocument.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        """Deletar um documento"""
        return super().destroy(request, *args, **kwargs)

class AgentViewSet(viewsets.ModelViewSet):
    """
    ViewSet para agentes - CRUD completo
    """
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class EvaluationRequestViewSet(viewsets.ModelViewSet):
    """
    ViewSet para pedidos de avaliação
    POST público, GET/DELETE para admin
    """
    queryset = EvaluationRequest.objects.all().order_by('-created_at')
    serializer_class = EvaluationRequestSerializer
    
    def get_permissions(self):
        # POST é público, resto é apenas para visualização (admin via Django Admin)
        return super().get_permissions()

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet para mensagens de contacto
    POST público, GET/DELETE para admin
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    
    def get_permissions(self):
        return super().get_permissions()
