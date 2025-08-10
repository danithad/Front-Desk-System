import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend access
  app.enableCors({
    origin: 'http://localhost:3002',
    credentials: true,
  });
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Create initial data
  const authService = app.get(AuthService);
  await authService.createInitialUser();
  
  // Seed sample doctors
  const seedService = app.get(SeedService);
  await seedService.seedDoctors();
  
  await app.listen(3001);
  console.log('Front Desk System Backend running on port 3001');
}
bootstrap();
