import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@app/common/exception-filters/http-exception.filter';
import { ResponseMappingInterceptor } from '@app/common/interceptors/response-mapping.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseMappingInterceptor());

  await app.listen(parseInt(process.env.PORT || '3000'));
}
bootstrap();
