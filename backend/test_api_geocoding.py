"""
Testar API para verificar se os campos de geocodificação estão sendo retornados corretamente
"""
import requests
import json

API_URL = "http://localhost:8000/api"

def test_property_api():
    """Testa a API de propriedades"""
    print("=== TESTE DA API - GEOCODIFICAÇÃO ===\n")
    
    # Testar propriedade recém-criada (ID 8)
    property_id = 8
    
    try:
        print(f"📡 Fazendo requisição para: {API_URL}/properties/{property_id}/")
        response = requests.get(f"{API_URL}/properties/{property_id}/", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"\n✅ Resposta da API (Status {response.status_code}):\n")
            
            # Campos de localização
            print(f"📍 Localização:")
            print(f"   Título: {data.get('title')}")
            print(f"   Bairro: {data.get('neighborhood')}")
            print(f"   Cidade: {data.get('city')}")
            print(f"   Província: {data.get('province')}")
            
            # Coordenadas exatas
            print(f"\n🎯 Coordenadas Exatas:")
            print(f"   Latitude: {data.get('latitude')}")
            print(f"   Longitude: {data.get('longitude')}")
            
            # Coordenadas aproximadas (novos campos!)
            print(f"\n📍 Coordenadas Aproximadas (Geocodificação):")
            print(f"   approximate_latitude: {data.get('approximate_latitude')}")
            print(f"   approximate_longitude: {data.get('approximate_longitude')}")
            print(f"   is_approximate_location: {data.get('is_approximate_location')}")
            
            if data.get('is_approximate_location'):
                lat = data.get('approximate_latitude')
                lon = data.get('approximate_longitude')
                print(f"\n   ✅ Localização aproximada disponível!")
                print(f"   🗺️  Ver no mapa: https://www.openstreetmap.org/?mlat={lat}&mlon={lon}#map=14/{lat}/{lon}")
            elif data.get('latitude') and data.get('longitude'):
                print(f"\n   ℹ️  Usando coordenadas exatas fornecidas manualmente")
            else:
                print(f"\n   ❌ Nenhuma coordenada disponível")
            
        else:
            print(f"❌ Erro na API: Status {response.status_code}")
            print(f"   Resposta: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"❌ Erro: Não foi possível conectar ao servidor em {API_URL}")
        print(f"   Certifique-se de que o backend Django está rodando!")
        print(f"   Execute: cd backend && python manage.py runserver")
    except Exception as e:
        print(f"❌ Erro: {e}")

if __name__ == '__main__':
    test_property_api()
