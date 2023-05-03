import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
const express = require('express');

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('WholeSale App')
    .setDescription('WholeSale App')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  const port = process.env.PORT;

  //Start of Image Routes
  app.use(
    '/banner-image',
    express.static(join(__dirname, '..', 'images/banner-image'))
  );
  app.use(
    '/blog-image',
    express.static(join(__dirname, '..', 'images/blog-image'))
  );
  app.use(
    '/brand-image',
    express.static(join(__dirname, '..', 'images/brand-image'))
  );
  app.use(
    '/category-image',
    express.static(join(__dirname, '..', 'images/category-image'))
  );
  app.use(
    '/user-image',
    express.static(join(__dirname, '..', 'images/user-image'))
  );
  app.use(
    '/region-image',
    express.static(join(__dirname, '..', 'images/region-image'))
  );
  app.use(
    '/trade-image',
    express.static(join(__dirname, '..', 'images/trade-image'))
  );
  app.use(
    '/section-image',
    express.static(join(__dirname, '..', 'images/section-image'))
  );
  app.use(
    '/sub-section-image',
    express.static(join(__dirname, '..', 'images/sub-section-image'))
  );

  //End of Images Routes

  //Connection to Server
  await app.listen(port, () => {
    console.log(`server is running on port = ${port}`);
  });
}
bootstrap();
