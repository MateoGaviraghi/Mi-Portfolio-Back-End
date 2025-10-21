# 📮 Guía de Endpoints - Postman Collection

Guía completa de todos los endpoints de la API Portfolio con ejemplos para probar en Postman.

---

## 🔑 Configuración Inicial en Postman

### 1. Variables de Entorno

Crea un Environment en Postman con estas variables:

```
BASE_URL = http://localhost:3001/api
TOKEN = (se llenará después del login)
ADMIN_EMAIL = admin@example.com
ADMIN_PASSWORD = Admin123!
```

### 2. Authorization

Para endpoints protegidos, ve a **Headers** y agrega:

```
Authorization: Bearer {{TOKEN}}
```

---

## 📦 MÓDULOS Y ENDPOINTS

### 1. 🏠 App (Health Check)

#### GET / - Health Check

```
GET {{BASE_URL}}/
```

**Response:**

```json
"Portfolio API is running!"
```

---

### 2. 🔐 Auth Module

#### POST /auth/register - Registrar Usuario

```
POST {{BASE_URL}}/auth/register
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "name": "Juan Pérez"
}
```

**Response (201):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "role": "visitor"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### POST /auth/login - Login

```
POST {{BASE_URL}}/auth/login
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "admin@example.com",
  "password": "Admin123!"
}
```

**Response (200):**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**💡 Después del login:** Copia el `accessToken` y guárdalo en la variable `{{TOKEN}}` de tu environment.

---

#### POST /auth/refresh - Refresh Token

```
POST {{BASE_URL}}/auth/refresh
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### POST /auth/logout - Logout

```
POST {{BASE_URL}}/auth/logout
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "message": "Logout successful"
}
```

---

### 3. 👥 Users Module

#### POST /users - Crear Usuario (Admin)

```
POST {{BASE_URL}}/users
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "email": "nuevo@example.com",
  "password": "Password123!",
  "name": "Nuevo Usuario",
  "role": "visitor"
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "nuevo@example.com",
  "name": "Nuevo Usuario",
  "role": "visitor",
  "createdAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### GET /users - Listar Usuarios (Admin)

```
GET {{BASE_URL}}/users
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin",
    "createdAt": "2025-10-20T10:00:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "role": "visitor",
    "createdAt": "2025-10-20T11:00:00.000Z"
  }
]
```

---

#### GET /users/:id - Obtener Usuario por ID (Admin)

```
GET {{BASE_URL}}/users/507f1f77bcf86cd799439011
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@example.com",
  "name": "Admin",
  "role": "admin",
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### PATCH /users/:id - Actualizar Usuario (Admin)

```
PATCH {{BASE_URL}}/users/507f1f77bcf86cd799439011
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "Nuevo Nombre",
  "role": "admin"
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "admin@example.com",
  "name": "Nuevo Nombre",
  "role": "admin",
  "updatedAt": "2025-10-20T12:00:00.000Z"
}
```

---

#### DELETE /users/:id - Eliminar Usuario (Admin)

```
DELETE {{BASE_URL}}/users/507f1f77bcf86cd799439011
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "message": "User deleted successfully"
}
```

---

### 4. 🚀 Projects Module

#### POST /projects - Crear Proyecto (Admin)

```
POST {{BASE_URL}}/projects
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "title": "Mi Portfolio Backend",
  "description": "API REST profesional con NestJS",
  "longDescription": "Backend completo desarrollado con NestJS, MongoDB, JWT authentication, Swagger documentation, y más...",
  "technologies": ["NestJS", "MongoDB", "TypeScript", "JWT", "Swagger"],
  "images": [],
  "videos": [],
  "githubUrl": "https://github.com/usuario/proyecto",
  "liveUrl": "https://proyecto.vercel.app",
  "category": "backend",
  "featured": true,
  "aiGenerated": {
    "percentage": 30,
    "tools": ["GitHub Copilot", "ChatGPT"],
    "description": "IA utilizada para acelerar desarrollo"
  }
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Mi Portfolio Backend",
  "description": "API REST profesional con NestJS",
  "longDescription": "Backend completo desarrollado...",
  "technologies": ["NestJS", "MongoDB", "TypeScript", "JWT", "Swagger"],
  "images": [],
  "videos": [],
  "githubUrl": "https://github.com/usuario/proyecto",
  "liveUrl": "https://proyecto.vercel.app",
  "category": "backend",
  "featured": true,
  "views": 0,
  "likes": 0,
  "aiGenerated": {
    "percentage": 30,
    "tools": ["GitHub Copilot", "ChatGPT"],
    "description": "IA utilizada para acelerar desarrollo"
  },
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### GET /projects - Listar Proyectos (Público)

