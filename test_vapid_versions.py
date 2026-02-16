#!/usr/bin/env python3
"""
Verificar versões do Vapid disponíveis
"""
try:
    from py_vapid import Vapid
    print("✅ Vapid (sem 01) existe!")
    print(f"Tipo: {type(Vapid)}")
except ImportError as e:
    print(f"❌ Vapid (sem 01) não existe: {e}")

try:
    from py_vapid import Vapid01
    print("\n✅ Vapid01 existe!")
    print(f"Tipo: {type(Vapid01)}")
except ImportError as e:
    print(f"\n❌ Vapid01 não existe: {e}")

print("\n" + "=" * 70)
print("Testando criação e sign com ambos:")
print("=" * 70)

from cryptography.hazmat.primitives import serialization

# Testar Vapid01
try:
    v01 = Vapid01()
    v01.generate_keys()
    
    # Exportar PEM
    pem = v01.private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')
    
    # Recarregar
    v01_reloaded = Vapid01.from_pem(pem.encode('utf-8'))
    
    # Tentar assinar
    claims = {"sub": "mailto:test@example.com", "aud": "https://fcm.googleapis.com"}
    headers = v01_reloaded.sign(claims)
    
    print("\n✅ Vapid01: Funcionou!")
    print(f"Headers: {headers}")
    
except Exception as e:
    print(f"\n❌ Vapid01 falhou: {e}")
    import traceback
    traceback.print_exc()

# Testar Vapid (se existir)
try:
    v = Vapid()
    v.generate_keys()
    
    # Exportar PEM
    pem = v.private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')
    
    # Recarregar
    v_reloaded = Vapid.from_pem(pem.encode('utf-8'))
    
    # Tentar assinar
    claims = {"sub": "mailto:test@example.com", "aud": "https://fcm.googleapis.com"}
    headers = v_reloaded.sign(claims)
    
    print("\n✅ Vapid (sem 01): Funcionou!")
    print(f"Headers: {headers}")
    
except NameError:
    print("\n⚠️  Vapid (sem 01) não existe")
except Exception as e:
    print(f"\n❌ Vapid (sem 01) falhou: {e}")
    import traceback
    traceback.print_exc()
