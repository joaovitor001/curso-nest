import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { Logger } from '@nestjs/common';

//console.log(process.env.MY_VARIABLE);
//console.log(process.env.SOMETHING);

async function bootstrap() {
  const logguer = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000;
  await app.listen(3000);
  logguer.log(`Application listening on port ${port}`);
}
bootstrap();
