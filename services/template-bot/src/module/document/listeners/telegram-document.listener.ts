import { Update, On, Ctx } from 'nestjs-telegraf';
import { CommandBus } from '@nestjs/cqrs';
import { match } from 'oxide.ts';

import { Context } from '@common/interfaces';
import { SaveDataCommand, FillDocxTemplateCommand } from '../commands';
import { ContentService } from '@infrastructure/content';
import { FileExtensions } from '../enums';

@Update()
export class TelegramDocumentListener {
  constructor(
    private readonly contentService: ContentService,
    private readonly commandBus: CommandBus,
  ) {}

  @On('document')
  public async documentHandler(@Ctx() ctx: Context): Promise<string | void> {
    const fileExtensions = ctx.update.message.document.file_name
      .split('.')
      .pop();

    switch (fileExtensions) {
      case FileExtensions.PPTX:
      case FileExtensions.DOCX:
        const fillTemplateByCsvCommand = new FillDocxTemplateCommand({
          userId: ctx.update.message.from.id.toString(),
          fileId: ctx.update.message.document.file_id,
          initiatorId: ctx.update.message.from.id.toString(),
        });

        const result = await this.commandBus.execute(fillTemplateByCsvCommand);

        match(result, {
          Ok: (buf: Buffer) => {
            ctx.replyWithDocument({ source: buf, filename: 'archive.zip' });
          },
          Err: () => {
            ctx.reply(this.contentService.dataNotFoundResponse());
          },
        });
        return;

      case FileExtensions.CSV:
        const saveTemplateCommand = new SaveDataCommand({
          userId: ctx.update.message.from.id.toString(),
          fileId: ctx.update.message.document.file_id,
          initiatorId: ctx.update.message.from.id.toString(),
          fileName: ctx.update.message.document.file_name,
        });

        await this.commandBus.execute(saveTemplateCommand);

        return this.contentService.saveDataResponse();
      default:
        return this.contentService.notSupportFileExtension(fileExtensions);
    }
  }
}
