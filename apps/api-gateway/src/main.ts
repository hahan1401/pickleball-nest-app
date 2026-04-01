import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { HttpExceptionFilter, ResponseMappingInterceptor } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseMappingInterceptor());

  app.setGlobalPrefix('/api');

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
