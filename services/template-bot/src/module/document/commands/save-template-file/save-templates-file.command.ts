import { Command } from '@common/ddd';

export class SaveTemplateFileCommand extends Command {
  constructor(props: SaveTemplateFileCommand) {
    super(props.initiatorId);
    this.chatId = props.chatId;
    this.fileId = props.fileId;
    this.name = props.name;
  }

  public readonly chatId: string;
  public readonly fileId: string;
  public readonly name: string;
}
