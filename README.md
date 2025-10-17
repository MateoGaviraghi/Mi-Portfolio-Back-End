# 🚀 Portfolio Backend API

Backend profesional para portfolio personal desarrollado con **NestJS**, **MongoDB** y **TypeScript**.  
Incluye autenticación JWT, documentación con Swagger y features potenciadas con IA.

## 📋 Tabla de Contenidos

- [Stack Tecnológico](#-stack-tecnológico)
- [Características](#-características)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Ejecución](#-ejecución)
- [Documentación API](#-documentación-api)
- [Deploy](#-deploy)

## 🛠️ Stack Tecnológico

- **Node.js** v18+
- **NestJS** v10
- **TypeScript** v5
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **Swagger** para documentación
- **Class Validator** para validaciones
- **Helmet** para seguridad
- **Throttler** para rate limiting

## ✨ Características

### Core Features

- 🔐 **Autenticación JWT** con refresh tokens
- 👥 **Gestión de usuarios** con roles (Admin/Visitor)
- 📁 **CRUD de proyectos** con información detallada
- ⭐ **Sistema de reseñas** y testimonios
- 🎯 **Skills y tecnologías** categorizadas
- 📊 **Analytics** de visitas y estadísticas

### Features Especiales

- 🤖 **AI Insights** - Análisis de código con IA
- 📈 **Tracking de código generado con IA** por proyecto
- 🔒 **Rate Limiting** para protección contra abuso
- 📚 **Documentación Swagger** interactiva
- 🛡️ **Seguridad** con Helmet y validaciones estrictas

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MateoGaviraghi/Mi-Portfolio-Back-End.git

# Instalar dependencias
npm install
```

## ⚙️ Configuración

1. **Crear archivo `.env`** basado en `.env.example`:

```bash
cp .env.example .env
```

2. **Configurar variables de entorno**:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

3. **Configurar MongoDB**:
   - Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Crear un cluster gratuito
   - Obtener la URI de conexión
   - Agregar tu IP a la whitelist

## 🏃 Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test

# E2E tests
npm run test:e2e
```

La aplicación estará disponible en:

- **API**: http://localhost:3001/api
- **Swagger Docs**: http://localhost:3001/api/docs

## 📚 Documentación API

Una vez iniciada la aplicación, visita:

**http://localhost:3001/api/docs**

Swagger UI te permitirá:

- Ver todos los endpoints disponibles
- Probar requests directamente
- Ver esquemas de datos
- Autenticarte con JWT

### Endpoints Principales

#### Auth

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token

#### Projects

- `GET /api/projects` - Listar proyectos
- `GET /api/projects/:id` - Ver detalle
- `POST /api/projects` - Crear (Admin)
- `PUT /api/projects/:id` - Actualizar (Admin)
- `DELETE /api/projects/:id` - Eliminar (Admin)

#### Reviews

- `GET /api/reviews` - Listar reseñas
- `POST /api/reviews` - Crear reseña (Auth)

## 🌐 Deploy

### Vercel (Recomendado)

1. **Instalar Vercel CLI**:

```bash
npm i -g vercel
```

2. **Deploy**:

```bash
vercel
```

3. **Configurar variables de entorno** en Vercel Dashboard

## 📁 Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación
├── users/             # Gestión de usuarios
├── projects/          # Proyectos del portfolio
├── reviews/           # Sistema de reseñas
├── skills/            # Habilidades técnicas
├── analytics/         # Estadísticas
├── ai-insights/       # Features con IA
├── common/            # Utilidades compartidas
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
├── config/            # Configuraciones
└── main.ts           # Punto de entrada
```

## 👨‍💻 Autor

**Mateo Gaviraghi**

- GitHub: [@MateoGaviraghi](https://github.com/MateoGaviraghi)

---

⚡ **Desarrollado con NestJS y potenciado con IA** 🤖

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
