"""
Modelos de dados para a plataforma IJPS - Imobiliária Jamal

Define as entidades principais:
- Agent: Agentes imobiliários
- Property: Propriedades/imóveis
- PropertyImage: Imagens das propriedades
- EvaluationRequest: Solicitações de avaliação
- ContactMessage: Mensagens de contacto
"""

from django.db import models


class Agent(models.Model):
    """Modelo para representar agentes imobiliários da IJPS"""
    name = models.CharField(max_length=120, verbose_name="Nome")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    phone = models.CharField(max_length=30, verbose_name="Telefone")
    whatsapp = models.CharField(max_length=30, blank=True, null=True, verbose_name="WhatsApp")
    photo = models.ImageField(upload_to='agents/', blank=True, null=True, verbose_name="Foto")

    class Meta:
        verbose_name = "Agente"
        verbose_name_plural = "Agentes"
        ordering = ['name']

    def __str__(self):
        return self.name


class Property(models.Model):
    """Modelo para representar propriedades/imóveis"""
    
    TYPE_CHOICES = [
        ('apartamento', 'Apartamento'),
        ('apartamento_em_condominio', 'Apartamento em Condomínio'),
        ('casa', 'Casa'),
        ('terreno', 'Terreno'),
        ('comercial', 'Comercial'),
        ('empreendimento', 'Empreendimento'),
    ]
    
    STATUS_CHOICES = [
        ('venda', 'Venda'),
        ('arrendamento', 'Arrendamento'),
    ]

    CURRENCY_CHOICES = [
        ('MZN', 'Metical Moçambicano'),
        ('USD', 'Dólar Americano'),
        ('EUR', 'Euro'),
        ('ZAR', 'Rand Sul-Africano'),
    ]

    LEGAL_STATUS_CHOICES = [
        ('duat', 'DUAT (Direito de Uso e Aproveitamento da Terra)'),
        ('direito_uso', 'Direito de Uso'),
        ('escritura', 'Escritura Pública'),
        ('regularizacao', 'Em Regularização'),
        ('concessao', 'Concessão'),
    ]

    # Informações básicas
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(verbose_name="Descrição")
    reference_code = models.CharField(max_length=50, blank=True, null=True, verbose_name="Código de Referência")
    location = models.CharField(max_length=200, verbose_name="Localização")
    
    # Endereço detalhado
    address = models.CharField(max_length=300, blank=True, null=True, verbose_name="Endereço")
    city = models.CharField(max_length=100, blank=True, null=True, verbose_name="Cidade")
    neighborhood = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bairro")
    province = models.CharField(max_length=100, blank=True, null=True, verbose_name="Província")
    district = models.CharField(max_length=100, blank=True, null=True, verbose_name="Distrito")
    country = models.CharField(max_length=100, default='Moçambique', verbose_name="País")
    zip_code = models.CharField(max_length=20, blank=True, null=True, verbose_name="Código Postal")
    latitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True, verbose_name="Latitude")
    longitude = models.DecimalField(max_digits=10, decimal_places=7, blank=True, null=True, verbose_name="Longitude")
    
    # Preço e custos
    price = models.DecimalField(max_digits=14, decimal_places=2, verbose_name="Preço")
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='MZN', verbose_name="Moeda")
    condominium_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Condomínio (por mês)")
    ipra = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="IPRA (Imposto Predial Anual)")
    iptu = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="IPTU/Imposto Anual (DEPRECADO)")
    monthly_expenses = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Despesas Mensais")
    
    # Tipo e status
    type = models.CharField(max_length=30, choices=TYPE_CHOICES, verbose_name="Tipo")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, verbose_name="Status")
    legal_status = models.CharField(max_length=20, choices=LEGAL_STATUS_CHOICES, blank=True, null=True, verbose_name="Situação Legal")
    
    # Características principais
    bedrooms = models.PositiveIntegerField(default=0, verbose_name="Quartos")
    suites = models.PositiveIntegerField(default=0, verbose_name="Suites")
    bathrooms = models.PositiveIntegerField(default=0, verbose_name="Casas de Banho Completas")
    toilets = models.PositiveIntegerField(default=0, verbose_name="WC/Lavabos")
    area = models.PositiveIntegerField(default=0, help_text='m²', verbose_name="Área Total")
    useful_area = models.PositiveIntegerField(blank=True, null=True, help_text='m²', verbose_name="Área Útil")
    land_area = models.PositiveIntegerField(blank=True, null=True, help_text='m²', verbose_name="Área do Terreno")
    parking_spaces = models.PositiveIntegerField(default=0, verbose_name="Vagas de Estacionamento")
    
    # Detalhes do imóvel
    year_built = models.PositiveIntegerField(blank=True, null=True, verbose_name="Ano de Construção")
    floor_number = models.PositiveIntegerField(blank=True, null=True, verbose_name="Andar")
    total_floors = models.PositiveIntegerField(blank=True, null=True, verbose_name="Total de Andares")
    
    # Detalhes técnicos
    property_condition = models.CharField(max_length=50, blank=True, null=True, verbose_name="Estado de Conservação")
    orientation = models.CharField(max_length=20, blank=True, null=True, verbose_name="Orientação Solar")
    energy_class = models.CharField(max_length=10, blank=True, null=True, verbose_name="Classe Energética")
    heating_type = models.CharField(max_length=50, blank=True, null=True, verbose_name="Sistema de Aquecimento")
    
    # Flags e características
    furnished = models.BooleanField(default=False, verbose_name="Mobilado")
    accepts_pets = models.BooleanField(default=False, verbose_name="Aceita Animais")
    accepts_financing = models.BooleanField(default=False, verbose_name="Aceita Financiamento")
    is_featured = models.BooleanField(default=False, verbose_name="Destaque")
    is_verified = models.BooleanField(default=False, verbose_name="Verificado")
    
    # Estatísticas
    view_count = models.PositiveIntegerField(default=0, verbose_name="Número de Visualizações")
    
    # Disponibilidade
    availability_date = models.DateField(blank=True, null=True, verbose_name="Data de Disponibilidade")
    
    # Notas internas
    internal_notes = models.TextField(blank=True, null=True, verbose_name="Observações Internas")
    
    # Comodidades (JSON)
    amenities = models.JSONField(
        default=list, 
        blank=True, 
        verbose_name="Comodidades",
        help_text="Lista de comodidades como ['garagem', 'piscina', 'jardim']"
    )
    
    # Relações
    agent = models.ForeignKey(
        Agent, 
        on_delete=models.SET_NULL, 
        null=True, 
        related_name='properties',
        verbose_name="Agente"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Propriedade"
        verbose_name_plural = "Propriedades"
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    
    def get_approximate_coordinates(self):
        """
        Retorna coordenadas aproximadas baseadas em endereço quando lat/long não estão disponíveis.
        Usa geocodificação com OpenStreetMap Nominatim.
        Retorna tupla (latitude, longitude, is_approximate) ou (None, None, False)
        """
        import logging
        logger = logging.getLogger(__name__)
        
        # Se já tem coordenadas exatas, retorná-las
        if self.latitude and self.longitude:
            logger.info(f"[Geocode] Property {self.id} já tem coordenadas: {self.latitude}, {self.longitude}")
            return (float(self.latitude), float(self.longitude), False)
        
        # Tentar geocodificar com informações de localização disponíveis
        try:
            from geopy.geocoders import Nominatim
            from geopy.exc import GeocoderTimedOut, GeocoderServiceError
            import time
            
            geolocator = Nominatim(user_agent="ijps_imobiliaria_v1.0", timeout=10)
            
            # Construir string de endereço com as informações disponíveis
            # Priorizar: bairro, cidade, província, país
            address_parts = []
            
            if self.neighborhood:
                address_parts.append(self.neighborhood)
            if self.city:
                address_parts.append(self.city)
            if self.province:
                address_parts.append(self.province)
            if self.country:
                address_parts.append(self.country)
            
            if not address_parts:
                logger.warning(f"[Geocode] Property {self.id} sem informações de endereço")
                return (None, None, False)
            
            # Criar string de endereço
            address_string = ", ".join(address_parts)
            logger.info(f"[Geocode] Property {self.id} - Tentando geocodificar: {address_string}")
            
            # Nominatim tem rate limit de 1 req/segundo - adicionar delay
            time.sleep(1.5)
            
            # Tentar geocodificar (com retry para evitar rate limiting)
            max_retries = 2
            for attempt in range(max_retries):
                try:
                    location = geolocator.geocode(address_string)
                    if location:
                        logger.info(f"[Geocode] Property {self.id} - Sucesso! Coords: {location.latitude}, {location.longitude}")
                        return (location.latitude, location.longitude, True)
                    logger.warning(f"[Geocode] Property {self.id} - Nominatim não encontrou o endereço")
                    break
                except GeocoderTimedOut as e:
                    logger.warning(f"[Geocode] Property {self.id} - Timeout (tentativa {attempt+1}/{max_retries})")
                    if attempt < max_retries - 1:
                        time.sleep(1)
                    continue
                except Exception as e:
                    logger.error(f"[Geocode] Property {self.id} - Erro: {str(e)}")
                    break
            
            # Se falhou, usar coordenadas do centro da cidade como fallback
            city_centers = {
                'Maputo': (-25.9655, 32.5832),
                'Matola': (-25.9622, 32.4589),
                'Beira': (-19.8436, 34.8389),
                'Nampula': (-15.1165, 39.2666),
            }
            
            if self.city and self.city in city_centers:
                lat, lon = city_centers[self.city]
                logger.info(f"[Geocode] Property {self.id} - Usando coordenadas do centro de {self.city}")
                return (lat, lon, True)
            
            return (None, None, False)
            
        except ImportError as e:
            logger.error(f"[Geocode] Property {self.id} - geopy não instalado: {str(e)}")
            return (None, None, False)
        except Exception as e:
            logger.error(f"[Geocode] Property {self.id} - Erro inesperado: {str(e)}")
            return (None, None, False)


class PropertyImage(models.Model):
    """Modelo para imagens de propriedades"""
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='images',
        verbose_name="Propriedade"
    )
    image = models.ImageField(upload_to='properties/', verbose_name="Imagem")
    is_primary = models.BooleanField(default=False, verbose_name="Imagem Principal")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordem")

    class Meta:
        verbose_name = "Imagem da Propriedade"
        verbose_name_plural = "Imagens das Propriedades"
        ordering = ['-is_primary', 'order', 'id']

    def save(self, *args, **kwargs):
        """Sobrescreve save para aplicar marca d'água automaticamente"""
        from django.conf import settings
        from .watermark_utils import add_watermark
        
        # Verificar se o sistema de marca d'água está ativado
        enable_watermark = getattr(settings, 'ENABLE_WATERMARK', False)
        
        # Se está salvando uma nova imagem (não atualização de campos)
        if enable_watermark and self.image and hasattr(self.image, 'file'):
            try:
                # Aplicar marca d'água simples
                watermarked_image = add_watermark(
                    self.image.file,
                    watermark_text="IJPS IMOBILIÁRIA"
                )
                
                # Substituir imagem original pela com marca d'água
                self.image.file = watermarked_image
                
            except Exception as e:
                # Em caso de erro, continuar sem marca d'água e registrar erro
                print(f"Aviso: Não foi possível aplicar marca d'água: {e}")
        elif not enable_watermark and self.image:
            print(f"ℹ️ Marca d'água desativada - imagem salva sem processamento")
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Imagem {self.order} - {self.property.title}"


