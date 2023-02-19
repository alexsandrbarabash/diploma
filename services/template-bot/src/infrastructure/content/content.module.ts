import { Module, Global } from '@nestjs/common';

import { ContentService } from './services';

@Global()
@Module({ providers: [ContentService], exports: [ContentService] })
export class ContentModule {}
