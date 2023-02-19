import { Injectable } from '@nestjs/common';

import { IParser } from '../interfaces';

@Injectable()
export class DataParserFactory {
  get(fileExtensions: string): IParser {
    throw new Error('Not implements');
  }
}
