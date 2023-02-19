import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TelegramDocumentListener } from './listeners';
import { TelegramApiModule } from '@infrastructure/telegram-api';
import { StateModule } from '../state/state.module';
import { SaveDataUseCase, FillDocxTemplateUseCase } from './commands';

@Module({
  imports: [TelegramApiModule, CqrsModule, StateModule],
  providers: [
    TelegramDocumentListener,
    SaveDataUseCase,
    FillDocxTemplateUseCase,
  ],
})
export class DocumentModule {}
