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

  async setWaitingTemplate(
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

  async setWaitingFile(
    userId: string,
    type: 'template' | 'data',
  ): Promise<CacheData> {
    const value: CacheData = {
      status: UserStatus.WAITING_FILE,
      fields: { type },
    };

    await this.map.set(
      userId,
      JSON.stringify(value),
      this.configService.get('APP_TTL'),
    );

    return value;
  }

  async setWaitingData(userId: string): Promise<CacheData> {
    const value: CacheData = {
      status: UserStatus.WAITING_DATA,
    };

    await this.map.set(
      userId,
      JSON.stringify(value),
      this.configService.get('APP_TTL'),
    );

    return value;
  }

  async setWaitingFileForSave(userId: string): Promise<CacheData> {
    const value: CacheData = {
      status: UserStatus.WAITING_FILE_FOR_SAVE,
    };

    await this.map.set(
      userId,
      JSON.stringify(value),
      this.configService.get('APP_TTL'),
    );

    return value;
  }

  async setWaitingFileForDelete(userId: string): Promise<CacheData> {
    const value: CacheData = {
      status: UserStatus.WAITING_FILE_FOR_DELETE,
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

  async getCurrent(
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

  async clear(userId: string): Promise<void> {
    await this.map.delete(userId);
  }
}
