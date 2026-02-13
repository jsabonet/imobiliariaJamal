# 🔒 Sistema de Marca d'Água - Guia Rápido

## ✅ O que foi implementado?

Sistema completo de proteção de imagens com **dupla camada de segurança**:

### 1. Backend (Django + Pillow)
- ✅ Marca d'água permanente aplicada automaticamente no upload
- ✅ Texto: "IJPS IMOBILIÁRIA" + código da propriedade
- ✅ Posicionamento: canto inferior direito + diagonal central
- ✅ Qualidade preservada (90% JPEG)

### 2. Frontend (Next.js + CSS)
- ✅ Overlay CSS dinâmico não removível facilmente
- ✅ Proteção contra clique direito e drag & drop
- ✅ Marca d'água visível em cards e páginas de detalhe

## 🚀 Como usar?

### Upload automático (já configurado)
Quando você cria/edita uma propriedade no dashboard, a marca d'água é aplicada automaticamente em todas as imagens!

### Testar o sistema
```bash
cd backend
python test_watermark.py
```

Este comando irá:
1. Criar imagens de teste
2. Aplicar marca d'água
3. Salvar arquivos de exemplo
4. Exibir resultado no terminal

### Reprocessar imagens antigas
Se você já tem imagens no banco de dados sem marca d'água:
```bash
cd backend
python manage.py add_watermark_to_existing
```

Opções disponíveis:
```bash
# Limitar a 10 imagens
python manage.py add_watermark_to_existing --limit 10

# Forçar reprocessamento de todas
python manage.py add_watermark_to_existing --force
```

## 🎨 Arquivos criados/modificados

### Backend
- ✅ `core/watermark_utils.py` - Utilitários de marca d'água
- ✅ `core/models.py` - Modificado PropertyImage.save()
- ✅ `core/management/commands/add_watermark_to_existing.py` - Reprocessar imagens
- ✅ `test_watermark.py` - Script de teste

### Frontend
- ✅ `app/globals.css` - Classes CSS de proteção
- ✅ `components/properties/PropertyCard.tsx` - Proteção em cards
- ✅ `app/(public)/propriedades/[id]/page.tsx` - Proteção em detalhes

### Documentação
- ✅ `MARCA_DAGUA_IMPLEMENTATION.md` - Documentação completa

## 🔧 Customização rápida

### Alterar texto da marca d'água

**Backend** (`core/watermark_utils.py`, linha 16):
```python
watermark_text = "SEU TEXTO AQUI"
```

**Frontend** (`app/globals.css`, linha 211):
```css
.property-image-protected::after {
  content: 'SEU TEXTO AQUI';
}
```

### Alterar opacidade

**Backend** (`watermark_utils.py`):
```python
opacity = 180  # 0-255, padrão: 128
```

**Frontend** (`globals.css`):
```css
background: rgba(0, 0, 0, 0.7);  /* Padrão: 0.5 */
color: rgba(255, 255, 255, 1);   /* Padrão: 0.9 */
```

## 📊 Verificar funcionamento

### 1. No Dashboard
1. Acesse `/dashboard/propriedades/nova`
2. Faça upload de imagens
3. Salve a propriedade
4. Verifique as imagens em `backend/media/properties/`
5. Abra as imagens → Marca d'água deve estar visível

### 2. Na Interface Pública
1. Acesse a propriedade criada
2. Inspecione as imagens (F12)
3. Tente:
   - Arrastar imagem → Bloqueado ✓
   - Clicar com botão direito → Bloqueado ✓
   - Salvar imagem → Marca d'água permanente ✓

### 3. Verificar proteção CSS
- Overlay "IJPS IMOBILIÁRIA" visível no canto inferior direito
- Marca d'água diagonal central em páginas de detalhe
- Impossível selecionar ou arrastar imagens

## 🛡️ Níveis de proteção

| Tipo | Local | Removível? | Eficácia |
|------|-------|------------|----------|
| Marca d'água permanente | Backend/Imagem | Difícil | ⭐⭐⭐⭐⭐ |
| Overlay CSS | Frontend | Possível com DevTools | ⭐⭐⭐ |
| Anti-drag & drop | Frontend | Possível com DevTools | ⭐⭐⭐ |
| Anti-clique direito | Frontend | Possível com DevTools | ⭐⭐ |

**Proteção dupla**: Mesmo que alguém remova a proteção CSS, a marca d'água permanente ainda estará na imagem!

## 📝 Exemplos de uso

### Criar propriedade com imagens (automático)
```python
# No Django shell ou view
property = Property.objects.create(
    title="Apartamento T3",
    reference_code="IJPS-2026-001",
    # ... outros campos
)

# Upload de imagem - marca d'água será aplicada automaticamente!
PropertyImage.objects.create(
    property=property,
    image=uploaded_file,  # SimpleUploadedFile ou InMemoryUploadedFile
    is_primary=True
)
# A marca d'água "IJPS IMOBILIÁRIA · IJPS-2026-001" será aplicada!
```

### Aplicar marca d'água manualmente
```python
from core.watermark_utils import add_watermark_with_property_code
from django.core.files.uploadedfile import SimpleUploadedFile

# Abrir imagem
with open('imagem.jpg', 'rb') as f:
    image_file = SimpleUploadedFile('imagem.jpg', f.read())

# Aplicar marca d'água
watermarked = add_watermark_with_property_code(
    image_file,
    property_code="IJPS-2026-001"
)

# Salvar
with open('imagem_marcada.jpg', 'wb') as f:
    f.write(watermarked.read())
```

## ⚠️ Importante

1. **Backup**: Faça backup das imagens originais antes de reprocessar em massa
2. **Performance**: Processamento adiciona ~200-500ms por imagem no upload
3. **Espaço**: Imagens com marca d'água são ~5-10% maiores
4. **Qualidade**: Marca d'água não degrada qualidade visual (JPEG 90%)

## 🐛 Troubleshooting

**Marca d'água não aparece?**
- Verifique logs do Django
- Teste com `python test_watermark.py`
- Certifique-se que Pillow está instalado: `pip install Pillow`

**Erro ao fazer upload?**
- Verifique permissões da pasta `media/properties/`
- Verifique espaço em disco

**Overlay CSS não aparece?**
- Limpe cache do navegador (Ctrl+Shift+R)
- Verifique se `globals.css` está sendo carregado
- Inspecione elemento (F12) e veja se classes estão aplicadas

## 📞 Documentação completa

Ver: [`MARCA_DAGUA_IMPLEMENTATION.md`](../MARCA_DAGUA_IMPLEMENTATION.md)

---

**Status**: ✅ Implementado e testado  
**Versão**: 1.0  
**Data**: 13 de Fevereiro de 2026
