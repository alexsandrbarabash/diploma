import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Ok, Err, Result } from 'oxide.ts';

import { DeleteTemplateFileCommand } from './delete-template.command';
import { PrismaService } from '@infrastructure/prisma';
import { NotFoundExceptions, InternalServerException } from '@common/exception';
import { StateService } from '../../../state/services';

@CommandHandler(DeleteTemplateFileCommand)
export class DeleteTemplateFileUseCase implements ICommandHandler {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stateService: StateService,
  ) {}

  public async execute(
    command: DeleteTemplateFileCommand,
  ): Promise<Result<null, NotFoundExceptions>> {
    try {
      await this.prismaService.tempalte.delete({
        where: {
          id: command.fileId,
        },
      });
      await this.stateService.clear(command.initiatorId);

      return Ok(null);
    } catch (error) {
      return Err(
        new InternalServerException('DeleteTemplateFileUseCase', error),
      );
    }
  }
}
