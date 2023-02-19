import { Command } from '@common/ddd';

export class SaveDataCommand extends Command {
  constructor(props: SaveDataCommand) {
    super(props.initiatorId);
    this.userId = props.userId;
    this.fileId = props.fileId;
    this.fileName = props.fileName;
  }

  public readonly userId: string;
  public readonly fileId: string;
  public readonly fileName: string;
}
