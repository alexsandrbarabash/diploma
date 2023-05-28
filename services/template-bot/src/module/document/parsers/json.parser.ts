import { Injectable } from '@nestjs/common';

import { IParser, Row } from '../interfaces';
import { CsvParser as BaseCsvParser } from '@utils';

@Injectable()
export class JsonParser implements IParser {
  constructor() {}

  parse(input: Buffer): Row[] {
    const bufferString = input.toString('utf8');
    const arr = JSON.parse(bufferString);

    if (!Array.isArray(arr)) {
      return [];
    }

    return arr as Row[];
  }
}
