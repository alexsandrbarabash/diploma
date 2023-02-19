import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';

import {
  InitAppConfig,
  configValidationSchema,
  TelegramConfig,
  RedisConfig,
} from '@config';
import { StartModule, DocumentModule, StateModule } from '@module';
import { RedisModule } from '@infrastructure/redis';
import { ContentModule } from '@infrastructure/content';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [InitAppConfig],
      validationSchema: configValidationSchema,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TelegramConfig,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfig,
    }),
    StartModule,
    DocumentModule,
    ContentModule,
    StateModule,
  ],
})
export class AppModule {}
