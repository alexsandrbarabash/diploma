import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SaveDataCommand } from './save-data.command';
import { StateService } from '../../state/services';

@CommandHandler(SaveDataCommand)
export class SaveDataUseCase implements ICommandHandler {
  constructor(private readonly stateService: StateService) {}

  async execute(command: SaveDataCommand): Promise<void> {
    await this.stateService.setWaitingTemplate(
      command.chatId,
      command.fileId,
      command.fileName,
    );
  }
}
