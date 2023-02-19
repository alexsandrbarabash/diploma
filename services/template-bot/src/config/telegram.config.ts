import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegrafModuleOptions, TelegrafOptionsFactory } from 'nestjs-telegraf';

import { AppConfig } from './types';

@Injectable()
export class TelegramConfig implements TelegrafOptionsFactory {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  createTelegrafOptions(): TelegrafModuleOptions {
    return {
      token: this.configService.get('BOT_TOKEN'),
    };
  }
}
