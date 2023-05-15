import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {
  public getStartMessage(name: string): string {
    return `Hello ${name}. This bot is designed to create filling documents based on templates. To start work, send a csv file with data. Next, send the document template (the bot supports the following extensions: .docx, .md, .txt, .pptx). The text to be replaced must be separated by brackets like this {name}. The name of the column in which you need to substitute should be in parentheses. It is very important that the names of the columns are exactly in English, otherwise there is a risk that the bot simply does not recognize this term. You can apply this pattern to file names as well.Next, the bot should send you an archive with all the data`;
  }

  public saveDataResponse(): string {
    return 'Data was saved';
  }

  public dataNotFoundResponse(): string {
    return 'Please upload the data before uploading the template';
  }

  public serverError(): string {
    return 'Server error';
  }

  public notSupportFileExtension(fileExtension: string): string {
    return `File extension not support ${fileExtension}`;
  }

  public fileNameRequire(): string {
    return `File name require`;
  }

  public saveFile(): string {
    return 'Send file csv, xlsx';
  }

  public sendFile(): string {
    return 'Send file';
  }

  public fileWasSaved(): string {
    return 'File was saved';
  }

  public fileNotFound(): string {
    return 'File not found';
  }
}
