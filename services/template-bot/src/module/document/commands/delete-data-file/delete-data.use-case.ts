import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';

import { DeleteDataFileCommand } from './delete-data-file.command';
import { PrismaService } from '@infrastructure/prisma';
import { NotFoundExceptions, InternalServerException } from '@common/exception';
import { StateService } from '../../../state/services';

@CommandHandler(DeleteDataFileCommand)
export class DeleteDataFileUseCase implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stateService: StateService,
  ) {}

  public async execute(
    command: DeleteDataFileCommand,
  ): Promise<Result<null, NotFoundExceptions>> {
    try {
      await this.prismaService.data.delete({
        where: {
          id: command.fileId,
        },
      });
      await this.stateService.clear(command.initiatorId);

      return Ok(null);
    } catch (error) {
      return Err(new InternalServerException('DeleteDataFileUseCase', error));
    }
  }
}
