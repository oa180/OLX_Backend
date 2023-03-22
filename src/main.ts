import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RolesGuard } from './guard/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // const reflector: Reflector = new Reflector();
  // app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  await app.listen(3000);
}
bootstrap();