class PropertyDocument(models.Model):
    """Modelo para documentos de propriedades"""
    property = models.ForeignKey(
        Property, 
        on_delete=models.CASCADE, 
        related_name='documents',
        verbose_name="Propriedade"
    )
    document = models.FileField(upload_to='properties/documents/', verbose_name="Documento")
    name = models.CharField(max_length=255, blank=True, verbose_name="Nome do Documento")
    document_type = models.CharField(max_length=100, blank=True, verbose_name="Tipo de Documento")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="Enviado em")

    class Meta:
        verbose_name = "Documento da Propriedade"
        verbose_name_plural = "Documentos das Propriedades"
        ordering = ['uploaded_at']

    def __str__(self):
        return f"Documento - {self.property.title} ({self.name or 'Sem nome'})"


class EvaluationRequest(models.Model):
    """Modelo para solicitações de avaliação de imóveis"""
    name = models.CharField(max_length=120, verbose_name="Nome")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=30, verbose_name="Telefone")
    property_type = models.CharField(max_length=50, verbose_name="Tipo de Propriedade")
    location = models.CharField(max_length=200, verbose_name="Localização")
    details = models.TextField(blank=True, verbose_name="Detalhes")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")

    class Meta:
        verbose_name = "Solicitação de Avaliação"
        verbose_name_plural = "Solicitações de Avaliação"
        ordering = ['-created_at']

    def __str__(self):
        return f"Avaliação - {self.name} ({self.location})"


