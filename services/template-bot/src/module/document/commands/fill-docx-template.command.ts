import { Command } from '@common/ddd';

export class FillDocxTemplateCommand extends Command {
  constructor(props: FillDocxTemplateCommand) {
    super(props.initiatorId);
    this.chatId = props.chatId;
    this.fileId = props.fileId;
    this.fileName = props.fileName;
  }

  public readonly chatId: string;
  public readonly fileId: string;
  public readonly fileName: string;
}
