"""
Signals para enviar notificações automáticas
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Property
from .notifications import send_new_property_notification
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Property)
def notify_new_property(sender, instance, created, **kwargs):
    """
    Signal para enviar notificação quando uma nova propriedade é criada
    """
    # Só envia se for uma nova propriedade (não atualização)
    if created:
        try:
            logger.info(f"Nova propriedade criada: {instance.title} (ID: {instance.id})")
            
            # Enviar notificação push para usuários inscritos
            result = send_new_property_notification(instance)
            
            logger.info(
                f"Notificações push enviadas para propriedade {instance.id}: "
                f"{result['success']} sucesso, {result['failed']} falhas"
            )
        except Exception as e:
            logger.error(f"Erro ao enviar notificações para propriedade {instance.id}: {e}")
