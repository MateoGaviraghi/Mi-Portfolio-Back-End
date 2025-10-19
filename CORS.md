# 🔒 Configuración CORS

Este documento explica cómo configurar CORS (Cross-Origin Resource Sharing) para tu aplicación.

## ¿Qué es CORS?

CORS es una medida de seguridad que controla qué dominios externos pueden hacer peticiones a tu API.

## Configuración

### Variables de Entorno

La configuración CORS se controla mediante la variable `FRONTEND_URLS`:

```env
# Múltiples URLs separadas por coma
FRONTEND_URLS=http://localhost:3017,https://mi-portfolio.vercel.app
```

### Desarrollo Local

Por defecto, la API permite conexiones desde:
- `http://localhost:3000`
- `http://localhost:3017`

### Producción (Vercel)

1. Ve a tu proyecto en Vercel Dashboard
2. Settings → Environment Variables
3. Agrega o edita la variable `FRONTEND_URLS`

**Ejemplo para producción:**
```
FRONTEND_URLS=https://mi-portfolio.vercel.app,https://www.mi-portfolio.com,http://localhost:3017
```

## Headers Permitidos

La API acepta los siguientes headers:
- `Content-Type`
- `Authorization`
- `Accept`

## Métodos HTTP Permitidos

- `GET`
- `POST`
- `PUT`
- `PATCH`
- `DELETE`
- `OPTIONS`

## Credenciales

Las cookies y headers de autenticación están habilitados (`credentials: true`).

## Troubleshooting

### Error: "blocked by CORS policy"

**Causa:** Tu frontend está intentando conectarse desde un origen no permitido.

**Solución:**
1. Verifica que la URL de tu frontend esté en `FRONTEND_URLS`
2. Asegúrate de incluir el protocolo (`http://` o `https://`)
3. No incluyas trailing slash (`/`) al final de la URL
4. En desarrollo, verifica que el puerto coincida

### Error: "Access-Control-Allow-Credentials"

**Causa:** Tu frontend está enviando cookies/headers pero CORS no está configurado correctamente.

**Solución:**
1. Asegúrate de tener `credentials: true` en tu configuración de fetch/axios
2. Verifica que el origen esté en la lista permitida

## Ejemplo de Uso desde el Frontend

### Con Fetch (Vanilla JS)

```javascript
fetch('https://tu-api.vercel.app/api/projects', {
  method: 'GET',
  credentials: 'include', // Importante para cookies
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
```

### Con Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tu-api.vercel.app/api',
  withCredentials: true, // Importante para cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Usar en tus requests
api.get('/projects');
api.post('/auth/login', { email, password });
```

### Con React + Axios

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## Seguridad

⚠️ **Importante:**
- **NUNCA** uses `*` (wildcard) en producción
- Solo agrega dominios que tú controlas
- Revisa periódicamente la lista de orígenes permitidos
- En producción, usa HTTPS (no HTTP)

## Logs

Si un origen es bloqueado, verás un warning en los logs:

```
[Bootstrap] WARN CORS blocked request from origin: https://malicious-site.com
```

Esto es normal y significa que la seguridad CORS está funcionando correctamente.
