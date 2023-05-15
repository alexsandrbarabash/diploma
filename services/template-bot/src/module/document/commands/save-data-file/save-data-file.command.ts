import { Command } from '@common/ddd';

export class SaveDataFileCommand extends Command {
  constructor(props: SaveDataFileCommand) {
    super(props.initiatorId);
    this.chatId = props.chatId;
    this.fileId = props.fileId;
    this.name = props.name;
  }

  public readonly chatId: string;
  public readonly fileId: string;
  public readonly name: string;
}
