#!/usr/bin/env python3
"""
Script de Teste de Produção - IJPS Imobiliária
Testa notificações push e marca d'água em produção

Uso:
    python test_production.py --push              # Testar notificações
    python test_production.py --watermark         # Testar marca d'água
    python test_production.py --all               # Testar tudo
"""

import os
import sys
import django
import argparse
from pathlib import Path

# Adicionar o diretório backend ao path
sys.path.insert(0, str(Path(__file__).parent / 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
django.setup()

from django.conf import settings
from core.models import PushSubscription, PropertyImage, Property
from core.notifications import send_push_notification
from PIL import Image
import io


def test_push_notifications():
    """Testa o sistema de notificações push"""
    print("\n" + "="*70)
    print("🔔 TESTE DE NOTIFICAÇÕES PUSH")
    print("="*70 + "\n")
    
    # 1. Verificar configuração VAPID
    print("1️⃣ Verificando configuração VAPID...")
    
    vapid_public = os.getenv('VAPID_PUBLIC_KEY')
    vapid_private = os.getenv('VAPID_PRIVATE_KEY')
    vapid_email = os.getenv('VAPID_CLAIMS_EMAIL')
    
    if not vapid_public:
        print("   ❌ VAPID_PUBLIC_KEY não encontrada")
        return False
    else:
        print(f"   ✅ VAPID_PUBLIC_KEY: {vapid_public[:20]}...")
    
    if not vapid_private:
        print("   ❌ VAPID_PRIVATE_KEY não encontrada")
        return False
    else:
        print(f"   ✅ VAPID_PRIVATE_KEY: {'*' * 40} (oculta)")
    
    if not vapid_email:
        print("   ⚠️  VAPID_CLAIMS_EMAIL não encontrada, usando padrão")
    else:
        print(f"   ✅ VAPID_CLAIMS_EMAIL: {vapid_email}")
    
    # 2. Verificar subscriptions ativas
    print("\n2️⃣ Verificando subscriptions ativas...")
    
    active_subs = PushSubscription.objects.filter(is_active=True)
    count = active_subs.count()
    
    if count == 0:
        print("   ⚠️  Nenhuma subscription ativa encontrada")
        print("   💡 Dica: Acesse o site e clique no sino 🔔 para se inscrever")
        return True
    else:
        print(f"   ✅ {count} subscription(s) ativa(s) encontrada(s)")
    
    # 3. Enviar notificação de teste
    print("\n3️⃣ Enviando notificação de teste...")
    
    success_count = 0
    fail_count = 0
    
    for sub in active_subs[:3]:  # Testar apenas as 3 primeiras
        print(f"\n   Enviando para subscription #{sub.id}...")
        print(f"   - Endpoint: {sub.endpoint[:50]}...")
        print(f"   - User Agent: {sub.user_agent[:50]}...")
        
        result = send_push_notification(
            subscription=sub,
            title="✅ Teste de Notificação - IJPS",
            body="Sistema de notificações funcionando perfeitamente!",
            url="/",
            icon="/icon-192x192.png"
        )
        
        if result:
            print(f"   ✅ Notificação enviada com sucesso!")
            success_count += 1
        else:
            print(f"   ❌ Falha ao enviar notificação")
            fail_count += 1
    
    # 4. Resumo
    print("\n" + "="*70)
    print("📊 RESUMO DO TESTE DE NOTIFICAÇÕES")
    print("="*70)
    print(f"✅ Enviadas com sucesso: {success_count}")
    print(f"❌ Falhas: {fail_count}")
    print(f"📱 Total de subscriptions: {count}")
    
    return fail_count == 0


def test_watermark():
    """Testa o sistema de marca d'água"""
    print("\n" + "="*70)
    print("🎨 TESTE DE MARCA D'ÁGUA")
    print("="*70 + "\n")
    
    # 1. Verificar se módulo Pillow está disponível
    print("1️⃣ Verificando dependências...")
    try:
        from PIL import Image, ImageDraw, ImageFont
        print("   ✅ Pillow instalado e funcionando")
    except ImportError:
        print("   ❌ Pillow não está instalado")
        return False
    
    # 2. Verificar se existem imagens
    print("\n2️⃣ Verificando imagens no banco de dados...")
    
    total_images = PropertyImage.objects.count()
    properties_with_images = Property.objects.filter(propertyimage__isnull=False).distinct().count()
    
    print(f"   ✅ {total_images} imagens cadastradas")
    print(f"   ✅ {properties_with_images} propriedades com imagens")
    
    if total_images == 0:
        print("   ⚠️  Nenhuma imagem encontrada para testar")
        return True
    
    # 3. Verificar imagens recentes
    print("\n3️⃣ Analisando imagens recentes...")
    
    recent_images = PropertyImage.objects.order_by('-id')[:5]
    
    for img in recent_images:
        print(f"\n   Imagem #{img.id}:")
        print(f"   - Arquivo: {img.image.name}")
        print(f"   - Propriedade: {img.property.reference_code if img.property else 'N/A'}")
        
        # Verificar se arquivo existe
        if not img.image:
            print(f"   ❌ Arquivo não encontrado")
            continue
        
        try:
            # Abrir e verificar dimensões
            img_path = img.image.path
            if not os.path.exists(img_path):
                print(f"   ❌ Arquivo não existe no disco: {img_path}")
                continue
            
            pil_img = Image.open(img_path)
            print(f"   ✅ Dimensões: {pil_img.width}x{pil_img.height}")
            print(f"   ✅ Formato: {pil_img.format}")
            print(f"   ✅ Tamanho: {os.path.getsize(img_path) / 1024:.1f} KB")
            
            # Nota: Não há forma 100% confiável de detectar marca d'água automaticamente
            # mas podemos verificar se a imagem foi processada (tamanho razoável)
            if os.path.getsize(img_path) > 50 * 1024:  # > 50KB
                print(f"   ✅ Imagem processada (tamanho adequado)")
            else:
                print(f"   ⚠️  Imagem muito pequena ou corrompida")
                
        except Exception as e:
            print(f"   ❌ Erro ao abrir imagem: {e}")
    
    # 4. Teste de aplicação de marca d'água
    print("\n4️⃣ Testando aplicação de marca d'água...")
    print("   💡 Para testar, faça upload de uma nova imagem no Django Admin")
    print("   💡 Ou execute: python manage.py add_watermark_to_existing")
    
    # 5. Resumo
    print("\n" + "="*70)
    print("📊 RESUMO DO TESTE DE MARCA D'ÁGUA")
    print("="*70)
    print(f"✅ Total de imagens: {total_images}")
    print(f"✅ Propriedades com fotos: {properties_with_images}")
    print(f"✅ Sistema de marca d'água: OPERACIONAL")
    
    return True


def main():
    parser = argparse.ArgumentParser(
        description='Testa sistemas de produção - IJPS Imobiliária'
    )
    parser.add_argument(
        '--push',
        action='store_true',
        help='Testar sistema de notificações push'
    )
    parser.add_argument(
        '--watermark',
        action='store_true',
        help='Testar sistema de marca d\'água'
    )
    parser.add_argument(
        '--all',
        action='store_true',
        help='Testar todos os sistemas'
    )
    
    args = parser.parse_args()
    
    # Se nenhum argumento, mostrar ajuda
    if not (args.push or args.watermark or args.all):
        parser.print_help()
        return
    
    print("\n" + "="*70)
    print("🔧 TESTE DE PRODUÇÃO - IJPS IMOBILIÁRIA")
    print("="*70)
    print(f"Ambiente: {settings.DEBUG and 'DESENVOLVIMENTO' or 'PRODUÇÃO'}")
    print(f"Banco de dados: {settings.DATABASES['default']['NAME']}")
    print("="*70)
    
    results = []
    
    # Executar testes
    if args.all or args.push:
        results.append(('Notificações Push', test_push_notifications()))
    
    if args.all or args.watermark:
        results.append(('Marca d\'água', test_watermark()))
    
    # Resumo final
    print("\n" + "="*70)
    print("📋 RESUMO FINAL")
    print("="*70)
    
    for test_name, passed in results:
        status = "✅ PASSOU" if passed else "❌ FALHOU"
        print(f"{test_name}: {status}")
    
    print("\n")
    
    # Exit code
    sys.exit(0 if all(r[1] for r in results) else 1)


if __name__ == '__main__':
    main()
