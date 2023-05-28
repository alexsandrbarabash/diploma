import { Injectable } from '@nestjs/common';
import { Command } from '@common/ddd';

import { FileExtensions } from '@common/enums';
import { SaveDataFileCommand, SaveTemplateFileCommand } from '../commands';

@Injectable()
export class SaveFileCommandFactory {
  get({
    chatId,
    fileId,
    name,
    fileExtensions,
  }: {
    chatId: string;
    fileId: string;
    name: string;
    fileExtensions: string;
  }): Command {
    switch (fileExtensions) {
      case FileExtensions.CSV:
      case FileExtensions.XML:
      case FileExtensions.JSON:
        return new SaveDataFileCommand({
          chatId,
          fileId,
          initiatorId: chatId,
          name,
        });

      case FileExtensions.MD:
      case FileExtensions.TXT:
      case FileExtensions.PPTX:
      case FileExtensions.DOCX:
        return new SaveTemplateFileCommand({
          chatId,
          fileId,
          initiatorId: chatId,
          name,
        });
      default:
        return;
    }
  }
}
