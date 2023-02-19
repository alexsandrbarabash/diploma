export type AppConfig = {
  APP_PORT: string;
  BOT_TOKEN: string;
  APP_REDIS_HOST: string;
  APP_REDIS_PORT: number;
  APP_REDIS_DB: number;
  APP_REDIS_USERNAME?: string;
  APP_REDIS_PASSWORD?: string;
  APP_TTL: number;
};
