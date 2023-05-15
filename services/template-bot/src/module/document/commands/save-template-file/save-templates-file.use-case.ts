import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';

import { SaveTemplateFileCommand } from './save-templates-file.command';
import { PrismaService } from '@infrastructure/prisma';
import { NotFoundExceptions, InternalServerException } from '@common/exception';
import { StateService } from '../../../state/services';

@CommandHandler(SaveTemplateFileCommand)
export class SaveTemplateFileUseCase implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stateService: StateService,
  ) {}

  async execute(
    command: SaveTemplateFileCommand,
  ): Promise<Result<null, NotFoundExceptions | InternalServerException>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { chatId: command.chatId },
      });

      if (!user) {
        return Err(new NotFoundExceptions('User not found'));
      }

      await this.prismaService.tempalte.create({
        data: {
          userId: user.id,
          fileId: command.fileId,
          name: command.name,
        },
      });

      await this.stateService.clear(command.chatId);

      return Ok(null);
    } catch (error) {
      return Err(new InternalServerException('SaveTemplateFileUseCase', error));
    }
  }
}
