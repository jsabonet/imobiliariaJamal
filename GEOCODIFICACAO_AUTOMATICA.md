# 🗺️ Sistema de Geocodificação Automática de Propriedades

## 📋 Visão Geral

Sistema implementado para resolver o problema de propriedades sem coordenadas GPS (latitude/longitude) que deixavam o mapa em branco no frontend. Agora, quando as coordenadas exatas não são fornecidas, o sistema automaticamente **geocodifica** o endereço da propriedade para mostrar pelo menos a localização aproximada do bairro.

## ✨ Funcionalidades

### 1. **Geocodificação Automática**
- Quando latitude e longitude não estão preenchidas, o sistema usa as informações de endereço disponíveis
- Fontes de dados para geocodificação (em ordem de prioridade):
  - Bairro
  - Cidade
  - Província
  - País

### 2. **Indicação Visual no Mapa**
- Mapas com localização aproximada exibem um **aviso visual** em cor âmbar
- Texto explicativo: "Localização Aproximada - Este mapa mostra a localização geral do bairro"
- Ícone diferenciado para coordenadas aproximadas vs. exatas

### 3. **Proteção de Privacidade**
- Coordenadas aproximadas mostram apenas a região/bairro
- Endereço exato continua protegido até o contato com o agente
- Zoom reduzido para localização aproximada (14 vs 15 para exata)

## 🔧 Implementação Técnica

### **Backend (Django)**

#### 1. Novo Pacote Instalado
```bash
pip install geopy==2.4.1
```

#### 2. Método no Modelo Property
```python
def get_approximate_coordinates(self):
    """
    Retorna coordenadas aproximadas baseadas em endereço.
    Returns: (latitude, longitude, is_approximate)
    """
```

#### 3. Novos Campos no Serializer
- `approximate_latitude`: Latitude aproximada (se não houver exata)
- `approximate_longitude`: Longitude aproximada (se não houver exata)
- `is_approximate_location`: Boolean indicando se é aproximada

#### 4. API de Geocodificação
- Usa **OpenStreetMap Nominatim** (gratuito, sem necessidade de API key)
- Timeout de 10 segundos
- Retry automático em caso de rate limiting
- Graceful fallback se geocodificação falhar

### **Frontend (Next.js/React)**

#### 1. Componente MapPlaceholder Atualizado
```tsx
<MapPlaceholder 
  latitude={property.latitude}
  longitude={property.longitude}
  approximateLatitude={property.approximateLatitude}
  approximateLongitude={property.approximateLongitude}
  isApproximateLocation={property.isApproximateLocation}
  height={400}
/>
```

#### 2. Lógica de Renderização
- **Prioridade 1**: Usa coordenadas exatas se disponíveis
- **Prioridade 2**: Usa coordenadas aproximadas (geocodificadas)
- **Fallback**: Mostra placeholder "Localização não disponível"

## 📊 Exemplos de Uso

### Propriedade COM Coordenadas Exatas
```json
{
  "latitude": -25.9655000,
  "longitude": 32.5832000,
  "approximate_latitude": null,
  "approximate_longitude": null,
  "is_approximate_location": false
}
```
✅ Mapa mostra localização EXATA do imóvel

### Propriedade SEM Coordenadas (Geocodificada)
```json
{
  "latitude": null,
  "longitude": null,
  "approximate_latitude": -16.2294369,
  "approximate_longitude": 39.9048489,
  "is_approximate_location": true,
  "neighborhood": "Bairro Central",
  "city": "Nampula",
  "province": "Nampula"
}
```
⚠️ Mapa mostra localização APROXIMADA do bairro com aviso visual

### Propriedade SEM Dados Suficientes
```json
{
  "latitude": null,
  "longitude": null,
  "approximate_latitude": null,
  "approximate_longitude": null,
  "is_approximate_location": false
}
```
❌ Mapa mostra placeholder "Localização não disponível"

## 🧪 Como Testar

### 1. Testar Geocodificação no Backend
```bash
cd backend
python test_geocoding.py
```

### 2. Criar Propriedade de Teste SEM Coordenadas
```bash
cd backend
python create_test_property_no_coords.py
```
Isso cria uma propriedade em Nampula sem coordenadas que será geocodificada automaticamente.

### 3. Testar API
```bash
cd backend
python test_api_geocoding.py
```
Verifica se a API está retornando os campos corretamente.

### 4. Testar no Frontend
1. Inicie o backend: `cd backend && python manage.py runserver`
2. Inicie o frontend: `cd frontend && npm run dev`
3. Acesse: `http://localhost:3000/propriedades/8`
4. Verifique se o mapa mostra a localização aproximada com o aviso

## 📝 Workflow para Administradores

### Cadastrando Nova Propriedade

#### Opção 1: Com Coordenadas Exatas (Recomendado)
1. No formulário de cadastro, preencha **todos** os campos de localização:
   - Endereço Completo
   - Bairro
   - Cidade
   - Província
   - **Latitude** (GPS)
   - **Longitude** (GPS)

2. ✅ Resultado: Mapa mostrará localização EXATA do imóvel

