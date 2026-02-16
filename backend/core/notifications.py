"""
Módulo para envio de notificações push
"""
import json
import logging
import tempfile
import os
from pywebpush import webpush, WebPushException
from django.conf import settings
from .models import PushSubscription

logger = logging.getLogger(__name__)


def send_push_notification(subscription, title, body, url=None, icon=None):
    """
    Envia uma notificação push para uma subscription específica
    
    Args:
        subscription: Objeto PushSubscription
        title: Título da notificação
        body: Corpo da mensagem
        url: URL para redirecionar ao clicar (opcional)
        icon: URL do ícone (opcional)
    
    Returns:
        bool: True se enviado com sucesso, False caso contrário
    """
    try:
        # Preparar dados da notificação
        notification_data = {
            "title": title,
            "body": body,
            "icon": icon or "/icon-192x192.png",
            "badge": "/icon-72x72.png",
            "url": url or "/"
        }
        
        # Informações da subscription
        subscription_info = {
            "endpoint": subscription.endpoint,
            "keys": {
                "p256dh": subscription.p256dh,
                "auth": subscription.auth
            }
        }
        
        # Obter chave privada VAPID (salvar em arquivo temporário)
        vapid_private_key = getattr(settings, 'VAPID_PRIVATE_KEY', None)
        if not vapid_private_key:
            logger.error("VAPID_PRIVATE_KEY não configurada")
            return False
        
        vapid_claims = {
            "sub": getattr(settings, 'VAPID_CLAIMS_EMAIL', 'mailto:contato@imobiliariajamal.com')
        }
        
        # Criar arquivo temporário com a chave PEM (pywebpush lê do arquivo)
        with tempfile.NamedTemporaryFile(mode='w', suffix='.pem', delete=False) as f:
            f.write(vapid_private_key)
            temp_key_path = f.name
        
        try:
            # Enviar notificação usando caminho para arquivo PEM
            webpush(
                subscription_info=subscription_info,
                data=json.dumps(notification_data),
                vapid_private_key=temp_key_path,
                vapid_claims=vapid_claims
            )
        finally:
            # Limpar arquivo temporário
            if os.path.exists(temp_key_path):
                os.unlink(temp_key_path)
        
        logger.info(f"Notificação enviada com sucesso para subscription {subscription.id}")
        return True
        
    except WebPushException as e:
        logger.error(f"Erro ao enviar push notification: {e}")
        
        # Se o erro for 410 (Gone), a subscription expirou
        if e.response and e.response.status_code == 410:
            logger.info(f"Subscription {subscription.id} expirou, marcando como inativa")
            subscription.is_active = False
            subscription.save()
        
        return False
        
    except Exception as e:
        logger.error(f"Erro inesperado ao enviar notificação: {e}")
        return False


def send_new_property_notification(property_obj):
    """
    Envia notificação push para todos os usuários inscritos quando uma nova propriedade é criada
    
    Args:
        property_obj: Objeto Property recém-criado
    
    Returns:
        dict: Estatísticas do envio (sucesso, falhas)
    """
    # Buscar todas as subscriptions ativas
    subscriptions = PushSubscription.objects.filter(is_active=True)
    
    if not subscriptions.exists():
        logger.info("Nenhuma subscription ativa para enviar notificações")
        return {"success": 0, "failed": 0, "total": 0}
    
    # Preparar dados da notificação
    title = "🏠 Nova Propriedade Disponível!"
    
    # Formatação do preço
    if property_obj.currency == 'USD':
        price_str = f"${property_obj.price:,.0f}"
    else:
        price_str = f"{property_obj.price:,.0f} {property_obj.currency}"
    
    body = f"{property_obj.title}\n{property_obj.location} - {price_str}"
    url = f"/propriedades/{property_obj.id}"
    
    # Usar primeira imagem como ícone se disponível
    icon = None
    if hasattr(property_obj, 'images') and property_obj.images.exists():
        first_image = property_obj.images.first()
        if first_image and first_image.image:
            icon = first_image.image.url
    
    # Enviar para todas as subscriptions
    success_count = 0
    failed_count = 0
    
    for subscription in subscriptions:
        if send_push_notification(subscription, title, body, url, icon):
            success_count += 1
        else:
            failed_count += 1
    
    logger.info(
        f"Notificações enviadas: {success_count} sucesso, "
        f"{failed_count} falhas, {subscriptions.count()} total"
    )
    
    return {
        "success": success_count,
        "failed": failed_count,
        "total": subscriptions.count()
    }


def send_custom_notification(title, body, url=None, icon=None):
    """
    Envia uma notificação personalizada para todos os usuários inscritos
    
    Args:
        title: Título da notificação
        body: Corpo da mensagem
        url: URL para redirecionar (opcional)
        icon: URL do ícone (opcional)
    
    Returns:
        dict: Estatísticas do envio
    """
    subscriptions = PushSubscription.objects.filter(is_active=True)
    
    success_count = 0
    failed_count = 0
    
    for subscription in subscriptions:
        if send_push_notification(subscription, title, body, url, icon):
            success_count += 1
        else:
            failed_count += 1
    
    return {
        "success": success_count,
        "failed": failed_count,
        "total": subscriptions.count()
    }
