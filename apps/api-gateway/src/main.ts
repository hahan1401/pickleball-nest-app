import { HttpExceptionFilter, ResponseMappingInterceptor } from '@app/common';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const logger = new Logger('ApiGateway');
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'Api Gateway',
    }),
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseMappingInterceptor());

  app.setGlobalPrefix('/api');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Pickleball API')
    .setDescription('Pickleball application API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Gateway is listening on port ${port}`);
  logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
}
bootstrap();
