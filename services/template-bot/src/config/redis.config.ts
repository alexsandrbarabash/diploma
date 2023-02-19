import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisModuleOptions } from '@infrastructure/redis';
import { AppConfig } from './types';

@Injectable()
export class RedisConfig {
  constructor(private readonly configService: ConfigService<AppConfig>) {}

  public create(): RedisModuleOptions {
    return {
      port: this.configService.get('APP_REDIS_PORT'),
      host: this.configService.get('APP_REDIS_HOST'),
      db: this.configService.get('APP_REDIS_DB'),
    };
  }
}
