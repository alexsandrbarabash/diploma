import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

import { FillDocxTemplateCommand } from './fill-docx-template.command';
import { TelegramApiService } from '@infrastructure/telegram-api';
import { StateService } from '../../state/services';
import { UserStatus } from '@common/enums';
import { NotFoundExceptions } from '@common/exception';
import { FileNameUtils, FileExceptionsUtils } from '@utils';
import { DataParserFactory } from '../factories';

@CommandHandler(FillDocxTemplateCommand)
export class FillDocxTemplateUseCase implements ICommandHandler {
  constructor(
    private readonly telegramApiService: TelegramApiService,
    private readonly stateService: StateService,
    private readonly dataParserFactory: DataParserFactory,
  ) {}

  async execute(
    command: FillDocxTemplateCommand,
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
    const templateZip = new PizZip(template);

    await Promise.all(
      data.map(async (item) => {
        const doc = new Docxtemplater(templateZip, {
          nullGetter(part) {
            return part.value;
          },
        });

        doc.render(item);

        const buf = doc.getZip().generate({
          type: 'nodebuffer',
          compression: 'DEFLATE',
        });

        const fileName = FileNameUtils.get(command.fileName, item);
        zip.file(fileName, buf);
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