```
GET {{BASE_URL}}/projects
```

**Query Params (opcionales):**

- `category` - Filtrar por categoría (web, mobile, ai, backend)
- `featured` - Solo destacados (true/false)
- `limit` - Número de resultados (default: 10)
- `page` - Página (default: 1)

**Ejemplos:**

```
GET {{BASE_URL}}/projects?featured=true
GET {{BASE_URL}}/projects?category=backend&limit=5
GET {{BASE_URL}}/projects?page=2&limit=10
```

**Response (200):**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Mi Portfolio Backend",
      "description": "API REST profesional con NestJS",
      "technologies": ["NestJS", "MongoDB", "TypeScript"],
      "images": [],
      "githubUrl": "https://github.com/usuario/proyecto",
      "liveUrl": "https://proyecto.vercel.app",
      "category": "backend",
      "featured": true,
      "views": 42,
      "likes": 8
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

#### GET /projects/search - Buscar Proyectos (Público)

```
GET {{BASE_URL}}/projects/search?q=nestjs
```

**Query Params:**

- `q` - Texto a buscar (busca en título, descripción y tecnologías)

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Mi Portfolio Backend",
    "description": "API REST profesional con NestJS",
    "technologies": ["NestJS", "MongoDB", "TypeScript"],
    "category": "backend"
  }
]
```

---

#### GET /projects/:id - Obtener Proyecto por ID (Público)

```
GET {{BASE_URL}}/projects/507f1f77bcf86cd799439013
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Mi Portfolio Backend",
  "description": "API REST profesional con NestJS",
  "longDescription": "Backend completo desarrollado...",
  "technologies": ["NestJS", "MongoDB", "TypeScript", "JWT", "Swagger"],
  "images": [],
  "videos": [],
  "githubUrl": "https://github.com/usuario/proyecto",
  "liveUrl": "https://proyecto.vercel.app",
  "category": "backend",
  "featured": true,
  "views": 43,
  "likes": 8,
  "aiGenerated": {
    "percentage": 30,
    "tools": ["GitHub Copilot", "ChatGPT"],
    "description": "IA utilizada para acelerar desarrollo"
  },
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### PATCH /projects/:id - Actualizar Proyecto (Admin)

```
PATCH {{BASE_URL}}/projects/507f1f77bcf86cd799439013
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "title": "Mi Portfolio Backend v2",
  "featured": true,
  "technologies": ["NestJS", "MongoDB", "TypeScript", "Cloudinary"]
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Mi Portfolio Backend v2",
  "technologies": ["NestJS", "MongoDB", "TypeScript", "Cloudinary"],
  "featured": true,
  "updatedAt": "2025-10-20T12:00:00.000Z"
}
```

---

#### POST /projects/:id/like - Dar Like a Proyecto (Público)

```
POST {{BASE_URL}}/projects/507f1f77bcf86cd799439013/like
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Mi Portfolio Backend",
  "likes": 9
}
```

---

#### DELETE /projects/:id - Eliminar Proyecto (Admin)

```
DELETE {{BASE_URL}}/projects/507f1f77bcf86cd799439013
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "message": "Project deleted successfully"
}
```

---

### 5. ⭐ Skills Module

#### POST /skills - Crear Skill (Admin)

```
POST {{BASE_URL}}/skills
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "name": "NestJS",
  "category": "backend",
  "level": 85,
  "icon": "nestjs-icon.svg",
  "color": "#E0234E",
  "yearsOfExperience": 2
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "NestJS",
  "category": "backend",
  "level": 85,
  "icon": "nestjs-icon.svg",
  "color": "#E0234E",
  "yearsOfExperience": 2,
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### GET /skills - Listar Skills (Público)

```
GET {{BASE_URL}}/skills
```

**Query Params (opcionales):**

- `category` - Filtrar por categoría

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "NestJS",
    "category": "backend",
    "level": 85,
    "icon": "nestjs-icon.svg",
    "color": "#E0234E",
    "yearsOfExperience": 2
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "React",
    "category": "frontend",
    "level": 90,
    "icon": "react-icon.svg",
    "color": "#61DAFB",
    "yearsOfExperience": 3
  }
]
```

