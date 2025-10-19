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

  // Pre-flight checks: ensure required env vars are present and valid.
  const mongodbUri = configService.get<string>('database.uri');
  if (!mongodbUri || mongodbUri.trim() === '') {
    // Throw early with a helpful error so serverless platforms show a clear cause
    throw new Error(
      'Missing required environment variable MONGODB_URI (database.uri). Please set it in your environment or in Vercel Project Settings.',
    );
  }
  // Basic sanity check for connection string form
  if (!mongodbUri.startsWith('mongodb')) {
    throw new Error(
      'The MONGODB_URI does not look like a valid MongoDB connection string. Make sure it starts with "mongodb+srv://" or "mongodb://".',
    );
  }

  // Global prefix
  app.setGlobalPrefix('api');

  // Security
  app.use(helmet());

  // CORS - Permitir múltiples orígenes
  const allowedOrigins = configService.get<string[]>('cors.origins') || [
    'http://localhost:3000',
    'http://localhost:3017',
  ];

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Permitir requests sin origin (mobile apps, curl, etc)
      if (!origin) {
        callback(null, true);
        return;
      }

      // Verificar si el origin está en la lista permitida
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    maxAge: 86400, // 24 horas de cache para preflight requests
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
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
