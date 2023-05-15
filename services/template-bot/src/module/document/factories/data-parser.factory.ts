import { Injectable } from '@nestjs/common';

import { IParser } from '../interfaces';
import { CsvParser } from '../parsers';
import { FileExtensions } from '@common/enums';

@Injectable()
export class DataParserFactory {
  constructor(private readonly csvParser: CsvParser) {}

  get(fileExtensions: string): IParser {
    switch (fileExtensions) {
      case FileExtensions.CSV:
        return this.csvParser;
    }
    throw new Error('Not implements');
  }
}
