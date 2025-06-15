/* eslint-disable @typescript-eslint/no-require-imports */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL, // Your production frontend URL
      // Add any other domains you need
    ], // Remove undefined values
    credentials: true, // This is ESSENTIAL for cookies
  });
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Streamify')
    .setVersion('1.0')
    .addCookieAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      withCredentials: true, // ✅ Sends cookies
    },
  });
  const port = process.env.PORT ?? 3001;

  await app.listen(port, () => {
    console.log('Listening in port: ', port);
  });
}
bootstrap();
