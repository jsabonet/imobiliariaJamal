# Limpar Service Worker - Cache Antigo

O Service Worker pode estar em cache com o código antigo das URLs.

## Faça o seguinte no navegador:

1. **Abra DevTools:** `F12`

2. **Vá para Application tab** (ou Aplicação)

3. **Service Workers** (menu lateral esquerdo)

4. **Clique em "Unregister"** ao lado de `http://localhost:3000`

5. **Recarregue a página:** `Ctrl + Shift + R`

6. **Teste as notificações novamente**

## OU via Console:

Cole e execute no Console do navegador (F12 → Console):

```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  for(let registration of registrations) {
    registration.unregister();
    console.log('SW desregistrado:', registration.scope);
  }
  console.log('✅ Todos os Service Workers removidos! Recarregue a página.');
});
```

Depois: `Ctrl + Shift + R`
