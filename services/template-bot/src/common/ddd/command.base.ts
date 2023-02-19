export abstract class Command {
  initiatorId: string;
  constructor(initiatorId: string) {
    this.initiatorId = initiatorId;
  }
}
