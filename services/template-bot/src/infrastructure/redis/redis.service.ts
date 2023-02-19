import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

import { RedisMap } from './redis-map';
import { REDIS_TOKEN, RedisModuleOptions } from './redis.module-definition';

@Injectable()
export class RedisService {
  private readonly redisClient: Redis;

  constructor(@Inject(REDIS_TOKEN) redisOption: RedisModuleOptions) {
    this.redisClient = new Redis(redisOption);
  }

  public createMap(name: string): RedisMap {
    return new RedisMap(name, this.redisClient);
  }
}