---

#### GET /skills/stats - Estadísticas de Skills (Público)

```
GET {{BASE_URL}}/skills/stats
```

**Response (200):**

```json
{
  "totalSkills": 12,
  "averageLevel": 78.5,
  "byCategory": {
    "backend": 5,
    "frontend": 4,
    "database": 3
  },
  "topSkills": [
    {
      "name": "React",
      "level": 90
    },
    {
      "name": "TypeScript",
      "level": 88
    }
  ]
}
```

---

#### GET /skills/category/:category - Skills por Categoría (Público)

```
GET {{BASE_URL}}/skills/category/backend
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "NestJS",
    "level": 85,
    "yearsOfExperience": 2
  },
  {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Node.js",
    "level": 88,
    "yearsOfExperience": 3
  }
]
```

---

#### GET /skills/level/:minLevel - Skills por Nivel Mínimo (Público)

```
GET {{BASE_URL}}/skills/level/80
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "NestJS",
    "level": 85
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "React",
    "level": 90
  }
]
```

---

#### GET /skills/:id - Obtener Skill por ID (Público)

```
GET {{BASE_URL}}/skills/507f1f77bcf86cd799439014
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "NestJS",
  "category": "backend",
  "level": 85,
  "icon": "nestjs-icon.svg",
  "color": "#E0234E",
  "yearsOfExperience": 2,
  "createdAt": "2025-10-20T10:00:00.000Z",
  "updatedAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### PATCH /skills/:id - Actualizar Skill (Admin)

```
PATCH {{BASE_URL}}/skills/507f1f77bcf86cd799439014
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "level": 90,
  "yearsOfExperience": 3
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "NestJS",
  "level": 90,
  "yearsOfExperience": 3,
  "updatedAt": "2025-10-20T12:00:00.000Z"
}
```

---

#### DELETE /skills/:id - Eliminar Skill (Admin)

```
DELETE {{BASE_URL}}/skills/507f1f77bcf86cd799439014
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "message": "Skill deleted successfully"
}
```

---

### 6. 💬 Reviews Module

#### POST /reviews - Crear Review (Autenticado)

```
POST {{BASE_URL}}/reviews
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "authorName": "Juan Pérez",
  "authorPosition": "Tech Lead en Empresa XYZ",
  "content": "Excelente profesional, muy recomendado para proyectos backend con NestJS.",
  "rating": 5,
  "authorAvatar": "https://example.com/avatar.jpg",
  "projectName": "API Enterprise"
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "authorName": "Juan Pérez",
  "authorPosition": "Tech Lead en Empresa XYZ",
  "content": "Excelente profesional, muy recomendado...",
  "rating": 5,
  "status": "pending",
  "authorAvatar": "https://example.com/avatar.jpg",
  "projectName": "API Enterprise",
  "createdAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### GET /reviews - Listar Reviews Aprobados (Público)

```
GET {{BASE_URL}}/reviews
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "authorName": "Juan Pérez",
    "authorPosition": "Tech Lead en Empresa XYZ",
    "content": "Excelente profesional, muy recomendado...",
    "rating": 5,
    "status": "approved",
    "createdAt": "2025-10-20T10:00:00.000Z"
  }
]
```

---

#### GET /reviews/all - Listar Todos los Reviews (Admin)

```
GET {{BASE_URL}}/reviews/all
Authorization: Bearer {{TOKEN}}
```

**Query Params (opcionales):**

- `status` - Filtrar por estado (pending, approved, rejected)

