"""
Script para gerar chaves VAPID para notificações push
Execute: python generate_vapid_keys.py
"""

try:
    from py_vapid import Vapid
    from cryptography.hazmat.primitives import serialization
    import base64
    
    # Gerar novas chaves VAPID
    vapid = Vapid()
    vapid.generate_keys()
    
    # Obter chaves em formato bytes
    private_key_bytes = vapid.private_key.private_bytes(
        encoding=serialization.Encoding.DER,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    )
    
    public_key_bytes = vapid.public_key.public_bytes(
        encoding=serialization.Encoding.X962,
        format=serialization.PublicFormat.UncompressedPoint
    )
    
    # Converter para base64 URL-safe
    public_key_b64 = base64.urlsafe_b64encode(public_key_bytes).decode('utf-8').rstrip('=')
    private_key_b64 = base64.urlsafe_b64encode(private_key_bytes).decode('utf-8').rstrip('=')
    
    print("\n" + "="*70)
    print("🔑 CHAVES VAPID GERADAS COM SUCESSO!")
    print("="*70 + "\n")
    
    print("📋 CHAVE PÚBLICA (Frontend - .env.local):")
    print("-" * 70)
    print(f"NEXT_PUBLIC_VAPID_PUBLIC_KEY={public_key_b64}")
    print("-" * 70)
    
    print("\n🔐 CHAVE PRIVADA (Backend - settings.py ou .env):")
    print("-" * 70)
    print(f"VAPID_PRIVATE_KEY={private_key_b64}")
    print("-" * 70)
    
    print("\n📧 EMAIL (Backend - settings.py ou .env):")
    print("-" * 70)
    print("VAPID_CLAIMS_EMAIL=mailto:contato@imobiliariajamal.com")
    print("-" * 70)
    
    print("\n📝 PRÓXIMOS PASSOS:")
    print("1. Criar frontend/.env.local e adicionar NEXT_PUBLIC_VAPID_PUBLIC_KEY")
    print("2. Adicionar VAPID_PRIVATE_KEY e VAPID_CLAIMS_EMAIL em backend/ijps_api/settings.py")
    print("3. Executar migrações: python manage.py makemigrations && python manage.py migrate")
    print("4. Reiniciar ambos os servidores (frontend e backend)")
    print("\n" + "="*70 + "\n")
    
except ImportError as e:
    print(f"\n❌ ERRO: {e}")
    print("\nInstale primeiro: pip install pywebpush\n")
except Exception as e:
    print(f"\n❌ ERRO inesperado: {e}\n")
