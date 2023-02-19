import { AppConfig } from './types';

const ENV = process.env;

export function InitAppConfig(): AppConfig {
  return {
    APP_PORT: ENV.PORT,
    BOT_TOKEN: ENV.TOKEN,
    APP_REDIS_HOST: ENV.REDIS_HOST,
    APP_REDIS_PORT: parseInt(ENV.REDIS_PORT),
    APP_REDIS_DB: parseInt(ENV.REDIS_DB),
    APP_REDIS_PASSWORD: ENV.REDIS_PASSWORD,
    APP_REDIS_USERNAME: ENV.REDIS_USERNAME,
    APP_TTL: parseInt(ENV.TTL),
  };
}
