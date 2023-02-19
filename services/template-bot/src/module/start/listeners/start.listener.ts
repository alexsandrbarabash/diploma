import { Update, Start, Ctx } from 'nestjs-telegraf';

import { ContentService } from '@infrastructure/content/services';
import { Context } from '@common/interfaces';

@Update()
export class StartListener {
  constructor(private readonly contentService: ContentService) {}

  @Start()
  public start(@Ctx() ctx: Context): string {
    const firstName = ctx.update.message.from.first_name;

    return this.contentService.getStartMessage(firstName);
  }
}
