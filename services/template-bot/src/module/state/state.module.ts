import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StateService } from './services';

@Module({
  imports: [ConfigModule],
  providers: [StateService],
  exports: [StateService],
})
export class StateModule {}
