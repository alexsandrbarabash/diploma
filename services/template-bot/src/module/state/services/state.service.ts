import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisMap, RedisService } from '@infrastructure/redis';
import { RedisCollections, UserStatus } from '@common/enums';
import { CacheData } from '@common/types';
import { RedisExceptions } from '@common/exception';
import { AppConfig } from '@config';

@Injectable()
export class StateService {
  private readonly map: RedisMap;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService<AppConfig>,
  ) {
    this.map = redis.createMap(RedisCollections.STATE);
  }

  async setWaitingTemplateState(
    userId: string,
    fileId: string,
    fileName: string,
  ): Promise<CacheData> {
    const value: CacheData = {
      status: UserStatus.WAITING_TEMPLATE,
      fields: { fileId, userId, fileName },
    };

    await this.map.set(
      userId,
      JSON.stringify(value),
      this.configService.get('APP_TTL'),
    );

    return value;
  }

  async getStatus(
    userId,
    options?: { throwError?: boolean },
  ): Promise<UserStatus | undefined> {
    const value = await this.map.get(userId);
    if (options?.throwError && !value) {
      throw new RedisExceptions(`User not found by id ${userId}`);
    }

    if (!value) {
      return;
    }

    const cache: CacheData = JSON.parse(value);
    return cache.status;
  }

  async getCurrentState(
    userId: string,
    options?: { throwError?: boolean },
  ): Promise<CacheData | undefined> {
    const value = await this.map.get(userId);
    if (options?.throwError && !value) {
      throw new RedisExceptions(`User not found by id ${userId}`);
    }

    if (!value) {
      return;
    }

    const cache: CacheData = JSON.parse(value);
    return cache;
  }
}