class ContactMessage(models.Model):
    """Modelo para mensagens de contacto"""
    name = models.CharField(max_length=120, verbose_name="Nome")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    phone = models.CharField(max_length=30, verbose_name="Telefone")
    message = models.TextField(verbose_name="Mensagem")
    property = models.ForeignKey(
        Property, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Propriedade"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")

    class Meta:
        verbose_name = "Mensagem de Contacto"
        verbose_name_plural = "Mensagens de Contacto"
        ordering = ['-created_at']

    def __str__(self):
        return f"Contacto - {self.name}"


class PushSubscription(models.Model):
    """Modelo para armazenar subscriptions de notificações push"""
    endpoint = models.TextField(unique=True, verbose_name="Endpoint")
    p256dh = models.CharField(max_length=255, verbose_name="Chave P256DH")
    auth = models.CharField(max_length=255, verbose_name="Chave Auth")
    user_agent = models.TextField(blank=True, null=True, verbose_name="User Agent")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    
    # Preferências de notificação
    notify_new_properties = models.BooleanField(default=True, verbose_name="Novas Propriedades")
    notify_price_changes = models.BooleanField(default=True, verbose_name="Mudanças de Preço")
    notify_status_changes = models.BooleanField(default=True, verbose_name="Mudanças de Status")
    notify_recommendations = models.BooleanField(default=False, verbose_name="Recomendações")
    
    # Filtros de interesse (JSON fields para flexibilidade)
    location_filters = models.JSONField(default=list, blank=True, verbose_name="Filtros de Localização")
    property_types = models.JSONField(default=list, blank=True, verbose_name="Tipos de Propriedade")
    price_min = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True, verbose_name="Preço Mínimo")
    price_max = models.DecimalField(max_digits=14, decimal_places=2, blank=True, null=True, verbose_name="Preço Máximo")
    bedrooms_min = models.PositiveIntegerField(blank=True, null=True, verbose_name="Quartos Mínimos")
    
    # Configurações de horário
    quiet_hours_enabled = models.BooleanField(default=False, verbose_name="Horário Silencioso Ativo")
    quiet_hours_start = models.TimeField(default='22:00', verbose_name="Início Horário Silencioso")
    quiet_hours_end = models.TimeField(default='08:00', verbose_name="Fim Horário Silencioso")

    class Meta:
        verbose_name = "Push Subscription"
        verbose_name_plural = "Push Subscriptions"
        ordering = ['-created_at']

    def __str__(self):
        return f"Subscription {self.id} - {self.created_at.strftime('%d/%m/%Y')}"
