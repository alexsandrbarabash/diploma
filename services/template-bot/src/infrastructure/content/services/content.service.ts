import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {
  public getStartMessage(name: string): string {
    return `Hello ${name}. this bot is for generating fill documents according to the templates of the templates`;
  }

  public saveDataResponse(): string {
    return 'Data was saved';
  }

  public dataNotFoundResponse(): string {
    return 'Please upload the data before uploading the template';
  }

  public notSupportFileExtension(fileExtension: string): string {
    return `File extension not support ${fileExtension}`;
  }
}
