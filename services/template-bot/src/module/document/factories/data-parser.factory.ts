import { Injectable } from '@nestjs/common';

import { IParser } from '../interfaces';
import { CsvParser, JsonParser, XmlParser } from '../parsers';
import { FileExtensions } from '@common/enums';

@Injectable()
export class DataParserFactory {
  constructor(
    private readonly csvParser: CsvParser,
    private readonly jsonParser: JsonParser,
    private readonly xmlParser: XmlParser,
  ) {}

  get(fileExtensions: string): IParser {
    switch (fileExtensions) {
      case FileExtensions.CSV:
        return this.csvParser;
      case FileExtensions.JSON:
        return this.jsonParser;
      case FileExtensions.XML:
        return this.xmlParser;
    }
    throw new Error('Not implements');
  }
}
