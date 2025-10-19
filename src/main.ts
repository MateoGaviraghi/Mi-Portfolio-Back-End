import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Global prefix
  app.setGlobalPrefix('api');

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: configService.get<string>('cors.origin'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger documentation
  setupSwagger(app);

  await app.init();

  const port = configService.get<number>('port') || 3001;
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';

  // Solo listen si no es Vercel
  if (process.env.VERCEL !== '1') {
    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
    logger.log(
      `📚 Swagger docs available at: http://localhost:${port}/api/docs`,
    );
    logger.log(`🌍 Environment: ${nodeEnv}`);
  }

  return app;
}

// Para desarrollo local
if (require.main === module) {
  bootstrap().catch((error) => {
    console.error('❌ Error starting application:', error);
    process.exit(1);
  });
}

// Para Vercel (serverless)
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
