import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';

import { SaveDataFileCommand } from './save-data-file.command';
import { PrismaService } from '@infrastructure/prisma';
import { NotFoundExceptions, InternalServerException } from '@common/exception';
import { StateService } from '../../../state/services';

@CommandHandler(SaveDataFileCommand)
export class SaveDataFileUseCase implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stateService: StateService,
  ) {}

  public async execute(
    command: SaveDataFileCommand,
  ): Promise<Result<null, NotFoundExceptions>> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { chatId: command.chatId },
      });

      if (!user) {
        return Err(new NotFoundExceptions('User not found'));
      }

      await this.prismaService.data.create({
        data: {
          userId: user.id,
          fileId: command.fileId,
          name: command.name,
        },
      });

      await this.stateService.clear(command.chatId);

      return Ok(null);
    } catch (error) {
      return Err(new InternalServerException('SaveDataFileUseCase', error));
    }
  }
}
