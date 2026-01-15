# Gerador de Ícones PWA - IJPS

## 📱 Como Gerar os Ícones

### Opção 1: Usando o HTML Generator (Recomendado)

1. Abra o arquivo `generate-icons.html` em qualquer navegador moderno
2. Clique no botão "Gerar Todos os Ícones"
3. Baixe todos os arquivos PNG gerados
4. Coloque-os na pasta `public/`

### Opção 2: Usando Ferramentas Online

Use uma destas ferramentas para converter o `icon.svg`:

- **PWA Builder**: https://www.pwabuilder.com/imageGenerator
- **Real Favicon Generator**: https://realfavicongenerator.net/
- **Favicon.io**: https://favicon.io/favicon-converter/

### Opção 3: Usando Photoshop/Illustrator

1. Abra o arquivo `icon.svg`
2. Exporte para PNG nos seguintes tamanhos:
   - 72x72
   - 96x96
   - 128x128
   - 144x144
   - 152x152
   - 192x192
   - 384x384
   - 512x512

3. Nomeie os arquivos como `icon-{size}x{size}.png`
4. Salve na pasta `public/`

### Opção 4: Usando ImageMagick (Terminal)

```bash
# Instale o ImageMagick se ainda não tiver
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Gere todos os tamanhos
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

## 🎨 Design do Ícone

O ícone foi desenhado para representar:
- **Casa**: Símbolo principal da imobiliária
- **Cores IJPS**: Azul (#1E40AF) e Dourado (#FBBF24)
- **Profissionalismo**: Design limpo e moderno
- **Identidade**: Texto "IJPS" na parte inferior

## ✅ Checklist de Instalação

- [ ] Gerar todos os tamanhos de ícone (72, 96, 128, 144, 152, 192, 384, 512)
- [ ] Colocar arquivos PNG na pasta `public/`
- [ ] Verificar que `manifest.json` está atualizado
- [ ] Testar em Chrome DevTools (Application > Manifest)
- [ ] Testar instalação em dispositivo móvel

## 📋 Arquivos Necessários

Certifique-se de ter estes arquivos em `public/`:

```
public/
├── icon.svg (✓ criado)
├── icon-72x72.png
├── icon-96x96.png
├── icon-128x128.png
├── icon-144x144.png
├── icon-152x152.png
├── icon-192x192.png
├── icon-384x384.png
└── icon-512x512.png
```

## 🚀 Próximos Passos

Após gerar os ícones:
1. Faça commit dos arquivos
2. Faça deploy
3. Teste a instalação do PWA
4. Verifique que o ícone aparece corretamente na tela inicial
