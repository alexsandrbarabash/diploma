import { Command } from '@common/ddd';

export class FillDocxTemplateCommand extends Command {
  constructor(props: FillDocxTemplateCommand) {
    super(props.initiatorId);
    this.userId = props.userId;
    this.fileId = props.fileId;
  }

  public readonly userId: string;
  public readonly fileId: string;
}
