import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Enable CORS
  app.enableCors();
  
  // Set global prefix for REST endpoints
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3002;
  await app.listen(port, '0.0.0.0');
  console.log(`Prompt service is running on port ${port} and bound to all interfaces (0.0.0.0)`);
}
bootstrap();
