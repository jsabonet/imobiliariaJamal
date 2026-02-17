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
    logger.info(f"Signal disparado para Property ID {instance.id} - created={created}")
    
    # Só envia se for uma nova propriedade (não atualização)
    if created:
        try:
            logger.info(f"🏠 Nova propriedade criada: {instance.title} (ID: {instance.id})")
            logger.info(f"   Localização: {instance.location}")
            logger.info(f"   Preço: {instance.price} {instance.currency}")
            
            # Enviar notificação push para usuários inscritos
            result = send_new_property_notification(instance)
            
            logger.info(
                f"📱 Notificações push enviadas para propriedade {instance.id}: "
                f"{result['success']} sucesso, {result['failed']} falhas, {result['total']} total"
            )
            
            if result['success'] > 0:
                logger.info(f"✅ {result['success']} usuário(s) notificado(s) com sucesso!")
            elif result['total'] == 0:
                logger.warning("⚠️ Nenhuma subscription ativa para enviar notificações")
            else:
                logger.warning(f"⚠️ Todas as {result['total']} notificações falharam")
                
        except Exception as e:
            logger.error(f"❌ Erro ao enviar notificações para propriedade {instance.id}: {e}")
            import traceback
            logger.error(traceback.format_exc())
    else:
        logger.debug(f"Propriedade {instance.id} atualizada (não enviar notificação)")
