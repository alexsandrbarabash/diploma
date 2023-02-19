import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TelegramApiService } from './telegram-api.service';

@Module({
  imports: [ConfigModule],
  providers: [TelegramApiService],
  exports: [TelegramApiService],
})
export class TelegramApiModule {}
