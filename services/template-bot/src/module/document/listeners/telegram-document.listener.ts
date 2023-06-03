import { Update, On, Ctx, Command } from 'nestjs-telegraf';
import { CommandBus } from '@nestjs/cqrs';
import { match } from 'oxide.ts';
import { Tempalte, Data } from '@prisma/client';

import { ContextWithUserState } from '@common/interfaces';
import { ContentService } from '@infrastructure/content';
import { FileExtensions, UserStatus } from '@common/enums';
import { FillTemplateFactory, SaveFileCommandFactory } from '../factories';
import { StateService } from '../../state/services';
import { State, TelegrafUserId } from '@common/decorators';
import { FileQuery } from '../services';
import { DeleteDataFileCommand, DeleteTemplateFileCommand } from '../commands';

@Update()
export class TelegramDocumentListener {
  constructor(
    private readonly contentService: ContentService,
    private readonly commandBus: CommandBus,
    private readonly fillTemplateFactory: FillTemplateFactory,
    private readonly saveFileCommandFactory: SaveFileCommandFactory,
    private readonly stateService: StateService,
    private readonly fileQuery: FileQuery,
  ) {}

  @State(
    UserStatus.WAITING_TEMPLATE,
    UserStatus.WAITING_DATA,
    UserStatus.WAITING_FILE_FOR_DELETE,
  )
  @On('callback_query')
  public async onCallbackProcess(
    @Ctx() ctx: ContextWithUserState,
    @TelegrafUserId() chatId: string,
  ) {
    if (!ctx.allowState) {
      return;
    }

    const [type, entityId, action] = ctx.update.callback_query.data.split('_');

    if (action === 'delete') {
      if (type === 'data') {
        await this.commandBus.execute(
          new DeleteDataFileCommand({ fileId: entityId, initiatorId: chatId }),
        );
      } else {
        await this.commandBus.execute(
          new DeleteTemplateFileCommand({
            fileId: entityId,
            initiatorId: chatId,
          }),
        );
      }
      return 'File was delete';
    }

    let entity: Tempalte | Data;

    if (type === 'data') {
      entity = await this.fileQuery.getDataById(entityId);
    } else {
      entity = await this.fileQuery.getTemplateById(entityId);
    }

    if (!entity) {
      return this.contentService.fileNotFound();
    }

    const fileExtensions = entity.name.split('.').pop();

    const command = this.fillTemplateFactory.get({
      chatId,
      fileId: entity.fileId,
      initiatorId: chatId,
      fileName: entity.name,
      fileExtensions,
    });

    if (!command) {
      return this.contentService.notSupportFileExtension(fileExtensions);
    }

    const result = await this.commandBus.execute(command);

    if (
      fileExtensions === FileExtensions.CSV ||
      fileExtensions === FileExtensions.JSON ||
      fileExtensions === FileExtensions.XML
    ) {
      return this.contentService.saveDataResponse();
    }

    match(result, {
      Ok: (buf: Buffer) => {
        ctx.replyWithDocument({ source: buf, filename: 'archive.zip' });
      },
      Err: () => {
        ctx.reply(this.contentService.dataNotFoundResponse());
      },
    });
  }

  @Command('fill_template')
  public async startProcess(@TelegrafUserId() userId: string): Promise<string> {
    await this.stateService.setWaitingData(userId);

    return this.contentService.saveFile();
  }

  @State(UserStatus.WAITING_TEMPLATE)
  @Command('use_templates')
  public async getSavedTemplates(
    @Ctx() ctx: any,
    @TelegrafUserId() userId: string,
  ) {
    if (!ctx.allowState) {
      return;
    }

    const data = await this.fileQuery.getTemplates(userId);

    if (!data.length) {
      return this.contentService.fileNotFound();
    }

    const buttons = data.map((item) => {
      return {
        text: item.name,
        callback_data: `template_${item.id}_use`,
      };
    });

    ctx.reply('Select template file', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  }

  @State(UserStatus.WAITING_DATA)
  @Command('use_data')
  public async getSavedData(@TelegrafUserId() userId: string, @Ctx() ctx: any) {
    if (!ctx.allowState) {
      return;
    }

    const data = await this.fileQuery.getData(userId);

    if (!data.length) {
      return this.contentService.fileNotFound();
    }

    const buttons = data.map((item) => {
      return {
        text: item.name,
        callback_data: `data_${item.id}_use`,
      };
    });

    ctx.reply('Select data file', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  }

  @Command('delete_template')
  public async deletetemplate(
    @TelegrafUserId() userId: string,
    @Ctx() ctx: any,
  ) {
    const data = await this.fileQuery.getTemplates(userId);

    if (!data.length) {
      return this.contentService.fileNotFound();
    }

    const buttons = data.map((item) => {
      return {
        text: item.name,
        callback_data: `template_${item.id}_delete`,
      };
    });

    await this.stateService.setWaitingFileForDelete(userId);

    ctx.reply('Delete template file', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  }

  @Command('delete_data')
  public async deleteData(@TelegrafUserId() userId: string, @Ctx() ctx: any) {
    const data = await this.fileQuery.getData(userId);

    if (!data.length) {
      return this.contentService.fileNotFound();
    }

    const buttons = data.map((item) => {
      return {
        text: item.name,
        callback_data: `data_${item.id}_delete`,
      };
    });

    await this.stateService.setWaitingFileForDelete(userId);

    ctx.reply('Delete data file', {
      reply_markup: {
        inline_keyboard: [buttons],
      },
    });
  }

  @Command('save_file')
  public async saveData(@TelegrafUserId() userId: string): Promise<string> {
    await this.stateService.setWaitingFileForSave(userId);
    return this.contentService.sendFile();
  }

  @On('document')
  @State(
    UserStatus.WAITING_TEMPLATE,
    UserStatus.WAITING_DATA,
    UserStatus.WAITING_FILE_FOR_SAVE,
  )
  public async documentHandler(
    @Ctx() ctx: ContextWithUserState,
    @TelegrafUserId() chatId: string,
  ) {
    if (!ctx.allowState) {
      return;
    }

    const fileExtensions = ctx.update.message.document.file_name
      .split('.')
      .pop();

    if (ctx.userState === UserStatus.WAITING_FILE_FOR_SAVE) {
      const command = this.saveFileCommandFactory.get({
        chatId,
        fileId: ctx.update.message.document.file_id,
        name: ctx.update.message.document.file_name,
        fileExtensions,
      });

      if (!command) {
        return this.contentService.notSupportFileExtension(fileExtensions);
      }

      const result = await this.commandBus.execute(command);

      return match(result, {
        Ok: () => {
          ctx.reply(this.contentService.fileWasSaved());
        },
        Err: () => {
          ctx.reply(this.contentService.serverError());
        },
      });
    }

    const command = this.fillTemplateFactory.get({
      chatId,
      fileId: ctx.update.message.document.file_id,
      initiatorId: chatId,
      fileName: ctx.update.message.document.file_name,
      fileExtensions,
    });

    if (!command) {
      return this.contentService.notSupportFileExtension(fileExtensions);
    }

    const result = await this.commandBus.execute(command);

    if (
      fileExtensions === FileExtensions.CSV ||
      fileExtensions === FileExtensions.JSON ||
      fileExtensions === FileExtensions.XML
    ) {
      return this.contentService.saveDataResponse();
    }

    match(result, {
      Ok: (buf: Buffer) => {
        ctx.replyWithDocument({ source: buf, filename: 'archive.zip' });
      },
      Err: () => {
        ctx.reply(this.contentService.dataNotFoundResponse());
      },
    });
  }
}
