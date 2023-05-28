import { Command } from '@common/ddd';

export class DeleteTemplateFileCommand extends Command {
  constructor(props: DeleteTemplateFileCommand) {
    super(props.initiatorId);
    this.fileId = props.fileId;
  }

  public readonly fileId: string;
}
