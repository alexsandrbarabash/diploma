import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

import { FillDocxTemplateCommand } from '../commands';
import { CsvParser } from '@utils';
import { TelegramApiService } from '@infrastructure/telegram-api';
import { StateService } from '../../state/services';
import { UserStatus } from '@common/enums';
import { DataNotFoundExceptions } from '@common/exception';
import { FileNameUtils } from '@utils';

@CommandHandler(FillDocxTemplateCommand)
export class FillDocxTemplateUseCase implements ICommandHandler {
  private readonly parser: CsvParser;

  constructor(
    private readonly telegramApiService: TelegramApiService,
    private readonly stateService: StateService,
  ) {
    this.parser = new CsvParser();
  }

  async execute(
    command: FillDocxTemplateCommand,
  ): Promise<Result<Buffer, DataNotFoundExceptions>> {
    const state = await this.stateService.getCurrentState(command.userId);

    if (state?.status !== UserStatus.WAITING_TEMPLATE) {
      return Err(new DataNotFoundExceptions('Data not found'));
    }

    const csv = await this.telegramApiService.getFile(command.fileId);

    const data = this.parser.parse({
      input: csv,
      removeEmptyColumn: false,
      getOriginalRaw: false,
    });

    const template = await this.telegramApiService.getFile(state.fields.fileId);

    const zip = new PizZip();
    const templateZip = new PizZip(template);

    await Promise.all(
      data.map(async (item) => {
        const doc = new Docxtemplater(templateZip, {
          nullGetter(part) {
            return part.value;
          },
        });

        doc.render(item.record);

        const buf = doc.getZip().generate({
          type: 'nodebuffer',
          compression: 'DEFLATE',
        });

        const fileName = FileNameUtils.get(state.fields.fileName, item.record);
        zip.file(fileName, buf);
      }),
    );

    const buf = zip.generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    return Ok(buf);
  }
}
