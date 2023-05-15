import { Update, Start, Ctx, Help } from 'nestjs-telegraf';

import { ContentService } from '@infrastructure/content/services';
import { Context } from '@common/interfaces';
import { PrismaService } from '@infrastructure/prisma';

@Update()
export class StartListener {
  constructor(
    private readonly contentService: ContentService,
    private readonly prismaService: PrismaService,
  ) {}

  @Help()
  @Start()
  public async start(@Ctx() ctx: Context): Promise<string> {
    const firstName = ctx.update.message.from.first_name;

    await this.prismaService.user.upsert({
      where: { chatId: ctx.update.message.chat.id.toString() },
      update: {
        username: ctx.update.message.chat.username,
        firstName: ctx.update.message.chat.first_name,
      },
      create: {
        chatId: ctx.update.message.chat.id.toString(),
        username: ctx.update.message.chat.username,
        firstName: ctx.update.message.chat.first_name,
      },
    });

    return this.contentService.getStartMessage(firstName);
  }
}
