import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SaveDataCommand } from '.';
import { StateService } from '../../state/services';

@CommandHandler(SaveDataCommand)
export class SaveDataUseCase implements ICommandHandler {
  constructor(private readonly stateService: StateService) {}

  async execute(command: SaveDataCommand): Promise<void> {
    await this.stateService.setWaitingTemplateState(
      command.userId,
      command.fileId,
      command.fileName,
    );
  }
}
