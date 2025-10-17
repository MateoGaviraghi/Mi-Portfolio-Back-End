import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription(
      'API Backend para Portfolio Personal - Desarrollado con NestJS y potenciado con IA',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Endpoints de autenticación y autorización')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Projects', 'Gestión de proyectos del portfolio')
    .addTag('Reviews', 'Sistema de reseñas y testimonios')
    .addTag('Skills', 'Habilidades y tecnologías')
    .addTag('Analytics', 'Estadísticas y análisis de visitas')
    .addTag('AI Insights', 'Análisis con Inteligencia Artificial')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Portfolio API Docs',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });
}
