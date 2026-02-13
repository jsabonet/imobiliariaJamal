"""
Script de teste rápido para verificar a funcionalidade de marca d'água
Execute diretamente: python test_watermark.py
"""

import os
import sys

# Adicionar diretório do backend ao path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ijps_api.settings')
import django
django.setup()

from core.watermark_utils import add_watermark, add_watermark_with_property_code
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile


def test_watermark_basic():
    """Teste básico de adição de marca d'água"""
    print("\n" + "="*60)
    print("TESTE 1: Marca d'água básica")
    print("="*60)
    
    # Criar imagem de teste simples
    test_image = Image.new('RGB', (800, 600), color='blue')
    buffer = BytesIO()
    test_image.save(buffer, format='JPEG')
    buffer.seek(0)
    
    # Criar arquivo de upload simulado
    test_file = SimpleUploadedFile(
        "test_image.jpg",
        buffer.read(),
        content_type="image/jpeg"
    )
    
    # Aplicar marca d'água
    print("Aplicando marca d'água...")
    watermarked = add_watermark(test_file)
    
    # Salvar resultado
    output_path = 'test_watermark_output.jpg'
    with open(output_path, 'wb') as f:
        f.write(watermarked.read())
    
    print(f"✓ Marca d'água aplicada com sucesso!")
    print(f"✓ Arquivo salvo em: {output_path}")
    print(f"✓ Abra o arquivo para verificar a marca d'água")
    
    return True


def test_watermark_with_code():
    """Teste de marca d'água com código de propriedade"""
    print("\n" + "="*60)
    print("TESTE 2: Marca d'água com código de propriedade")
    print("="*60)
    
    # Criar imagem de teste
    test_image = Image.new('RGB', (1200, 800), color='green')
    buffer = BytesIO()
    test_image.save(buffer, format='JPEG')
    buffer.seek(0)
    
    # Criar arquivo de upload simulado
    test_file = SimpleUploadedFile(
        "test_property.jpg",
        buffer.read(),
        content_type="image/jpeg"
    )
    
    # Aplicar marca d'água com código
    print("Aplicando marca d'água com código 'IJPS-2026-001'...")
    watermarked = add_watermark_with_property_code(
        test_file,
        property_code="IJPS-2026-001"
    )
    
    # Salvar resultado
    output_path = 'test_watermark_with_code.jpg'
    with open(output_path, 'wb') as f:
        f.write(watermarked.read())
    
    print(f"✓ Marca d'água com código aplicada!")
    print(f"✓ Arquivo salvo em: {output_path}")
    print(f"✓ Verifique se o código 'IJPS-2026-001' aparece na marca d'água")
    
    return True


def test_with_real_image():
    """Teste com imagem real (se disponível)"""
    print("\n" + "="*60)
    print("TESTE 3: Marca d'água em imagem real")
    print("="*60)
    
    # Procurar por uma imagem real no media
    media_path = os.path.join(os.path.dirname(__file__), '..', 'media', 'properties')
    
    if not os.path.exists(media_path):
        print("⚠ Diretório media/properties não encontrado")
        return False
    
    # Procurar primeira imagem
    for filename in os.listdir(media_path):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            image_path = os.path.join(media_path, filename)
            print(f"Usando imagem: {filename}")
            
            # Abrir imagem
            with open(image_path, 'rb') as f:
                test_file = SimpleUploadedFile(
                    filename,
                    f.read(),
                    content_type="image/jpeg"
                )
            
            # Aplicar marca d'água
            print("Aplicando marca d'água...")
            watermarked = add_watermark_with_property_code(
                test_file,
                property_code="TESTE-REAL-001"
            )
            
            # Salvar resultado
            output_path = f'test_real_{filename}'
            with open(output_path, 'wb') as f:
                f.write(watermarked.read())
            
            print(f"✓ Marca d'água aplicada em imagem real!")
            print(f"✓ Arquivo salvo em: {output_path}")
            return True
    
    print("⚠ Nenhuma imagem encontrada em media/properties")
    return False


def main():
    """Executar todos os testes"""
    print("\n" + "🔒 " + "="*56 + " 🔒")
    print("   TESTE DE SISTEMA DE MARCA D'ÁGUA - IJPS IMOBILIÁRIA")
    print("🔒 " + "="*56 + " 🔒")
    
    try:
        # Teste 1: Marca d'água básica
        result1 = test_watermark_basic()
        
        # Teste 2: Marca d'água com código
        result2 = test_watermark_with_code()
        
        # Teste 3: Com imagem real (opcional)
        test_with_real_image()
        
        # Resumo
        print("\n" + "="*60)
        print("RESUMO DOS TESTES")
        print("="*60)
        print(f"✓ Teste 1 (Básico): {'PASSOU' if result1 else 'FALHOU'}")
        print(f"✓ Teste 2 (Com código): {'PASSOU' if result2 else 'FALHOU'}")
        print("\n✓ Sistema de marca d'água está funcionando!")
        print("\nArquivos gerados:")
        print("  - test_watermark_output.jpg")
        print("  - test_watermark_with_code.jpg")
        print("  - test_real_*.jpg (se disponível)")
        print("\nAbra os arquivos para verificar as marcas d'água aplicadas.")
        print("="*60)
        
    except Exception as e:
        print(f"\n✗ ERRO: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    return True


if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
