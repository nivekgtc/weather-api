import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nMiddleware } from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(I18nMiddleware);

  const config = new DocumentBuilder()
    .setTitle('Weather API')
    .setDescription(
      'The Weather API allows you to retrieve forecast data for any location in the world.',
    )
    .setVersion('1.0')
    .addTag('weather')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
