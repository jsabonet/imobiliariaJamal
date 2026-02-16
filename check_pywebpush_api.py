#!/usr/bin/env python3
"""
Script para verificar assinatura correta do pywebpush.webpush()
"""
from pywebpush import webpush
import inspect

print("=" * 70)
print("ASSINATURA DO PYWEBPUSH.WEBPUSH()")
print("=" * 70)

sig = inspect.signature(webpush)
print(f"\nAssinatura: {sig}")

print("\nDocstring:")
if webpush.__doc__:
    print(webpush.__doc__)

print("\n" + "=" * 70)
print("PARÂMETROS DETALHADOS")
print("=" * 70)

for param_name, param in sig.parameters.items():
    print(f"\n{param_name}:")
    print(f"  Tipo de anotação: {param.annotation}")
    print(f"  Default: {param.default}")
