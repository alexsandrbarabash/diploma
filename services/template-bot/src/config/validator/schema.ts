import * as joi from 'joi';

import { EnvType } from '../types';

export const configValidationSchema = joi.object<EnvType>({
  TOKEN: joi.string().required(),
  PORT: joi.string().required(),
  REDIS_HOST: joi.string().required(),
  REDIS_PORT: joi.string().regex(/^\d+$/).required(),
  REDIS_DB: joi.string().regex(/^\d+$/).required(),
  TTL: joi.string().regex(/^\d+$/).required(),
  REDIS_USERNAME: joi.string().optional(),
  REDIS_PASSWORD: joi.string().optional(),
});
