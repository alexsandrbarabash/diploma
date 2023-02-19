import { Module, Global } from '@nestjs/common';

import { RedisService } from './redis.service';
import { RedisConfigurableModule } from './redis.module-definition';

@Global()
@Module({ providers: [RedisService], exports: [RedisService] })
export class RedisModule extends RedisConfigurableModule {}