**Response (200):**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439017",
      "authorName": "Juan Pérez",
      "content": "Excelente profesional...",
      "rating": 5,
      "status": "pending"
    },
    {
      "_id": "507f1f77bcf86cd799439018",
      "authorName": "María García",
      "content": "Gran trabajo...",
      "rating": 5,
      "status": "approved"
    }
  ],
  "total": 2
}
```

---

#### GET /reviews/stats - Estadísticas de Reviews (Público)

```
GET {{BASE_URL}}/reviews/stats
```

**Response (200):**

```json
{
  "total": 15,
  "approved": 12,
  "pending": 2,
  "rejected": 1,
  "averageRating": 4.8,
  "ratingDistribution": {
    "5": 10,
    "4": 3,
    "3": 2,
    "2": 0,
    "1": 0
  }
}
```

---

#### GET /reviews/my-reviews - Mis Reviews (Autenticado)

```
GET {{BASE_URL}}/reviews/my-reviews
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439017",
    "authorName": "Juan Pérez",
    "content": "Excelente profesional...",
    "rating": 5,
    "status": "pending",
    "createdAt": "2025-10-20T10:00:00.000Z"
  }
]
```

---

#### POST /reviews/:id/approve - Aprobar Review (Admin)

```
POST {{BASE_URL}}/reviews/507f1f77bcf86cd799439017/approve
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "status": "approved",
  "approvedAt": "2025-10-20T12:00:00.000Z",
  "approvedBy": "507f1f77bcf86cd799439011"
}
```

---

#### POST /reviews/:id/reject - Rechazar Review (Admin)

```
POST {{BASE_URL}}/reviews/507f1f77bcf86cd799439017/reject
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "status": "rejected"
}
```

---

#### GET /reviews/:id - Obtener Review por ID (Público si aprobado)

```
GET {{BASE_URL}}/reviews/507f1f77bcf86cd799439017
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "authorName": "Juan Pérez",
  "authorPosition": "Tech Lead en Empresa XYZ",
  "content": "Excelente profesional...",
  "rating": 5,
  "status": "approved",
  "createdAt": "2025-10-20T10:00:00.000Z",
  "approvedAt": "2025-10-20T12:00:00.000Z"
}
```

---

#### PATCH /reviews/:id - Actualizar Review (Propietario o Admin)

```
PATCH {{BASE_URL}}/reviews/507f1f77bcf86cd799439017
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "content": "Contenido actualizado...",
  "rating": 5
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439017",
  "content": "Contenido actualizado...",
  "rating": 5,
  "updatedAt": "2025-10-20T13:00:00.000Z"
}
```

---

#### DELETE /reviews/:id - Eliminar Review (Propietario o Admin)

```
DELETE {{BASE_URL}}/reviews/507f1f77bcf86cd799439017
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "message": "Review deleted successfully"
}
```

---

### 7. 📊 Analytics Module

#### POST /analytics/track - Trackear Evento (Público)

```
POST {{BASE_URL}}/analytics/track
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "eventType": "page_view",
  "page": "/projects",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referrer": "https://google.com",
  "country": "Argentina",
  "city": "Buenos Aires",
  "device": "desktop",
  "browser": "Chrome",
  "metadata": {
    "projectId": "507f1f77bcf86cd799439013"
  }
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439019",
  "sessionId": "sess_abc123xyz",
  "eventType": "page_view",
  "page": "/projects",
  "timestamp": "2025-10-20T10:00:00.000Z"
}
```

---

#### GET /analytics/overview - Overview de Analytics (Admin)

```
GET {{BASE_URL}}/analytics/overview
Authorization: Bearer {{TOKEN}}
```

**Query Params (opcionales):**

- `startDate` - Fecha inicio (ISO 8601)
- `endDate` - Fecha fin (ISO 8601)

**Response (200):**

```json
{
  "totalEvents": 1543,
  "uniqueVisitors": 328,
  "pageViews": 1245,
  "averageSessionDuration": 180,
  "topPages": [
    { "page": "/projects", "views": 542 },
    { "page": "/", "views": 398 }
  ],
  "topReferrers": [
    { "referrer": "google.com", "count": 156 },
    { "referrer": "direct", "count": 98 }
  ]
}
```

---

#### GET /analytics/devices - Analytics por Dispositivos (Admin)

```
GET {{BASE_URL}}/analytics/devices
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "desktop": 654,
  "mobile": 489,
  "tablet": 98,
  "browsers": {
    "Chrome": 785,
    "Firefox": 234,
    "Safari": 189,
    "Edge": 35
  }
}
```

---

#### GET /analytics/geo - Analytics Geográficos (Admin)

```
GET {{BASE_URL}}/analytics/geo
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "byCountry": [
    { "country": "Argentina", "count": 456 },
    { "country": "España", "count": 234 },
    { "country": "México", "count": 198 }
  ],
  "byCities": [
    { "city": "Buenos Aires", "count": 345 },
    { "city": "Madrid", "count": 198 }
  ]
}
```

---

#### GET /analytics/timeseries - Serie Temporal (Admin)

```
GET {{BASE_URL}}/analytics/timeseries
Authorization: Bearer {{TOKEN}}
```

**Query Params:**

- `startDate` - Fecha inicio
- `endDate` - Fecha fin
- `granularity` - hour, day, week, month

**Response (200):**

```json
{
  "data": [
    {
      "date": "2025-10-20",
      "events": 234,
      "visitors": 89
    },
    {
      "date": "2025-10-21",
      "events": 287,
      "visitors": 102
    }
  ]
}
```

---

#### GET /analytics/referrers - Top Referrers (Admin)

```
GET {{BASE_URL}}/analytics/referrers
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
[
  {
    "referrer": "google.com",
    "count": 456,
    "percentage": 34.5
  },
  {
    "referrer": "direct",
    "count": 298,
    "percentage": 22.5
  },
  {
    "referrer": "linkedin.com",
    "count": 187,
    "percentage": 14.1
  }
]
```

---

#### GET /analytics/session/:sessionId - Obtener Sesión (Admin)

```
GET {{BASE_URL}}/analytics/session/sess_abc123xyz
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "sessionId": "sess_abc123xyz",
  "startTime": "2025-10-20T10:00:00.000Z",
  "endTime": "2025-10-20T10:15:32.000Z",
  "duration": 932,
  "events": [
    {
      "eventType": "page_view",
      "page": "/",
      "timestamp": "2025-10-20T10:00:00.000Z"
    },
    {
      "eventType": "page_view",
      "page": "/projects",
      "timestamp": "2025-10-20T10:02:15.000Z"
    }
  ],
  "device": "desktop",
  "browser": "Chrome",
  "country": "Argentina"
}
```

---

### 8. 🤖 AI Insights Module

#### POST /ai-insights - Crear AI Insight (Admin)

```
POST {{BASE_URL}}/ai-insights
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "projectId": "507f1f77bcf86cd799439013",
  "title": "Generación de Schemas con IA",
  "description": "Uso de GitHub Copilot para generar schemas de Mongoose automáticamente",
  "insightType": "code_generation",
  "aiTools": ["github_copilot", "chatgpt"],
  "impactPercentage": 40,
  "codeSnippets": [
    {
      "language": "typescript",
      "code": "@Schema({ timestamps: true })\nexport class Project {\n  @Prop({ required: true })\n  title: string;\n}",
      "description": "Schema generado con Copilot"
    }
  ],
  "timeSaved": 120,
  "tags": ["automation", "productivity", "backend"],
  "metrics": {
    "linesOfCode": 150,
    "timeWithoutAI": 180,
    "timeWithAI": 60,
    "qualityScore": 9
  }
}
```

**Response (201):**

```json
{
  "_id": "507f1f77bcf86cd799439020",
  "projectId": "507f1f77bcf86cd799439013",
  "title": "Generación de Schemas con IA",
  "description": "Uso de GitHub Copilot...",
  "insightType": "code_generation",
  "aiTools": ["github_copilot", "chatgpt"],
  "impactPercentage": 40,
  "timeSaved": 120,
  "createdAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### GET /ai-insights - Listar AI Insights (Público)

```
GET {{BASE_URL}}/ai-insights
```

**Query Params (opcionales):**

- `insightType` - Filtrar por tipo
- `aiTool` - Filtrar por herramienta
- `limit` - Límite de resultados

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Generación de Schemas con IA",
    "insightType": "code_generation",
    "aiTools": ["github_copilot", "chatgpt"],
    "impactPercentage": 40,
    "timeSaved": 120
  }
]
```

---

#### GET /ai-insights/stats - Estadísticas de AI Insights (Público)

```
GET {{BASE_URL}}/ai-insights/stats
```

**Response (200):**

```json
{
  "totalInsights": 25,
  "totalTimeSaved": 3450,
  "averageImpact": 35.5,
  "byType": {
    "code_generation": 12,
    "code_optimization": 8,
    "debugging": 3,
    "testing": 2
  },
  "byTool": {
    "github_copilot": 18,
    "chatgpt": 15,
    "cursor": 5
  },
  "topProjects": [
    {
      "projectId": "507f1f77bcf86cd799439013",
      "projectTitle": "Mi Portfolio Backend",
      "insightsCount": 8,
      "totalImpact": 280
    }
  ]
}
```

---

#### GET /ai-insights/top - Top AI Insights (Público)

```
GET {{BASE_URL}}/ai-insights/top
```

**Query Params (opcionales):**

- `limit` - Número de resultados (default: 10)
- `sortBy` - impactPercentage, timeSaved (default: impactPercentage)

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Generación de Schemas con IA",
    "impactPercentage": 40,
    "timeSaved": 120,
    "aiTools": ["github_copilot"]
  },
  {
    "_id": "507f1f77bcf86cd799439021",
    "title": "Optimización de Queries",
    "impactPercentage": 35,
    "timeSaved": 90,
    "aiTools": ["chatgpt"]
  }
]
```

