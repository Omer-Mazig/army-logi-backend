import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure CORS for production
  // app.enableCors({
  //   origin: [
  //     'http://localhost:5173', // Vite dev server
  //     'http://localhost:3000', // Local testing
  //     process.env.FRONTEND_URL, // Production frontend URL
  //   ].filter(Boolean), // Remove undefined values
  //   credentials: true,
  //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  // });

  app.enableCors();

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
