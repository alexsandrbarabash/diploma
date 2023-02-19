import { ConfigurableModuleBuilder } from '@nestjs/common';

export type RedisModuleOptions = {
  port?: number;
  host?: string;
  username?: string;
  password?: string;
  db?: number;
};

export const {
  ConfigurableModuleClass: RedisConfigurableModule,
  MODULE_OPTIONS_TOKEN: REDIS_TOKEN,
} = new ConfigurableModuleBuilder<RedisModuleOptions>()
  .setClassMethodName('forRoot')
  .build();