#### Opção 2: Sem Coordenadas (Geocodificação Automática)
1. Preencha apenas os campos de endereço:
   - Bairro ✅ **IMPORTANTE**
   - Cidade ✅ **IMPORTANTE**
   - Província ✅ **IMPORTANTE**
   - Deixe Latitude e Longitude em branco

2. ⚠️ Resultado: Sistema geocodificará automaticamente e mostrará localização aproximada do bairro

**⚡ Dica**: Para melhores resultados na geocodificação, preencha pelo menos:
- Bairro (obrigatório)
- Cidade (obrigatório)
- Província (obrigatório)

## 🔍 Como Obter Coordenadas GPS

### Método 1: Google Maps
1. Abra [Google Maps](https://maps.google.com)
2. Pesquise o endereço exato
3. Clique com botão direito no local exato
4. Selecione "Copiar coordenadas"
5. Cole no formulário (formato: `-25.9655, 32.5832`)

### Método 2: OpenStreetMap
1. Abra [OpenStreetMap](https://www.openstreetmap.org)
2. Navegue até o local
3. Clique com botão direito
4. Veja "Mostrar endereço" - coordenadas aparecem na URL

### Método 3: Aplicativo GPS no Celular
1. Vá fisicamente ao imóvel
2. Use app de GPS (Google Maps, Maps.me, etc.)
3. Anote as coordenadas exatas

## ⚙️ Configurações Técnicas

### Rate Limiting da Geocodificação
- **Provider**: OpenStreetMap Nominatim
- **Limite**: 1 requisição por segundo (respeitado automaticamente)
- **Timeout**: 10 segundos
- **Retries**: 2 tentativas em caso de timeout

### Cache
- Coordenadas geocodificadas são calculadas **dinamicamente** na API
- Não são salvas no banco de dados
- Recalculadas a cada requisição (overhead mínimo: ~50-200ms)

**💡 Otimização Futura**: Considerar cache em Redis ou salvar em campo separado

## 🐛 Troubleshooting

### Problema: Geocodificação não funciona
**Solução**:
```bash
# Verificar se geopy está instalado
pip list | grep geopy

# Reinstalar se necessário
pip install geopy==2.4.1
```

### Problema: API retorna null para approximate_latitude
**Causas possíveis**:
1. ✅ Propriedade JÁ tem coordenadas exatas (comportamento esperado)
2. ❌ Faltam informações de localização (bairro, cidade, província)
3. ❌ Nome do bairro/cidade está incorreto ou não existe no OpenStreetMap

**Solução**: Verificar e corrigir dados de localização no admin

### Problema: Mapa não aparece no frontend
**Verificar**:
1. Backend está rodando? `http://localhost:8000/api/properties/8/`
2. Frontend está rodando? `http://localhost:3000`
3. Propriedade tem dados de localização válidos?
4. Console do browser mostra erros?

## 📈 Benefícios

### Para Usuários
✅ **Sempre** veem um mapa (quando há dados mínimos de localização)
✅ Melhor experiência: mapas não ficam em branco
✅ Transparência: sabem quando é localização aproximada vs. exata

### Para Administradores
✅ Menos pressão para obter coordenadas GPS exatas
✅ Propriedades podem ser cadastradas mais rapidamente
✅ Sistema mais tolerante a dados incompletos

### Para o Negócio
✅ Menos propriedades com mapas em branco
✅ Melhor impressão profissional
✅ Maior conversão (usuários confiam mais em listings completos)

## 🔐 Considerações de Privacidade

### Coordenadas Aproximadas (Geocodificadas)
- ✅ Mostram apenas a **região geral** (bairro/cidade)
- ✅ NÃO revelam endereço exato
- ✅ Usuários podem ver a área sem comprometer privacidade
- ✅ Endereço completo só é revelado após contato com agente

### Coordenadas Exatas (Fornecidas Manualmente)
- ⚠️ Mostram localização PRECISA do imóvel
- ⚠️ Use apenas se o cliente autorizar
- ⚠️ Considere política de privacidade da imobiliária

## 🚀 Próximos Passos (Melhorias Futuras)

### 1. Cache de Geocodificação
```python
# Adicionar campo no modelo
geocoded_latitude = models.DecimalField(...)
geocoded_at = models.DateTimeField(...)
```
- Salvar coordenadas geocodificadas no banco
- Recalcular apenas se endereço mudou
- Reduzir chamadas à API externa

### 2. Geocodificação Reversa
- Permitir clicar no mapa para obter endereço
- Facilitar preenchimento de coordenadas no admin

### 3. Múltiplos Providers
- Fallback para Google Geocoding API
- Fallback para Here API
- Melhor cobertura e confiabilidade

### 4. Admin Interface
- Botão "Geocodificar Automaticamente" no admin
- Visualização prévia do mapa ao cadastrar
- Validação de coordenadas (se estão em Moçambique)

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique este documento primeiro
2. Execute os scripts de teste
3. Consulte logs do Django: `tail -f backend/logs/`
4. Consulte console do navegador (F12)

---

**Status**: ✅ Implementado e testado em 19 de Fevereiro de 2026
