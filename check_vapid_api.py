#!/usr/bin/env python3
"""
Script para verificar a API do py_vapid
"""
from py_vapid import Vapid01
import inspect

print("=" * 70)
print("MÉTODOS E ATRIBUTOS DE Vapid01")
print("=" * 70)

# Listar todos os métodos
for name, method in inspect.getmembers(Vapid01):
    if callable(method) and not name.startswith('_'):
        print(f"\n{name}:")
        try:
            sig = inspect.signature(method)
            print(f"  Assinatura: {sig}")
        except:
            print(f"  (sem assinatura)")
        
        # Pegar docstring se existir
        if method.__doc__:
            lines = method.__doc__.strip().split('\n')
            if lines:
                print(f"  Doc: {lines[0]}")

print("\n" + "=" * 70)
print("TESTANDO FROM_STRING")
print("=" * 70)

# Testar from_string
try:
    # Gerar chaves
    vapid = Vapid01()
    vapid.generate_keys()
    
    # Exportar chave privada
    from cryptography.hazmat.primitives import serialization
    private_pem = vapid.private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')
    
    print("\nChave PEM gerada:")
    print(private_pem[:100] + "...")
    
    # Tentar carregar de volta
    print("\nTentando from_string()...")
    vapid2 = Vapid01.from_string(private_pem)
    print(f"✅ from_string() funcionou!")
    print(f"Tipo: {type(vapid2)}")
    
except Exception as e:
    print(f"❌ Erro: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("TESTANDO FROM_PEM")
print("=" * 70)

try:
    print("\nTentando from_pem()...")
    vapid3 = Vapid01.from_pem(private_pem.encode('utf-8'))
    print(f"✅ from_pem() funcionou!")
except AttributeError as e:
    print(f"❌ from_pem() não existe: {e}")
except Exception as e:
    print(f"❌ Erro: {e}")
