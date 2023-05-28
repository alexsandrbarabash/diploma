import { Command } from '@common/ddd';

export class DeleteDataFileCommand extends Command {
  constructor(props: DeleteDataFileCommand) {
    super(props.initiatorId);
    this.fileId = props.fileId;
  }

  public readonly fileId: string;
}
