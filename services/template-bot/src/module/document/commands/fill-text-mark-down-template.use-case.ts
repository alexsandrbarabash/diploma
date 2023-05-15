import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';
import PizZip from 'pizzip';
import format from 'string-template';

import { TextMarkDownTemplate } from './text-mark-down-template.command';
import { TelegramApiService } from '@infrastructure/telegram-api';
import { StateService } from '../../state/services';
import { UserStatus } from '@common/enums';
import { NotFoundExceptions } from '@common/exception';
import { FileNameUtils, FileExceptionsUtils } from '@utils';
import { DataParserFactory } from '../factories';

@CommandHandler(TextMarkDownTemplate)
export class FillTextMarkDownTemplateUseCase implements ICommandHandler {
  constructor(
    private readonly telegramApiService: TelegramApiService,
    private readonly stateService: StateService,
    private readonly dataParserFactory: DataParserFactory,
  ) {}

  async execute(
    command: TextMarkDownTemplate,
  ): Promise<Result<Buffer | null, NotFoundExceptions>> {
    const state = await this.stateService.getCurrent(command.chatId);

    if (state?.status !== UserStatus.WAITING_TEMPLATE) {
      return Err(new NotFoundExceptions('Data not found'));
    }

    const parser = this.dataParserFactory.get(
      FileExceptionsUtils.get(state.fields.fileName),
    );

    const input = await this.telegramApiService.getFile(state.fields.fileId);

    const data = parser.parse(input);

    const template = await this.telegramApiService.getFile(command.fileId);

    const zip = new PizZip();
    const templateStr = template.toString();

    await Promise.all(
      data.map(async (item) => {
        const content = format(templateStr, item);

        const buff = Buffer.from(content, 'utf-8');

        const fileName = FileNameUtils.get(command.fileName, item);
        zip.file(fileName, buff);
      }),
    );

    const buf = zip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    await this.stateService.clear(command.chatId);

    return Ok(buf);
  }
}
