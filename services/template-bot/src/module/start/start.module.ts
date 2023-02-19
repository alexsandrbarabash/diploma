import { Module } from '@nestjs/common';

import { StartListener } from './listeners';

@Module({ providers: [StartListener] })
export class StartModule {}
