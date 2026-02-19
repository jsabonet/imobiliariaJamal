# 🧪 Como Testar a Geocodificação Automática

## ✅ Status da Implementação

**COMPLETO** - Todas as mudanças foram implementadas:

### Backend ✅
- ✅ Biblioteca `geopy` instalada
- ✅ Método `get_approximate_coordinates()` no modelo Property
- ✅ API retornando 3 novos campos:
  - `approximate_latitude`
  - `approximate_longitude`
  - `is_approximate_location`

### Frontend ✅
- ✅ Componente `MapPlaceholder` atualizado
- ✅ Página de detalhes de propriedades integrada
- ✅ Aviso visual para localização aproximada

## 🚀 Passos para Ver as Mudanças

### 1. Reiniciar o Frontend (IMPORTANTE!)

**Terminal no Windows:**
```powershell
# Parar o servidor atual (Ctrl+C no terminal do frontend)
# Depois executar:
cd D:\Projectos\JamalImobiliaria\frontend
npm run dev
```

**OU mate o processo e reinicie:**
```powershell
# Encontrar processo Node.js
Get-Process node | Stop-Process -Force

# Reiniciar
cd D:\Projectos\JamalImobiliaria\frontend
npm run dev
```

### 2. Limpar Cache do Navegador

No navegador, pressione:
- **Chrome/Edge**: `Ctrl + Shift + R` (hard refresh)
- **Firefox**: `Ctrl + Shift + Delete` → Limpar cache

### 3. Testar a Geocodificação

#### Opção A: Propriedade de Teste Já Criada
1. Acesse: http://localhost:3000/propriedades/8
2. Role para baixo até a seção "Localização"
3. Você deve ver:
   - ⚠️ Aviso em cor âmbar: "Localização Aproximada"
   - 🗺️ Mapa do Bairro Central, Nampula
   - 📍 Coordenadas aproximadas

#### Opção B: Criar Nova Propriedade SEM Coordenadas

1. **No Admin Django** (http://localhost:8000/admin):
   - Vá para "Propriedades" → "Adicionar propriedade"
   - Preencha:
     - Título: "Teste Geocodificação"
     - Bairro: "Polana"
     - Cidade: "Maputo"
     - Província: "Maputo Cidade"
     - **NÃO preencha Latitude e Longitude**
   - Salvar

2. **Ver no Frontend:**
   - Acesse http://localhost:3000/propriedades/[ID_DA_NOVA]
   - Você verá o mapa da região da Polana (aproximado)

#### Opção C: Editar Propriedade Existente

1. **No Admin Django**:
   - Edite uma propriedade que JÁ tem coordenadas
   - **Apague** os valores de Latitude e Longitude
   - Certifique-se de ter Bairro, Cidade e Província preenchidos
   - Salvar

2. **Ver mudança** (faça hard refresh no navegador!):
   - Acesse a propriedade no frontend
   - Agora verá localização APROXIMADA em vez da exata

## 🔍 Como Verificar se Está Funcionando

### 1. Testar API Diretamente

```powershell
# PowerShell
Invoke-WebRequest -Uri "http://localhost:8000/api/properties/8/" -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json | Select-Object id, title, latitude, longitude, approximate_latitude, approximate_longitude, is_approximate_location
```

**Resultado esperado:**
```json
{
  "id": 8,
  "title": "Casa T4 no Bairro Central - Nampula",
  "latitude": null,
  "longitude": null,
  "approximate_latitude": -16.2294369,
  "approximate_longitude": 39.9048489,
  "is_approximate_location": true
}
```

### 2. Verificar no Navegador (DevTools)

1. Abra http://localhost:3000/propriedades/8
2. Abra DevTools (F12)
3. Vá para aba "Network"
4. Recarregue a página (F5)
5. Procure pela requisição da API
6. Verifique se a resposta tem os campos `approximate_*`

### 3. Visual no Frontend

**Com Coordenadas EXATAS:**
- 🟢 Mapa normal
- 🎯 "Coordenadas: -25.965500, 32.583200"
- Sem aviso

**Com Coordenadas APROXIMADAS:**
- 🟡 Aviso em cor âmbar no topo do mapa
- ⚠️ "Localização Aproximada"
- 📍 "Área aproximada: -16.229437, 39.904849"
- Texto explicativo sobre contatar para endereço exato

## 🐛 Troubleshooting

### Problema: Ainda vejo "Localização não disponível"

**Causas:**
1. ❌ Frontend não foi reiniciado
2. ❌ Cache do navegador não foi limpo
3. ❌ Propriedade não tem bairro/cidade/província
4. ❌ Backend não está rodando

**Solução:**
```powershell
# 1. Verificar se backend está rodando
Invoke-WebRequest -Uri "http://localhost:8000/api/properties/" -UseBasicParsing

# 2. Limpar cache do Next.js
cd D:\Projectos\JamalImobiliaria
Remove-Item -Recurse -Force .\frontend\.next

# 3. Reiniciar frontend
cd frontend
npm run dev

# 4. Hard refresh no navegador (Ctrl + Shift + R)
```

### Problema: API não retorna approximate_latitude

**Verificar:**
1. ✅ Propriedade tem Bairro, Cidade ou Província?
2. ✅ Backend foi reiniciado após instalar geopy?
3. ✅ Propriedade NÃO tem latitude/longitude exatas? (se tiver, usa exatas)

**Testar no backend:**
```powershell
cd D:\Projectos\JamalImobiliaria\backend
..\.venv\Scripts\python.exe test_geocoding.py
```

### Problema: "geopy not found"

```powershell
cd D:\Projectos\JamalImobiliaria\backend
..\.venv\Scripts\python.exe -m pip install geopy==2.4.1
```

## 📊 Comportamento Esperado

| Situação | Resultado |
|----------|-----------|
| ✅ Lat/Long preenchidas | Mapa EXATO, sem aviso |
| ✅ Sem Lat/Long + Bairro/Cidade | Mapa APROXIMADO, com aviso âmbar |
| ❌ Sem Lat/Long + Sem localização | "Localização não disponível" |

## 🎯 Checklist Rápido

Antes de testar, verifique:
- [ ] Backend Django está rodando (`http://localhost:8000/admin`)
- [ ] Frontend Next.js foi **reiniciado** após as mudanças
- [ ] Cache do Next.js foi limpo (pasta `.next` deletada)
- [ ] Navegador foi atualizado com hard refresh (Ctrl+Shift+R)
- [ ] Propriedade tem pelo menos Bairro + Cidade + Província

## ✨ Tudo Funcionando?

Se você ver o **mapa com aviso âmbar** dizendo "Localização Aproximada", parabéns! 🎉

A geocodificação automática está funcionando perfeitamente!

---

**Criado em:** 19 de Fevereiro de 2026  
**Para:** Testes pós-implementação
