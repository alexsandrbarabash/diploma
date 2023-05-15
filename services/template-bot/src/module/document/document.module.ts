import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { TelegramDocumentListener } from './listeners';
import { TelegramApiModule } from '@infrastructure/telegram-api';
import { StateModule } from '../state/state.module';
import {
  SaveDataUseCase,
  FillDocxTemplateUseCase,
  FillTextMarkDownTemplateUseCase,
  SaveDataFileUseCase,
  SaveTemplateFileUseCase,
} from './commands';
import {
  DataParserFactory,
  FillTemplateFactory,
  SaveFileCommandFactory,
} from './factories';
import { CsvParser } from './parsers';
import { FileQuery } from './services';

@Module({
  imports: [TelegramApiModule, CqrsModule, StateModule],
  providers: [
    FillTextMarkDownTemplateUseCase,
    TelegramDocumentListener,
    SaveDataUseCase,
    FillDocxTemplateUseCase,
    SaveTemplateFileUseCase,
    SaveDataFileUseCase,
    DataParserFactory,
    CsvParser,
    FillTemplateFactory,
    SaveFileCommandFactory,
    FileQuery,
  ],
})
export class DocumentModule {}
