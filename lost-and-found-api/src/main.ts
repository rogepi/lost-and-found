import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { AppModule } from './app.module';
import { TransformInterceptor } from './core/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';

async function bootstrap() {
  process.env.TZ = 'Asia/Shanghai';
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log'],
  });
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });

  // 设置全局前缀
  app.setGlobalPrefix('api');

  // 允许跨域
  app.enableCors();

  // 注册过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 注册拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 注册管道
  app.useGlobalPipes(new ValidationPipe());

  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(9080);
}
bootstrap();