---

#### GET /ai-insights/project/:projectId - Insights por Proyecto (Público)

```
GET {{BASE_URL}}/ai-insights/project/507f1f77bcf86cd799439013
```

**Response (200):**

```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "title": "Generación de Schemas con IA",
    "description": "Uso de GitHub Copilot...",
    "insightType": "code_generation",
    "impactPercentage": 40,
    "timeSaved": 120
  },
  {
    "_id": "507f1f77bcf86cd799439022",
    "title": "Tests Automáticos",
    "description": "Generación de tests unitarios...",
    "insightType": "testing",
    "impactPercentage": 30,
    "timeSaved": 80
  }
]
```

---

#### GET /ai-insights/:id - Obtener AI Insight por ID (Público)

```
GET {{BASE_URL}}/ai-insights/507f1f77bcf86cd799439020
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439020",
  "projectId": "507f1f77bcf86cd799439013",
  "title": "Generación de Schemas con IA",
  "description": "Uso de GitHub Copilot para generar schemas...",
  "insightType": "code_generation",
  "aiTools": ["github_copilot", "chatgpt"],
  "impactPercentage": 40,
  "codeSnippets": [
    {
      "language": "typescript",
      "code": "@Schema({ timestamps: true })\nexport class Project {...}",
      "description": "Schema generado con Copilot"
    }
  ],
  "timeSaved": 120,
  "tags": ["automation", "productivity", "backend"],
  "metrics": {
    "linesOfCode": 150,
    "timeWithoutAI": 180,
    "timeWithAI": 60,
    "qualityScore": 9
  },
  "createdAt": "2025-10-20T10:00:00.000Z"
}
```

