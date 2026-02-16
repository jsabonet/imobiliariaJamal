"""
Utilitários para aplicação de marca d'água em imagens
Protege as imagens da plataforma IJPS Imobiliária
"""

from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
import sys
import os


def add_watermark(image_file, watermark_text="IJPS IMOBILIÁRIA", opacity=128):
    """
    Adiciona marca d'água em uma imagem
    
    Args:
        image_file: Arquivo de imagem (InMemoryUploadedFile ou path)
        watermark_text: Texto da marca d'água (padrão: "IJPS IMOBILIÁRIA")
        opacity: Opacidade da marca d'água 0-255 (padrão: 128 = 50%)
    
    Returns:
        InMemoryUploadedFile: Imagem com marca d'água aplicada
    """
    try:
        # Abrir a imagem original
        if hasattr(image_file, 'read'):
            img = Image.open(image_file)
            image_file.seek(0)  # Reset para caso precise usar novamente
        else:
            img = Image.open(image_file)
        
        # Converter para RGBA se necessário (para suportar transparência)
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Criar camada para a marca d'água
        watermark_layer = Image.new('RGBA', img.size, (0, 0, 0, 0))
        draw = ImageDraw.Draw(watermark_layer)
        
        # Calcular tamanho da fonte baseado no tamanho da imagem
        # Usar aproximadamente 3% da largura da imagem
        font_size = max(20, int(img.width * 0.03))
        
        try:
            # Tentar usar fonte TrueType (pode não estar disponível em todos os sistemas)
            # Usar fonte bold para melhor visibilidade
            font_paths = [
                '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',  # Linux
                'C:\\Windows\\Fonts\\arialbd.ttf',  # Windows - Arial Bold
                'C:\\Windows\\Fonts\\Arial.ttf',  # Windows - Arial
                '/System/Library/Fonts/Helvetica.ttc',  # macOS
            ]
            
            font = None
            for font_path in font_paths:
                if os.path.exists(font_path):
                    font = ImageFont.truetype(font_path, font_size)
                    break
            
            if font is None:
                # Fallback para fonte padrão
                font = ImageFont.load_default()
        except Exception:
            # Se falhar, usar fonte padrão
            font = ImageFont.load_default()
        
        # Calcular posição do texto
        # Usar textbbox para obter dimensões precisas
        bbox = draw.textbbox((0, 0), watermark_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # Posicionar no canto inferior direito com margem
        margin = 20
        position = (
            img.width - text_width - margin,
            img.height - text_height - margin
        )
        
        # Desenhar sombra/contorno para melhor legibilidade
        shadow_offset = 2
        # Sombra preta mais forte para destaque
        for adj_x in range(-shadow_offset, shadow_offset + 1):
            for adj_y in range(-shadow_offset, shadow_offset + 1):
                if adj_x != 0 or adj_y != 0:
                    draw.text(
                        (position[0] + adj_x, position[1] + adj_y),
                        watermark_text,
                        font=font,
                        fill=(0, 0, 0, 255)  # Contorno preto sólido
                    )
        
        # Texto principal branco sólido
        draw.text(
            position,
            watermark_text,
            font=font,
            fill=(255, 255, 255, 255)  # Branco sólido para máximo contraste
        )
        
        # Também adicionar marca d'água diagonal no centro (mais sutil)
        # Criar imagem rotacionada para marca d'água central
        center_watermark = Image.new('RGBA', img.size, (0, 0, 0, 0))
        center_draw = ImageDraw.Draw(center_watermark)
        
        # Calcular fonte maior para marca d'água central
        center_font_size = max(40, int(img.width * 0.05))
        try:
            if font_paths:
                for font_path in font_paths:
                    if os.path.exists(font_path):
                        center_font = ImageFont.truetype(font_path, center_font_size)
                        break
                else:
                    center_font = ImageFont.load_default()
            else:
                center_font = ImageFont.load_default()
        except Exception:
            center_font = ImageFont.load_default()
        
        # Posicionar no centro
        center_bbox = center_draw.textbbox((0, 0), watermark_text, font=center_font)
        center_text_width = center_bbox[2] - center_bbox[0]
        center_text_height = center_bbox[3] - center_bbox[1]
        
        center_position = (
            (img.width - center_text_width) // 2,
            (img.height - center_text_height) // 2
        )
        
        # Desenhar marca d'água central (com contorno forte)
        # Contorno preto
        for adj_x in range(-2, 3):
            for adj_y in range(-2, 3):
                if adj_x != 0 or adj_y != 0:
                    center_draw.text(
                        (center_position[0] + adj_x, center_position[1] + adj_y),
                        watermark_text,
                        font=center_font,
                        fill=(0, 0, 0, 200)
                    )
        
        # Texto branco
        center_draw.text(
            center_position,
            watermark_text,
            font=center_font,
            fill=(255, 255, 255, 180)  # Meio transparente mas visível
        )
        
        # Rotacionar marca d'água central -30 graus
        center_watermark = center_watermark.rotate(-30, expand=False, fillcolor=(0, 0, 0, 0))
        
        # Combinar todas as camadas
        watermarked = Image.alpha_composite(img, center_watermark)
        watermarked = Image.alpha_composite(watermarked, watermark_layer)
        
        # Converter de volta para RGB (remover canal alpha para JPEG)
        if watermarked.mode == 'RGBA':
            # Criar fundo branco
            rgb_img = Image.new('RGB', watermarked.size, (255, 255, 255))
            rgb_img.paste(watermarked, mask=watermarked.split()[3])  # 3 é o canal alpha
            watermarked = rgb_img
        
        # Salvar em buffer
        output = BytesIO()
        
        # Determinar formato pelo nome do arquivo original
        image_format = 'JPEG'
        if hasattr(image_file, 'name'):
            if image_file.name.lower().endswith('.png'):
                image_format = 'PNG'
            elif image_file.name.lower().endswith('.webp'):
                image_format = 'WEBP'
        
        # Salvar com qualidade alta
        if image_format == 'JPEG':
            watermarked.save(output, format='JPEG', quality=90, optimize=True)
        elif image_format == 'PNG':
            watermarked.save(output, format='PNG', optimize=True)
        else:
            watermarked.save(output, format=image_format, quality=90)
        
        output.seek(0)
        
        # Criar novo InMemoryUploadedFile
        watermarked_file = InMemoryUploadedFile(
            output,
            'ImageField',
            image_file.name if hasattr(image_file, 'name') else 'watermarked.jpg',
            f'image/{image_format.lower()}',
            sys.getsizeof(output),
            None
        )
        
        return watermarked_file
        
    except Exception as e:
        # Em caso de erro, retornar imagem original
        print(f"Erro ao aplicar marca d'água: {e}")
        if hasattr(image_file, 'seek'):
            image_file.seek(0)
        return image_file


def add_watermark_with_property_code(image_file, property_code=None):
    """
    Adiciona marca d'água com código da propriedade
    
    Args:
        image_file: Arquivo de imagem
        property_code: Código de referência da propriedade (opcional)
    
    Returns:
        InMemoryUploadedFile: Imagem com marca d'água aplicada
    """
    if property_code:
        watermark_text = f"IJPS IMOBILIÁRIA · {property_code}"
    else:
        watermark_text = "IJPS IMOBILIÁRIA"
    
    return add_watermark(image_file, watermark_text=watermark_text)
