from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Property, PropertyImage, PropertyDocument, Agent, EvaluationRequest, ContactMessage, PushSubscription
from .serializers import (
    PropertySerializer, AgentSerializer,
    EvaluationRequestSerializer, ContactMessageSerializer, PushSubscriptionSerializer
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
    
    @action(detail=True, methods=['post'], url_path='increment-view')
    def increment_view(self, request, pk=None):
        """Incrementa o contador de visualizações de uma propriedade"""
        property_instance = self.get_object()
        property_instance.view_count += 1
        property_instance.save(update_fields=['view_count'])
        return Response({
            'success': True, 
            'view_count': property_instance.view_count
        })

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


@api_view(['POST'])
def subscribe_push(request):
    """
    Endpoint para registrar uma nova push subscription
    """
    try:
        # Extrair user agent do request
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Adicionar user agent aos dados
        data = request.data.copy()
        data['user_agent'] = user_agent
        
        serializer = PushSubscriptionSerializer(data=data)
        if serializer.is_valid():
            # Verificar se já existe subscription com este endpoint
            endpoint = serializer.validated_data['endpoint']
            subscription, created = PushSubscription.objects.update_or_create(
                endpoint=endpoint,
                defaults={
                    'p256dh': serializer.validated_data['p256dh'],
                    'auth': serializer.validated_data['auth'],
                    'user_agent': user_agent,
                    'is_active': True
                }
            )
            
            return Response({
                'success': True,
                'message': 'Notificações ativadas com sucesso!' if created else 'Subscription atualizada!',
                'subscription_id': subscription.id
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def unsubscribe_push(request):
    """
    Endpoint para remover uma push subscription
    """
    try:
        endpoint = request.data.get('endpoint')
        
        if not endpoint:
            return Response({
                'success': False,
                'message': 'Endpoint é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Marcar como inativa ao invés de deletar
        deleted_count = PushSubscription.objects.filter(endpoint=endpoint).update(is_active=False)
        
        if deleted_count > 0:
            return Response({
                'success': True,
                'message': 'Notificações desativadas com sucesso!'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'message': 'Subscription não encontrada'
            }, status=status.HTTP_404_NOT_FOUND)
            
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_notification_preferences(request):
    """
    Endpoint para obter preferências de notificação de uma subscription
    """
    try:
        endpoint = request.query_params.get('endpoint')
        
        if not endpoint:
            return Response({
                'success': False,
                'message': 'Endpoint é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        subscription = PushSubscription.objects.filter(endpoint=endpoint, is_active=True).first()
        
        if not subscription:
            return Response({
                'success': False,
                'message': 'Subscription não encontrada'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PushSubscriptionSerializer(subscription)
        return Response({
            'success': True,
            'preferences': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])
def update_notification_preferences(request):
    """
    Endpoint para atualizar preferências de notificação
    """
    try:
        endpoint = request.data.get('endpoint')
        
        if not endpoint:
            return Response({
                'success': False,
                'message': 'Endpoint é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        subscription = PushSubscription.objects.filter(endpoint=endpoint, is_active=True).first()
        
        if not subscription:
            return Response({
                'success': False,
                'message': 'Subscription não encontrada'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Atualizar apenas os campos de preferências fornecidos
        updatable_fields = [
            'notify_new_properties', 'notify_price_changes', 
            'notify_status_changes', 'notify_recommendations',
            'location_filters', 'property_types', 
            'price_min', 'price_max', 'bedrooms_min',
            'quiet_hours_enabled', 'quiet_hours_start', 'quiet_hours_end'
        ]
        
        for field in updatable_fields:
            if field in request.data:
                setattr(subscription, field, request.data[field])
        
        subscription.save()
        
        serializer = PushSubscriptionSerializer(subscription)
        return Response({
            'success': True,
            'message': 'Preferências atualizadas com sucesso!',
            'preferences': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def upload_watermark_image(request):
    """
    Upload de imagem para aplicação automática de marca d'água
    Uso administrativo para reutilização em outras plataformas
    """
    from .models import TemporaryWatermarkedImage
    from .watermark_utils import add_watermark
    from io import BytesIO
    from django.core.files.base import ContentFile
    import os
    
    try:
        if 'image' not in request.FILES:
            return Response({
                'success': False,
                'message': 'Nenhuma imagem foi enviada'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['image']
        
        # Criar registro temporário
        temp_image = TemporaryWatermarkedImage.objects.create(
            original_image=uploaded_file,
            original_filename=uploaded_file.name
        )
        
        # Aplicar marca d'água usando o sistema existente
        with open(temp_image.original_image.path, 'rb') as f:
            original_bytes = BytesIO(f.read())
        
        watermarked_bytes = add_watermark(original_bytes, watermark_text='IJPS IMOBILIÁRIA')
        
        # Salvar imagem com marca d'água
        filename_without_ext = os.path.splitext(temp_image.original_filename)[0]
        ext = os.path.splitext(temp_image.original_filename)[1]
        watermarked_filename = f"{filename_without_ext}_watermarked{ext}"
        
        temp_image.watermarked_image.save(
            watermarked_filename,
            ContentFile(watermarked_bytes.read()),
            save=True
        )
        
        return Response({
            'success': True,
            'message': 'Marca d\'água aplicada com sucesso!',
            'data': {
                'id': temp_image.id,
                'original_filename': temp_image.original_filename,
                'watermarked_url': request.build_absolute_uri(temp_image.watermarked_image.url),
                'created_at': temp_image.created_at.isoformat(),
                'expires_in_hours': 2
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': f'Erro ao processar imagem: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def list_watermark_images(request):
    """
    Listar todas as imagens temporárias com marca d'água
    (apenas as não expiradas)
    """
    from .models import TemporaryWatermarkedImage
    
    try:
        images = TemporaryWatermarkedImage.objects.all().order_by('-created_at')
        
        # Filtrar apenas não expiradas
        active_images = [img for img in images if not img.is_expired()]
        
        data = [{
            'id': img.id,
            'original_filename': img.original_filename,
            'watermarked_url': request.build_absolute_uri(img.watermarked_image.url) if img.watermarked_image else None,
            'created_at': img.created_at.isoformat(),
            'is_expired': img.is_expired()
        } for img in active_images]
        
        return Response({
            'success': True,
            'count': len(data),
            'data': data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_watermark_image(request, image_id):
    """
    Deletar uma imagem temporária específica
    """
    from .models import TemporaryWatermarkedImage
    
    try:
        image = TemporaryWatermarkedImage.objects.get(id=image_id)
        
        # Deletar arquivos físicos
        if image.original_image:
            image.original_image.delete()
        if image.watermarked_image:
            image.watermarked_image.delete()
        
        image.delete()
        
        return Response({
            'success': True,
            'message': 'Imagem deletada com sucesso'
        }, status=status.HTTP_200_OK)
        
    except TemporaryWatermarkedImage.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Imagem não encontrada'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