---

#### PATCH /ai-insights/:id - Actualizar AI Insight (Admin)

```
PATCH {{BASE_URL}}/ai-insights/507f1f77bcf86cd799439020
Authorization: Bearer {{TOKEN}}
Content-Type: application/json
```

**Body (raw JSON):**

```json
{
  "title": "Generación Mejorada de Schemas con IA",
  "impactPercentage": 45,
  "timeSaved": 150
}
```

**Response (200):**

```json
{
  "_id": "507f1f77bcf86cd799439020",
  "title": "Generación Mejorada de Schemas con IA",
  "impactPercentage": 45,
  "timeSaved": 150,
  "updatedAt": "2025-10-20T12:00:00.000Z"
}
```

---

#### DELETE /ai-insights/:id - Eliminar AI Insight (Admin)

```
DELETE {{BASE_URL}}/ai-insights/507f1f77bcf86cd799439020
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "message": "AI Insight deleted successfully"
}
```

---

### 9. 📤 Upload Module (Cloudinary)

#### POST /upload/project-image - Subir Imagen de Proyecto (Admin)

```
POST {{BASE_URL}}/upload/project-image
Authorization: Bearer {{TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**

- Key: `file` (type: File)
- Value: Selecciona tu imagen (JPG, PNG, WebP, GIF)

**Validaciones:**

- Tamaño máximo: 5MB
- Tipos permitidos: jpg, jpeg, png, webp, gif

**Response (201):**

```json
{
  "url": "http://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/abc123.jpg",
  "secureUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/portfolio/projects/abc123.jpg",
  "publicId": "portfolio/projects/abc123",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "resourceType": "image",
  "bytes": 245678,
  "thumbnail": "https://res.cloudinary.com/demo/image/upload/c_fill,h_150,w_150/portfolio/projects/abc123.jpg",
  "createdAt": "2025-10-20T10:30:00.000Z"
}
```

---

#### POST /upload/project-video - Subir Video de Proyecto (Admin)

```
POST {{BASE_URL}}/upload/project-video
Authorization: Bearer {{TOKEN}}
Content-Type: multipart/form-data
```

**Body (form-data):**

- Key: `file` (type: File)
- Value: Selecciona tu video (MP4, WebM, MOV)

**Validaciones:**

- Tamaño máximo: 50MB
- Tipos permitidos: mp4, webm, mov

**Response (201):**

```json
{
  "url": "http://res.cloudinary.com/demo/video/upload/v1234567890/portfolio/projects/video123.mp4",
  "secureUrl": "https://res.cloudinary.com/demo/video/upload/v1234567890/portfolio/projects/video123.mp4",
  "publicId": "portfolio/projects/video123",
  "width": 1920,
  "height": 1080,
  "format": "mp4",
  "resourceType": "video",
  "bytes": 5245678,
  "thumbnail": "https://res.cloudinary.com/demo/video/upload/c_fill,h_150,w_150/portfolio/projects/video123.jpg",
  "createdAt": "2025-10-20T10:30:00.000Z"
}
```

---

#### DELETE /upload/image/:publicId - Eliminar Imagen (Admin)

```
DELETE {{BASE_URL}}/upload/image/portfolio%2Fprojects%2Fabc123
Authorization: Bearer {{TOKEN}}
```

**⚠️ Importante:** El `publicId` debe estar URL-encoded.

- Original: `portfolio/projects/abc123`
- Encoded: `portfolio%2Fprojects%2Fabc123`

**Response (200):**

```json
{
  "message": "Image deleted successfully",
  "result": "ok"
}
```

---

#### DELETE /upload/video/:publicId - Eliminar Video (Admin)

```
DELETE {{BASE_URL}}/upload/video/portfolio%2Fprojects%2Fvideo123
Authorization: Bearer {{TOKEN}}
```

**Response (200):**

```json
{
  "message": "Video deleted successfully",
  "result": "ok"
}
```

---

## 🔧 Tips para Postman

### 1. Usar Variables de Entorno

Configura tu environment con:

```
BASE_URL = http://localhost:3001/api
TOKEN = (se actualiza después del login)
```

### 2. Pre-request Script para Login Automático

Si necesitas autenticación automática, agrega este script en la pestaña "Pre-request Script" de tu collection:

```javascript
// Auto login si el token no existe
if (!pm.environment.get('TOKEN')) {
  pm.sendRequest(
    {
      url: pm.environment.get('BASE_URL') + '/auth/login',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: {
        mode: 'raw',
        raw: JSON.stringify({
          email: pm.environment.get('ADMIN_EMAIL'),
          password: pm.environment.get('ADMIN_PASSWORD'),
        }),
      },
    },
    function (err, response) {
      if (!err) {
        const jsonData = response.json();
        pm.environment.set('TOKEN', jsonData.tokens.accessToken);
      }
    },
  );
}
```

### 3. Test Script para Guardar Token

En el endpoint de `/auth/login`, agrega este script en "Tests":

```javascript
if (pm.response.code === 200) {
  const jsonData = pm.response.json();
  pm.environment.set('TOKEN', jsonData.tokens.accessToken);
  console.log('Token guardado: ' + jsonData.tokens.accessToken);
}
```

### 4. Organizar Carpetas

Organiza tu collection en carpetas:

```
Portfolio API
├── Auth
├── Users
├── Projects
├── Skills
├── Reviews
├── Analytics
├── AI Insights
└── Upload
```

---

## 📚 Documentación Adicional

- **Swagger UI:** http://localhost:3001/api/docs
- **Base URL Producción:** https://tu-api.vercel.app/api
- **CORS configurado para:** localhost:3000, localhost:3017

---

## 🐛 Errores Comunes

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Solución:** Verifica que el token esté en el header `Authorization: Bearer {{TOKEN}}`

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**Solución:** El endpoint requiere rol de Admin. Verifica que tu usuario tenga `role: "admin"`

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

**Solución:** Verifica que los datos del body cumplan con las validaciones

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found"
}
```

**Solución:** Verifica que el ID del recurso existe en la BD

---

**Fecha de creación:** Octubre 20, 2025  
**Versión:** 1.0  
**Base URL:** http://localhost:3001/api
