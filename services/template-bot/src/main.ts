import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { AppConfig } from '@config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService: ConfigService<AppConfig> = app.get(ConfigService);

  await app.listen(configService.get('APP_PORT'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
