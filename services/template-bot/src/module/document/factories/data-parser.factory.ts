import { Injectable } from '@nestjs/common';

import { IParser } from '../interfaces';
import { CsvParser, JsonParser } from '../parsers';
import { FileExtensions } from '@common/enums';

@Injectable()
export class DataParserFactory {
  constructor(
    private readonly csvParser: CsvParser,
    private readonly jsonParser: JsonParser,
  ) {}

  get(fileExtensions: string): IParser {
    switch (fileExtensions) {
      case FileExtensions.CSV:
        return this.csvParser;
      case FileExtensions.JSON:
        return this.jsonParser;
    }
    throw new Error('Not implements');
  }
}
