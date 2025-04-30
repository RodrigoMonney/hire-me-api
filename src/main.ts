import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/infrastructure/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter(configService));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hire.me API')
    .setDescription('Documentação da API da aplicação de usuários')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);

  const port = configService.get<string>('PORT') ?? '3000';
  const environment = configService.get<string>('NODE_ENV');

  if (environment === 'development') {
    app.enableCors({ origin: '*' });
  }

  await app.listen(port);
}

void bootstrap();
