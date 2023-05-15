import { Command } from '@common/ddd';

export class TextMarkDownTemplate extends Command {
  constructor(props: TextMarkDownTemplate) {
    super(props.initiatorId);
    this.chatId = props.chatId;
    this.fileId = props.fileId;
    this.fileName = props.fileName;
  }

  public readonly chatId: string;
  public readonly fileId: string;
  public readonly fileName: string;
}
