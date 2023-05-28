import { Injectable } from '@nestjs/common';
import { Command } from '@common/ddd';

import { FileExtensions } from '@common/enums';
import {
  SaveDataCommand,
  FillDocxTemplateCommand,
  TextMarkDownTemplate,
} from '../commands';

@Injectable()
export class FillTemplateFactory {
  get({
    chatId,
    fileId,
    initiatorId,
    fileName,
    fileExtensions,
  }: {
    chatId: string;
    fileId: string;
    initiatorId: string;
    fileName: string;
    fileExtensions: string;
  }): Command {
    switch (fileExtensions) {
      case FileExtensions.CSV:
      case FileExtensions.JSON:
        return new SaveDataCommand({
          chatId,
          fileId,
          initiatorId,
          fileName,
        });

      case FileExtensions.MD:
      case FileExtensions.TXT:
        return new TextMarkDownTemplate({
          chatId,
          fileId,
          initiatorId,
          fileName,
        });

      case FileExtensions.PPTX:
      case FileExtensions.DOCX:
        return new FillDocxTemplateCommand({
          chatId,
          fileId,
          initiatorId,
          fileName,
        });
      default:
        return;
    }
  }
}
