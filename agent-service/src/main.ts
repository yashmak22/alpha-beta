import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Get, Controller } from '@nestjs/common';
import { AppModule } from './app.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

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
  
  // Set global prefix for REST endpoints except health check
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });
  
  // Register the health check endpoint
  const healthCheck = app.getHttpAdapter().getInstance();
  healthCheck.use('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Agent service is running on port ${port} and bound to all interfaces (0.0.0.0)`);
}
bootstrap();
