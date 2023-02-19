import { Injectable } from '@nestjs/common';

import { IParser, Row } from '../interfaces';
import { CsvParser as BaseCsvParser } from '@utils';

@Injectable()
export class CsvParser implements IParser {
  private readonly csv: BaseCsvParser;

  constructor() {
    this.csv = new BaseCsvParser();
  }

  parse(input: Buffer): Row[] {
    return this.csv
      .parse({
        input,
        removeEmptyColumn: false,
        getOriginalRaw: false,
      })
      .map((item) => item.record) as Row[];
  }
}
